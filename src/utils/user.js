// utils/user.js - User management utilities
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { encryptionService } from '../services/encryptionService';

/**
 * Create a new user profile with encrypted medication system setup
 */
export const createUserProfile = async (userId, profileData) => {
  try {
    // Create user profile document
    const userRef = doc(db, 'users', userId);

    const userProfile = {
      profile: {
        email: profileData.email,
        displayName: profileData.name,
        age: profileData.age ? parseInt(profileData.age) : null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        joinedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      },
      communitySettings: {
        allowAnonymousSharing: false, // Default to private
        shareAgeRange: true,
        shareConditionType: false,
        sharedExperiences: [],
      },
      preferences: {
        reminderDefaults: {
          enabled: true,
          sound: true,
          vibration: true,
        },
        privacyLevel: 'high', // high, medium, low
        dataRetention: '2years', // How long to keep logs
      },
      // Initialize encryption for this user
      encryptionVersion: '1.0',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userRef, userProfile);

    // Test encryption setup (ensure it works for this user)
    const testKey = encryptionService.generateUserKey(
      userId,
      profileData.email,
    );
    const testData = {
      test: 'encryption_working',
      timestamp: new Date().toISOString(),
    };
    const encrypted = encryptionService.encryptMedicalData(testData, testKey);
    const decrypted = encryptionService.decryptMedicalData(encrypted, testKey);

    if (decrypted.test !== 'encryption_working') {
      throw new Error('Encryption setup failed for user');
    }

    console.log('✅ User profile created successfully with encryption setup');
    return userProfile;
  } catch (error) {
    console.error('❌ Error creating user profile:', error);
    throw new Error(`Failed to create user profile: ${error.message}`);
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error(`Failed to get user profile: ${error.message}`);
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);

    // Prepare the update object with proper nesting
    const updateData = {
      updatedAt: serverTimestamp(),
    };

    // Handle nested profile updates
    Object.keys(updates).forEach((key) => {
      if (key === 'profile') {
        Object.keys(updates.profile).forEach((profileKey) => {
          updateData[`profile.${profileKey}`] = updates.profile[profileKey];
        });
      } else if (key === 'communitySettings') {
        Object.keys(updates.communitySettings).forEach((settingKey) => {
          updateData[`communitySettings.${settingKey}`] =
            updates.communitySettings[settingKey];
        });
      } else if (key === 'preferences') {
        Object.keys(updates.preferences).forEach((prefKey) => {
          updateData[`preferences.${prefKey}`] = updates.preferences[prefKey];
        });
      } else {
        updateData[key] = updates[key];
      }
    });

    await updateDoc(userRef, updateData);
    console.log('✅ User profile updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
};

/**
 * Update user's last login timestamp
 */
export const updateLastLogin = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        profile: {
          lastLoginAt: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    console.warn('Could not update last login timestamp:', error);
    // Non-critical error, don't throw
  }
};

/**
 * Check if user profile exists and is complete
 */
export const isProfileComplete = async (userId) => {
  try {
    const profile = await getUserProfile(userId);

    if (!profile) return false;

    // Check if essential profile fields exist
    const hasBasicInfo = profile.profile?.email && profile.profile?.displayName;
    const hasEncryption = profile.encryptionVersion;

    return hasBasicInfo && hasEncryption;
  } catch (error) {
    console.error('Error checking profile completeness:', error);
    return false;
  }
};

/**
 * Get user's medication statistics
 */
export const getUserStats = async () => {
  try {
    // This would typically query the medication collections
    // For now, return basic structure
    return {
      totalMedications: 0,
      activeMedications: 0,
      totalLogs: 0,
      lastActivity: null,
      joinedDate: null,
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
};

/**
 * Anonymize user data for community sharing
 */
export const createAnonymousUserData = (profile) => {
  try {
    const currentYear = new Date().getFullYear();
    const birthYear = profile.age ? currentYear - profile.age : null;

    return encryptionService.anonymizeDemographics(
      birthYear,
      profile.gender || 'not-specified',
      profile.location || 'not-specified',
    );
  } catch (error) {
    console.error('Error creating anonymous user data:', error);
    return {
      ageRange: 'not-specified',
      genderCategory: 'not-specified',
      regionCategory: 'not-specified',
    };
  }
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const minLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  return {
    isValid: minLength && hasNumber && hasLetter,
    minLength,
    hasNumber,
    hasLetter,
    score: [minLength, hasNumber, hasLetter].filter(Boolean).length,
  };
};
