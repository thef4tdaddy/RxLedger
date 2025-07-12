export default function MedicationsTable({
  medications,
  onToggleTaken,
  onToggleReminders,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                'Common Name',
                'Medical Name',
                'Brand/Generic',
                'Manufacturer',
                'Pharmacy',
                'Dose Amount',
                'Schedule',
                'Refill Schedule',
                'Actions',
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-sm font-medium text-gray-700"
                >
                  {h}
                </th>
              ))}
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
                <td className="px-6 py-4 text-sm">
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
                  {med.manufacturers?.[0]?.name || '—'}
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
                      onClick={() => onToggleTaken(med.id)}
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
                      <span className="text-xs text-gray-500">Reminders:</span>
                      <button
                        onClick={() => onToggleReminders(med.id)}
                        className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                          med.remindersOn ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className="sr-only">Toggle reminders</span>
                        <span
                          className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform ${
                            med.remindersOn ? 'translate-x-4' : 'translate-x-1'
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
  );
}
