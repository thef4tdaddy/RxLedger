// components/dashboard/DashboardHeader.jsx - Enhanced with user info
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import useAuth from '../../hooks/useAuth';
import { useMedications } from '../../context/MedicationContext';

export default function DashboardHeader() {
  const { user } = useAuth();
  const { medications } = useMedications();
  const [userProfile, setUserProfile] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Load user profile
  useEffect(() => {
    if (!user?.uid) return;

    const loadUserProfile = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserProfile(userSnap.data());
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, [user]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userProfile?.profile?.displayName) {
      return userProfile.profile.displayName
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Get current time greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get user display name
  const getDisplayName = () => {
    return (
      userProfile?.profile?.displayName ||
      user?.displayName ||
      user?.email?.split('@')[0] ||
      'there'
    );
  };

  // Calculate quick stats
  const getQuickStats = () => {
    if (!medications || medications.length === 0) {
      return { medicationCount: 0, takenToday: 0 };
    }

    const today = new Date().toDateString();
    const takenToday = medications.filter((med) => {
      if (!med.lastTaken) return false;
      const lastTakenDate = med.lastTaken.toDate
        ? med.lastTaken.toDate()
        : new Date(med.lastTaken);
      return lastTakenDate.toDateString() === today;
    }).length;

    return {
      medicationCount: medications.length,
      takenToday,
    };
  };

  const stats = getQuickStats();
  const initials = getUserInitials();

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1B59AE' }}>
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          {getTimeGreeting()}, {getDisplayName()}!
          {stats.medicationCount > 0 && (
            <span className="ml-2 text-sm">
              {stats.takenToday}/{stats.medicationCount} medications taken today
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick action button */}
        <a
          href="#/medications"
          className="hidden sm:flex items-center gap-2 bg-[#1B59AE] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#10B981] transition-colors"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Med
        </a>

        {/* User avatar with menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 bg-[#10B981] rounded-full flex items-center justify-center text-black text-sm font-bold border-2 border-black hover:bg-[#0EA5E9] transition-colors"
            title={`Signed in as ${getDisplayName()}`}
          >
            {initials}
          </button>

          {/* Profile dropdown menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border-2 border-black z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#10B981] rounded-full flex items-center justify-center text-black text-lg font-bold border-2 border-black">
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {getDisplayName()}
                    </p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <div className="px-3 py-2 text-sm text-gray-600">
                  <p>
                    <strong>Medications:</strong> {stats.medicationCount}
                  </p>
                  <p>
                    <strong>Taken Today:</strong> {stats.takenToday}
                  </p>
                  {userProfile?.profile?.joinedAt && (
                    <p>
                      <strong>Member Since:</strong>{' '}
                      {userProfile.profile.joinedAt.toDate
                        ? userProfile.profile.joinedAt
                            .toDate()
                            .toLocaleDateString()
                        : 'Recently'}
                    </p>
                  )}
                </div>

                <hr className="my-2" />

                <a
                  href="#/account"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Account Settings
                </a>
                <a
                  href="#/settings"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Preferences
                </a>
                <button
                  onClick={() => {
                    // Add sign out logic here
                    setShowProfileMenu(false);
                    // signOut(auth);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        ></div>
      )}
    </div>
  );
}
