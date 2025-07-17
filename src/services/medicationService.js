// services/medicationService.js - Enhanced version based on your existing logic
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  limit as firestoreLimit,
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { encryptionService } from './encryptionService';

export class MedicationService {
  constructor(userId, userEmail) {
    this.userId = userId;
    this.userEmail = userEmail;
    this.userKey = encryptionService.generateUserKey(userId, userEmail);
    this.medicationsRef = collection(db, 'users', userId, 'medications');
    this.logsRef = collection(db, 'users', userId, 'medicationLogs');
  }

  // Your existing addMedication method with enhancements
  async addMedication(medicationData) {
    try {
      // Your existing transformation logic
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
        notes: medicationData.notes || '',
        sideEffects: medicationData.sideEffects || [],
        // Enhanced: Add missing fields your table needs
        takenToday: false,
        taken: false,
        remindersOn: medicationData.remindersOn || false,
        reminders: medicationData.reminders || false,
        isActive: true,
        archived: false,
        lastTaken: null,
        archivedAt: null,
      };

      // Your existing hash creation
      const medicationHash = encryptionService.createMedicationHash(
        internalData.name,
        internalData.dosage,
      );

      // Your existing encryption
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
      console.log('✅ Medication added to Firebase:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding medication:', error);
      throw new Error(`Failed to add medication: ${error.message}`);
    }
  }

  // Enhanced updateMedication with your logic
  async updateMedication(medicationId, updates) {
    try {
      const medicationDoc = doc(this.medicationsRef, medicationId);

      // Your existing logic to get current data
      const existing = await this.getMedication(medicationId);
      if (!existing) throw new Error('Medication not found');

      // Your existing merge logic
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

      console.log('✅ Medication updated in Firebase:', medicationId);
      return true;
    } catch (error) {
      console.error('Error updating medication:', error);
      throw new Error(`Failed to update medication: ${error.message}`);
    }
  }

  // Enhanced: Real deletion option (your version only did soft delete)
  async deleteMedication(medicationId, permanent = false) {
    try {
      const medicationDoc = doc(this.medicationsRef, medicationId);

      if (permanent) {
        // Permanent deletion
        await deleteDoc(medicationDoc);
        console.log('✅ Medication permanently deleted:', medicationId);
      } else {
        // Your existing soft delete
        await updateDoc(medicationDoc, {
          isActive: false,
          lastModified: serverTimestamp(),
        });
        console.log('✅ Medication soft deleted:', medicationId);
      }
      return true;
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw new Error(`Failed to delete medication: ${error.message}`);
    }
  }

  // Your existing getMedication with fix for missing import
  async getMedication(medicationId) {
    try {
      const medicationDoc = doc(this.medicationsRef, medicationId);
      const snapshot = await getDoc(medicationDoc); // Now properly imported

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

  // Enhanced: Your subscribeTo method with complete data transformation
  subscribeTo(callback) {
    const q = query(
      this.medicationsRef,
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const medications = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            try {
              const decryptedData = encryptionService.decryptMedicalData(
                data.encryptedData,
                this.userKey,
              );

              // Enhanced: Complete transformation for your table
              return {
                id: doc.id,
                // Your existing fields
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
                // Enhanced: Missing fields your table needs
                name: decryptedData.name,
                dosage: decryptedData.dosage,
                frequency: decryptedData.frequency,
                takenToday: decryptedData.takenToday || false,
                taken: decryptedData.taken || false,
                remindersOn: decryptedData.remindersOn || false,
                reminders: decryptedData.reminders || false,
                manufacturers: decryptedData.manufacturer
                  ? [{ name: decryptedData.manufacturer }]
                  : [],
                isActive: data.isActive,
                archived: decryptedData.archived || false,
                lastTaken: decryptedData.lastTaken,
                createdAt: data.createdAt?.toDate(),
                lastModified: data.lastModified?.toDate(),
              };
            } catch (error) {
              console.error('Error decrypting medication:', error);
              return null;
            }
          })
          .filter(Boolean);

        callback(medications);
      },
      (error) => {
        console.error('Error in medications subscription:', error);
        callback([]);
      },
    );
  }

  // NEW: Methods your table needs that were missing

  // Mark medication as taken
  async markMedicationTaken(medicationId, timestamp = new Date()) {
    try {
      await this.updateMedication(medicationId, {
        takenToday: true,
        taken: true,
        lastTaken: timestamp,
      });

      // Also log this action
      await this.logMedication(medicationId, {
        action: 'taken',
        timestamp,
        notes: 'Marked as taken via medication table',
      });

      console.log('✅ Medication marked as taken:', medicationId);
    } catch (error) {
      console.error('Error marking medication as taken:', error);
      throw error;
    }
  }

  // Toggle medication reminders
  async toggleMedicationReminders(medicationId) {
    try {
      const existing = await this.getMedication(medicationId);
      if (!existing) throw new Error('Medication not found');

      const currentState =
        existing.decryptedData.remindersOn || existing.decryptedData.reminders;
      const newState = !currentState;

      await this.updateMedication(medicationId, {
        remindersOn: newState,
        reminders: newState,
      });

      console.log('✅ Medication reminders toggled:', medicationId, newState);
    } catch (error) {
      console.error('Error toggling medication reminders:', error);
      throw error;
    }
  }

  // Archive medication
  async archiveMedication(medicationId) {
    try {
      await this.updateMedication(medicationId, {
        isActive: false,
        archived: true,
        archivedAt: new Date(),
      });

      console.log('✅ Medication archived:', medicationId);
    } catch (error) {
      console.error('Error archiving medication:', error);
      throw error;
    }
  }

  // Your existing logMedication with enhancements
  async logMedication(medicationId, logData) {
    try {
      const sensitiveLogData = {
        medicationId,
        action: logData.action || 'log',
        notes: logData.notes || '',
        sideEffects: logData.sideEffects || [],
        mood: logData.mood,
        symptoms: logData.symptoms || [],
        timestamp: logData.timestamp || new Date(),
        metadata: logData.metadata || {},
      };

      const encryptedData = encryptionService.encryptMedicalData(
        sensitiveLogData,
        this.userKey,
      );

      const logEntry = {
        medicationId,
        action: logData.action || 'log', // Keep unencrypted for querying
        encryptedData,
        effectivenessRating: logData.effectivenessRating || null,
        timestamp: logData.timestamp || serverTimestamp(),
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(this.logsRef, logEntry);
      console.log('✅ Medication log added:', docRef.id);
      return docRef;
    } catch (error) {
      console.error('Error logging medication:', error);
      throw new Error(`Failed to log medication: ${error.message}`);
    }
  }

  // NEW: Get medication statistics
  async getMedicationStats() {
    try {
      const [medications, logs] = await Promise.all([
        this.getMedications(),
        this.getMedicationLogs(),
      ]);

      const today = new Date();
      const todayLogs = logs.filter((log) => {
        const logDate = new Date(log.timestamp);
        return logDate.toDateString() === today.toDateString();
      });

      return {
        totalMedications: medications.length,
        activeMedications: medications.filter((med) => med.isActive).length,
        takenToday: medications.filter((med) => med.takenToday || med.taken)
          .length,
        withReminders: medications.filter(
          (med) => med.remindersOn || med.reminders,
        ).length,
        logsToday: todayLogs.length,
        adherenceRate:
          medications.length > 0
            ? Math.round(
                (medications.filter((med) => med.takenToday || med.taken)
                  .length /
                  medications.length) *
                  100,
              )
            : 0,
      };
    } catch (error) {
      console.error('Error getting medication stats:', error);
      return {
        totalMedications: 0,
        activeMedications: 0,
        takenToday: 0,
        withReminders: 0,
        logsToday: 0,
        adherenceRate: 0,
      };
    }
  }

  // NEW: Get all medications (helper method)
  async getMedications() {
    try {
      const q = query(
        this.medicationsRef,
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
      );

      const querySnapshot = await getDocs(q);
      const medications = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const decryptedData = encryptionService.decryptMedicalData(
          data.encryptedData,
          this.userKey,
        );

        if (decryptedData) {
          medications.push({
            id: doc.id,
            ...decryptedData,
            createdAt: data.createdAt?.toDate(),
            lastModified: data.lastModified?.toDate(),
          });
        }
      });

      return medications;
    } catch (error) {
      console.error('Error getting medications:', error);
      throw new Error(`Failed to get medications: ${error.message}`);
    }
  }

  // NEW: Get medication logs
  async getMedicationLogs(medicationId = null, limitCount = 50) {
    try {
      let q;

      if (medicationId) {
        q = query(
          this.logsRef,
          where('medicationId', '==', medicationId),
          orderBy('createdAt', 'desc'),
          firestoreLimit(limitCount),
        );
      } else {
        q = query(
          this.logsRef,
          orderBy('createdAt', 'desc'),
          firestoreLimit(limitCount),
        );
      }

      const querySnapshot = await getDocs(q);
      const logs = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const decryptedData = encryptionService.decryptMedicalData(
          data.encryptedData,
          this.userKey,
        );

        if (decryptedData) {
          logs.push({
            id: doc.id,
            ...decryptedData,
            createdAt: data.createdAt?.toDate(),
          });
        }
      });

      return logs;
    } catch (error) {
      console.error('Error getting medication logs:', error);
      throw new Error(`Failed to get medication logs: ${error.message}`);
    }
  }

  // NEW: Batch operations for better performance
  async batchUpdateMedications(updates) {
    try {
      const batch = writeBatch(db);

      for (const { medicationId, updates: medUpdates } of updates) {
        const medicationRef = doc(this.medicationsRef, medicationId);

        // Get current data and merge updates
        const existing = await this.getMedication(medicationId);
        if (existing) {
          const updatedData = {
            ...existing.decryptedData,
            ...medUpdates,
          };

          const encryptedData = encryptionService.encryptMedicalData(
            updatedData,
            this.userKey,
          );

          batch.update(medicationRef, {
            encryptedData,
            lastModified: serverTimestamp(),
          });
        }
      }

      await batch.commit();
      console.log('✅ Batch medication updates completed');
    } catch (error) {
      console.error('Error in batch medication updates:', error);
      throw new Error(`Failed to batch update medications: ${error.message}`);
    }
  }

  // NEW: Reset daily medication status (useful for scheduled tasks)
  async resetDailyStatus() {
    try {
      const medications = await this.getMedications();
      const updates = medications.map((med) => ({
        medicationId: med.id,
        updates: { takenToday: false, taken: false },
      }));

      await this.batchUpdateMedications(updates);
      console.log('✅ Daily medication status reset');
    } catch (error) {
      console.error('Error resetting daily status:', error);
      throw new Error(`Failed to reset daily status: ${error.message}`);
    }
  }
}
