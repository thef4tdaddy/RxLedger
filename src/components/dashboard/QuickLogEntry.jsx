// components/dashboard/QuickLogEntry.jsx - Enhanced with Firebase integration
import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useMedications } from '../../context/MedicationContext';
import { encryptionService } from '../../services/encryptionService';
import useAuth from '../../hooks/useAuth';
import Select from 'react-select';
import { Link } from 'react-router-dom';

const demoSideEffectsOptions = [
  { value: 'headache', label: 'Headache' },
  { value: 'nausea', label: 'Nausea' },
  { value: 'dizziness', label: 'Dizziness' },
  { value: 'fatigue', label: 'Fatigue' },
  { value: 'drowsiness', label: 'Drowsiness' },
  { value: 'stomach_upset', label: 'Stomach Upset' },
  { value: 'dry_mouth', label: 'Dry Mouth' },
  { value: 'insomnia', label: 'Insomnia' },
];

export default function QuickLogEntry() {
  const { user } = useAuth();
  const { medications, logMedication, updateMedication } = useMedications();
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [selectedSideEffects, setSelectedSideEffects] = useState([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Create medication options from real Firebase data
  const medicationOptions = [
    { value: 'all', label: 'All Medications' },
    ...(medications || []).map((med) => ({
      value: med.id,
      label: med.commonName || med.medicalName || 'Unknown',
      medication: med,
    })),
  ];

  // Mood options with values
  const moodOptions = [
    { emoji: '😊', value: 8, label: 'Good' },
    { emoji: '😐', value: 5, label: 'Okay' },
    { emoji: '😞', value: 2, label: 'Poor' },
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleLogEntry = async () => {
    if (!user?.uid) return;

    setSaving(true);
    setSuccess(false);

    try {
      const today = new Date().toISOString().split('T')[0];
      const userKey = encryptionService.generateUserKey(
        user.uid,
        user.email || 'bypass@example.com',
      );

      // 1. Save health stats if mood is selected
      if (selectedMood) {
        const healthStatsRef = doc(db, 'users', user.uid, 'healthStats', today);

        // Get existing health data for today (if any)
        const existingHealthData = {}; // Could fetch existing data here

        const healthData = {
          ...existingHealthData,
          mood: selectedMood.value,
          timestamp: new Date(),
          notes: notes || null,
        };

        const encryptedHealthData = encryptionService.encryptMedicalData(
          healthData,
          userKey,
        );

        await setDoc(
          healthStatsRef,
          {
            encryptedData: encryptedHealthData,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      }

      // 2. Log medications as taken
      const medicationsToLog = selectedMedications.filter(
        (med) => med.value !== 'all',
      );

      for (const medOption of medicationsToLog) {
        if (medOption.medication) {
          // Update medication as taken today
          await updateMedication(medOption.medication.id, {
            takenToday: true,
            lastTaken: new Date(),
          });

          // Create a medication log entry
          const logData = {
            notes: notes || '',
            sideEffects: selectedSideEffects.map((se) => se.value),
            mood: selectedMood?.value || null,
            timestamp: new Date(),
          };

          await logMedication(medOption.medication.id, logData);
        }
      }

      // Handle "All Medications" selection
      if (
        selectedMedications.some((med) => med.value === 'all') &&
        medications
      ) {
        for (const medication of medications) {
          await updateMedication(medication.id, {
            takenToday: true,
            lastTaken: new Date(),
          });

          const logData = {
            notes: notes || '',
            sideEffects: selectedSideEffects.map((se) => se.value),
            mood: selectedMood?.value || null,
            timestamp: new Date(),
          };

          await logMedication(medication.id, logData);
        }
      }

      // Reset form and show success
      setSelectedMood(null);
      setSelectedMedications([]);
      setSelectedSideEffects([]);
      setNotes('');
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving log entry:', error);
      alert('Failed to save log entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const hasData =
    selectedMood ||
    selectedMedications.length > 0 ||
    selectedSideEffects.length > 0 ||
    notes.trim();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black mb-8">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
        Quick Log Entry
      </h2>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            ✓ Log entry saved successfully!
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Mood
          </label>
          <div className="flex gap-2">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood)}
                className={`p-2 text-2xl rounded transition-colors ${
                  selectedMood?.value === mood.value
                    ? 'bg-[#10B981] text-white'
                    : 'hover:bg-[#10B981] hover:text-white'
                }`}
                title={mood.label}
              >
                {mood.emoji}
              </button>
            ))}
          </div>
          {selectedMood && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: {selectedMood.label} ({selectedMood.value}/10)
            </p>
          )}
        </div>

        {/* Medication Selection */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Take Meds
          </label>
          {medications && medications.length > 0 ? (
            <Select
              isMulti
              options={medicationOptions}
              value={selectedMedications}
              onChange={setSelectedMedications}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Select medications taken..."
            />
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-500 text-sm">
                No medications available.
                <Link
                  to="/medications"
                  className="text-[#1B59AE] hover:underline ml-1"
                >
                  Add medications first
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Side Effects */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Side Effects
          </label>
          <Select
            isMulti
            options={demoSideEffectsOptions}
            value={selectedSideEffects}
            onChange={setSelectedSideEffects}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Any side effects experienced..."
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 border-2 border-gray-400 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="How are you feeling today?"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleLogEntry}
          disabled={saving || !hasData}
          className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium transition-colors ${
            hasData && !saving
              ? 'bg-[#1B59AE] text-white hover:bg-[#10B981]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {saving ? 'Saving...' : 'Log Entry'}
        </button>

        {/* Full Log Entry Link */}
        <div className="mt-4 text-center">
          <Link
            to="/log"
            className="inline-block text-[#1B59AE] font-semibold hover:underline"
          >
            Start Full Log Entry
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-4 text-xs text-gray-500">
          <p>
            💡 Quick tip: Log your mood and medications daily for better health
            insights
          </p>
        </div>
      </div>
    </div>
  );
}
