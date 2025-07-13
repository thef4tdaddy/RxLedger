import { aggregatedMedicationData } from '../../demo-data/medications/aggregatedMedicationsData';

export default function SummaryCards() {
  const { total, taken, reminders, multipleManufacturers } =
    aggregatedMedicationData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Medications</p>
            <p className="text-2xl font-semibold text-[#1B59AE]">{total}</p>
          </div>
          <div className="text-[#1B59AE] text-2xl">💊</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Taken Today</p>
            <p className="text-2xl font-semibold text-[#0E7C7B]">{taken}</p>
          </div>
          <div className="text-[#0E7C7B] text-2xl">✓</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Reminders Active</p>
            <p className="text-2xl font-semibold text-[#1B59AE]">{reminders}</p>
          </div>
          <div className="text-[#1B59AE] text-2xl">🔔</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Multiple Manufacturers</p>
            <p className="text-2xl font-semibold text-[#0E7C7B]">
              {multipleManufacturers}
            </p>
          </div>
          <div className="text-[#0E7C7B] text-2xl">🏷️</div>
        </div>
      </div>
    </div>
  );
}
