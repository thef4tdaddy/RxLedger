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
  const data = [
    { day: 'Mon', mood: 7, energy: 6, feeling: 6 },
    { day: 'Tue', mood: 8, energy: 7, feeling: 7 },
    { day: 'Wed', mood: 6, energy: 5, feeling: 5 },
    { day: 'Thu', mood: 9, energy: 8, feeling: 8 },
    { day: 'Fri', mood: 7, energy: 6, feeling: 7 },
    { day: 'Sat', mood: 8, energy: 7, feeling: 8 },
    { day: 'Sun', mood: 9, energy: 8, feeling: 9 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
        Overall Feeling / Mood / Energy
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#1B59AE"
              strokeWidth={2}
              name="Mood"
            />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#10B981"
              strokeWidth={2}
              name="Energy"
            />
            <Line
              type="monotone"
              dataKey="feeling"
              stroke="#F59E0B"
              strokeWidth={2}
              name="Overall Feeling"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
