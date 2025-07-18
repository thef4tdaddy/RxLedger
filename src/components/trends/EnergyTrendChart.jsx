import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../../hooks/useAuth';
import { demoMoodEnergyData } from '../../demo-data/trends/personalTrends';

export default function EnergyTrendChart() {
  const { user } = useAuth();
  const [energyData, setEnergyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load energy data from Firebase
  useEffect(() => {
    const getUserId = () => {
      if (import.meta.env.VITE_AUTH_BYPASS === 'true') {
        return 'bypass-user';
      }
      return user?.uid || null;
    };

    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Set up real-time listener for energy data
      const energyCollectionRef = collection(
        db,
        'users',
        userId,
        'healthStats',
      );
      const energyQuery = query(
        energyCollectionRef,
        orderBy('date', 'desc'),
        limit(30), // Last 30 days
      );

      const unsubscribe = onSnapshot(
        energyQuery,
        (snapshot) => {
          const firebaseData = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.energy !== undefined) {
              firebaseData.push({
                date: data.date,
                energy: data.energy,
                dateISO: data.date, // For compatibility with existing format
              });
            }
          });

          // Sort by date ascending for chart display
          firebaseData.sort((a, b) => new Date(a.date) - new Date(b.date));

          if (firebaseData.length > 0) {
            setEnergyData(firebaseData);
          } else {
            // Fall back to demo data if no Firebase data
            console.log('No energy data found, using demo data');
            setEnergyData(demoMoodEnergyData);
          }
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('Error loading energy data:', error);
          setError('Failed to load energy data');
          // Fall back to demo data on error
          setEnergyData(demoMoodEnergyData);
          setLoading(false);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up energy data listener:', error);
      setError('Failed to set up data connection');
      setEnergyData(demoMoodEnergyData);
      setLoading(false);
    }
  }, [user]);

  // Prepare data for chart
  const chartData = energyData.map((d) => ({
    date: d.dateISO || d.date,
    energy: d.energy,
  }));

  // Custom tooltip for better UX
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedDate = isNaN(date.getTime())
        ? label
        : date.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{formattedDate}</p>
          <p className="text-sm text-amber-600">
            Energy: <span className="font-semibold">{payload[0].value}/10</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-2">Energy Levels</h2>
        <div className="h-56 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Energy Levels</h2>
        {error && (
          <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
            Using demo data
          </span>
        )}
        {!error &&
          energyData.length > 0 &&
          energyData !== demoMoodEnergyData && (
            <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded">
              Live data
            </span>
          )}
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                const parsedDate = new Date(date);
                if (isNaN(parsedDate.getTime())) return date;
                return parsedDate.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                });
              }}
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {chartData.length === 0 && (
        <div className="text-center text-gray-500 text-sm mt-4">
          No energy data available. Start tracking your energy levels!
        </div>
      )}
    </div>
  );
}
