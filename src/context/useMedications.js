// src/context/useMedications.js
import { useContext } from 'react';
import MedicationContext from './MedicationContextBase';

export const useMedications = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedications must be used within a MedicationProvider');
  }
  return context;
};
