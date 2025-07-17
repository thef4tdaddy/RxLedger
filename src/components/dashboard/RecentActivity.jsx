// components/dashboard/RecentActivity.jsx - Enhanced with Firebase integration
import { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useMedications } from '../../context/useMedications';
import { encryptionService } from '../../services/encryptionService';
import { useAuth } from '../../context/useAuth';

export default function RecentActivity() {
  const { user } = useAuth();
  const { medications } = useMedications();
  const [medicationLogs, setMedicationLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load recent medication logs
  useEffect(() => {
    if (!user?.uid) return;

    const loadRecentLogs = async () => {
      try {
        setLoading(true);
        const logsRef = collection(db, 'users', user.uid, 'medicationLogs');
        const q = query(logsRef, orderBy('createdAt', 'desc'), limit(10));
        const snapshot = await getDocs(q);

        const userKey = encryptionService.generateUserKey(
          user.uid,
          user.email || 'bypass@example.com',
        );
        const logs = [];

        snapshot.docs.forEach((doc) => {
          try {
            const data = doc.data();
            let logData = {};

            if (data.encryptedData) {
              logData = encryptionService.decryptMedicalData(
                data.encryptedData,
                userKey,
              );
            }

            logs.push({
              id: doc.id,
              medicationId: data.medicationId,
              timestamp: data.timestamp?.toDate
                ? data.timestamp.toDate()
                : new Date(data.timestamp),
              createdAt: data.createdAt?.toDate
                ? data.createdAt.toDate()
                : new Date(),
              effectivenessRating: data.effectivenessRating,
              ...logData,
            });
          } catch (error) {
            console.warn('Could not decrypt log entry:', doc.id, error);
          }
        });

        setMedicationLogs(logs);
      } catch (error) {
        console.error('Error loading recent activity:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentLogs();
  }, [user]);

  // Generate activity items from real data
  const activityItems = useMemo(() => {
    const activities = [];

    // Add medication logs
    medicationLogs.forEach((log) => {
      const medication = medications?.find(
        (med) => med.id === log.medicationId,
      );
      const medicationName =
        medication?.commonName ||
        medication?.medicalName ||
        'Unknown Medication';

      activities.push({
        icon: '💊',
        text: `Logged ${medicationName}`,
        time: formatTimeAgo(log.timestamp || log.createdAt),
        timestamp: log.timestamp || log.createdAt,
        type: 'medication_log',
      });
    });

    // Add recent medication additions
    if (medications) {
      medications
        .filter((med) => med.createdAt)
        .sort((a, b) => {
          const aDate = a.createdAt.toDate
            ? a.createdAt.toDate()
            : new Date(a.createdAt);
          const bDate = b.createdAt.toDate
            ? b.createdAt.toDate()
            : new Date(b.createdAt);
          return bDate - aDate;
        })
        .slice(0, 3)
        .forEach((med) => {
          const createdDate = med.createdAt.toDate
            ? med.createdAt.toDate()
            : new Date(med.createdAt);
          activities.push({
            icon: '➕',
            text: `Added ${med.commonName || med.medicalName}`,
            time: formatTimeAgo(createdDate),
            timestamp: createdDate,
            type: 'medication_added',
          });
        });
    }

    // Sort all activities by timestamp and take recent 8
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 8);
  }, [medicationLogs, medications]);

  function formatTimeAgo(date) {
    if (!date) return 'Unknown time';

    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  }

  // Generate demo activities when no real data
  const generateDemoActivities = () => {
    const now = new Date();
    return [
      {
        icon: '💊',
        text: 'Logged Lisinopril',
        time: formatTimeAgo(new Date(now - 2 * 60 * 60 * 1000)), // 2h ago
        type: 'demo',
      },
      {
        icon: '➕',
        text: 'Added new medication',
        time: formatTimeAgo(new Date(now - 6 * 60 * 60 * 1000)), // 6h ago
        type: 'demo',
      },
      {
        icon: '📊',
        text: 'Updated health stats',
        time: formatTimeAgo(new Date(now - 12 * 60 * 60 * 1000)), // 12h ago
        type: 'demo',
      },
      {
        icon: '🔔',
        text: 'Enabled reminders',
        time: formatTimeAgo(new Date(now - 24 * 60 * 60 * 1000)), // 1d ago
        type: 'demo',
      },
    ];
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black">
        <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-pulse"
            >
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayActivities =
    activityItems.length > 0 ? activityItems : generateDemoActivities();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#1B59AE]">
          Recent Activity
        </h2>
        {activityItems.length === 0 && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Demo Data
          </span>
        )}
      </div>

      <div className="space-y-3">
        {displayActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-gray-500 mb-2">No recent activity</p>
            <p className="text-sm text-gray-400">
              Start tracking medications to see your activity here
            </p>
          </div>
        ) : (
          displayActivities.map((activity, idx) => (
            <div
              key={`${activity.type}-${idx}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-lg">{activity.icon}</span>
              <span className="text-black flex-1">{activity.text}</span>
              <span className="text-sm text-gray-600 ml-auto">
                {activity.time}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer with helpful link */}
      {activityItems.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
          <a href="#/log" className="text-sm text-[#1B59AE] hover:underline">
            View all activity →
          </a>
        </div>
      )}
    </div>
  );
}
