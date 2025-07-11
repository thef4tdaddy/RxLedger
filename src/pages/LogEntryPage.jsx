export default function LogEntryPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Log Entry</h1>
        <p className="text-gray-600 mt-1">How are you feeling today?</p>
      </div>

      {/* Log Entry Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form className="space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue={new Date().toTimeString().slice(0, 5)}
              />
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Mood
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                className="p-4 text-3xl hover:bg-gray-100 rounded-lg transition-colors"
              >
                😊
              </button>
              <button
                type="button"
                className="p-4 text-3xl hover:bg-gray-100 rounded-lg transition-colors"
              >
                😐
              </button>
              <button
                type="button"
                className="p-4 text-3xl hover:bg-gray-100 rounded-lg transition-colors"
              >
                😞
              </button>
              <button
                type="button"
                className="p-4 text-3xl hover:bg-gray-100 rounded-lg transition-colors"
              >
                😠
              </button>
              <button
                type="button"
                className="p-4 text-3xl hover:bg-gray-100 rounded-lg transition-colors"
              >
                😱
              </button>
              <button
                type="button"
                className="p-4 text-3xl hover:bg-gray-100 rounded-lg transition-colors"
              >
                😴
              </button>
            </div>
          </div>

          {/* Energy Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Energy Level
            </label>
            <div className="px-2">
              <input
                type="range"
                min="1"
                max="10"
                defaultValue="5"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </div>

          {/* Sleep */}
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
                placeholder="8"
                className="w-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-600">hours</span>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Symptoms (select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Headache',
                'Nausea',
                'Dizziness',
                'Fatigue',
                'Anxiety',
                'Insomnia',
                'Appetite loss',
                'Dry mouth',
                'Drowsiness',
              ].map((symptom) => (
                <label
                  key={symptom}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{symptom}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Any additional notes about how you're feeling, side effects, or other observations..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Save Entry
          </button>
        </form>
      </div>
    </div>
  );
}
