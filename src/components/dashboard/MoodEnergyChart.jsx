import { demoMoodEnergyData } from '../../demo-data/dashboard/DashboardData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function MoodEnergyChart() {
  const parsedData = demoMoodEnergyData
    .map((entry) => ({
      ...entry,
      mood: (entry.mood ?? 0) * 20,
      feeling: Math.round(((entry.mood ?? 0) * 20 + (entry.energy ?? 0)) / 2),
      parsedDate: new Date(entry.dateISO),
    }))
    .filter((entry) => !isNaN(entry.parsedDate))
    .sort((a, b) => a.parsedDate - b.parsedDate);

  const last7 = parsedData.slice(-7);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black pt-6 md:pt-0">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
        Overall Feeling / Mood / Energy
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={last7}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="dateISO"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })
              }
            />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              labelFormatter={(date) =>
                new Date(date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })
              }
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#1B59AE"
              strokeWidth={2}
              name="Mood"
              dot={true}
            />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#10B981"
              strokeWidth={2}
              name="Energy"
              dot={true}
            />
            <Line
              type="monotone"
              dataKey="feeling"
              stroke="#F59E0B"
              strokeWidth={2}
              name="Overall Feeling"
              dot={true}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-2 text-sm text-gray-500">
          Showing last 7 days.{' '}
          <a href="/trends" className="text-[#1B59AE] underline">
            View full chart
          </a>
        </p>
      </div>
    </div>
  );
}
