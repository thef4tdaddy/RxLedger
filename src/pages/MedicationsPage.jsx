// pages/MedicationsPage.jsx - Updated with Firebase integration
import React, { useState } from 'react';
import MedicationsHeader from '../components/medications/MedicationsHeader';
import AddMedicationForm from '../components/medications/AddMedicationForm';
import MedicationsTable from '../components/medications/MedicationsTable';
import SummaryCards from '../components/medications/SummaryCards';
import MedicationSettings from '../components/medications/MedicationSettings';
import { useMedications } from '../context/MedicationContext';

export default function EnhancedMedicationsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const { medications, loading, error, addMedication, updateMedication } =
    useMedications();

  const handleAddMedication = async (formData) => {
    try {
      await addMedication(formData);
      setShowAddForm(false);
      // Optional: Show success message
    } catch (error) {
      console.error('Failed to add medication:', error);
      // Optional: Show error message to user
      alert('Failed to add medication. Please try again.');
    }
  };

  const handleToggleTaken = async (medicationId) => {
    // Find the medication
    const medication = medications.find((med) => med.id === medicationId);
    if (!medication) return;

    try {
      // Update the taken status
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
    // Find the medication
    const medication = medications.find((med) => med.id === medicationId);
    if (!medication) return;

    try {
      // Update the reminders status
      await updateMedication(medicationId, {
        remindersOn: !medication.remindersOn,
      });
    } catch (error) {
      console.error('Failed to update reminders:', error);
      alert('Failed to update reminder settings.');
    }
  };

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

      {loading ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B59AE]"></div>
            <span className="ml-2 text-gray-600">Loading medications...</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-800">Error loading medications: {error}</p>
          </div>
        </div>
      ) : (
        <MedicationsTable
          medications={medications}
          onToggleTaken={handleToggleTaken}
          onToggleReminders={handleToggleReminders}
        />
      )}

      <SummaryCards medications={medications} />

      <MedicationSettings />
    </div>
  );
}
