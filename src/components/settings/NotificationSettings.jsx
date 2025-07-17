// components/settings/NotificationSettings.jsx - Enhanced with implementation status
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import useAuth from '../../hooks/useAuth';

export default function NotificationSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    medicationReminders: true,
    refillReminders: true,
    healthCheckReminders: false,
    communityUpdates: false,
    weeklyReports: true,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  });
  const [saving, setSaving] = useState(false);

  // Load notification settings
  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.uid) return;

      try {
        const settingsRef = doc(
          db,
          'users',
          user.uid,
          'settings',
          'notifications',
        );
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          setSettings((prev) => ({ ...prev, ...settingsSnap.data() }));
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    };

    loadSettings();
  }, [user]);

  const handleToggle = async (setting) => {
    const newSettings = { ...settings, [setting]: !settings[setting] };
    setSettings(newSettings);

    if (!user?.uid) return;

    setSaving(true);
    try {
      const settingsRef = doc(
        db,
        'users',
        user.uid,
        'settings',
        'notifications',
      );
      await setDoc(settingsRef, {
        ...newSettings,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      // Revert on error
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  const notificationOptions = [
    {
      key: 'medicationReminders',
      title: 'Medication Reminders',
      description: "Get notified when it's time to take your medications",
      status: 'coming-soon',
    },
    {
      key: 'refillReminders',
      title: 'Refill Reminders',
      description: 'Alerts when medications are running low',
      status: 'coming-soon',
    },
    {
      key: 'healthCheckReminders',
      title: 'Health Check Reminders',
      description: 'Daily prompts to log your mood, energy, and symptoms',
      status: 'planned',
    },
    {
      key: 'communityUpdates',
      title: 'Community Updates',
      description: 'New insights and trends from the RxLedger community',
      status: 'planned',
    },
    {
      key: 'weeklyReports',
      title: 'Weekly Health Reports',
      description: 'Summary of your health trends and medication adherence',
      status: 'planned',
    },
    {
      key: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      status: 'functional',
    },
    {
      key: 'pushNotifications',
      title: 'Push Notifications',
      description: 'Browser notifications for important alerts',
      status: 'coming-soon',
    },
    {
      key: 'smsNotifications',
      title: 'SMS Notifications',
      description: 'Text message alerts for critical reminders',
      status: 'planned',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Implementation Status Banner */}
      <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
        <div className="flex items-center">
          <span className="text-yellow-600 text-sm mr-2">🔄</span>
          <div>
            <p className="text-yellow-800 font-medium text-sm">
              Partially Functional
            </p>
            <p className="text-yellow-700 text-xs">
              Settings save to Firebase, but notification delivery system is in
              development
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Notification Preferences
      </h2>

      <div className="space-y-4">
        {notificationOptions.map((option) => (
          <div
            key={option.key}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-gray-800">{option.title}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    option.status === 'functional'
                      ? 'bg-green-100 text-green-700'
                      : option.status === 'coming-soon'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {option.status === 'functional'
                    ? 'Working'
                    : option.status === 'coming-soon'
                      ? 'Coming Soon'
                      : 'Planned'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{option.description}</p>
            </div>
            <button
              onClick={() => handleToggle(option.key)}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1B59AE] focus:ring-offset-2 disabled:opacity-50 ${
                settings[option.key] ? 'bg-[#1B59AE]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings[option.key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {saving && (
        <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#1B59AE] border-t-transparent"></div>
          Saving preferences...
        </div>
      )}

      {/* Development Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <div className="text-blue-500 text-xl mr-3">📱</div>
          <div>
            <h4 className="font-medium text-blue-900">
              Notification System Status
            </h4>
            <p className="text-sm text-blue-800 mt-1">
              Your preferences are saved and will be applied when the
              notification delivery system is deployed. Email preferences work
              immediately, while push notifications and SMS are in active
              development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
