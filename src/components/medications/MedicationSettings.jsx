// components/medications/MedicationSettings.jsx - Enhanced with Firebase integration
import { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import useAuth from '../../hooks/useAuth';

export default function MedicationSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    medicationReminders: true,
    refillReminders: true,
    manufacturerAlerts: false,
    reminderSound: true,
    reminderVibration: true,
    privacyLevel: 'high',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [error, setError] = useState('');

  // Load user settings from Firebase
  useEffect(() => {
    if (!user?.uid) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(
      userRef,
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          const userPreferences = userData.preferences || {};

          setSettings({
            medicationReminders: userPreferences.medicationReminders ?? true,
            refillReminders: userPreferences.refillReminders ?? true,
            manufacturerAlerts: userPreferences.manufacturerAlerts ?? false,
            reminderSound: userPreferences.reminderSound ?? true,
            reminderVibration: userPreferences.reminderVibration ?? true,
            privacyLevel: userPreferences.privacyLevel ?? 'high',
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error loading settings:', error);
        setError('Failed to load settings');
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user]);

  // Update a setting in Firebase
  const updateSetting = async (settingKey, value) => {
    if (!user?.uid) return;

    setSaving((prev) => ({ ...prev, [settingKey]: true }));
    setError('');

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        [`preferences.${settingKey}`]: value,
        updatedAt: new Date(),
      });

      // Optimistically update local state
      setSettings((prev) => ({ ...prev, [settingKey]: value }));
    } catch (error) {
      console.error('Error updating setting:', error);
      setError('Failed to save setting. Please try again.');
      // Revert optimistic update on error
      setSettings((prev) => ({ ...prev, [settingKey]: !value }));
    } finally {
      setSaving((prev) => ({ ...prev, [settingKey]: false }));
    }
  };

  // Toggle switch component
  const ToggleSwitch = ({ enabled, onChange, disabled }) => (
    <button
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{
        backgroundColor: enabled ? '#1B59AE' : '#9CA3AF',
      }}
      onMouseOver={(e) =>
        !disabled &&
        enabled &&
        (e.currentTarget.style.backgroundColor = '#48B4A2')
      }
      onMouseOut={(e) =>
        !disabled &&
        enabled &&
        (e.currentTarget.style.backgroundColor = '#1B59AE')
      }
      onClick={onChange}
      disabled={disabled}
    >
      <span className="sr-only">Toggle setting</span>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Medication Settings</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between animate-pulse"
            >
              <div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-6 w-11 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const settingsConfig = [
    {
      key: 'medicationReminders',
      title: 'Medication Reminders',
      desc: "Get notifications when it's time to take your medications",
      enabled: settings.medicationReminders,
    },
    {
      key: 'refillReminders',
      title: 'Refill Reminders',
      desc: "Get notified when it's time to refill your prescriptions",
      enabled: settings.refillReminders,
    },
    {
      key: 'manufacturerAlerts',
      title: 'Manufacturer Change Alerts',
      desc: 'Get notified when your medication manufacturer changes',
      enabled: settings.manufacturerAlerts,
    },
    {
      key: 'reminderSound',
      title: 'Reminder Sounds',
      desc: 'Play sound notifications for medication reminders',
      enabled: settings.reminderSound,
      dependsOn: 'medicationReminders',
    },
    {
      key: 'reminderVibration',
      title: 'Reminder Vibration',
      desc: 'Vibrate device for medication reminders (mobile only)',
      enabled: settings.reminderVibration,
      dependsOn: 'medicationReminders',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#1B59AE]">
          Medication Settings
        </h2>
        {Object.keys(saving).some((key) => saving[key]) && (
          <div className="flex items-center text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1B59AE] mr-2"></div>
            Saving...
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Notification Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Notifications
          </h3>
          {settingsConfig.map((setting) => {
            const isDependentDisabled =
              setting.dependsOn && !settings[setting.dependsOn];
            const isDisabled = saving[setting.key] || isDependentDisabled;

            return (
              <div
                key={setting.key}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  isDependentDisabled
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-gray-200 hover:border-[#1B59AE]/30'
                }`}
              >
                <div className={isDependentDisabled ? 'opacity-50' : ''}>
                  <h4 className="font-medium text-gray-900">{setting.title}</h4>
                  <p className="text-sm text-gray-600">{setting.desc}</p>
                  {isDependentDisabled && (
                    <p className="text-xs text-gray-500 mt-1">
                      Requires{' '}
                      {
                        settingsConfig.find((s) => s.key === setting.dependsOn)
                          ?.title
                      }
                    </p>
                  )}
                </div>
                <ToggleSwitch
                  enabled={setting.enabled && !isDependentDisabled}
                  onChange={() =>
                    !isDisabled && updateSetting(setting.key, !setting.enabled)
                  }
                  disabled={isDisabled}
                />
              </div>
            );
          })}
        </div>

        {/* Privacy Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Privacy & Data
          </h3>
          <div className="p-3 rounded-lg border border-gray-200 hover:border-[#1B59AE]/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Privacy Level</h4>
                <p className="text-sm text-gray-600">
                  Control how your data is used for community insights
                </p>
              </div>
              <select
                value={settings.privacyLevel}
                onChange={(e) => updateSetting('privacyLevel', e.target.value)}
                disabled={saving.privacyLevel}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent disabled:opacity-50"
              >
                <option value="high">High (No sharing)</option>
                <option value="medium">Medium (Anonymous trends)</option>
                <option value="low">Low (Anonymous insights)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="text-blue-500 text-xl mr-3">🔒</div>
            <div>
              <h4 className="font-medium text-blue-900">
                Your Privacy is Protected
              </h4>
              <p className="text-sm text-blue-800 mt-1">
                All your medication data is encrypted and stored securely.
                Community features use anonymous data only, and you control what
                gets shared.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
