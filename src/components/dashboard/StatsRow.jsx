import {
  demoMoodEnergyData,
  demoSleepData,
} from '../../demo-data/dashboard/DashboardData';

export default function StatsRow() {
  const latestMoodEnergy = demoMoodEnergyData[demoMoodEnergyData.length - 1];
  const latestSleep = demoSleepData[demoSleepData.length - 1];

  const stats = [
    { label: 'Mood', value: latestMoodEnergy.mood },
    { label: 'Energy', value: `${latestMoodEnergy.energy}%` },
    { label: 'Sleep', value: `${latestSleep.hours}h` },
    { label: 'Meds', value: '✓' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-4 rounded-lg shadow-sm border-2 border-black"
        >
          <div>
            <p className="text-sm text-black">{stat.label}</p>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
