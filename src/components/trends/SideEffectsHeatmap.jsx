// components/trends/SideEffectsHeatmap.jsx - Enhanced with Firebase integration
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

export default function SideEffectsHeatmap({ data, loading }) {
  // Process real data to create side effects frequency map
  const processSideEffectsData = (healthStats) => {
    const allEffects = new Set();
    const effectsByDate = {};

    // Collect all unique side effects and organize by date
    healthStats.forEach((stat) => {
      if (stat.sideEffects && Array.isArray(stat.sideEffects)) {
        stat.sideEffects.forEach((effect) => {
          allEffects.add(effect.toLowerCase());
        });
        effectsByDate[stat.dateISO] = stat.sideEffects.map((e) =>
          e.toLowerCase(),
        );
      }
    });

    return {
      effects: Array.from(allEffects).slice(0, 10), // Limit to top 10 most common
      effectsByDate,
    };
  };

  // Use real data if available, otherwise fall back to demo data
  let effects, effectsByDate, days;

  if (data && data.length > 0) {
    const processed = processSideEffectsData(data);
    effects = processed.effects;
    effectsByDate = processed.effectsByDate;
    days = data.map((d) => d.dateISO).sort();
  } else {
    // Use demo data
    effects = ['headache', 'nausea', 'insomnia'];
    days = getLast7Days();
    effectsByDate = {};
    demoSideEffectsData.forEach((d) => {
      effectsByDate[d.dateISO] = Object.keys(d).filter(
        (key) => key !== 'dateISO' && d[key] > 0,
      );
    });
  }

  const heatmapData = effects.map((effect) => {
    const row = { effect };
    days.forEach((day) => {
      const dayEffects = effectsByDate[day] || [];
      row[day] = dayEffects.includes(effect) ? 1 : 0;
    });
    return row;
  });

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="h-32 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Side Effects Pattern
        </h2>
        {effects.length > 0 && (
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
            {effects.length} tracked effects
          </span>
        )}
      </div>

      {effects.length === 0 ? (
        <div className="h-32 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-sm">No side effects recorded</p>
            <p className="text-xs">Great job maintaining your health!</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Effect
                </th>
                {days.map((d) => (
                  <th
                    key={d}
                    className="px-2 py-2 text-center font-medium text-gray-700"
                  >
                    {(() => {
                      if (!d) return 'No date';
                      const parsedDate = new Date(d);
                      return isNaN(parsedDate.getTime())
                        ? String(d)
                        : parsedDate.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          });
                    })()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row) => (
                <tr key={row.effect} className="border-t border-gray-100">
                  <td className="px-3 py-2 text-left capitalize font-medium text-gray-800">
                    {row.effect}
                  </td>
                  {days.map((d) => (
                    <td key={d} className="px-2 py-2 text-center">
                      <div className="flex justify-center">
                        <span
                          className={`inline-block w-6 h-6 rounded-full border-2 ${
                            row[d]
                              ? 'bg-red-500 border-red-600'
                              : 'bg-green-100 border-green-300'
                          }`}
                          title={
                            row[d] ? `${row.effect} reported` : 'No issues'
                          }
                        >
                          {row[d] ? (
                            <span className="text-white text-xs flex items-center justify-center h-full">
                              !
                            </span>
                          ) : (
                            <span className="text-green-600 text-xs flex items-center justify-center h-full">
                              ✓
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-red-500 rounded-full"></span>
              <span>Side effect reported</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-green-100 border-2 border-green-300 rounded-full"></span>
              <span>No issues</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
