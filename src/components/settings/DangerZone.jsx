// components/settings/DangerZone.jsx - Real Firebase integration
import { useState } from 'react';
import { deleteUser } from 'firebase/auth';
import { doc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { db, auth } from '../../utils/firebase';
import useAuth from '../../hooks/useAuth';

export default function DangerZone() {
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportData, setShowExportData] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExportData = async () => {
    if (!user?.uid) return;

    setExporting(true);
    try {
      // Export all user data
      const userData = {
        profile: {},
        medications: [],
        healthStats: [],
        medicationLogs: [],
        settings: {},
      };

      // Get profile data
      try {
        const profileRef = doc(db, 'users', user.uid, 'profile', 'personal');
        const profileSnap = await getDocs(profileRef);
        if (profileSnap.exists()) {
          userData.profile = profileSnap.data();
        }
      } catch (error) {
        console.warn('Error exporting profile:', error);
      }

      // Get medications
      try {
        const medicationsRef = collection(db, 'users', user.uid, 'medications');
        const medicationsSnap = await getDocs(medicationsRef);
        userData.medications = medicationsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.warn('Error exporting medications:', error);
      }

      // Get health stats
      try {
        const healthStatsRef = collection(db, 'users', user.uid, 'healthStats');
        const healthStatsSnap = await getDocs(healthStatsRef);
        userData.healthStats = healthStatsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.warn('Error exporting health stats:', error);
      }

      // Get medication logs
      try {
        const logsRef = collection(db, 'users', user.uid, 'medicationLogs');
        const logsSnap = await getDocs(logsRef);
        userData.medicationLogs = logsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.warn('Error exporting medication logs:', error);
      }

      // Get all settings
      try {
        const settingsRef = collection(db, 'users', user.uid, 'settings');
        const settingsSnap = await getDocs(settingsRef);
        settingsSnap.docs.forEach((doc) => {
          userData.settings[doc.id] = doc.data();
        });
      } catch (error) {
        console.warn('Error exporting settings:', error);
      }

      // Create and download file
      const exportData = {
        exportDate: new Date().toISOString(),
        userId: user.uid,
        email: user.email,
        ...userData,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rxledger-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
      setShowExportData(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE MY ACCOUNT') {
      alert('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }

    if (!user?.uid) return;

    setDeleting(true);
    try {
      const batch = writeBatch(db);

      // Delete all user subcollections
      const subcollections = [
        'medications',
        'healthStats',
        'medicationLogs',
        'settings',
        'profile',
      ];

      for (const subcollection of subcollections) {
        try {
          const collectionRef = collection(
            db,
            'users',
            user.uid,
            subcollection,
          );
          const snapshot = await getDocs(collectionRef);
          snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
          });
        } catch (error) {
          console.warn(`Error deleting ${subcollection}:`, error);
        }
      }

      // Delete user document
      const userRef = doc(db, 'users', user.uid);
      batch.delete(userRef);

      // Commit all deletions
      await batch.commit();

      // Delete Firebase Auth user
      await deleteUser(auth.currentUser);

      alert('Your account has been permanently deleted.');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again or contact support.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-red-900 mb-4">Danger Zone</h2>

      <div className="space-y-4">
        {/* Export Data */}
        <div className="flex items-center justify-between p-4 bg-white border border-red-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Export Your Data</h3>
            <p className="text-sm text-gray-600">
              Download all your health data in JSON format
            </p>
          </div>
          <button
            onClick={() => setShowExportData(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Export Data
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between p-4 bg-white border border-red-200 rounded-lg">
          <div>
            <h3 className="font-medium text-red-900">Delete Account</h3>
            <p className="text-sm text-red-700">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Export Data Modal */}
      {showExportData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Export Your Data
            </h3>
            <p className="text-gray-600 mb-6">
              This will download all your health data, including medications,
              health stats, and settings in JSON format.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleExportData}
                disabled={exporting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {exporting ? 'Exporting...' : 'Download Data'}
              </button>
              <button
                onClick={() => setShowExportData(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-red-900 mb-4">
              Delete Account
            </h3>
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <p className="text-red-800 text-sm font-medium mb-2">
                ⚠️ This action is permanent and cannot be undone!
              </p>
              <p className="text-red-700 text-sm">
                All your medications, health data, settings, and account
                information will be permanently deleted.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type &quot;DELETE MY ACCOUNT&quot; to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="DELETE MY ACCOUNT"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || confirmText !== 'DELETE MY ACCOUNT'}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete My Account'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setConfirmText('');
                }}
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
