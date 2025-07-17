// components/log-entry/SideEffectsSelector.jsx - Simplified to match your style
export default function SideEffectsSelector({
  selectedSymptoms,
  onSymptomsChange,
}) {
  const symptoms = [
    'Headache',
    'Nausea',
    'Dizziness',
    'Fatigue',
    'Anxiety',
    'Insomnia',
    'Appetite loss',
    'Dry mouth',
    'Drowsiness',
    'Stomach upset',
    'Joint pain',
    'Mood changes',
    'Sexual dysfunction',
  ];

  const handleSymptomToggle = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      onSymptomsChange(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      onSymptomsChange([...selectedSymptoms, symptom]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Symptoms (select all that apply)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {symptoms.map((symptom) => (
          <label
            key={symptom}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedSymptoms.includes(symptom)}
              onChange={() => handleSymptomToggle(symptom)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{symptom}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
