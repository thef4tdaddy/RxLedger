// components/settings/DangerZone.jsx
import { useState } from 'react';
import { useAuth } from '../../context/useAuth';

export default function DangerZone() {
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      alert('Please type "DELETE" to confirm account deletion.');
      return;
    }

    setDeleting(true);
    try {
      // Here you would implement account deletion
      // This would need to be a Cloud Function for security
      alert(
        'Account deletion functionality will be implemented with Cloud Functions for security.',
      );
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please contact support.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setConfirmText('');
    }
  };

  return (
    <>
      <section className="bg-white p-6 rounded-lg shadow-sm border border-red-200 mb-6">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-600">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Account
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-red-500 text-xl">⚠️</div>
              <div>
                <h3 className="font-medium text-red-900 mb-1">
                  What gets deleted:
                </h3>
                <ul className="text-red-800 text-sm space-y-1">
                  <li>• All your medication data and logs</li>
                  <li>• Health stats and tracking history</li>
                  <li>• Account profile and preferences</li>
                  <li>• Community contributions (anonymized data remains)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Account
              </h3>
              <p className="text-gray-600">
                This will permanently delete your account and all data. This
                action cannot be undone.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type &quot;DELETE&quot; to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Type DELETE here"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setConfirmText('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || confirmText !== 'DELETE'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
