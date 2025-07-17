import React, { useState } from 'react';
import MedicationsHeader from '../components/medications/MedicationsHeader';
import AddMedicationForm from '../components/medications/AddMedicationForm';
import MedicationsTable from '../components/medications/MedicationsTable';
import SummaryCards from '../components/medications/SummaryCards';
import MedicationSettings from '../components/medications/MedicationSettings';
import { useMedications } from '../context/useMedications';

export default function EnhancedMedicationsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const {
    medications,
    loading,
    error,
    addMedication,
    markMedicationTaken,
    toggleMedicationReminders,
    isFirebaseEnabled,
  } = useMedications();

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

  // Legacy handlers for demo mode (when Firebase isn't available)
  const handleToggleTaken = async (medicationId) => {
    if (isFirebaseEnabled && markMedicationTaken) {
      // Use Firebase method
      try {
        await markMedicationTaken(medicationId);
      } catch (error) {
        console.error('Failed to mark medication as taken:', error);
        alert('Failed to update medication status.');
      }
    } else {
      // Demo mode - log action
      console.log('Demo mode: Toggle taken for medication', medicationId);
    }
  };

  const handleToggleReminders = async (medicationId) => {
    if (isFirebaseEnabled && toggleMedicationReminders) {
      // Use Firebase method
      try {
        await toggleMedicationReminders(medicationId);
      } catch (error) {
        console.error('Failed to toggle reminders:', error);
        alert('Failed to update reminder settings.');
      }
    } else {
      // Demo mode - log action
      console.log('Demo mode: Toggle reminders for medication', medicationId);
    }
  };

  // Show loading state while Firebase initializes
  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
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
      <div className="p-6 max-w-6xl mx-auto">
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
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <MedicationsHeader onAdd={() => setShowAddForm(true)} />

      {/* Add Medication Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <AddMedicationForm
              onClose={() => setShowAddForm(false)}
              onSubmit={handleAddMedication}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {/* Summary Cards */}
        <SummaryCards medications={medications} />

        {/* Medications Table - Remove props to use Firebase integration directly */}
        <MedicationsTable
          // Legacy props for fallback compatibility
          medications={medications}
          onToggleTaken={handleToggleTaken}
          onToggleReminders={handleToggleReminders}
        />

        {/* Settings Section */}
        <MedicationSettings />
      </div>
    </div>
  );
}
