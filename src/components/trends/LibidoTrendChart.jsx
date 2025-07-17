// components/trends/LibidoTrendChart.jsx - New component for libido tracking
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function LibidoTrendChart({ data, loading }) {
  // Use real data if available, otherwise show empty state
  const chartData =
    data && data.length > 0
      ? data
          .filter((d) => d.libido !== null && d.libido !== undefined)
          .map((d) => ({
            date: d.dateISO,
            libido: d.libido,
          }))
      : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-1">
            {new Date(label).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p className="text-sm font-medium text-[#EC4899]">
            Libido: {payload[0].value}/10
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

  const avgLibido =
    chartData.length > 0
      ? chartData.reduce((sum, d) => sum + d.libido, 0) / chartData.length
      : 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Sexual Health</h2>
        {chartData.length > 0 && (
          <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
            Avg: {avgLibido.toFixed(1)}/10
          </span>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-3xl mb-2">💖</div>
            <p className="text-sm">No sexual health data available</p>
            <p className="text-xs">Start tracking for better insights</p>
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
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="libido"
                stroke="#EC4899"
                strokeWidth={3}
                dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#EC4899', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
