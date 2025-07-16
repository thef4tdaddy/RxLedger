// pages/LogEntryPage.jsx - Componentized version using individual components
import { useState, useEffect } from 'react';
import { useMedications } from '../context/MedicationContext';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Import all the log entry components
import LogEntryHeader from '../components/log-entry/LogEntryHeader';
import DateTimeSelector from '../components/log-entry/DateTimeSelector';
import MedicationSelector from '../components/log-entry/MedicationSelector';
import EffectivenessRatings from '../components/log-entry/EffectivenessRatings';
import MoodSelector from '../components/log-entry/MoodSelector';
import EnergySlider from '../components/log-entry/EnergySlider';
import LibidoSlider from '../components/log-entry/LibidoSlider';
import SleepTracker from '../components/log-entry/SleepTracker';
import SideEffectsSelector from '../components/log-entry/SideEffectsSelector';
import NotesInput from '../components/log-entry/NotesInput';

export default function LogEntryPage() {
  const {} = useAuth();
  const {
    medications,
    loading: medicationsLoading,
    logMedicationTaken,
    updateMedication,
  } = useMedications();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    entryDate: new Date().toISOString().split('T')[0],
    entryTime: new Date().toTimeString().slice(0, 5),
    selectedMood: null,
    energyLevel: 5,
    libidoLevel: 5,
    sleepHours: 8,
    selectedMedications: [],
    effectivenessRatings: {},
    selectedSymptoms: [],
    notes: '',
  });

  // UI state
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Set default medications when they load
  useEffect(() => {
    if (
      medications &&
      medications.length > 0 &&
      formData.selectedMedications.length === 0
    ) {
      const availableMeds = medications.filter((med) => !med.takenToday);
      if (availableMeds.length > 0) {
        updateFormData('selectedMedications', [availableMeds[0].id]);
      }
    }
  }, [medications, formData.selectedMedications.length]);

  // Helper to update form data
  const updateFormData = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.selectedMedications.length === 0) {
      setError('Please select at least one medication');
      return;
    }

    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      // Create the entry timestamp from date and time
      const entryDateTime = new Date(
        `${formData.entryDate}T${formData.entryTime}`,
      );

      // Log each selected medication
      const logPromises = formData.selectedMedications.map(
        async (medicationId) => {
          const metadata = {
            mood: formData.selectedMood ? formData.selectedMood.value : null,
            energy: formData.energyLevel,
            libido: formData.libidoLevel,
            sleepHours: formData.sleepHours,
            effectiveness: formData.effectivenessRatings[medicationId] || null,
            sideEffects: formData.selectedSymptoms,
            notes: formData.notes.trim(),
            timestamp: entryDateTime,
          };

          await logMedicationTaken(medicationId, metadata);

          // Only update "taken today" status if the entry is for today
          const isToday =
            formData.entryDate === new Date().toISOString().split('T')[0];
          if (isToday) {
            await updateMedication(medicationId, {
              takenToday: true,
              lastTaken: entryDateTime,
            });
          }
        },
      );

      await Promise.all(logPromises);

      setSuccess(true);

      // Reset form and redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error saving log entry:', error);
      setError(`Failed to save log entry: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (medicationsLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header Component */}
      <LogEntryHeader />

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <p className="text-green-800 font-medium">
                Log Entry Saved Successfully!
              </p>
              <p className="text-green-700 text-sm">
                Redirecting to dashboard...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Time Component */}
          <DateTimeSelector
            entryDate={formData.entryDate}
            entryTime={formData.entryTime}
            onDateChange={(date) => updateFormData('entryDate', date)}
            onTimeChange={(time) => updateFormData('entryTime', time)}
          />

          {/* Show info if backfilling */}
          {formData.entryDate !== new Date().toISOString().split('T')[0] && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                📅 Logging entry for{' '}
                {new Date(formData.entryDate).toLocaleDateString()} - This
                won&apos;t update today&apos;s medication status
              </p>
            </div>
          )}

          {/* Medication Selector Component */}
          <MedicationSelector
            medications={medications || []}
            selectedMedications={formData.selectedMedications}
            entryDate={formData.entryDate}
            onMedicationChange={(selected) =>
              updateFormData('selectedMedications', selected)
            }
          />

          {/* Effectiveness Ratings Component */}
          {formData.selectedMedications.length > 0 && (
            <EffectivenessRatings
              selectedMedications={formData.selectedMedications}
              medications={medications || []}
              effectivenessRatings={formData.effectivenessRatings}
              onRatingChange={(medicationId, rating) =>
                updateFormData('effectivenessRatings', {
                  ...formData.effectivenessRatings,
                  [medicationId]: rating,
                })
              }
            />
          )}

          {/* Mood Selector Component */}
          <MoodSelector
            selectedMood={formData.selectedMood}
            onMoodSelect={(mood) => updateFormData('selectedMood', mood)}
          />

          {/* Energy and Libido Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EnergySlider
              energy={formData.energyLevel}
              onEnergyChange={(energy) => updateFormData('energyLevel', energy)}
            />
            <LibidoSlider
              libido={formData.libidoLevel}
              onLibidoChange={(libido) => updateFormData('libidoLevel', libido)}
            />
          </div>

          {/* Sleep Tracker Component */}
          <SleepTracker
            sleepHours={formData.sleepHours}
            onSleepChange={(hours) => updateFormData('sleepHours', hours)}
          />

          {/* Side Effects Selector Component */}
          <SideEffectsSelector
            selectedSymptoms={formData.selectedSymptoms}
            onSymptomsChange={(symptoms) =>
              updateFormData('selectedSymptoms', symptoms)
            }
          />

          {/* Notes Input Component */}
          <NotesInput
            notes={formData.notes}
            onNotesChange={(notes) => updateFormData('notes', notes)}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving || formData.selectedMedications.length === 0}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              saving || formData.selectedMedications.length === 0
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {saving ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving Entry...
              </div>
            ) : (
              'Save Entry'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
