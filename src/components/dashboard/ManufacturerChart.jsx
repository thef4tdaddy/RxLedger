// components/dashboard/ManufacturerChart.jsx - Enhanced with Firebase integration
import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useMedications } from '../../context/useMedications';

export default function ManufacturerChart() {
  const { medications, loading, error } = useMedications();
  const [selected, setSelected] = useState('Overview');

  const chartData = useMemo(() => {
    if (!medications || medications.length === 0) {
      return {
        overallData: [],
        medsData: [],
      };
    }

    // Calculate manufacturer distribution across all medications
    const manufacturerCounts = {};
    medications.forEach((med) => {
      const manufacturer = med.manufacturer || 'Unknown';
      manufacturerCounts[manufacturer] =
        (manufacturerCounts[manufacturer] || 0) + 1;
    });

    const totalMeds = medications.length;
    const overallData = Object.entries(manufacturerCounts).map(
      ([name, count]) => ({
        name,
        value: Math.round((count / totalMeds) * 100),
        count,
      }),
    );

    // Individual medication data (for future enhancement with manufacturer history)
    const medsData = medications.map((med) => ({
      medication: med.commonName || med.medicalName || 'Unknown',
      manufacturers: [
        {
          name: med.manufacturer || 'Unknown',
          value: 100,
        },
      ],
    }));

    return { overallData, medsData };
  }, [medications]);

  const COLORS = [
    '#1B59AE',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#06B6D4',
  ];

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black">
        <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
          Medication Manufacturer Overview
        </h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black">
        <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
          Medication Manufacturer Overview
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Unable to load manufacturer data</p>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!medications || medications.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black">
        <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
          Medication Manufacturer Overview
        </h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-500 mb-2">No medication data available</p>
          <p className="text-sm text-gray-400">
            Add medications to see manufacturer distribution
          </p>
        </div>
      </div>
    );
  }

  const { overallData, medsData } = chartData;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
        Medication Manufacturer Overview
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-1">
          Select View:
        </label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
        >
          <option value="Overview">Overview</option>
          {medsData.map((med) => (
            <option key={med.medication} value={med.medication}>
              {med.medication}
            </option>
          ))}
        </select>
      </div>

      {selected === 'Overview' && (
        <>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overallData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, value, count }) =>
                    `${name}: ${value}% (${count})`
                  }
                >
                  {overallData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value}% (${props.payload.count} medication${props.payload.count !== 1 ? 's' : ''})`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend/Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {overallData.map((item, index) => (
              <div key={item.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span>
                  {item.name}: {item.count} medication
                  {item.count !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {medsData
        .filter((m) => m.medication === selected)
        .map((med) => (
          <div key={med.medication} className="mb-6">
            <h3 className="text-lg font-semibold text-[#1B59AE] mb-2">
              {med.medication}
            </h3>
            {med.manufacturers.length === 0 ? (
              <p className="text-gray-500">
                No manufacturer data available for this medication.
              </p>
            ) : (
              <>
                <div className="h-48 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={med.manufacturers}
                        cx="50%"
                        cy="50%"
                        outerRadius={50}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {med.manufacturers.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, 'Distribution']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Current Manufacturer:</strong>{' '}
                    {med.manufacturers[0]?.name}
                  </p>
                  <p className="text-xs mt-1 text-gray-500">
                    Track manufacturer changes over time to monitor consistency
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
    </div>
  );
}
