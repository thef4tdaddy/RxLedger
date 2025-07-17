// components/settings/NotificationSettings.jsx - Real Firebase integration
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
    },
    {
      key: 'refillReminders',
      title: 'Refill Reminders',
      description: 'Alerts when medications are running low',
    },
    {
      key: 'healthCheckReminders',
      title: 'Health Check Reminders',
      description: 'Daily prompts to log your mood, energy, and symptoms',
    },
    {
      key: 'communityUpdates',
      title: 'Community Updates',
      description: 'New insights and trends from the RxLedger community',
    },
    {
      key: 'weeklyReports',
      title: 'Weekly Health Reports',
      description: 'Summary of your health trends and medication adherence',
    },
    {
      key: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
    },
    {
      key: 'pushNotifications',
      title: 'Push Notifications',
      description: 'Browser notifications for important alerts',
    },
    {
      key: 'smsNotifications',
      title: 'SMS Notifications',
      description: 'Text message alerts for critical reminders',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
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
              <h3 className="font-medium text-gray-800">{option.title}</h3>
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
    </div>
  );
}
