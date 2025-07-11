export default function Trends() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Trends</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Export Data</button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">Mood</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">Sleep</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">Medications</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">Energy</button>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-8">
        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300">7 Days</button>
        <button className="px-3 py-1 bg-blue-600 text-white rounded font-medium">30 Days</button>
        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300">90 Days</button>
      </div>

      {/* Chart Container */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Mood Over Time</h2>

        {/* Placeholder Chart */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center relative">
          <div className="absolute inset-0 p-6">
            {/* Y-axis */}
            <div className="absolute left-4 top-6 bottom-6 flex flex-col justify-between text-sm text-gray-600">
              <span>😊</span>
              <span>😐</span>
              <span>😞</span>
            </div>

            {/* Chart line visualization */}
            <div className="ml-12 h-full flex items-end justify-between">
              {[60, 40, 80, 30, 70, 50, 90, 60].map((height, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-3 bg-blue-500 rounded-t" style={{ height: `${height}%` }} />
                  <span className="text-xs text-gray-500 mt-2">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* X-axis label */}
        <div className="text-center text-sm text-gray-600 mt-2">Days</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Average Mood</h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl">😊</span>
            <span className="text-2xl font-bold text-gray-800">7.2/10</span>
          </div>
          <p className="text-sm text-green-600 mt-1">↑ 12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Sleep Quality</h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl">😴</span>
            <span className="text-2xl font-bold text-gray-800">7.5h</span>
          </div>
          <p className="text-sm text-blue-600 mt-1">→ Consistent</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Medication Adherence</h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl">💊</span>
            <span className="text-2xl font-bold text-gray-800">85%</span>
          </div>
          <p className="text-sm text-green-600 mt-1">↑ 5% from last month</p>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Insights</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <span className="text-blue-600 text-xl">💡</span>
            <div>
              <p className="font-medium text-gray-800">Your mood tends to be higher on days when you sleep 7+ hours</p>
              <p className="text-sm text-gray-600 mt-1">Consider maintaining a consistent sleep schedule</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <span className="text-green-600 text-xl">📈</span>
            <div>
              <p className="font-medium text-gray-800">Your energy levels have improved by 15% this month</p>
              <p className="text-sm text-gray-600 mt-1">Great progress! Keep up the current routine</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
            <span className="text-yellow-600 text-xl">⚠️</span>
            <div>
              <p className="font-medium text-gray-800">You missed medications 3 times this week</p>
              <p className="text-sm text-gray-600 mt-1">Consider setting up reminders to improve adherence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
