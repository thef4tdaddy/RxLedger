export function IntegrationSettings() {
  const integrations = [
    {
      key: 'appleHealth',
      label: 'Apple Health',
      description: 'Sync with Apple Health app',
      available: false,
    },
    {
      key: 'googleFit',
      label: 'Google Fit',
      description: 'Sync with Google Fit',
      available: false,
    },
    {
      key: 'fitbit',
      label: 'Fitbit',
      description: 'Connect your Fitbit device',
      available: false,
    },
    {
      key: 'pharmacy',
      label: 'Pharmacy Portal',
      description: 'Connect to pharmacy systems',
      available: false,
    },
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
        Integrations
      </h2>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <div
            key={integration.key}
            className="flex justify-between items-center"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{integration.label}</p>
              <p className="text-sm text-gray-600">{integration.description}</p>
            </div>
            <div className="text-right">
              {integration.available ? (
                <button className="text-sm bg-[#1B59AE] text-white px-3 py-1 rounded">
                  Connect
                </button>
              ) : (
                <span className="text-sm text-gray-400">Coming Soon</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          🚧 Health integrations are in development. Stay tuned for updates!
        </p>
      </div>
    </section>
  );
}
