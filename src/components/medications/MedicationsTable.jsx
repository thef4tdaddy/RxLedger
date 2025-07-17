// components/medications/MedicationsTable.jsx - Firebase integrated
import { useState } from 'react';
import { useMedications } from '../../context/useMedications';

export default function MedicationsTable() {
  const { medications, loading, error, updateMedication, deleteMedication } =
    useMedications();

  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Handle marking medication as taken
  const handleToggleTaken = async (medicationId) => {
    const medication = medications.find((med) => med.id === medicationId);
    if (!medication) return;

    setUpdatingId(medicationId);
    try {
      await updateMedication(medicationId, {
        takenToday: !medication.takenToday,
        lastTaken: !medication.takenToday ? new Date() : null,
      });
    } catch (error) {
      console.error('Failed to update medication:', error);
      alert('Failed to update medication status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle toggling reminders
  const handleToggleReminders = async (medicationId) => {
    const medication = medications.find((med) => med.id === medicationId);
    if (!medication) return;

    setUpdatingId(medicationId);
    try {
      await updateMedication(medicationId, {
        remindersOn: !medication.remindersOn,
      });
    } catch (error) {
      console.error('Failed to update reminders:', error);
      alert('Failed to update reminder settings. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle medication deletion
  const handleDelete = async (medicationId, medicationName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${medicationName}"? This action cannot be undone.`,
    );

    if (!confirmDelete) return;

    setDeletingId(medicationId);
    try {
      await deleteMedication(medicationId);
    } catch (error) {
      console.error('Failed to delete medication:', error);
      alert('Failed to delete medication. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle archive action (placeholder for now)
  const handleArchive = (medicationId, medicationName) => {
    alert(`Archive functionality for "${medicationName}" coming soon!`);
  };

  // Handle view history action (placeholder for now)
  const handleViewHistory = (medicationId, medicationName) => {
    alert(`History view for "${medicationName}" coming soon!`);
  };

  // Loading state
  if (loading) {
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
              {[1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
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

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-8 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to Load Medications
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (medications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-12 text-center">
          <div className="text-6xl mb-4">💊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No medications yet
          </h3>
          <p className="text-gray-600 mb-6">
            Add your first medication to start tracking your health journey
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Add Medication
          </button>
        </div>
      </div>
    );
  }

  // Main table render
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
            {medications.map((medication) => (
              <tr key={medication.id} className="hover:bg-gray-50">
                {/* Common Name */}
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {medication.commonName || medication.medicalName || '—'}
                </td>

                {/* Medical Name */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  {medication.medicalName || medication.commonName || '—'}
                </td>

                {/* Brand/Generic */}
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      medication.brandGeneric === 'Generic' ||
                      medication.type === 'Generic'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {medication.brandGeneric || medication.type || 'Unknown'}
                  </span>
                </td>

                {/* Manufacturer */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  {medication.manufacturer ||
                    medication.manufacturers?.[0]?.name ||
                    '—'}
                </td>

                {/* Pharmacy */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  {medication.pharmacy || '—'}
                </td>

                {/* Dose Amount */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  {medication.doseAmount || medication.dosage || '—'}
                </td>

                {/* Schedule */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  {medication.schedule || medication.frequency || '—'}
                </td>

                {/* Refill Schedule */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  {medication.refillSchedule || '—'}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    {/* Mark as Taken Button */}
                    <button
                      onClick={() => handleToggleTaken(medication.id)}
                      disabled={updatingId === medication.id}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        medication.takenToday
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {updatingId === medication.id ? (
                        <>
                          <div className="w-3 h-3 border border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <span className="text-sm">
                            {medication.takenToday ? '✓' : '○'}
                          </span>
                          {medication.takenToday ? 'Taken' : 'Mark taken'}
                        </>
                      )}
                    </button>

                    {/* Action Links */}
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleViewHistory(
                            medication.id,
                            medication.commonName || medication.medicalName,
                          )
                        }
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View History
                      </button>
                      <button
                        onClick={() =>
                          handleArchive(
                            medication.id,
                            medication.commonName || medication.medicalName,
                          )
                        }
                        className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                      >
                        Archive
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(
                            medication.id,
                            medication.commonName || medication.medicalName,
                          )
                        }
                        disabled={deletingId === medication.id}
                        className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === medication.id ? (
                          <div className="w-4 h-4 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </div>

                    {/* Reminders Toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Reminders:</span>
                      <button
                        onClick={() => handleToggleReminders(medication.id)}
                        disabled={updatingId === medication.id}
                        className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          medication.remindersOn ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className="sr-only">Toggle reminders</span>
                        <span
                          className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform ${
                            medication.remindersOn
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
  );
}
