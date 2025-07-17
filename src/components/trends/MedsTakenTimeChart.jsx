// components/trends/MedsTakenTimeChart.jsx - Enhanced with Firebase integration
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { demoMedsTakenTimeData } from '../../demo-data/trends/personalTrends';

export default function MedsTakenTimeChart({ data, loading }) {
  // Process real medication logs to show time distribution
  const processTimeData = (logs) => {
    const timeSlots = {
      'Early Morning (5-7 AM)': 0,
      'Morning (7-9 AM)': 0,
      'Late Morning (9-12 PM)': 0,
      'Afternoon (12-5 PM)': 0,
      'Evening (5-8 PM)': 0,
      'Night (8-11 PM)': 0,
      'Late Night (11 PM-5 AM)': 0,
    };

    logs.forEach((log) => {
      const hour = log.timestamp.getHours();

      if (hour >= 5 && hour < 7) {
        timeSlots['Early Morning (5-7 AM)']++;
      } else if (hour >= 7 && hour < 9) {
        timeSlots['Morning (7-9 AM)']++;
      } else if (hour >= 9 && hour < 12) {
        timeSlots['Late Morning (9-12 PM)']++;
      } else if (hour >= 12 && hour < 17) {
        timeSlots['Afternoon (12-5 PM)']++;
      } else if (hour >= 17 && hour < 20) {
        timeSlots['Evening (5-8 PM)']++;
      } else if (hour >= 20 && hour < 23) {
        timeSlots['Night (8-11 PM)']++;
      } else {
        timeSlots['Late Night (11 PM-5 AM)']++;
      }
    });

    return Object.entries(timeSlots).map(([time, count]) => ({
      time: time.split(' (')[0], // Show just the time period name
      fullTime: time,
      count,
    }));
  };

  // Use real data if available, otherwise fall back to demo data
  const chartData =
    data && data.length > 0 ? processTimeData(data) : demoMedsTakenTimeData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-1">{data.fullTime || label}</p>
          <p className="text-sm font-medium text-[#6366F1]">
            {payload[0].value} doses taken
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

  const totalDoses = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Medication Timing
        </h2>
        {totalDoses > 0 && (
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
            {totalDoses} total doses
          </span>
        )}
      </div>

      {totalDoses === 0 ? (
        <div className="h-56 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-3xl mb-2">💊</div>
            <p className="text-sm">No medication logs available</p>
            <p className="text-xs">Start logging your medications</p>
          </div>
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                stroke="#666"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
