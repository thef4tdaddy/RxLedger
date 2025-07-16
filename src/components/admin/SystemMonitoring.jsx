export function SystemMonitoring({ adminLevel }) {
  const [systemStats, setSystemStats] = useState({
    uptime: '99.9%',
    responseTime: '245ms',
    errorRate: '0.02%',
    activeConnections: 1247,
  });

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
        System Monitoring
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {systemStats.uptime}
          </p>
          <p className="text-sm text-gray-600">Uptime</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {systemStats.responseTime}
          </p>
          <p className="text-sm text-gray-600">Avg Response</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {systemStats.errorRate}
          </p>
          <p className="text-sm text-gray-600">Error Rate</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {systemStats.activeConnections}
          </p>
          <p className="text-sm text-gray-600">Active Users</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">
          System Status:{' '}
          <span className="text-green-600 font-medium">Operational</span>
        </p>
        <p className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>
    </section>
  );
}
