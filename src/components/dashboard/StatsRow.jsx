// components/dashboard/StatsRow.jsx - Enhanced with Firebase integration
import { useMedications } from '../../context/useMedications';
import { useAuth } from '../../context/useAuth';

export default function StatsRow() {
  const { medications, loading } = useMedications();
  const { user } = useAuth();

  // Mock health data for now - can be enhanced with real health tracking later
  const getMockHealthData = () => {
    // Generate consistent "random" data based on user ID for demo
    const seed = user?.uid ? user.uid.charCodeAt(0) % 10 : 5;
    return {
      mood: Math.max(1, Math.min(10, 6 + (seed % 5))), // 6-10 range
      energy: Math.max(10, Math.min(100, 60 + ((seed * 8) % 40))), // 60-100 range
      sleep: Math.max(4, Math.min(10, 7 + (seed % 3))), // 7-9 hours range
    };
  };

  const mockHealth = getMockHealthData();

  // Calculate real medication stats from Firebase
  const getMedicationStats = () => {
    if (!medications || medications.length === 0) {
      return { allTaken: true, missedCount: 0 };
    }

    const today = new Date().toDateString();
    const takenToday = medications.filter((med) => {
      if (!med.lastTaken) return false;
      const lastTakenDate = med.lastTaken.toDate
        ? med.lastTaken.toDate()
        : new Date(med.lastTaken);
      return lastTakenDate.toDateString() === today;
    });

    return {
      allTaken: takenToday.length === medications.length,
      missedCount: medications.length - takenToday.length,
    };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-lg shadow-sm border-2 border-black"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const medStats = getMedicationStats();

  const stats = [
    {
      label: 'Mood',
      value: `${mockHealth.mood}/10`,
      icon:
        mockHealth.mood <= 2
          ? '😢'
          : mockHealth.mood <= 4
            ? '😟'
            : mockHealth.mood <= 6
              ? '😐'
              : mockHealth.mood <= 8
                ? '🙂'
                : '😁',
    },
    {
      label: 'Energy',
      value: `${mockHealth.energy}%`,
      icon:
        mockHealth.energy <= 20
          ? '🪫'
          : mockHealth.energy <= 40
            ? '🔋'
            : mockHealth.energy <= 60
              ? '⚡'
              : mockHealth.energy <= 80
                ? '💪'
                : '🚀',
    },
    {
      label: 'Sleep',
      value: `${mockHealth.sleep}h`,
      icon:
        mockHealth.sleep <= 4
          ? '😴'
          : mockHealth.sleep <= 6
            ? '🌙'
            : mockHealth.sleep <= 8
              ? '🛌'
              : '💤',
    },
    {
      label: 'Meds',
      value: medStats.allTaken
        ? '✓ All taken'
        : medications && medications.length > 0
          ? `${medStats.missedCount} MISSED`
          : 'No medications',
      icon: medStats.allTaken
        ? '✅'
        : medications && medications.length > 0
          ? '❗'
          : '💊',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-4 rounded-lg shadow-sm border-2 border-black hover:shadow-md transition-shadow"
        >
          <div>
            <p className="text-sm text-black">{stat.label}</p>
            <p className="text-2xl font-semibold flex items-center gap-1">
              <span>{stat.icon}</span>
              {stat.value}
            </p>
            {/* Add helpful context */}
            {stat.label === 'Meds' && medications && medications.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {medications.length} total medication
                {medications.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
