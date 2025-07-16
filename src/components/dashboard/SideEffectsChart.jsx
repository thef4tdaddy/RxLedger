// components/dashboard/SideEffectsChart.jsx - Enhanced with Firebase integration
import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { encryptionService } from '../../services/encryptionService';
import useAuth from '../../hooks/useAuth';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function SideEffectsChart() {
  const { user } = useAuth();
  const [medicationLogs, setMedicationLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load medication logs for side effects analysis
  useEffect(() => {
    if (!user?.uid) return;

    const loadMedicationLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get logs from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const logsRef = collection(db, 'users', user.uid, 'medicationLogs');
        const q = query(
          logsRef,
          where('createdAt', '>=', sevenDaysAgo),
          orderBy('createdAt', 'desc'),
        );

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
              createdAt: data.createdAt?.toDate
                ? data.createdAt.toDate()
                : new Date(),
              sideEffects: logData.sideEffects || [],
              ...logData,
            });
          } catch (decryptError) {
            console.warn(
              'Could not decrypt medication log:',
              doc.id,
              decryptError,
            );
          }
        });

        setMedicationLogs(logs);
      } catch (err) {
        console.error('Error loading medication logs:', err);
        setError('Failed to load side effects data');
      } finally {
        setLoading(false);
      }
    };

    loadMedicationLogs();
  }, [user]);

  // Process logs to count side effects
  const sideEffectsData = useMemo(() => {
    if (medicationLogs.length === 0) {
      // Return demo data when no real data exists
      return [
        { name: 'Headache', count: 2 },
        { name: 'Nausea', count: 1 },
        { name: 'Dizziness', count: 3 },
        { name: 'Fatigue', count: 1 },
      ];
    }

    // Count side effects from real logs
    const sideEffectCounts = {};

    medicationLogs.forEach((log) => {
      if (log.sideEffects && Array.isArray(log.sideEffects)) {
        log.sideEffects.forEach((effect) => {
          // Convert effect keys to readable names
          const effectName = formatSideEffectName(effect);
          sideEffectCounts[effectName] =
            (sideEffectCounts[effectName] || 0) + 1;
        });
      }
    });

    // Convert to chart data format
    const chartData = Object.entries(sideEffectCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count) // Sort by frequency
      .slice(0, 8); // Limit to top 8 side effects

    return chartData.length > 0
      ? chartData
      : [{ name: 'No side effects', count: 0 }];
  }, [medicationLogs]);

  // Format side effect names for display
  function formatSideEffectName(effect) {
    const nameMap = {
      headache: 'Headache',
      nausea: 'Nausea',
      dizziness: 'Dizziness',
      fatigue: 'Fatigue',
      drowsiness: 'Drowsiness',
      stomach_upset: 'Stomach Upset',
      dry_mouth: 'Dry Mouth',
      insomnia: 'Insomnia',
    };

    return (
      nameMap[effect] ||
      effect.charAt(0).toUpperCase() + effect.slice(1).replace('_', ' ')
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#1B59AE]">
            Side Effects Tracking
          </h2>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <p className="text-gray-500">Loading side effects data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#1B59AE]">
            Side Effects Tracking
          </h2>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-2">
              Unable to load side effects data
            </p>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const hasRealData = medicationLogs.length > 0;
  const totalSideEffects = sideEffectsData.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#1B59AE]">
          Side Effects Tracking
        </h2>
        <div className="flex items-center gap-2">
          {!hasRealData && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Demo Data
            </span>
          )}
          {totalSideEffects > 0 && (
            <span className="text-sm text-gray-600">
              {totalSideEffects} reported this week
            </span>
          )}
        </div>
      </div>

      {totalSideEffects === 0 && hasRealData ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-gray-600 mb-2">No side effects reported</p>
            <p className="text-sm text-gray-400">
              Great job! Keep tracking your medications to monitor any changes.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sideEffectsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `${value} occurrence${value !== 1 ? 's' : ''}`,
                    'Count',
                  ]}
                />
                <Bar dataKey="count" fill="#1B59AE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing last 7 days.{' '}
              <a href="#/trends" className="text-[#1B59AE] underline">
                View full chart
              </a>
              {!hasRealData && (
                <span className="ml-2 text-gray-400">
                  (Start logging medications to see real data)
                </span>
              )}
            </p>

            {hasRealData && totalSideEffects > 0 && (
              <a
                href="#/log"
                className="text-sm text-[#1B59AE] hover:underline"
              >
                Log side effects →
              </a>
            )}
          </div>

          {/* Summary insight */}
          {hasRealData && totalSideEffects > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <div className="text-yellow-600 text-lg mr-2">💡</div>
                <div className="text-sm">
                  <p className="text-yellow-800 font-medium">
                    Side Effects Insight
                  </p>
                  <p className="text-yellow-700 mt-1">
                    {sideEffectsData[0]?.name} is your most frequent side
                    effect. Consider discussing this with your healthcare
                    provider.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
