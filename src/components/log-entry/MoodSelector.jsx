// components/log-entry/MoodSelector.jsx - Simplified to match your style
export default function MoodSelector({ selectedMood, onMoodSelect }) {
  const moodOptions = [
    { emoji: '😊', value: 8, label: 'Good' },
    { emoji: '😐', value: 5, label: 'Neutral' },
    { emoji: '😞', value: 3, label: 'Sad' },
    { emoji: '😠', value: 2, label: 'Angry' },
    { emoji: '😱', value: 1, label: 'Anxious' },
    { emoji: '😴', value: 4, label: 'Tired' },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Mood
      </label>
      <div className="flex gap-3">
        {moodOptions.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => onMoodSelect(mood)}
            className={`p-4 text-3xl rounded-lg transition-colors ${
              selectedMood?.value === mood.value
                ? 'bg-blue-100 ring-2 ring-blue-500'
                : 'hover:bg-gray-100'
            }`}
            title={mood.label}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
      {selectedMood && (
        <p className="text-sm text-gray-600 mt-2">
          Selected: {selectedMood.label} ({selectedMood.value}/10)
        </p>
      )}
    </div>
  );
}
