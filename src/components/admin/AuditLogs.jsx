import { useState, useEffect } from 'react';

export default function AuditLogs({ adminLevel }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would load from an audit log collection
      // For demo, we'll generate some sample logs
      const demoLogs = [
        {
          id: '1',
          action: 'user_search',
          adminId: 'admin123',
          adminEmail: 'admin@rxledger.com',
          details: 'Searched for user by email',
          timestamp: new Date(),
          ipAddress: '192.168.1.100',
          severity: 'info',
        },
        {
          id: '2',
          action: 'report_reviewed',
          adminId: 'admin123',
          adminEmail: 'admin@rxledger.com',
          details: 'Approved community report #456',
          timestamp: new Date(Date.now() - 3600000),
          ipAddress: '192.168.1.100',
          severity: 'info',
        },
        {
          id: '3',
          action: 'metrics_accessed',
          adminId: 'admin456',
          adminEmail: 'superadmin@rxledger.com',
          details: 'Accessed user metrics dashboard',
          timestamp: new Date(Date.now() - 7200000),
          ipAddress: '192.168.1.101',
          severity: 'info',
        },
        {
          id: '4',
          action: 'failed_login',
          adminId: 'unknown',
          adminEmail: 'suspicious@email.com',
          details: 'Failed admin login attempt',
          timestamp: new Date(Date.now() - 86400000),
          ipAddress: '10.0.0.1',
          severity: 'warning',
        },
      ];

      setLogs(demoLogs);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.severity === filter;
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#1B59AE]">Audit Logs</h2>
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
          >
            <option value="all">All Logs</option>
            <option value="info">Info</option>
            <option value="warning">Warnings</option>
            <option value="error">Errors</option>
          </select>
          <button
            onClick={loadAuditLogs}
            className="bg-[#1B59AE] text-white px-3 py-1 rounded text-sm hover:bg-[#48B4A2] transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-50 p-4 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`p-4 rounded-lg border ${getSeverityColor(log.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {log.action.replace('_', ' ').toUpperCase()}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${getSeverityColor(log.severity)}`}
                    >
                      {log.severity}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{log.details}</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>
                      Admin: {log.adminEmail} (ID: {log.adminId})
                    </p>
                    <p>IP: {log.ipAddress}</p>
                    <p>Time: {log.timestamp.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No audit logs found for selected filter
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          📝 All admin actions are automatically logged. Logs are retained for
          compliance and security auditing.
        </p>
      </div>
    </section>
  );
}
