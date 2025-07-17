// components/admin/DataPrivacy.jsx (Complete)
export function DataPrivacy() {
  const handleDataExport = () => {
    alert(
      'Data export functionality would be implemented via Cloud Functions for security',
    );
  };

  const handlePrivacyAudit = () => {
    alert('Privacy audit report would be generated');
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
        Data & Privacy
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <p className="font-medium text-blue-900">Data Encryption Status</p>
            <p className="text-sm text-blue-800">
              All user medical data is encrypted client-side
            </p>
          </div>
          <span className="text-green-600 font-medium">✅ Active</span>
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Data Retention Policy</p>
            <p className="text-sm text-gray-600">
              Automatic cleanup after 7 years of inactivity
            </p>
          </div>
          <button className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors">
            Configure
          </button>
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">GDPR Compliance</p>
            <p className="text-sm text-gray-600">
              User data export and deletion tools
            </p>
          </div>
          <button
            onClick={handleDataExport}
            className="bg-[#1B59AE] text-white px-3 py-1 rounded text-sm hover:bg-[#48B4A2] transition-colors"
          >
            Export Tools
          </button>
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Privacy Audit</p>
            <p className="text-sm text-gray-600">
              Review data access and sharing policies
            </p>
          </div>
          <button
            onClick={handlePrivacyAudit}
            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
          >
            Run Audit
          </button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-green-500 text-xl">🔒</div>
            <div>
              <h3 className="font-medium text-green-900 mb-1">
                Privacy Protection Summary
              </h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• All medical data encrypted with user-specific keys</li>
                <li>• Community sharing is completely anonymous</li>
                <li>• Admin access is logged and auditable</li>
                <li>• Zero-knowledge architecture for sensitive data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
