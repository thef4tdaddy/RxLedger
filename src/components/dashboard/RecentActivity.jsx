import { demoRecentActivities } from '../../demo-data/dashboard/DashboardData';

export default function RecentActivity() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
        Recent Activity
      </h2>
      <div className="space-y-3">
        {demoRecentActivities.map((activity, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <span className="text-lg">{activity.icon}</span>
            <span className="text-black">{activity.text}</span>
            <span className="text-sm text-black ml-auto">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
