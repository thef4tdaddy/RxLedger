// components/settings/ProfileSection.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../../utils/firebase';

export default function ProfileSection({ user }) {
  const [userProfile, setUserProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    age: '',
    timezone: '',
  });

  useEffect(() => {
    if (!user?.uid) return;

    const loadUserProfile = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const profile = userSnap.data();
          setUserProfile(profile);
          setFormData({
            displayName: profile.profile?.displayName || user.displayName || '',
            age: profile.profile?.age || '',
            timezone:
              profile.profile?.timezone ||
              Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user?.uid, user?.displayName]); // Include user.displayName since it's used in the function

  const handleSave = async () => {
    try {
      setSaving(true);

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: formData.displayName,
      });

      // Update Firestore profile
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        'profile.displayName': formData.displayName,
        'profile.age': formData.age ? parseInt(formData.age) : null,
        'profile.timezone': formData.timezone,
        updatedAt: new Date(),
      });

      setEditing(false);

      // Reload profile data after successful save
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const profile = userSnap.data();
        setUserProfile(profile);
        setFormData({
          displayName: profile.profile?.displayName || user.displayName || '',
          age: profile.profile?.age || '',
          timezone:
            profile.profile?.timezone ||
            Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: userProfile?.profile?.displayName || user.displayName || '',
      age: userProfile?.profile?.age || '',
      timezone:
        userProfile?.profile?.timezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    setEditing(false);
  };

  const getUserInitials = () => {
    const name = formData.displayName || user?.displayName || user?.email || '';
    return (
      name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U'
    );
  };

  if (loading) {
    return (
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">Profile</h2>
        <div className="animate-pulse flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-gray-200"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#1B59AE]">Profile</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-[#1B59AE] hover:underline font-medium"
          >
            Edit Profile
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-[#10B981] flex items-center justify-center text-white text-xl font-bold border-2 border-[#1B59AE]">
              {getUserInitials()}
            </div>
            <div className="text-sm text-gray-600">
              Profile photos coming soon
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  displayName: e.target.value,
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
              placeholder="Enter your display name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age (Optional)
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, age: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
              placeholder="Your age"
              min="1"
              max="120"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used for anonymized community insights (age ranges only)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <select
              value={formData.timezone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, timezone: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-[#1B59AE] text-white rounded-lg hover:bg-[#48B4A2] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-[#10B981] flex items-center justify-center text-white text-xl font-bold border-2 border-[#1B59AE]">
            {getUserInitials()}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {formData.displayName || 'No display name set'}
            </p>
            <p className="text-sm text-gray-600">{user?.email}</p>
            {formData.age && (
              <p className="text-xs text-gray-500">Age: {formData.age}</p>
            )}
            <p className="text-xs text-gray-500">
              Timezone: {formData.timezone}
            </p>
            {userProfile?.profile?.joinedAt && (
              <p className="text-xs text-gray-500">
                Member since:{' '}
                {userProfile.profile.joinedAt.toDate
                  ? userProfile.profile.joinedAt.toDate().toLocaleDateString()
                  : 'Recently'}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
