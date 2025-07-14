import { demoAdminMetrics } from '../demo-data/admin/AdminMetrics';

export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-semibold">
            {demoAdminMetrics.totalUsers}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Active This Month</p>
          <p className="text-2xl font-semibold">
            {demoAdminMetrics.activeUsers}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Logs Recorded</p>
          <p className="text-2xl font-semibold">
            {demoAdminMetrics.logsRecorded}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Reports Reviewed</p>
          <p className="text-2xl font-semibold">
            {demoAdminMetrics.reportsReviewed}
          </p>
        </div>
      </div>

      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">User Management</h2>
        <input
          type="text"
          placeholder="Search users by email or ID"
          className="w-full border p-2 rounded mb-4"
        />
        <p className="text-sm text-gray-500">User list placeholder</p>
      </section>

      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Content Moderation</h2>
        <p>Pending Reports: {demoAdminMetrics.pendingReports}</p>
        <button className="text-blue-600 text-sm mt-2">View Reports</button>
      </section>

      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">System Monitoring</h2>
        <p className="text-sm text-gray-500">
          Placeholder for monitoring widgets
        </p>
      </section>

      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Data &amp; Privacy</h2>
        <p className="text-sm text-gray-500">
          Placeholder controls for data export and retention
        </p>
      </section>

      <section className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Audit Logs</h2>
        <p className="text-sm text-gray-500">Admin action log placeholder</p>
      </section>
    </div>
  );
}
