// context/MedicationContext.js - Enhanced to work with your existing structure
import React, { useState, useEffect } from 'react';
import { MedicationService } from '../services/medicationService';
import { useAuth } from '../hooks/useAuth'; // Updated import path
import MedicationContext from './MedicationContextBase';

export const MedicationProvider = ({ children }) => {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [medicationLogs, setMedicationLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [medicationService, setMedicationService] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      // Create service with user info (works with auth bypass too)
      const userEmail = user.email || 'bypass@example.com';
      const service = new MedicationService(user.uid, userEmail);
      setMedicationService(service);

      try {
        // Subscribe to real-time medication updates
        const unsubscribeMeds = service.subscribeTo((meds) => {
          setMedications(meds);
          setLoading(false);
          setError(null);
          if (!initialized) {
            setInitialized(true);
          }
        });

        // Subscribe to medication logs (if available)
        let unsubscribeLogs = () => {};
        if (service.subscribeToLogs) {
          unsubscribeLogs = service.subscribeToLogs((logs) => {
            setMedicationLogs(logs);
          });
        }

        // Cleanup function
        return () => {
          unsubscribeMeds();
          unsubscribeLogs();
        };
      } catch (err) {
        console.error('Error setting up medication subscriptions:', err);
        setError(err.message);
        setLoading(false);
      }
    } else {
      setLoading(false);
      setMedications([]);
      setMedicationLogs([]);
      setInitialized(false);
    }
  }, [user, initialized]);

  // Your existing addMedication method
  const addMedication = async (medicationData) => {
    if (!medicationService) {
      throw new Error('Service not initialized');
    }

    try {
      setError(null);
      setSyncing(true);
      const id = await medicationService.addMedication(medicationData);
      console.log('✅ Medication added successfully:', id);
      return id;
    } catch (err) {
      console.error('Error adding medication:', err);
      setError(err.message);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  // Your existing updateMedication method
  const updateMedication = async (id, updates) => {
    if (!medicationService) {
      throw new Error('Service not initialized');
    }

    try {
      setError(null);
      setSyncing(true);
      await medicationService.updateMedication(id, updates);
      console.log('✅ Medication updated successfully:', id);
    } catch (err) {
      console.error('Error updating medication:', err);
      setError(err.message);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  // Your existing deleteMedication method
  const deleteMedication = async (id) => {
    if (!medicationService) {
      throw new Error('Service not initialized');
    }

    try {
      setError(null);
      setSyncing(true);
      await medicationService.deleteMedication(id, true); // Permanent deletion
      console.log('✅ Medication deleted successfully:', id);
    } catch (err) {
      console.error('Error deleting medication:', err);
      setError(err.message);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  // Your existing logMedication method
  const logMedication = async (medicationId, logData) => {
    if (!medicationService) {
      throw new Error('Service not initialized');
    }

    try {
      setError(null);
      await medicationService.logMedication(medicationId, logData);
      console.log('✅ Medication logged successfully:', medicationId);
    } catch (err) {
      console.error('Error logging medication:', err);
      setError(err.message);
      throw err;
    }
  };

  // NEW: Methods that your table needs

  // Mark medication as taken (required by your table)
  const markMedicationTaken = async (medicationId) => {
    if (!medicationService) {
      throw new Error('Service not initialized');
    }

    try {
      setError(null);
      await medicationService.markMedicationTaken(medicationId);
      console.log('✅ Medication marked as taken:', medicationId);
    } catch (err) {
      console.error('Error marking medication as taken:', err);
      setError(err.message);
      throw err;
    }
  };

  // Toggle medication reminders (required by your table)
  const toggleMedicationReminders = async (medicationId) => {
    if (!medicationService) {
      throw new Error('Service not initialized');
    }

    try {
      setError(null);
      await medicationService.toggleMedicationReminders(medicationId);
      console.log('✅ Medication reminders toggled:', medicationId);
    } catch (err) {
      console.error('Error toggling medication reminders:', err);
      setError(err.message);
      throw err;
    }
  };

  // Archive medication (required by your table)
  const archiveMedication = async (medicationId) => {
    if (!medicationService) {
      throw new Error('Service not initialized');
    }

    try {
      setError(null);
      setSyncing(true);
      await medicationService.archiveMedication(medicationId);
      console.log('✅ Medication archived successfully:', medicationId);
    } catch (err) {
      console.error('Error archiving medication:', err);
      setError(err.message);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  // Add medication log entry
  const addMedicationLog = async (logData) => {
    if (!medicationService) {
      throw new Error('Service not initialized');
    }

    try {
      setError(null);
      const logId = await medicationService.logMedication(
        logData.medicationId,
        logData,
      );
      console.log('✅ Medication log added:', logId);
      return logId;
    } catch (err) {
      console.error('Error adding medication log:', err);
      setError(err.message);
      throw err;
    }
  };

  // Clear error state
  const clearError = () => {
    setError(null);
  };

  // Get medication statistics
  const getMedicationStats = () => {
    const total = medications.length;
    const active = medications.filter((med) => med.isActive !== false).length;
    const takenToday = medications.filter(
      (med) => med.takenToday || med.taken,
    ).length;
    const withReminders = medications.filter(
      (med) => med.remindersOn || med.reminders,
    ).length;

    const today = new Date();
    const recentLogs = medicationLogs.filter((log) => {
      const logDate = new Date(log.timestamp || log.createdAt);
      return logDate.toDateString() === today.toDateString();
    });

    return {
      total,
      active,
      archived: total - active,
      takenToday,
      withReminders,
      logsToday: recentLogs.length,
      adherenceRate: active > 0 ? Math.round((takenToday / active) * 100) : 0,
    };
  };

  // Force sync with Firebase
  const syncWithFirebase = async () => {
    if (!medicationService) {
      throw new Error('Service not initialized');
    }

    setSyncing(true);
    try {
      // Force reload from Firebase
      const [medications, logs] = await Promise.all([
        medicationService.getMedications(),
        medicationService.getMedicationLogs
          ? medicationService.getMedicationLogs()
          : [],
      ]);

      setMedications(medications);
      setMedicationLogs(logs);
      setError(null);

      console.log('✅ Manual sync completed');
    } catch (err) {
      console.error('Error syncing with Firebase:', err);
      setError(err.message);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  // Enhanced value object with all the methods your table needs
  const value = {
    // Your existing properties
    medications,
    loading,
    error,

    // Your existing methods
    addMedication,
    updateMedication,
    deleteMedication,
    logMedication,

    // NEW: Properties for enhanced functionality
    medicationLogs,
    syncing,
    initialized,

    // NEW: Methods that your table requires
    markMedicationTaken,
    toggleMedicationReminders,
    archiveMedication,
    addMedicationLog,
    clearError,
    syncWithFirebase,

    // NEW: Utility methods
    getMedicationStats,
    stats: getMedicationStats(),

    // NEW: Service availability check
    isFirebaseEnabled: !!medicationService,
  };

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  );
};
