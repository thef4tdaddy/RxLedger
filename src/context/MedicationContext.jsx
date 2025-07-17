// context/MedicationContext.js
import React, { useState, useEffect } from 'react';
import { MedicationService } from '../services/medicationService';
import { useAuth } from './useAuth';
import MedicationContext from './MedicationContextBase';

export const MedicationProvider = ({ children }) => {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicationService, setMedicationService] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      // Create service with user info (works with auth bypass too)
      const userEmail = user.email || 'bypass@example.com';
      const service = new MedicationService(user.uid, userEmail);
      setMedicationService(service);

      // Subscribe to real-time updates
      const unsubscribe = service.subscribeTo((meds) => {
        setMedications(meds);
        setLoading(false);
        setError(null);
      });

      return unsubscribe;
    } else {
      setLoading(false);
      setMedications([]);
    }
  }, [user]);

  const addMedication = async (medicationData) => {
    if (!medicationService) {
      throw new Error('Service not initialized');
    }

    try {
      setError(null);
      const id = await medicationService.addMedication(medicationData);
      return id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateMedication = async (id, updates) => {
    if (!medicationService) {
      throw new Error('Service not initialized');
    }

    try {
      setError(null);
      await medicationService.updateMedication(id, updates);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteMedication = async (id) => {
    if (!medicationService) {
      throw new Error('Service not initialized');
    }

    try {
      setError(null);
      await medicationService.deleteMedication(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logMedication = async (medicationId, logData) => {
    if (!medicationService) {
      throw new Error('Service not initialized');
    }

    try {
      setError(null);
      await medicationService.logMedication(medicationId, logData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    medications,
    loading,
    error,
    addMedication,
    updateMedication,
    deleteMedication,
    logMedication,
  };

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  );
};
