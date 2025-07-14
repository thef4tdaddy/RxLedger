import { useEffect, useState } from 'react';
import { getLogEntries } from '../../services/logService.js';
import { getMedications } from '../../services/medicationService.js';

export default function StatsRow() {
  const [stats, setStats] = useState({ mood: 0, energy: 0, sleep: 0, missed: 0 });

  useEffect(() => {
    async function load() {
      try {
        const logs = await getLogEntries();
        if (logs.length) {
          const last = logs.sort((a, b) => new Date(a.created) - new Date(b.created)).at(-1);
          setStats((s) => ({ ...s, mood: last.mood ?? 0, energy: last.energy ?? 0, sleep: last.sleepHours ?? 0 }));
        }
        const meds = await getMedications();
        const missed = meds.filter((m) => !m.takenToday).length;
        setStats((s) => ({ ...s, missed }));
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const statsData = [
    {
      label: 'Mood',
      value: `${stats.mood}/10`,
      icon:
        stats.mood <= 2
          ? '😢'
          : stats.mood <= 4
            ? '😟'
            : stats.mood <= 6
              ? '😐'
              : stats.mood <= 8
                ? '🙂'
                : '😁',
    },
    {
      label: 'Energy',
      value: `${stats.energy}%`,
      icon:
        stats.energy <= 20
          ? '🪫'
          : stats.energy <= 40
            ? '🔋'
            : stats.energy <= 60
              ? '⚡'
              : stats.energy <= 80
                ? '💪'
                : '🚀',
    },
    {
      label: 'Sleep',
      value: `${stats.sleep}h`,
      icon:
        stats.sleep <= 4
          ? '😴'
          : stats.sleep <= 6
            ? '🌙'
            : stats.sleep <= 8
              ? '🛌'
              : '💤',
    },
    {
      label: 'Meds',
      value: stats.missed === 0 ? '✓ All taken' : `${stats.missed} MISSED`,
      icon: stats.missed === 0 ? '✅' : '❗',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat) => (
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
