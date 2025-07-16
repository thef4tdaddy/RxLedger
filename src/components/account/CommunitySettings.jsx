// components/settings/CommunitySettings.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export function CommunitySettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    shareInsights: false,
    shareAgeRange: false,
    shareConditionType: false,
    allowResearch: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  const loadSettings = useCallback(async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const communitySettings = userData.communitySettings || {};

        setSettings({
          shareInsights: communitySettings.allowAnonymousSharing ?? false,
          shareAgeRange: communitySettings.shareAgeRange ?? false,
          shareConditionType: communitySettings.shareConditionType ?? false,
          allowResearch: communitySettings.allowResearch ?? false,
        });
      }
    } catch (error) {
      console.error('Error loading community settings:', error);
    } finally {
      setLoading(false);
    }
  }, [user.uid]);

  useEffect(() => {
    if (user?.uid) {
      loadSettings();
    }
  }, [user, loadSettings]);

  const updateSetting = async (key, value) => {
    setSaving((prev) => ({ ...prev, [key]: true }));

    try {
      const userRef = doc(db, 'users', user.uid);
      const updateData = {};

      if (key === 'shareInsights') {
        updateData['communitySettings.allowAnonymousSharing'] = value;
      } else if (key === 'shareAgeRange') {
        updateData['communitySettings.shareAgeRange'] = value;
      } else if (key === 'shareConditionType') {
        updateData['communitySettings.shareConditionType'] = value;
      } else if (key === 'allowResearch') {
        updateData['communitySettings.allowResearch'] = value;
      }

      updateData.updatedAt = new Date();

      await updateDoc(userRef, updateData);
      setSettings((prev) => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error updating community setting:', error);
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
      } ${enabled ? 'bg-[#10B981]' : 'bg-gray-300'}`}
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
          Community Sharing
        </h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
        Community Sharing
      </h2>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-500 text-xl">🔒</div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Privacy First</h3>
              <p className="text-blue-800 text-sm">
                All community sharing is completely anonymous. No personal
                information is ever shared.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                Share Anonymous Insights
              </p>
              <p className="text-sm text-gray-600">
                Allow your medication experiences to help others (completely
                anonymous)
              </p>
            </div>
            <ToggleSwitch
              enabled={settings.shareInsights}
              onChange={() =>
                updateSetting('shareInsights', !settings.shareInsights)
              }
              disabled={saving.shareInsights}
            />
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="font-medium text-gray-900">Share Age Range</p>
              <p className="text-sm text-gray-600">
                Share your age range (e.g., &ldquo;25-35&rdquo;) to help provide
                relevant insights
              </p>
            </div>
            <ToggleSwitch
              enabled={settings.shareAgeRange}
              onChange={() =>
                updateSetting('shareAgeRange', !settings.shareAgeRange)
              }
              disabled={saving.shareAgeRange}
            />
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                Share Condition Categories
              </p>
              <p className="text-sm text-gray-600">
                Share broad condition categories (e.g.,
                &ldquo;cardiovascular&rdquo;) to improve insights
              </p>
            </div>
            <ToggleSwitch
              enabled={settings.shareConditionType}
              onChange={() =>
                updateSetting(
                  'shareConditionType',
                  !settings.shareConditionType,
                )
              }
              disabled={saving.shareConditionType}
            />
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                Research Participation
              </p>
              <p className="text-sm text-gray-600">
                Allow anonymized data to contribute to medical research studies
              </p>
            </div>
            <ToggleSwitch
              enabled={settings.allowResearch}
              onChange={() =>
                updateSetting('allowResearch', !settings.allowResearch)
              }
              disabled={saving.allowResearch}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
