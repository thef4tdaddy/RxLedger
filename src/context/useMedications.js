// src/context/useMedications.js - Enhanced to work with your existing structure
import { useContext } from 'react';
import MedicationContext from './MedicationContextBase';

export const useMedications = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedications must be used within a MedicationProvider');
  }
  return context;
};

// Export individual pieces for convenience
export const useMedicationActions = () => {
  const context = useMedications();
  return {
    addMedication: context.addMedication,
    updateMedication: context.updateMedication,
    deleteMedication: context.deleteMedication,
    markMedicationTaken: context.markMedicationTaken,
    toggleMedicationReminders: context.toggleMedicationReminders,
    archiveMedication: context.archiveMedication,
    logMedication: context.logMedication,
    addMedicationLog: context.addMedicationLog,
    clearError: context.clearError,
    syncWithFirebase: context.syncWithFirebase,
  };
};

export const useMedicationData = () => {
  const context = useMedications();
  return {
    medications: context.medications,
    medicationLogs: context.medicationLogs,
    loading: context.loading,
    error: context.error,
    syncing: context.syncing,
    initialized: context.initialized,
    stats: context.stats,
    isFirebaseEnabled: context.isFirebaseEnabled,
  };
};

// Export the context for direct usage (maintains your existing pattern)
export { MedicationContext } from './MedicationContextBase';

// Default export for backward compatibility
export default useMedications;
