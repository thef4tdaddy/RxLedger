// components/settings/ProfileSection.jsx - Real Firebase integration
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { db, auth } from '../../utils/firebase';
import { encryptionService } from '../../services/encryptionService';
import useAuth from '../../hooks/useAuth';

export default function ProfileSection() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    emergencyContact: '',
    emergencyPhone: '',
    primaryPhysician: '',
    pharmacy: '',
    insuranceProvider: '',
    medicalConditions: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;

      try {
        const profileRef = doc(db, 'users', user.uid, 'profile', 'personal');
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const data = profileSnap.data();
          const userKey = encryptionService.generateUserKey(
            user.uid,
            user.email,
          );

          let decryptedProfile = {};
          if (data.encryptedData) {
            decryptedProfile = encryptionService.decryptMedicalData(
              data.encryptedData,
              userKey,
            );
          }

          setProfile({
            displayName: user.displayName || '',
            email: user.email || '',
            ...decryptedProfile,
          });
        } else {
          // Initialize with user auth data
          setProfile((prev) => ({
            ...prev,
            displayName: user.displayName || '',
            email: user.email || '',
          }));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user?.uid) return;

    setSaving(true);
    try {
      const userKey = encryptionService.generateUserKey(user.uid, user.email);

      // Update Firebase Auth profile
      if (profile.displayName !== user.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: profile.displayName,
        });
      }

      // Update email if changed
      if (profile.email !== user.email) {
        await updateEmail(auth.currentUser, profile.email);
      }

      // Encrypt and save profile data
      const profileData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        emergencyContact: profile.emergencyContact,
        emergencyPhone: profile.emergencyPhone,
        primaryPhysician: profile.primaryPhysician,
        pharmacy: profile.pharmacy,
        insuranceProvider: profile.insuranceProvider,
        medicalConditions: profile.medicalConditions,
      };

      const encryptedData = encryptionService.encryptMedicalData(
        profileData,
        userKey,
      );

      const profileRef = doc(db, 'users', user.uid, 'profile', 'personal');
      await setDoc(
        profileRef,
        {
          encryptedData,
          displayName: profile.displayName,
          email: profile.email,
          updatedAt: new Date(),
        },
        { merge: true },
      );

      setIsEditing(false);
      await refreshUser();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match');
      return;
    }

    if (passwords.new.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await updatePassword(auth.currentUser, passwords.new);
      setPasswords({ current: '', new: '', confirm: '' });
      setShowPasswordChange(false);
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please check your current password.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Profile Information
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-[#1B59AE] hover:text-[#48B4A2] font-medium transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={profile.displayName}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, displayName: e.target.value }))
            }
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, email: e.target.value }))
            }
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, firstName: e.target.value }))
            }
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, lastName: e.target.value }))
            }
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={profile.dateOfBirth}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, dateOfBirth: e.target.value }))
            }
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={profile.gender}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, gender: e.target.value }))
            }
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emergency Contact
          </label>
          <input
            type="text"
            value={profile.emergencyContact}
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                emergencyContact: e.target.value,
              }))
            }
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emergency Phone
          </label>
          <input
            type="tel"
            value={profile.emergencyPhone}
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                emergencyPhone: e.target.value,
              }))
            }
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
          />
        </div>

        {/* Healthcare Providers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Primary Physician
          </label>
          <input
            type="text"
            value={profile.primaryPhysician}
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                primaryPhysician: e.target.value,
              }))
            }
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pharmacy
          </label>
          <input
            type="text"
            value={profile.pharmacy}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, pharmacy: e.target.value }))
            }
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Insurance Provider
          </label>
          <input
            type="text"
            value={profile.insuranceProvider}
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                insuranceProvider: e.target.value,
              }))
            }
            disabled={!isEditing}
            className="w-full p-2 border border-gray-300 rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
          />
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-4 py-2 bg-[#1B59AE] text-white rounded-lg font-medium hover:bg-[#48B4A2] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={() => setShowPasswordChange(true)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Change Password
          </button>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Change Password
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords((prev) => ({
                      ...prev,
                      current: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords((prev) => ({ ...prev, new: e.target.value }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords((prev) => ({
                      ...prev,
                      confirm: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-[#1B59AE] text-white rounded-lg font-medium hover:bg-[#48B4A2] transition-colors"
              >
                Update Password
              </button>
              <button
                onClick={() => setShowPasswordChange(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
