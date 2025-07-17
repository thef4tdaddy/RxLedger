import { useState, useEffect } from 'react';

export function ContentModeration() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReports = async () => {
    try {
      setLoading(true);
      // In a real implementation, load from moderationQueue collection
      // For now, use demo data
      setReports([
        {
          id: '1',
          type: 'inappropriate_content',
          reason: 'Spam',
          reportedAt: new Date(),
          status: 'pending',
          reportedBy: 'user123',
        },
        {
          id: '2',
          type: 'false_information',
          reason: 'Medical misinformation',
          reportedAt: new Date(Date.now() - 86400000),
          status: 'pending',
          reportedBy: 'user456',
        },
      ]);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleReportAction = async (reportId, action) => {
    try {
      // Update report status
      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId
            ? { ...report, status: action, reviewedAt: new Date() }
            : report,
        ),
      );
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
        Content Moderation
      </h2>

      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600">
          Pending Reports:{' '}
          <span className="font-semibold text-orange-600">
            {reports.filter((r) => r.status === 'pending').length}
          </span>
        </p>
        <button
          onClick={loadReports}
          className="bg-[#1B59AE] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#48B4A2] transition-colors"
        >
          Refresh Reports
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse bg-gray-50 p-4 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {reports
            .filter((r) => r.status === 'pending')
            .map((report) => (
              <div
                key={report.id}
                className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {report.type.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Reason: {report.reason}
                    </p>
                    <p className="text-xs text-gray-500">
                      Reported {report.reportedAt.toLocaleDateString()} by{' '}
                      {report.reportedBy}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReportAction(report.id, 'approved')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReportAction(report.id, 'rejected')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {reports.filter((r) => r.status === 'pending').length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-gray-500">No pending reports</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
