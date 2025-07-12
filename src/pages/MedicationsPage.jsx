import React, { useState } from 'react';

export default function EnhancedMedicationsPage() {
  const [medications, setMedications] = useState([
    {
      id: 1,
      commonName: 'Sertraline',
      medicalName: 'Sertraline HCl',
      brandGeneric: 'Generic',
      manufacturer: 'Pfizer',
      pharmacy: 'CVS Pharmacy',
      doseAmount: '50mg',
      schedule: 'Daily 8:00am',
      refillSchedule: 'Every 30 days',
      takenToday: true,
      remindersOn: true,
    },
    {
      id: 2,
      commonName: 'Vitamin D',
      medicalName: 'Cholecalciferol',
      brandGeneric: 'Generic',
      manufacturer: 'Nature Made',
      pharmacy: 'Walgreens',
      doseAmount: '2000 IU',
      schedule: 'Daily 9:00am',
      refillSchedule: 'Every 90 days',
      takenToday: false,
      remindersOn: true,
    },
    {
      id: 3,
      commonName: 'Omega-3',
      medicalName: 'Fish Oil EPA/DHA',
      brandGeneric: 'Brand',
      manufacturer: 'Nordic Naturals',
      pharmacy: 'CVS Pharmacy',
      doseAmount: '1000mg',
      schedule: 'Daily 8:00pm',
      refillSchedule: 'Every 60 days',
      takenToday: false,
      remindersOn: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const toggleTaken = (id) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, takenToday: !med.takenToday } : med,
      ),
    );
  };

  const toggleReminders = (id) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, remindersOn: !med.remindersOn } : med,
      ),
    );
  };

  const AddMedicationForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Add New Medication
        </h2>
        <button
          onClick={() => setShowAddForm(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Common Name
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Sertraline"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical Name
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Sertraline HCl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand/Generic
          </label>
          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Generic</option>
            <option>Brand</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Manufacturer
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Pfizer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pharmacy
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., CVS Pharmacy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dose Amount
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 50mg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Daily 8:00am"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Refill Schedule
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Every 30 days"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Add Medication
        </button>
        <button
          onClick={() => setShowAddForm(false)}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Medications</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <span className="text-lg">+</span>
          Add Medication
        </button>
      </div>

      {/* Add Medication Form */}
      {showAddForm && <AddMedicationForm />}

      {/* Medications Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Common Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Medical Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Brand/Generic
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Manufacturer
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Pharmacy
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Dose Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Schedule
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Refill Schedule
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {medications.map((med) => (
                <tr key={med.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {med.commonName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {med.medicalName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        med.brandGeneric === 'Generic'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {med.brandGeneric}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {med.manufacturer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {med.pharmacy}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {med.doseAmount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {med.schedule}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {med.refillSchedule}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => toggleTaken(med.id)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          med.takenToday
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="text-sm">
                          {med.takenToday ? '✓' : '○'}
                        </span>
                        {med.takenToday ? 'Taken' : 'Mark taken'}
                      </button>

                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View History
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                          Archive
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Delete
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          Reminders:
                        </span>
                        <button
                          onClick={() => toggleReminders(med.id)}
                          className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                            med.remindersOn ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <span className="sr-only">Toggle reminders</span>
                          <span
                            className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform ${
                              med.remindersOn
                                ? 'translate-x-4'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Medications</p>
              <p className="text-2xl font-semibold text-gray-900">
                {medications.length}
              </p>
            </div>
            <div className="text-blue-500 text-2xl">💊</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taken Today</p>
              <p className="text-2xl font-semibold text-green-600">
                {medications.filter((med) => med.takenToday).length}
              </p>
            </div>
            <div className="text-green-500 text-2xl">✓</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reminders Active</p>
              <p className="text-2xl font-semibold text-blue-600">
                {medications.filter((med) => med.remindersOn).length}
              </p>
            </div>
            <div className="text-blue-500 text-2xl">🔔</div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Medication Settings</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">
                Medication Reminders
              </h3>
              <p className="text-sm text-gray-600">
                Get notifications when it's time to take your medications
              </p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
              <span className="sr-only">Enable notifications</span>
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Refill Reminders</h3>
              <p className="text-sm text-gray-600">
                Get notified when it's time to refill your prescriptions
              </p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
              <span className="sr-only">Enable refill notifications</span>
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">
                Manufacturer Change Alerts
              </h3>
              <p className="text-sm text-gray-600">
                Get notified when your medication manufacturer changes
              </p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
              <span className="sr-only">Enable manufacturer alerts</span>
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
