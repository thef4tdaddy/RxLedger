export default function Dashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex gap-2 mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">Today</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">Week</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">Month</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mood</p>
              <p className="text-2xl font-semibold">😊</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Meds</p>
              <p className="text-2xl font-semibold">✓</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sleep</p>
              <p className="text-2xl font-semibold">7h</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Energy</p>
              <p className="text-2xl font-semibold">🔋</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Log Entry */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Log Entry</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
            <div className="flex gap-2">
              <button className="p-2 text-2xl hover:bg-gray-100 rounded">😊</button>
              <button className="p-2 text-2xl hover:bg-gray-100 rounded">😐</button>
              <button className="p-2 text-2xl hover:bg-gray-100 rounded">😞</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Take Meds</label>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
              <span className="text-lg">✓</span>
              Mark as taken
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows="3"
              placeholder="How are you feeling today?"
            />
          </div>

          <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Log Entry</button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-lg">😊</span>
            <span className="text-gray-700">Mood logged</span>
            <span className="text-sm text-gray-500 ml-auto">9:00am</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-lg">💊</span>
            <span className="text-gray-700">Medications taken</span>
            <span className="text-sm text-gray-500 ml-auto">8:00am</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-lg">🛌</span>
            <span className="text-gray-700">Slept 7h last night</span>
            <span className="text-sm text-gray-500 ml-auto">Yesterday</span>
          </div>
        </div>
      </div>
    </div>
  );
}
