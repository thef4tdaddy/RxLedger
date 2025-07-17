// components/log-entry/MedicationSelector.jsx - Simplified to match your style with date awareness
export default function MedicationSelector({
  medications,
  selectedMedications,
  entryDate,
  onMedicationChange,
}) {
  const handleMedicationToggle = (medicationId) => {
    if (selectedMedications.includes(medicationId)) {
      onMedicationChange(
        selectedMedications.filter((id) => id !== medicationId),
      );
    } else {
      onMedicationChange([...selectedMedications, medicationId]);
    }
  };

  if (!medications || medications.length === 0) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Medications Taken
        </label>
        <p className="text-gray-500 text-sm">
          No medications found. Add medications to your profile first.
        </p>
      </div>
    );
  }

  const isToday = entryDate === new Date().toISOString().split('T')[0];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Medications Taken
      </label>
      <div className="grid grid-cols-1 gap-2">
        {medications.map((med) => {
          const isAlreadyTaken = med.takenToday && isToday;
          const isSelected = selectedMedications.includes(med.id);

          return (
            <label
              key={med.id}
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                isAlreadyTaken
                  ? 'bg-green-50 border border-green-200'
                  : isSelected
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleMedicationToggle(med.id)}
                disabled={isAlreadyTaken}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span
                className={`text-sm flex-1 ${isAlreadyTaken ? 'text-gray-500 line-through' : 'text-gray-700'}`}
              >
                {med.commonName || med.medicalName} - {med.dosage}
              </span>
              {isAlreadyTaken && (
                <span className="text-green-600 text-xs">✓ Already taken</span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
