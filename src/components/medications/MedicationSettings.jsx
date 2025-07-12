export default function MedicationSettings() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Medication Settings</h2>
      <div className="space-y-4">
        {[
          {
            title: 'Medication Reminders',
            desc: "Get notifications when it's time to take your medications",
          },
          {
            title: 'Refill Reminders',
            desc: "Get notified when it's time to refill your prescriptions",
          },
          {
            title: 'Manufacturer Change Alerts',
            desc: 'Get notified when your medication manufacturer changes',
          },
        ].map((setting) => (
          <div
            key={setting.title}
            className="flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium text-gray-900">{setting.title}</h3>
              <p className="text-sm text-gray-600">{setting.desc}</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
              <span className="sr-only">Toggle {setting.title}</span>
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
