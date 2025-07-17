// components/trends/MoodTrendChart.jsx - Enhanced with Firebase integration
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { demoMoodEnergyData } from '../../demo-data/trends/personalTrends';

export default function MoodTrendChart({ data, loading }) {
  // Use real data if available, otherwise fall back to demo data
  const chartData =
    data && data.length > 0
      ? data
          .filter((d) => d.mood !== null && d.mood !== undefined)
          .map((d) => ({
            date: d.dateISO,
            mood: d.mood * 20, // Convert 1-5 scale to 0-100 for better visualization
            moodRaw: d.mood,
          }))
      : demoMoodEnergyData.map((d) => ({
          date: d.dateISO,
          mood: d.mood * 20,
          moodRaw: d.mood,
        }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-1">
            {new Date(label).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p className="text-sm font-medium text-[#1B59AE]">
            Mood: {data.moodRaw}/5
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-56 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Mood Over Time</h2>
        {chartData.length > 0 && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {chartData.length} entries
          </span>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-3xl mb-2">😊</div>
            <p className="text-sm">No mood data available</p>
            <p className="text-xs">Start logging your daily mood</p>
          </div>
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })
                }
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v / 20}/5`}
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#1B59AE"
                strokeWidth={3}
                dot={{ fill: '#1B59AE', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#1B59AE', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
