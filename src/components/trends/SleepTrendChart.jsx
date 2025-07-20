// components/trends/SleepTrendChart.jsx - Enhanced with Firebase integration
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { demoSleepData } from '../../demo-data/trends/personalTrends';

export default function SleepTrendChart({ data, loading }) {
  // Use real data if available, otherwise fall back to demo data
  const chartData =
    data && data.length > 0
      ? data
          .filter((d) => d.sleepHours !== null && d.sleepHours !== undefined)
          .map((d) => ({
            date: d.dateISO,
            hours: d.sleepHours,
          }))
      : demoSleepData.map((d) => ({
          date: d.dateISO,
          hours: d.hours,
        }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-1">
            {!label
              ? 'No date'
              : (() => {
                  const parsedDate = new Date(label);
                  return isNaN(parsedDate.getTime())
                    ? String(label)
                    : parsedDate.toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      });
                })()}
          </p>
          <p className="text-sm font-medium text-[#10B981]">
            Sleep: {payload[0].value} hours
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

  const avgSleep =
    chartData.length > 0
      ? chartData.reduce((sum, d) => sum + d.hours, 0) / chartData.length
      : 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Sleep Duration</h2>
        {chartData.length > 0 && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Avg: {avgSleep.toFixed(1)}h
          </span>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-3xl mb-2">😴</div>
            <p className="text-sm">No sleep data available</p>
            <p className="text-xs">Start logging your sleep hours</p>
          </div>
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  if (!date) return '';
                  const parsedDate = new Date(date);
                  if (isNaN(parsedDate.getTime())) return String(date);
                  return parsedDate.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="hours" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
