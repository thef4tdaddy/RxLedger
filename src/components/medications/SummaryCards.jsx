// components/medications/SummaryCards.jsx - Enhanced with real-time Firebase data
import { useMemo } from 'react';
import { useMedications } from '../../context/useMedications';

export default function SummaryCards() {
  const { medications, loading, error } = useMedications();

  // Calculate real-time statistics from Firebase data
  const stats = useMemo(() => {
    if (!medications || medications.length === 0) {
      return {
        total: 0,
        taken: 0,
        reminders: 0,
        multipleManufacturers: 0,
      };
    }

    // Total active medications
    const total = medications.length;

    // Count medications taken today
    const today = new Date().toDateString();
    const taken = medications.filter((med) => {
      if (!med.lastTaken) return false;
      const lastTakenDate = med.lastTaken.toDate
        ? med.lastTaken.toDate()
        : new Date(med.lastTaken);
      return lastTakenDate.toDateString() === today;
    }).length;

    // Count active reminders
    const reminders = medications.filter(
      (med) => med.remindersOn === true,
    ).length;

    // Count medications with multiple manufacturers (based on different manufacturer names)
    const manufacturerGroups = medications.reduce((acc, med) => {
      const manufacturer = med.manufacturer?.toLowerCase().trim() || 'unknown';
      if (!acc[manufacturer]) {
        acc[manufacturer] = [];
      }
      acc[manufacturer].push(med);
      return acc;
    }, {});

    const multipleManufacturers = Object.values(manufacturerGroups).filter(
      (group) => group.length > 1,
    ).length;

    return {
      total,
      taken,
      reminders,
      multipleManufacturers,
    };
  }, [medications]);

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="col-span-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            Unable to load medication statistics: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Total Medications */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Medications</p>
            <p className="text-2xl font-semibold text-[#1B59AE]">
              {stats.total}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.total === 0
                ? 'No medications added'
                : stats.total === 1
                  ? 'Active medication'
                  : 'Active medications'}
            </p>
          </div>
          <div className="text-[#1B59AE] text-2xl">💊</div>
        </div>
      </div>

      {/* Taken Today */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Taken Today</p>
            <p className="text-2xl font-semibold text-[#0E7C7B]">
              {stats.taken}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.total > 0
                ? `${Math.round((stats.taken / stats.total) * 100)}% completed`
                : 'No medications to take'}
            </p>
          </div>
          <div className="text-[#0E7C7B] text-2xl">✓</div>
        </div>
      </div>

      {/* Reminders Active */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Reminders Active</p>
            <p className="text-2xl font-semibold text-[#1B59AE]">
              {stats.reminders}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.total > 0
                ? `${Math.round((stats.reminders / stats.total) * 100)}% with reminders`
                : 'No reminders set'}
            </p>
          </div>
          <div className="text-[#1B59AE] text-2xl">🔔</div>
        </div>
      </div>

      {/* Multiple Manufacturers */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Multiple Manufacturers</p>
            <p className="text-2xl font-semibold text-[#0E7C7B]">
              {stats.multipleManufacturers}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.multipleManufacturers === 0
                ? 'No duplicates found'
                : stats.multipleManufacturers === 1
                  ? 'Manufacturer group'
                  : 'Manufacturer groups'}
            </p>
          </div>
          <div className="text-[#0E7C7B] text-2xl">🏷️</div>
        </div>
      </div>
    </div>
  );
}
