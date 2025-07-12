export default function TrendsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Trends</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Export Data
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['Mood', 'Energy', 'Sleep', 'Side Effects'].map((tab) => (
          <button
            key={tab}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          'Mood Over Time',
          'Energy Over Time',
          'Sleep Over Time',
          'Side Effects Over Time',
        ].map((title) => (
          <div
            key={title}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
              <span className="text-gray-400">Chart Placeholder</span>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: 'Average Mood',
            value: '7.2/10',
            trend: '↑ 12% from last month',
          },
          { label: 'Average Sleep', value: '7.5h', trend: '→ Consistent' },
          {
            label: 'Medication Adherence',
            value: '85%',
            trend: '↑ 5% from last month',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {stat.value}
            </div>
            <p
              className={`text-sm ${stat.trend.startsWith('↑') ? 'text-green-600' : stat.trend.startsWith('→') ? 'text-blue-600' : 'text-gray-600'}`}
            >
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Insights</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <span className="text-blue-600 text-xl">💡</span>
            <div>
              <p className="font-medium text-gray-800">
                Your mood tends to be higher on days when you sleep 7+ hours
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Consider maintaining a consistent sleep schedule
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <span className="text-green-600 text-xl">📈</span>
            <div>
              <p className="font-medium text-gray-800">
                Your energy levels have improved by 15% this month
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Great progress! Keep up the current routine
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
            <span className="text-yellow-600 text-xl">⚠️</span>
            <div>
              <p className="font-medium text-gray-800">
                You missed medications 3 times this week
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Consider setting up reminders to improve adherence
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
