// services/encryptionService.js
import CryptoJS from 'crypto-js';

class EncryptionService {
  constructor() {
    this.keyDerivationSalt = 'rxledger_salt_2024';
  }

  generateUserKey(userUid, userEmail = 'bypass@example.com') {
    const combinedString = `${userUid}:${userEmail}:${this.keyDerivationSalt}`;
    return CryptoJS.PBKDF2(combinedString, this.keyDerivationSalt, {
      keySize: 256 / 32,
      iterations: 10000,
    }).toString();
  }

  encryptMedicalData(data, userKey) {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, userKey).toString();
    const hash = CryptoJS.HmacSHA256(encrypted, userKey).toString();

    return {
      data: encrypted,
      integrity: hash,
      version: '1.0',
    };
  }

  decryptMedicalData(encryptedObj, userKey) {
    if (!encryptedObj || !encryptedObj.data) return null;

    const expectedHash = CryptoJS.HmacSHA256(
      encryptedObj.data,
      userKey,
    ).toString();
    if (expectedHash !== encryptedObj.integrity) {
      throw new Error('Data integrity check failed');
    }

    const decrypted = CryptoJS.AES.decrypt(encryptedObj.data, userKey);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);

    try {
      return JSON.parse(jsonString);
    } catch {
      throw new Error('Failed to decrypt data');
    }
  }

  createMedicationHash(medicationName, dosage) {
    const normalizedName = medicationName.toLowerCase().trim();
    const normalizedDosage = dosage.toLowerCase().trim();
    return CryptoJS.SHA256(`${normalizedName}:${normalizedDosage}`).toString();
  }
}

export const encryptionService = new EncryptionService();
