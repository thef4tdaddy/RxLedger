import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import { getLogEntries } from '../../services/logService.js';

export default function SideEffectsChart() {
  const [data, setData] = useState([
    { name: 'Headache', count: 0 },
    { name: 'Nausea', count: 0 },
    { name: 'Insomnia', count: 0 },
  ]);

  useEffect(() => {
    getLogEntries()
      .then((logs) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7);
        const filtered = logs.filter((l) => new Date(l.created) >= cutoff);
        const counts = { Headache: 0, Nausea: 0, Insomnia: 0 };
        for (const l of filtered) {
          for (const s of l.symptoms || []) {
            if (counts[s] !== undefined) counts[s] += 1;
          }
        }
        setData([
          { name: 'Headache', count: counts.Headache },
          { name: 'Nausea', count: counts.Nausea },
          { name: 'Insomnia', count: counts.Insomnia },
        ]);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#1B59AE]">
          Side Effects Tracking
        </h2>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#1B59AE" />
          </BarChart>
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
