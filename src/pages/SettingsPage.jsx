// pages/SettingsPage.jsx - Enhanced with components and Firebase integration
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import ProfileSection from '../components/account/ProfileSection';
import NotificationSettings from '../components/account//NotificationSettings';
import CommunitySettings from '../components/account/CommunitySettings';
import IntegrationSettings from '../components/account/IntegrationSettings';
import DangerZone from '../components/account/DangerZone';
import useAuth from '../hooks/useAuth';

export default function SettingsPage() {
  const { user } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect will happen automatically via auth state change
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B59AE] mb-2">
          Account Settings
        </h1>
        <p className="text-gray-600">
          Manage your profile, notifications, and privacy preferences
        </p>
      </div>

      {/* Profile Section */}
      <ProfileSection user={user} />

      {/* Notification Settings */}
      <NotificationSettings />

      {/* Community Settings */}
      <CommunitySettings />

      {/* Integration Settings */}
      <IntegrationSettings />

      {/* Danger Zone */}
      <DangerZone />

      {/* Footer Actions */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <Link
          to="/admin"
          className="text-sm text-[#1B59AE] hover:underline font-medium"
        >
          Admin Panel
        </Link>
        <button
          onClick={confirmLogout}
          className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Sign Out
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to sign out of RxLedger?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
