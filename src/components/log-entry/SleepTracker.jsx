// components/log-entry/SleepTracker.jsx - Simplified to match your style
export default function SleepTracker({ sleepHours, onSleepChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sleep (hours)
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={sleepHours}
          onChange={(e) => onSleepChange(parseFloat(e.target.value))}
          className="w-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <span className="text-gray-600">hours</span>
      </div>
    </div>
  );
}
