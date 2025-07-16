// pages/AdminPage.jsx - Enhanced with components and Firebase integration
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import useAuth from '../hooks/useAuth';
import AdminMetrics from '../components/admin/AdminMetrics';
import UserManagement from '../components/admin/UserManagement';
import ContentModeration from '../components/admin/ContentModeration';
import SystemMonitoring from '../components/admin/SystemMonitoring';
import DataPrivacy from '../components/admin/DataPrivacy';
import AuditLogs from '../components/admin/AuditLogs';

export default function AdminPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminLevel, setAdminLevel] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      checkAdminAccess();
    }
  }, [user]);

  const checkAdminAccess = async () => {
    try {
      // Check if user has admin privileges
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const adminRole = userData.adminRole || null;

        // In a real implementation, you'd have proper role checking
        // For now, we'll allow access if they have an adminRole field
        setIsAdmin(!!adminRole);
        setAdminLevel(adminRole);
      } else {
        // For development, allow admin access for certain emails
        const devAdminEmails = ['admin@rxledger.com', 'dev@rxledger.com'];
        setIsAdmin(devAdminEmails.includes(user.email));
        setAdminLevel('dev');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-900 mb-2">
            Access Denied
          </h1>
          <p className="text-red-800 mb-4">
            You don't have permission to access the admin dashboard.
          </p>
          <a
            href="#/dashboard"
            className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1B59AE]">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            System administration and monitoring
            {adminLevel && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {adminLevel.toUpperCase()}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#1B59AE] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#48B4A2] transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Admin Metrics */}
      <AdminMetrics adminLevel={adminLevel} />

      {/* User Management */}
      <UserManagement adminLevel={adminLevel} />

      {/* Content Moderation */}
      <ContentModeration adminLevel={adminLevel} />

      {/* System Monitoring */}
      <SystemMonitoring adminLevel={adminLevel} />

      {/* Data & Privacy */}
      <DataPrivacy adminLevel={adminLevel} />

      {/* Audit Logs */}
      <AuditLogs adminLevel={adminLevel} />

      {/* Footer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-yellow-600 text-xl">⚠️</div>
          <div>
            <h3 className="font-medium text-yellow-900 mb-1">
              Admin Responsibilities
            </h3>
            <ul className="text-yellow-800 text-sm space-y-1">
              <li>• All admin actions are logged and auditable</li>
              <li>• User privacy must be maintained at all times</li>
              <li>• Only access data necessary for administration</li>
              <li>• Report security concerns immediately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
