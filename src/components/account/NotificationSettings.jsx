// components/settings/NotificationSettings.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../../context/useAuth';

export function NotificationSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    medicationReminders: true,
    refillReminders: true,
    manufacturerAlerts: false,
    reminderSound: true,
    reminderVibration: true,
    emailNotifications: false,
    pushNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    if (user?.uid) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const preferences = userData.preferences || {};

        setSettings({
          medicationReminders: preferences.medicationReminders ?? true,
          refillReminders: preferences.refillReminders ?? true,
          manufacturerAlerts: preferences.manufacturerAlerts ?? false,
          reminderSound: preferences.reminderSound ?? true,
          reminderVibration: preferences.reminderVibration ?? true,
          emailNotifications: preferences.emailNotifications ?? false,
          pushNotifications: preferences.pushNotifications ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    setSaving((prev) => ({ ...prev, [key]: true }));

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        [`preferences.${key}`]: value,
        updatedAt: new Date(),
      });

      setSettings((prev) => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error updating setting:', error);
      alert('Failed to update setting. Please try again.');
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  };

  const ToggleSwitch = ({ enabled, onChange, disabled }) => (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${enabled ? 'bg-[#1B59AE]' : 'bg-gray-300'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  if (loading) {
    return (
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
          Notifications
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-40"></div>
              <div className="h-6 w-11 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const notificationOptions = [
    {
      key: 'medicationReminders',
      label: 'Medication Reminders',
      description: "Get notified when it's time to take medications",
    },
    {
      key: 'refillReminders',
      label: 'Refill Reminders',
      description: 'Alerts when prescriptions need refilling',
    },
    {
      key: 'manufacturerAlerts',
      label: 'Manufacturer Alerts',
      description: 'Notify when medication manufacturer changes',
    },
    {
      key: 'reminderSound',
      label: 'Reminder Sounds',
      description: 'Play sound with notifications',
      dependsOn: 'medicationReminders',
    },
    {
      key: 'reminderVibration',
      label: 'Reminder Vibration',
      description: 'Vibrate device for reminders (mobile)',
      dependsOn: 'medicationReminders',
    },
    {
      key: 'emailNotifications',
      label: 'Email Notifications',
      description: 'Receive notifications via email',
    },
    {
      key: 'pushNotifications',
      label: 'Push Notifications',
      description: 'Browser/app push notifications',
    },
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
        Notifications
      </h2>
      <div className="space-y-4">
        {notificationOptions.map((option) => {
          const isDependentDisabled =
            option.dependsOn && !settings[option.dependsOn];
          const isDisabled = saving[option.key] || isDependentDisabled;

          return (
            <div key={option.key} className="flex justify-between items-start">
              <div
                className={`flex-1 ${isDependentDisabled ? 'opacity-50' : ''}`}
              >
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
                {isDependentDisabled && (
                  <p className="text-xs text-gray-500 mt-1">
                    Requires{' '}
                    {
                      notificationOptions.find(
                        (opt) => opt.key === option.dependsOn,
                      )?.label
                    }
                  </p>
                )}
              </div>
              <ToggleSwitch
                enabled={settings[option.key] && !isDependentDisabled}
                onChange={() =>
                  !isDisabled &&
                  updateSetting(option.key, !settings[option.key])
                }
                disabled={isDisabled}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
