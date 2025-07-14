import { useEffect, useState } from 'react';
import { getLogEntries } from '../../services/logService.js';
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
  const [data, setData] = useState([]);

  useEffect(() => {
    getLogEntries()
      .then((logs) => {
        const parsed = logs
          .map((l) => ({
            dateISO: l.created,
            mood: (l.mood ?? 0) * 20,
            energy: l.energy ?? 0,
            feeling: Math.round(((l.mood ?? 0) * 20 + (l.energy ?? 0)) / 2),
          }))
          .sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO));
        setData(parsed.slice(-7));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black pt-6 md:pt-0">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
        Overall Feeling / Mood / Energy
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
