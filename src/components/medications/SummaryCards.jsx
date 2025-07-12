export default function SummaryCards({ medications }) {
  const total = medications.length;
  const taken = medications.filter((m) => m.takenToday).length;
  const reminders = medications.filter((m) => m.remindersOn).length;
  const multipleManufacturers = medications.filter(
    (m) => m.manufacturers && m.manufacturers.length > 1,
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Medications</p>
            <p className="text-2xl font-semibold text-gray-900">{total}</p>
          </div>
          <div className="text-blue-500 text-2xl">💊</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Taken Today</p>
            <p className="text-2xl font-semibold text-green-600">{taken}</p>
          </div>
          <div className="text-green-500 text-2xl">✓</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Reminders Active</p>
            <p className="text-2xl font-semibold text-blue-600">{reminders}</p>
          </div>
          <div className="text-blue-500 text-2xl">🔔</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Multiple Manufacturers</p>
            <p className="text-2xl font-semibold text-purple-600">
              {multipleManufacturers}
            </p>
          </div>
          <div className="text-purple-500 text-2xl">🏷️</div>
        </div>
      </div>
    </div>
  );
}
