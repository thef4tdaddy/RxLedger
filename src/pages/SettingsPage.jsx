// pages/SettingsPage.jsx - Complete with real Firebase integration
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import ProfileSection from '../components/settings/ProfileSection';
import NotificationSettings from '../components/settings/NotificationSettings';
import CommunitySettings from '../components/settings/CommunitySettings';
import IntegrationSettings from '../components/settings/IntegrationSettings';
import DangerZone from '../components/settings/DangerZone';
import useAuth from '../hooks/useAuth';

export default function SettingsPage() {
  const { user } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut(auth);
      // Redirect will happen automatically via auth state change
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B59AE] mb-2">
          Account Settings
        </h1>
        <p className="text-gray-600">
          Manage your profile, notifications, privacy preferences, and
          integrations
        </p>
      </div>

      {/* Profile Section */}
      <ProfileSection />

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
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="text-sm text-[#1B59AE] hover:underline font-medium flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Admin Panel
          </Link>
          <span className="text-gray-400">•</span>
          <Link
            to="/trends"
            className="text-sm text-[#1B59AE] hover:underline font-medium flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Health Trends
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Signed in as <span className="font-medium">{user?.email}</span>
          </div>
          <button
            onClick={confirmLogout}
            disabled={loggingOut}
            className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {loggingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Sign Out
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to sign out of RxLedger? Any unsaved changes
              will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loggingOut ? 'Signing out...' : 'Yes, Sign Out'}
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
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
