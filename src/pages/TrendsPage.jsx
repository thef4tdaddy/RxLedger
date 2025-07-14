import { useEffect, useState } from 'react';
import { getLogEntries } from '../services/logService.js';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function TrendsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getLogEntries()
      .then((l) => setLogs(l.sort((a, b) => new Date(a.created) - new Date(b.created))))
      .catch((err) => console.error(err));
  }, []);

  const moodData = logs.map((l) => ({ date: l.created, mood: (l.mood ?? 0) * 20 }));
  const energyData = logs.map((l) => ({ date: l.created, energy: l.energy ?? 0 }));
  const sleepData = logs.map((l) => ({ date: l.created, sleep: l.sleepHours ?? 0 }));
  const effectCounts = logs.reduce((acc, l) => {
    for (const s of l.symptoms || []) acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const avgMood = logs.length ? (logs.reduce((a,b)=>a+(b.mood||0),0)/logs.length).toFixed(1) : '0';
  const avgSleep = logs.length ? (logs.reduce((a,b)=>a+(b.sleepHours||0),0)/logs.length).toFixed(1) : '0';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Trends</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Export Data
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['Mood', 'Energy', 'Sleep', 'Side Effects'].map((tab) => (
          <button
            key={tab}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Mood Over Time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(d)=>new Date(d).toLocaleDateString()} />
                <YAxis domain={[0,100]} />
                <Tooltip labelFormatter={(d)=>new Date(d).toLocaleDateString()} />
                <Line type="monotone" dataKey="mood" stroke="#1B59AE" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Energy Over Time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(d)=>new Date(d).toLocaleDateString()} />
                <YAxis domain={[0,100]} />
                <Tooltip labelFormatter={(d)=>new Date(d).toLocaleDateString()} />
                <Line type="monotone" dataKey="energy" stroke="#10B981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Sleep Over Time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(d)=>new Date(d).toLocaleDateString()} />
                <YAxis />
                <Tooltip labelFormatter={(d)=>new Date(d).toLocaleDateString()} />
                <Line type="monotone" dataKey="sleep" stroke="#F59E0B" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Side Effects Over Time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(effectCounts).map(([k,v])=>({name:k,count:v}))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1B59AE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Average Mood', value: `${avgMood}/10`, trend: '' },
            { label: 'Average Sleep', value: `${avgSleep}h`, trend: '' },
            { label: 'Log Entries', value: logs.length, trend: '' },
          ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {stat.value}
            </div>
            <p
              className={`text-sm ${stat.trend.startsWith('↑') ? 'text-green-600' : stat.trend.startsWith('→') ? 'text-blue-600' : 'text-gray-600'}`}
            >
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Insights</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <span className="text-blue-600 text-xl">💡</span>
            <div>
              <p className="font-medium text-gray-800">
                Your mood tends to be higher on days when you sleep 7+ hours
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Consider maintaining a consistent sleep schedule
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <span className="text-green-600 text-xl">📈</span>
            <div>
              <p className="font-medium text-gray-800">
                Your energy levels have improved by 15% this month
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Great progress! Keep up the current routine
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
            <span className="text-yellow-600 text-xl">⚠️</span>
            <div>
              <p className="font-medium text-gray-800">
                You missed medications 3 times this week
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Consider setting up reminders to improve adherence
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
