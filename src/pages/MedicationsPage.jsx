import React, { useState } from 'react';
import MedicationsHeader from '../components/medications/MedicationsHeader';
import AddMedicationForm from '../components/medications/AddMedicationForm';
import MedicationsTable from '../components/medications/MedicationsTable';
import SummaryCards from '../components/medications/SummaryCards';
import MedicationSettings from '../components/medications/MedicationSettings';
import { useMedications } from '../context/useMedications';

export default function EnhancedMedicationsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const { medications, loading, error, addMedication, updateMedication } =
    useMedications();

  const handleAddMedication = async (formData) => {
    try {
      console.log('Adding medication with data:', formData);
      await addMedication(formData);
      setShowAddForm(false);
      console.log('✅ Medication added successfully');
    } catch (error) {
      console.error('❌ Failed to add medication:', error);
      alert('Failed to add medication. Please try again.');
    }
  };

  const handleToggleTaken = async (medicationId) => {
    const medication = medications.find((med) => med.id === medicationId);
    if (!medication) return;

    try {
      await updateMedication(medicationId, {
        takenToday: !medication.takenToday,
        lastTaken: !medication.takenToday ? new Date() : null,
      });
    } catch (error) {
      console.error('Failed to update medication:', error);
      alert('Failed to update medication status.');
    }
  };

  const handleToggleReminders = async (medicationId) => {
    const medication = medications.find((med) => med.id === medicationId);
    if (!medication) return;

    try {
      await updateMedication(medicationId, {
        remindersOn: !medication.remindersOn,
      });
    } catch (error) {
      console.error('Failed to update reminders:', error);
      alert('Failed to update reminder settings.');
    }
  };

  // Show loading state while Firebase initializes
  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto relative">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B59AE] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your medications...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if Firebase fails
  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto relative">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="text-red-500 text-2xl mr-3">⚠️</div>
            <h3 className="text-lg font-semibold text-red-900">
              Error Loading Medications
            </h3>
          </div>
          <p className="text-red-800 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      <MedicationsHeader onAdd={() => setShowAddForm(true)} />

      {showAddForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full border border-black">
            <AddMedicationForm
              onClose={() => setShowAddForm(false)}
              onSubmit={handleAddMedication}
            />
          </div>
        </div>
      )}

      {/* Pass real Firebase data and handlers to MedicationsTable */}
      <MedicationsTable
        medications={medications}
        onToggleTaken={handleToggleTaken}
        onToggleReminders={handleToggleReminders}
      />

      {/* Pass real Firebase data to SummaryCards */}
      <SummaryCards medications={medications} />

      <MedicationSettings />
    </div>
  );
}
