import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function SideEffectsChart({ range, onRangeChange }) {
  const data = [
    { name: 'Nausea', count: 2 },
    { name: 'Headache', count: 1 },
    { name: 'Dizziness', count: 3 },
    { name: 'Fatigue', count: 1 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#1B59AE]">
          Side Effects Tracking
        </h2>
        <div className="flex gap-2">
          {['Day', 'Week', 'Month'].map((r) => (
            <button
              key={r}
              onClick={() => onRangeChange(r)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                range === r
                  ? 'bg-[#1B59AE] text-white'
                  : 'bg-gray-200 text-black hover:bg-[#10B981]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
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
      </div>
    </div>
  );
}
