import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { demoSideEffectsData } from '../../demo-data/dashboard/DashboardData';

export default function SideEffectsChart() {
  const today = new Date();

  const cutoffDate = new Date();
  cutoffDate.setDate(today.getDate() - 7);

  const filtered = demoSideEffectsData.filter((d) => {
    const entryDate = new Date(d.dateISO);
    return entryDate >= cutoffDate;
  });

  const data = [
    {
      name: 'Headache',
      count: filtered.reduce((sum, d) => sum + d.headache, 0),
    },
    {
      name: 'Nausea',
      count: filtered.reduce((sum, d) => sum + d.nausea, 0),
    },
    {
      name: 'Insomnia',
      count: filtered.reduce((sum, d) => sum + d.insomnia, 0),
    },
  ];

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
