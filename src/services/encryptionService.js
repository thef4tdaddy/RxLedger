// services/encryptionService.js
import CryptoJS from 'crypto-js';

class EncryptionService {
  constructor() {
    this.keyDerivationSalt = 'rxledger_salt_2024';
    this.version = '1.0';
  }

  generateUserKey(userUid, userEmail = 'bypass@example.com') {
    const combinedString = `${userUid}:${userEmail}:${this.keyDerivationSalt}`;
    return CryptoJS.PBKDF2(combinedString, this.keyDerivationSalt, {
      keySize: 256 / 32,
      iterations: 10000,
    }).toString();
  }

  // Enhanced encryption with timestamp (your original format + improvements)
  encryptMedicalData(data, userKey) {
    try {
      const jsonString = JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(jsonString, userKey).toString();
      const hash = CryptoJS.HmacSHA256(encrypted, userKey).toString();

      return {
        data: encrypted,
        integrity: hash,
        version: this.version,
        timestamp: new Date().toISOString(), // Added for better tracking
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt medical data');
    }
  }

  // Backward compatible decryption with enhanced error handling
  decryptMedicalData(encryptedObj, userKey) {
    try {
      // Handle your existing format and new format
      if (!encryptedObj || !encryptedObj.data) {
        console.error('Invalid encrypted object structure');
        return null;
      }

      // Integrity check (same as your version)
      const expectedHash = CryptoJS.HmacSHA256(
        encryptedObj.data,
        userKey,
      ).toString();
      if (expectedHash !== encryptedObj.integrity) {
        console.error(
          'Data integrity check failed - possible tampering detected',
        );
        return null; // Graceful failure instead of throwing
      }

      // Decryption (same as your version)
      const decrypted = CryptoJS.AES.decrypt(encryptedObj.data, userKey);
      const jsonString = decrypted.toString(CryptoJS.enc.Utf8);

      // Enhanced error handling
      if (!jsonString) {
        console.error('Decryption failed - invalid key or corrupted data');
        return null;
      }

      try {
        return JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Failed to parse decrypted data:', parseError);
        return null; // Graceful failure instead of throwing
      }
    } catch (error) {
      console.error('Decryption error:', error);
      return null; // Always return null on error to prevent crashes
    }
  }

  // Your existing method with enhanced error handling
  createMedicationHash(medicationName, dosage) {
    try {
      const normalizedName = medicationName.toLowerCase().trim();
      const normalizedDosage = dosage.toLowerCase().trim();
      return CryptoJS.SHA256(
        `${normalizedName}:${normalizedDosage}`,
      ).toString();
    } catch (error) {
      console.error('Error creating medication hash:', error);
      return null;
    }
  }

  // NEW: Additional utility methods for enhanced functionality

  // Test encryption to ensure it's working properly
  testEncryption(userKey) {
    try {
      const testData = {
        medication: 'Test Medication',
        dosage: '10mg',
        timestamp: new Date().toISOString(),
      };

      const encrypted = this.encryptMedicalData(testData, userKey);
      if (!encrypted) return false;

      const decrypted = this.decryptMedicalData(encrypted, userKey);
      if (!decrypted) return false;

      return (
        decrypted.medication === testData.medication &&
        decrypted.dosage === testData.dosage
      );
    } catch (error) {
      console.error('Encryption test failed:', error);
      return false;
    }
  }

  // Generate anonymous ID for community features
  generateAnonymousId(userUid, userEmail) {
    try {
      const combinedString = `${userUid}:${userEmail}:anonymous`;
      return CryptoJS.SHA256(combinedString).toString().substring(0, 16);
    } catch (error) {
      console.error('Error generating anonymous ID:', error);
      return null;
    }
  }

  // Validate key strength
  validateKeyStrength(key) {
    return key && key.length >= 32;
  }

  // Get encryption info for debugging
  getEncryptionInfo() {
    return {
      version: this.version,
      algorithm: 'AES-256',
      keyDerivation: 'PBKDF2',
      integrityCheck: 'HMAC-SHA256',
      backwardCompatible: true,
      gracefulErrors: true,
    };
  }
}

export const encryptionService = new EncryptionService();
