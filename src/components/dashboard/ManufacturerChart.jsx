import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { manufacturerCounts } from '../../demo-data/dashboard/AggegateData';
import { demoMedications } from '../../demo-data/medications/Medications';

export default function ManufacturerChart() {
  // Wire in demo data
  const overallData = manufacturerCounts.map((m) => ({
    name: m.manufacturer,
    value: m.count,
  }));

  const medsData = demoMedications.map((med) => {
    const counts = {};
    const history = med.manufacturerHistory ?? [];
    if (history.length === 0) {
      return {
        medication: med.commonName,
        manufacturers: [],
      };
    }
    history.forEach((name) => {
      counts[name] = (counts[name] || 0) + 1;
    });
    const total = history.length || 1;
    const manufacturers = Object.entries(counts).map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100),
    }));

    return {
      medication: med.commonName,
      manufacturers,
    };
  });

  const COLORS = ['#1B59AE', '#10B981', '#F59E0B', '#EF4444'];

  const [selected, setSelected] = useState('Overview');

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
          className="border p-2 rounded"
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
        <div className="h-48 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={overallData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {overallData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
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
                No data available for this medication.
              </p>
            ) : (
              <div className="h-48">
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
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
