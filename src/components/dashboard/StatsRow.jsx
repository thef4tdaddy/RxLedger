import {
  demoMoodEnergyData,
  demoSleepData,
} from '../../demo-data/dashboard/DashboardData';
import { demoMedications } from '../../demo-data/medications/Medications';

export default function StatsRow() {
  const latestMoodEnergy = demoMoodEnergyData[demoMoodEnergyData.length - 1];
  const latestSleep = demoSleepData[demoSleepData.length - 1];
  const allMedsTaken = demoMedications.every((m) => m.takenToday);

  const stats = [
    {
      label: 'Mood',
      value: `${latestMoodEnergy.mood}/10`,
      icon:
        latestMoodEnergy.mood <= 2
          ? '😢'
          : latestMoodEnergy.mood <= 4
            ? '😟'
            : latestMoodEnergy.mood <= 6
              ? '😐'
              : latestMoodEnergy.mood <= 8
                ? '🙂'
                : '😁',
    },
    {
      label: 'Energy',
      value: `${latestMoodEnergy.energy}%`,
      icon:
        latestMoodEnergy.energy <= 20
          ? '🪫'
          : latestMoodEnergy.energy <= 40
            ? '🔋'
            : latestMoodEnergy.energy <= 60
              ? '⚡'
              : latestMoodEnergy.energy <= 80
                ? '💪'
                : '🚀',
    },
    {
      label: 'Sleep',
      value: `${latestSleep.hours}h`,
      icon:
        latestSleep.hours <= 4
          ? '😴'
          : latestSleep.hours <= 6
            ? '🌙'
            : latestSleep.hours <= 8
              ? '🛌'
              : '💤',
    },
    {
      label: 'Meds',
      value: allMedsTaken
        ? '✓ All taken'
        : `${demoMedications.filter((m) => !m.takenToday).length} MISSED`,
      icon: allMedsTaken ? '✅' : '❗',
    },
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
            <p className="text-2xl font-semibold flex items-center gap-1">
              <span>{stat.icon}</span>
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
