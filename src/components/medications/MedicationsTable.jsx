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

  // Format last taken date
  const formatLastTaken = (lastTaken) => {
    if (!lastTaken) return 'Never';

    const date =
      lastTaken instanceof Date
        ? lastTaken
        : lastTaken.toDate
          ? lastTaken.toDate()
          : new Date(lastTaken);

    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';

    return date.toLocaleDateString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          My Medications ({medications.length})
        </h2>
      </div>

      {/* Table Content */}
      <div className="p-6">
        {medications.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
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
        ) : (
          // Medications table
          <div className="space-y-4">
            {medications.map((medication) => (
              <div
                key={medication.id}
                className={`border rounded-lg p-4 transition-all ${
                  medication.takenToday
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Medication Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3
                        className={`font-semibold ${
                          medication.takenToday
                            ? 'text-green-900'
                            : 'text-gray-900'
                        }`}
                      >
                        {medication.commonName || medication.medicalName}
                      </h3>
                      {medication.takenToday && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          ✓ Taken Today
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Dosage:</span>
                        <span className="ml-1 font-medium">
                          {medication.dosage || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Frequency:</span>
                        <span className="ml-1 font-medium">
                          {medication.frequency || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Manufacturer:</span>
                        <span className="ml-1 font-medium">
                          {medication.manufacturer || 'Unknown'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Taken:</span>
                        <span className="ml-1 font-medium">
                          {formatLastTaken(medication.lastTaken)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-6">
                    {/* Mark as Taken Toggle */}
                    <button
                      onClick={() => handleToggleTaken(medication.id)}
                      disabled={updatingId === medication.id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        medication.takenToday
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {updatingId === medication.id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </div>
                      ) : medication.takenToday ? (
                        'Taken ✓'
                      ) : (
                        'Mark Taken'
                      )}
                    </button>

                    {/* Reminders Toggle */}
                    <button
                      onClick={() => handleToggleReminders(medication.id)}
                      disabled={updatingId === medication.id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        medication.remindersOn
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {medication.remindersOn
                        ? 'Reminders On'
                        : 'Reminders Off'}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() =>
                        handleDelete(
                          medication.id,
                          medication.commonName || medication.medicalName,
                        )
                      }
                      disabled={deletingId === medication.id}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === medication.id ? (
                        <div className="w-4 h-4 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        '🗑️'
                      )}
                    </button>
                  </div>
                </div>

                {/* Additional Info */}
                {medication.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span>{' '}
                      {medication.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with summary */}
      {medications.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="text-gray-600">
                <span className="font-medium text-green-600">
                  {medications.filter((med) => med.takenToday).length}
                </span>{' '}
                taken today
              </span>
              <span className="text-gray-600">
                <span className="font-medium text-blue-600">
                  {medications.filter((med) => med.remindersOn).length}
                </span>{' '}
                with reminders
              </span>
            </div>
            <div className="text-gray-500">
              Total: {medications.length} medication
              {medications.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
