export default function Medications() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Medications</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
          <span className="text-lg">+</span>
          Add Medication
        </button>
      </div>

      {/* Medications Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Dosage</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Time</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Taken Today?</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">Sertraline</td>
                <td className="px-6 py-4 text-sm text-gray-700">50mg</td>
                <td className="px-6 py-4 text-sm text-gray-700">8:00 AM</td>
                <td className="px-6 py-4">
                  <button className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    <span className="text-sm">✓</span>
                    Taken
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">Delete</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">Vitamin D</td>
                <td className="px-6 py-4 text-sm text-gray-700">2000 IU</td>
                <td className="px-6 py-4 text-sm text-gray-700">9:00 AM</td>
                <td className="px-6 py-4">
                  <button className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
                    <span className="text-sm">○</span>
                    Mark taken
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">Delete</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">Omega-3</td>
                <td className="px-6 py-4 text-sm text-gray-700">1000mg</td>
                <td className="px-6 py-4 text-sm text-gray-700">8:00 PM</td>
                <td className="px-6 py-4">
                  <button className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
                    <span className="text-sm">○</span>
                    Mark taken
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Medication Reminders</h3>
            <p className="text-sm text-gray-600">Get notifications when it's time to take your medications</p>
          </div>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
            <span className="sr-only">Enable notifications</span>
            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
