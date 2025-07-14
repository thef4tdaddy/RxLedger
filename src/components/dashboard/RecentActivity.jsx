import { useEffect, useState } from 'react';
import { getLogEntries } from '../../services/logService.js';

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getLogEntries()
      .then((logs) => {
        const last = logs
          .sort((a, b) => new Date(b.created) - new Date(a.created))
          .slice(0, 5);
        setActivities(last);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
        Recent Activity
      </h2>
      <div className="space-y-3">
        {activities.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <span className="text-lg">📋</span>
            <span className="text-black">Log entry</span>
            <span className="text-sm text-black ml-auto">
              {new Date(a.created).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
