// components/admin/AdminMetrics.jsx - Real Firebase integration
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import useAuth from '../../hooks/useAuth';

export default function AdminMetrics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalMedications: 0,
    totalHealthLogs: 0,
    communityShares: 0,
    lastUpdated: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is admin
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.uid) return;

      try {
        // Check if user has admin role
        // In a real app, this would be stored in a custom claims or admin collection
        const adminEmails = ['admin@rxledger.com', 'admin@example.com']; // Configure admin emails
        setIsAdmin(
          adminEmails.includes(user.email) || user.email?.includes('admin'),
        );
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;

    const loadMetrics = async () => {
      setLoading(true);
      try {
        // Get total users count
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);
        const totalUsers = usersSnap.size;

        // Get active users (users with activity in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        let activeUsers = 0;
        let totalMedications = 0;
        let totalHealthLogs = 0;
        let communityShares = 0;

        // Aggregate data from all users
        for (const userDoc of usersSnap.docs) {
          const userId = userDoc.id;

          try {
            // Check if user has recent activity
            const healthStatsRef = collection(
              db,
              'users',
              userId,
              'healthStats',
            );
            const recentHealthQuery = query(
              healthStatsRef,
              where(
                '__name__',
                '>=',
                thirtyDaysAgo.toISOString().split('T')[0],
              ),
              limit(1),
            );
            const recentHealthSnap = await getDocs(recentHealthQuery);

            if (recentHealthSnap.size > 0) {
              activeUsers++;
            }

            // Count medications
            const medicationsRef = collection(
              db,
              'users',
              userId,
              'medications',
            );
            const medicationsSnap = await getDocs(medicationsRef);
            totalMedications += medicationsSnap.size;

            // Count health logs
            const healthLogsRef = collection(
              db,
              'users',
              userId,
              'healthStats',
            );
            const healthLogsSnap = await getDocs(healthLogsRef);
            totalHealthLogs += healthLogsSnap.size;

            // Count community shares
            const communityRef = collection(db, 'users', userId, 'settings');
            const communitySnap = await getDocs(communityRef);
            communitySnap.docs.forEach((doc) => {
              const data = doc.data();
              if (data.shareAnonymizedData) {
                communityShares++;
              }
            });
          } catch (userError) {
            console.warn(`Error processing user ${userId}:`, userError);
          }
        }

        setMetrics({
          totalUsers,
          activeUsers,
          totalMedications,
          totalHealthLogs,
          communityShares,
          lastUpdated: new Date(),
        });
      } catch (error) {
        console.error('Error loading admin metrics:', error);
        setError('Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-red-900">Access Denied</h3>
            <p className="text-red-700">
              You don&apos;t have permission to access admin features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-12 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Users',
      value: metrics.totalUsers.toLocaleString(),
      icon: '👥',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Users',
      value: metrics.activeUsers.toLocaleString(),
      icon: '🟢',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      subtitle: 'Last 30 days',
    },
    {
      title: 'Total Medications',
      value: metrics.totalMedications.toLocaleString(),
      icon: '💊',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Health Logs',
      value: metrics.totalHealthLogs.toLocaleString(),
      icon: '📊',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Community Participants',
      value: metrics.communityShares.toLocaleString(),
      icon: '🤝',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">System Metrics</h2>
        {metrics.lastUpdated && (
          <p className="text-sm text-gray-500">
            Last updated: {metrics.lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metricCards.map((metric, index) => (
          <div
            key={index}
            className={`${metric.bgColor} p-4 rounded-lg shadow-sm border text-center`}
          >
            <div className="text-2xl mb-2">{metric.icon}</div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              {metric.title}
            </p>
            <p className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </p>
            {metric.subtitle && (
              <p className="text-xs text-gray-600 mt-1">{metric.subtitle}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
