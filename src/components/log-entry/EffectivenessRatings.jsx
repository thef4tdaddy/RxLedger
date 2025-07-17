export default function EffectivenessRatings({
  selectedMedications,
  medications,
  effectivenessRatings,
  onRatingChange,
}) {
  if (!selectedMedications || selectedMedications.length === 0) {
    return null;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        How effective were your medications?
      </label>
      <div className="space-y-3">
        {selectedMedications.map((medicationId) => {
          const medication = medications.find((med) => med.id === medicationId);
          if (!medication) return null;

          const currentRating = effectivenessRatings[medicationId];

          return (
            <div key={medicationId} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">
                  {medication.commonName || medication.medicalName}
                </span>
                {currentRating && (
                  <span className="text-xs text-gray-600">
                    {currentRating}/5 stars
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => onRatingChange(medicationId, rating)}
                    className={`text-xl transition-all hover:scale-110 ${
                      currentRating >= rating
                        ? 'text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Not Effective</span>
                <span>Very Effective</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
