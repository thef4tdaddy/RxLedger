//src/components/medications/MedicationsTable.jsx
import { useState } from 'react';
import { useMedications } from '../../context/useMedications';
import { demoMedications } from '../../demo-data/medications/Medications';

export default function MedicationsTable({
  medications,
  onToggleTaken,
  onToggleReminders,
}) {
  const {
    medications: contextMedications,
    loading,
    error,
    markMedicationTaken,
    toggleMedicationReminders,
    deleteMedication,
    archiveMedication,
    isFirebaseEnabled,
  } = useMedications();

  const [localLoading, setLocalLoading] = useState({});

  // Use Firebase data if available, fall back to props or demo data
  const meds =
    isFirebaseEnabled && contextMedications && contextMedications.length > 0
      ? contextMedications
      : Array.isArray(medications) && medications.length > 0
        ? medications
        : demoMedications;

  // Handle marking medication as taken
  const handleToggleTaken = async (medicationId) => {
    if (!isFirebaseEnabled || !markMedicationTaken) {
      // Fall back to prop function for demo mode
      onToggleTaken?.(medicationId);
      return;
    }

    setLocalLoading((prev) => ({ ...prev, [medicationId]: true }));
    try {
      await markMedicationTaken(medicationId);
    } catch (error) {
      console.error('Error marking medication as taken:', error);
    } finally {
      setLocalLoading((prev) => ({ ...prev, [medicationId]: false }));
    }
  };

  // Handle toggling reminders
  const handleToggleReminders = async (medicationId) => {
    if (!isFirebaseEnabled || !toggleMedicationReminders) {
      // Fall back to prop function for demo mode
      onToggleReminders?.(medicationId);
      return;
    }

    setLocalLoading((prev) => ({
      ...prev,
      [`${medicationId}_reminders`]: true,
    }));
    try {
      await toggleMedicationReminders(medicationId);
    } catch (error) {
      console.error('Error toggling reminders:', error);
    } finally {
      setLocalLoading((prev) => ({
        ...prev,
        [`${medicationId}_reminders`]: false,
      }));
    }
  };

  // Handle archiving medication
  const handleArchive = async (medicationId) => {
    if (!isFirebaseEnabled || !archiveMedication) {
      console.log(
        'Archive functionality only available with Firebase integration',
      );
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to archive this medication? You can restore it later from settings.',
    );
    if (!confirmed) return;

    setLocalLoading((prev) => ({ ...prev, [`${medicationId}_archive`]: true }));
    try {
      await archiveMedication(medicationId);
    } catch (error) {
      console.error('Error archiving medication:', error);
    } finally {
      setLocalLoading((prev) => ({
        ...prev,
        [`${medicationId}_archive`]: false,
      }));
    }
  };

  // Handle deleting medication
  const handleDelete = async (medicationId) => {
    if (!isFirebaseEnabled || !deleteMedication) {
      console.log(
        'Delete functionality only available with Firebase integration',
      );
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this medication? This action cannot be undone.',
    );
    if (!confirmed) return;

    setLocalLoading((prev) => ({ ...prev, [`${medicationId}_delete`]: true }));
    try {
      await deleteMedication(medicationId);
    } catch (error) {
      console.error('Error deleting medication:', error);
    } finally {
      setLocalLoading((prev) => ({
        ...prev,
        [`${medicationId}_delete`]: false,
      }));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading your medications...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-8 text-center">
          <div className="text-red-600 mb-2">⚠️</div>
          <p className="text-red-600 font-medium">Error loading medications</p>
          <p className="text-gray-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!meds || meds.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-8 text-center">
          <div className="text-gray-400 mb-2">💊</div>
          <p className="text-gray-600 font-medium">No medications added yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Add your first medication to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
            {meds.map((med) => (
              <tr key={med.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {med.commonName || med.name}
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
                  {med.manufacturers?.[0]?.name || med.manufacturer || '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {med.pharmacy || '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {med.doseAmount || med.dosage || '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {med.schedule || med.frequency || '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {med.refillSchedule || '—'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    {/* Mark as Taken Button */}
                    <button
                      onClick={() => handleToggleTaken(med.id)}
                      disabled={localLoading[med.id]}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        med.takenToday || med.taken
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${localLoading[med.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {localLoading[med.id] ? (
                        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span className="text-sm">
                          {med.takenToday || med.taken ? '✓' : '○'}
                        </span>
                      )}
                      {med.takenToday || med.taken ? 'Taken' : 'Mark taken'}
                    </button>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View History
                      </button>

                      {isFirebaseEnabled && (
                        <>
                          <button
                            onClick={() => handleArchive(med.id)}
                            disabled={localLoading[`${med.id}_archive`]}
                            className={`text-gray-600 hover:text-gray-700 text-sm font-medium ${
                              localLoading[`${med.id}_archive`]
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                          >
                            {localLoading[`${med.id}_archive`]
                              ? 'Archiving...'
                              : 'Archive'}
                          </button>

                          <button
                            onClick={() => handleDelete(med.id)}
                            disabled={localLoading[`${med.id}_delete`]}
                            className={`text-red-600 hover:text-red-700 text-sm font-medium ${
                              localLoading[`${med.id}_delete`]
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                          >
                            {localLoading[`${med.id}_delete`]
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Reminders Toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Reminders:</span>
                      <button
                        onClick={() => handleToggleReminders(med.id)}
                        disabled={localLoading[`${med.id}_reminders`]}
                        className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                          med.remindersOn || med.reminders
                            ? 'bg-blue-600'
                            : 'bg-gray-300'
                        } ${localLoading[`${med.id}_reminders`] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className="sr-only">Toggle reminders</span>
                        {localLoading[`${med.id}_reminders`] ? (
                          <div className="inline-block h-2 w-2 transform rounded-full bg-white animate-pulse translate-x-2.5"></div>
                        ) : (
                          <span
                            className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform ${
                              med.remindersOn || med.reminders
                                ? 'translate-x-4'
                                : 'translate-x-1'
                            }`}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Subtle Firebase Status Indicator */}
      {isFirebaseEnabled && contextMedications?.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Real-time sync enabled
            </span>
            <span>{meds.length} medications</span>
          </div>
        </div>
      )}
    </div>
  );
}
