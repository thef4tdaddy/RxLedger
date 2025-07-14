import { demoSideEffectsData } from '../../demo-data/trends/personalTrends';

function getLast7Days() {
  const today = new Date();
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export default function SideEffectsHeatmap() {
  const days = getLast7Days();
  const effects = ['headache', 'nausea', 'insomnia'];

  const data = effects.map((effect) => {
    const row = { effect };
    days.forEach((day) => {
      const entry = demoSideEffectsData.find((d) => d.dateISO === day) || {};
      row[day] = entry[effect] || 0;
    });
    return row;
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-2">Side Effects Heatmap</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left">Effect</th>
              {days.map((d) => (
                <th key={d} className="px-2 py-1">
                  {new Date(d).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.effect} className="text-center">
                <td className="px-2 py-1 text-left capitalize">{row.effect}</td>
                {days.map((d) => (
                  <td key={d} className="px-2 py-1">
                    <span
                      className={`inline-block w-4 h-4 rounded ${
                        row[d] ? 'bg-red-500' : 'bg-gray-200'
                      }`}
                    ></span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
