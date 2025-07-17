// components/settings/CommunitySettings.jsx - Enhanced with implementation status
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import useAuth from '../../hooks/useAuth';

export default function CommunitySettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    shareAnonymizedData: false,
    shareEffectivenessData: false,
    shareSideEffectsData: false,
    shareAdherenceData: false,
    shareDemographics: false,
    participateInResearch: false,
    allowInsightGeneration: false,
    dataRetentionPeriod: '2years',
  });
  const [saving, setSaving] = useState(false);

  // Load community settings
  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.uid) return;

      try {
        const settingsRef = doc(db, 'users', user.uid, 'settings', 'community');
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          setSettings((prev) => ({ ...prev, ...settingsSnap.data() }));
        }
      } catch (error) {
        console.error('Error loading community settings:', error);
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
      const settingsRef = doc(db, 'users', user.uid, 'settings', 'community');
      await setDoc(settingsRef, {
        ...newSettings,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating community settings:', error);
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  const handleRetentionChange = async (period) => {
    const newSettings = { ...settings, dataRetentionPeriod: period };
    setSettings(newSettings);

    if (!user?.uid) return;

    setSaving(true);
    try {
      const settingsRef = doc(db, 'users', user.uid, 'settings', 'community');
      await setDoc(settingsRef, {
        ...newSettings,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating retention period:', error);
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  const communityOptions = [
    {
      key: 'shareAnonymizedData',
      title: 'Share Anonymized Health Data',
      description:
        'Contribute to community insights while keeping your identity private',
      status: 'coming-soon',
    },
    {
      key: 'shareEffectivenessData',
      title: 'Share Medication Effectiveness',
      description:
        'Help others understand how medications work for different people',
      status: 'planned',
    },
    {
      key: 'shareSideEffectsData',
      title: 'Share Side Effects Data',
      description: 'Contribute to side effect frequency and severity insights',
      status: 'planned',
    },
    {
      key: 'shareAdherenceData',
      title: 'Share Adherence Patterns',
      description: 'Help identify factors that improve medication adherence',
      status: 'planned',
    },
    {
      key: 'shareDemographics',
      title: 'Share Basic Demographics',
      description: 'Age range and gender only (no personal identifiers)',
      status: 'coming-soon',
    },
    {
      key: 'participateInResearch',
      title: 'Participate in Research Studies',
      description: 'Opt-in to anonymous research opportunities',
      status: 'planned',
    },
    {
      key: 'allowInsightGeneration',
      title: 'Allow AI Insight Generation',
      description:
        'Let RxLedger analyze patterns to generate personalized insights',
      status: 'coming-soon',
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
              In Development
            </p>
            <p className="text-yellow-700 text-xs">
              Privacy settings save to Firebase, community features launching
              soon
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Community & Privacy Settings
        </h2>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-500 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Privacy First</h3>
              <p className="text-sm text-blue-800">
                All shared data is completely anonymized. No personal
                information, names, or contact details are ever shared. You can
                change these settings at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {communityOptions.map((option) => (
          <div
            key={option.key}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
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

      {/* Data Retention Settings */}
      <div className="mt-6 p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-medium text-gray-800">Data Retention Period</h3>
          <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
            Working
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          How long should your shared data remain in community insights?
        </p>
        <div className="space-y-2">
          {[
            { value: '1year', label: '1 Year' },
            { value: '2years', label: '2 Years' },
            { value: '5years', label: '5 Years' },
            { value: 'indefinite', label: 'Indefinite (until I opt out)' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3">
              <input
                type="radio"
                name="retention"
                value={option.value}
                checked={settings.dataRetentionPeriod === option.value}
                onChange={() => handleRetentionChange(option.value)}
                className="text-[#1B59AE] focus:ring-[#1B59AE]"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {saving && (
        <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#1B59AE] border-t-transparent"></div>
          Saving preferences...
        </div>
      )}

      {/* Development Timeline */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start">
          <div className="text-amber-500 text-xl mr-3">🗓️</div>
          <div>
            <h4 className="font-medium text-amber-900">
              Community Features Timeline
            </h4>
            <p className="text-sm text-amber-800 mt-1">
              Your privacy preferences are saved and ready. Community data
              sharing will be enabled progressively as anonymization systems and
              insight generation features are completed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
