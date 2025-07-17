// components/settings/IntegrationSettings.jsx - Real Firebase integration
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import useAuth from '../../hooks/useAuth';

export default function IntegrationSettings() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState({
    googleFit: { connected: false, syncEnabled: false, lastSync: null },
    appleHealth: { connected: false, syncEnabled: false, lastSync: null },
    fitbit: { connected: false, syncEnabled: false, lastSync: null },
    myChart: { connected: false, syncEnabled: false, lastSync: null },
    pharmacyPortal: { connected: false, syncEnabled: false, lastSync: null },
  });
  const [saving, setSaving] = useState(false);

  // Load integration settings
  useEffect(() => {
    const loadIntegrations = async () => {
      if (!user?.uid) return;

      try {
        const integrationsRef = doc(
          db,
          'users',
          user.uid,
          'settings',
          'integrations',
        );
        const integrationsSnap = await getDoc(integrationsRef);

        if (integrationsSnap.exists()) {
          setIntegrations((prev) => ({ ...prev, ...integrationsSnap.data() }));
        }
      } catch (error) {
        console.error('Error loading integration settings:', error);
      }
    };

    loadIntegrations();
  }, [user]);

  const handleConnect = async (integration) => {
    // This would typically involve OAuth flow
    // For now, we'll simulate connection
    const newIntegrations = {
      ...integrations,
      [integration]: {
        ...integrations[integration],
        connected: true,
        lastSync: new Date(),
      },
    };

    setIntegrations(newIntegrations);

    if (!user?.uid) return;

    setSaving(true);
    try {
      const integrationsRef = doc(
        db,
        'users',
        user.uid,
        'settings',
        'integrations',
      );
      await setDoc(integrationsRef, {
        ...newIntegrations,
        updatedAt: new Date(),
      });
      alert(`${integration} connected successfully!`);
    } catch (error) {
      console.error('Error connecting integration:', error);
      setIntegrations(integrations);
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async (integration) => {
    const newIntegrations = {
      ...integrations,
      [integration]: {
        connected: false,
        syncEnabled: false,
        lastSync: null,
      },
    };

    setIntegrations(newIntegrations);

    if (!user?.uid) return;

    setSaving(true);
    try {
      const integrationsRef = doc(
        db,
        'users',
        user.uid,
        'settings',
        'integrations',
      );
      await setDoc(integrationsRef, {
        ...newIntegrations,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error disconnecting integration:', error);
      setIntegrations(integrations);
    } finally {
      setSaving(false);
    }
  };

  const integrationOptions = [
    {
      key: 'googleFit',
      name: 'Google Fit',
      description: 'Sync health and fitness data from Google Fit',
      icon: '🏃',
      features: ['Heart rate', 'Steps', 'Sleep', 'Weight'],
    },
    {
      key: 'appleHealth',
      name: 'Apple Health',
      description: 'Import health data from Apple Health app',
      icon: '🍎',
      features: ['Vitals', 'Activity', 'Sleep', 'Medications'],
    },
    {
      key: 'fitbit',
      name: 'Fitbit',
      description: 'Connect your Fitbit device for health tracking',
      icon: '⌚',
      features: ['Activity', 'Sleep', 'Heart rate', 'Stress'],
    },
    {
      key: 'myChart',
      name: 'MyChart / Epic',
      description: 'Import medical records and lab results',
      icon: '🏥',
      features: ['Lab results', 'Medications', 'Appointments', 'Allergies'],
    },
    {
      key: 'pharmacyPortal',
      name: 'Pharmacy Portal',
      description: 'Connect to your pharmacy for prescription sync',
      icon: '💊',
      features: ['Prescriptions', 'Refill dates', 'Dosages', 'Interactions'],
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Health Integrations
        </h2>
        <p className="text-gray-600">
          Connect external health services to automatically sync your data with
          RxLedger
        </p>
      </div>

      <div className="space-y-4">
        {integrationOptions.map((option) => (
          <div
            key={option.key}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="text-2xl">{option.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-800">{option.name}</h3>
                    {integrations[option.key]?.connected && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {option.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {option.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  {integrations[option.key]?.connected &&
                    integrations[option.key]?.lastSync && (
                      <p className="text-xs text-gray-500 mt-2">
                        Last sync:{' '}
                        {new Date(
                          integrations[option.key].lastSync.seconds * 1000 ||
                            integrations[option.key].lastSync,
                        ).toLocaleString()}
                      </p>
                    )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {integrations[option.key]?.connected ? (
                  <>
                    <button
                      onClick={() => handleDisconnect(option.key)}
                      disabled={saving}
                      className="px-3 py-1 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Disconnect
                    </button>
                    <button className="px-3 py-1 text-sm bg-[#1B59AE] text-white rounded-lg hover:bg-[#48B4A2] transition-colors">
                      Sync Now
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(option.key)}
                    disabled={saving}
                    className="px-3 py-1 text-sm bg-[#1B59AE] text-white rounded-lg hover:bg-[#48B4A2] transition-colors disabled:opacity-50"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {saving && (
        <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#1B59AE] border-t-transparent"></div>
          Updating integrations...
        </div>
      )}
    </div>
  );
}
