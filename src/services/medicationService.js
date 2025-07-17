// services/medicationService.js
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { encryptionService } from './encryptionService';

export class MedicationService {
  constructor(userId, userEmail) {
    this.userId = userId;
    this.userKey = encryptionService.generateUserKey(userId, userEmail);
    this.medicationsRef = collection(db, 'users', userId, 'medications');
    this.logsRef = collection(db, 'users', userId, 'medicationLogs');
  }

  async addMedication(medicationData) {
    try {
      // Transform your form data to our internal structure
      const internalData = {
        name: medicationData.commonName || medicationData.medicalName,
        medicalName: medicationData.medicalName,
        commonName: medicationData.commonName,
        dosage: medicationData.doseAmount,
        frequency: medicationData.schedule,
        manufacturer: medicationData.manufacturer,
        pharmacy: medicationData.pharmacy,
        refillSchedule: medicationData.refillSchedule,
        brandGeneric: medicationData.brandGeneric,
        notes: '',
        sideEffects: [],
      };

      // Create medication hash for potential community linking
      const medicationHash = encryptionService.createMedicationHash(
        internalData.name,
        internalData.dosage,
      );

      // Encrypt all sensitive data
      const encryptedData = encryptionService.encryptMedicalData(
        internalData,
        this.userKey,
      );

      const medicationDoc = {
        encryptedData,
        medicationHash,
        isActive: true,
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp(),
      };

      const docRef = await addDoc(this.medicationsRef, medicationDoc);
      return docRef.id;
    } catch (error) {
      console.error('Error adding medication:', error);
      throw new Error('Failed to add medication');
    }
  }

  async updateMedication(medicationId, updates) {
    try {
      const medicationDoc = doc(this.medicationsRef, medicationId);

      // Get existing data first
      const existing = await this.getMedication(medicationId);
      if (!existing) throw new Error('Medication not found');

      // Merge updates with existing data
      const updatedData = {
        ...existing.decryptedData,
        ...updates,
      };

      const encryptedData = encryptionService.encryptMedicalData(
        updatedData,
        this.userKey,
      );

      await updateDoc(medicationDoc, {
        encryptedData,
        lastModified: serverTimestamp(),
      });

      return true;
    } catch (error) {
      console.error('Error updating medication:', error);
      throw new Error('Failed to update medication');
    }
  }

  async deleteMedication(medicationId) {
    try {
      const medicationDoc = doc(this.medicationsRef, medicationId);
      await updateDoc(medicationDoc, {
        isActive: false,
        lastModified: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw new Error('Failed to delete medication');
    }
  }

  async getMedication(medicationId) {
    try {
      const medicationDoc = doc(this.medicationsRef, medicationId);
      const snapshot = await getDoc(medicationDoc);

      if (!snapshot.exists()) return null;

      const data = snapshot.data();
      const decryptedData = encryptionService.decryptMedicalData(
        data.encryptedData,
        this.userKey,
      );

      return {
        id: snapshot.id,
        ...data,
        decryptedData,
      };
    } catch (error) {
      console.error('Error getting medication:', error);
      return null;
    }
  }

  subscribeTo(callback) {
    const q = query(
      this.medicationsRef,
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
    );

    return onSnapshot(q, (snapshot) => {
      const medications = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          try {
            const decryptedData = encryptionService.decryptMedicalData(
              data.encryptedData,
              this.userKey,
            );

            // Transform back to your UI format
            return {
              id: doc.id,
              commonName: decryptedData.commonName,
              medicalName: decryptedData.medicalName,
              manufacturer: decryptedData.manufacturer,
              pharmacy: decryptedData.pharmacy,
              doseAmount: decryptedData.dosage,
              schedule: decryptedData.frequency,
              refillSchedule: decryptedData.refillSchedule,
              brandGeneric: decryptedData.brandGeneric,
              notes: decryptedData.notes,
              sideEffects: decryptedData.sideEffects,
              createdAt: data.createdAt,
              lastModified: data.lastModified,
              isActive: data.isActive,
            };
          } catch (error) {
            console.error('Error decrypting medication:', error);
            return null;
          }
        })
        .filter(Boolean);

      callback(medications);
    });
  }

  async logMedication(medicationId, logData) {
    try {
      const sensitiveLogData = {
        notes: logData.notes || '',
        sideEffects: logData.sideEffects || [],
        mood: logData.mood,
        symptoms: logData.symptoms || [],
      };

      const encryptedData = encryptionService.encryptMedicalData(
        sensitiveLogData,
        this.userKey,
      );

      const logEntry = {
        medicationId,
        encryptedData,
        effectivenessRating: logData.effectivenessRating || null,
        timestamp: logData.timestamp || serverTimestamp(),
        createdAt: serverTimestamp(),
      };

      return await addDoc(this.logsRef, logEntry);
    } catch (error) {
      console.error('Error logging medication:', error);
      throw new Error('Failed to log medication');
    }
  }
}
