export default function RecentActivity() {
  const activities = [
    { icon: '😊', text: 'Mood logged', time: '9:00am' },
    { icon: '💊', text: 'Medications taken', time: '8:00am' },
    { icon: '🛌', text: 'Slept 7h last night', time: 'Yesterday' },
    {
      icon: '⚠️',
      text: 'New manufacturer detected for Sertraline',
      time: '2 days ago',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-black">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
        Recent Activity
      </h2>
      <div className="space-y-3">
        {activities.map((activity, idx) => (
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
