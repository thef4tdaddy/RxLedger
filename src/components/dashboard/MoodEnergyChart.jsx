// components/dashboard/MoodEnergyChart.jsx - Enhanced with Firebase integration
import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../../context/useAuth';
import { encryptionService } from '../../services/encryptionService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function MoodEnergyChart() {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load health data from Firebase
  useEffect(() => {
    if (!user?.uid) return;

    const loadHealthData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get last 30 days of health stats
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const startDate = thirtyDaysAgo.toISOString().split('T')[0];

        const healthStatsRef = collection(db, 'users', user.uid, 'healthStats');
        const q = query(
          healthStatsRef,
          where('__name__', '>=', startDate),
          orderBy('__name__', 'desc'),
          limit(30),
        );

        const snapshot = await getDocs(q);
        const userKey = encryptionService.generateUserKey(
          user.uid,
          user.email || 'bypass@example.com',
        );

        const loadedData = [];
        snapshot.docs.forEach((doc) => {
          try {
            const data = doc.data();
            let healthStats = {};

            if (data.encryptedData) {
              healthStats = encryptionService.decryptMedicalData(
                data.encryptedData,
                userKey,
              );
            } else {
              healthStats = {
                mood: data.mood || null,
                energy: data.energy || null,
                sleepHours: data.sleepHours || null,
              };
            }

            loadedData.push({
              date: doc.id,
              dateISO: doc.id,
              mood: healthStats.mood,
              energy: healthStats.energy,
              sleepHours: healthStats.sleepHours,
              parsedDate: new Date(doc.id),
            });
          } catch (decryptError) {
            console.warn(
              'Could not decrypt health data for date:',
              doc.id,
              decryptError,
            );
          }
        });

        setHealthData(loadedData.reverse());
      } catch (err) {
        console.error('Error loading health data:', err);
        setError('Failed to load health data');
      } finally {
        setLoading(false);
      }
    };

    loadHealthData();
  }, [user]);

  // Generate mock data when no real data exists
  const generateMockData = () => {
    const mockData = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const seed = (user?.uid ? user.uid.charCodeAt(0) : 5) + i;

      mockData.push({
        date: dateStr,
        dateISO: dateStr,
        mood: Math.max(1, Math.min(10, 6 + (seed % 5))),
        energy: Math.max(10, Math.min(100, 60 + ((seed * 7) % 40))),
        parsedDate: date,
      });
    }

    return mockData;
  };

  const chartData = useMemo(() => {
    let dataToUse = healthData.length > 0 ? healthData : generateMockData();

    const parsedData = dataToUse
      .map((entry) => ({
        ...entry,
        mood: entry.mood ? entry.mood * 10 : null, // Convert 1-10 to 10-100
        feeling:
          entry.mood && entry.energy
            ? Math.round((entry.mood * 10 + entry.energy) / 2)
            : null,
        parsedDate: entry.parsedDate || new Date(entry.dateISO),
      }))
      .filter((entry) => !isNaN(entry.parsedDate))
      .sort((a, b) => a.parsedDate - b.parsedDate);

    return parsedData.slice(-7);
  }, [healthData, user]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black pt-6 md:pt-0">
        <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
          Overall Feeling / Mood / Energy
        </h2>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <p className="text-gray-500">Loading health data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black pt-6 md:pt-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#1B59AE]">
          Overall Feeling / Mood / Energy
        </h2>
        {healthData.length === 0 && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Demo Data
          </span>
        )}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="dateISO"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })
              }
            />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              labelFormatter={(date) =>
                new Date(date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })
              }
              formatter={(value, name) => {
                if (value === null || value === undefined)
                  return ['No data', name];
                return [`${Math.round(value)}%`, name];
              }}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#1B59AE"
              strokeWidth={2}
              name="Mood"
              dot={true}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#10B981"
              strokeWidth={2}
              name="Energy"
              dot={true}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="feeling"
              stroke="#F59E0B"
              strokeWidth={2}
              name="Overall Feeling"
              dot={true}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-2 text-sm text-gray-500">
          Showing last 7 days.{' '}
          <a href="#/trends" className="text-[#1B59AE] underline">
            View full chart
          </a>
          {healthData.length === 0 && (
            <span className="ml-2 text-gray-400">
              (Start tracking health data to see real trends)
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
