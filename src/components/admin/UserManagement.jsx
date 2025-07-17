// components/admin/UserManagement.jsx - Using your existing secure implementation
import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    if (adminLevel !== 'super' && adminLevel !== 'dev') return;

    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('profile.joinedAt', 'desc'), limit(50));
      const snapshot = await getDocs(q);

      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Never expose encrypted data in admin panel
        encryptedData: '[ENCRYPTED]',
      }));

      setUsers(usersList);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profile?.displayName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.id.includes(searchTerm),
  );

  if (adminLevel !== 'super' && adminLevel !== 'dev') {
    return (
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
          User Management
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">
            Insufficient permissions to view user data
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-xl font-semibold text-[#1B59AE] mb-4">
        User Management
      </h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search users by email or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
        />
        <button
          onClick={loadUsers}
          className="bg-[#1B59AE] text-white px-4 py-2 rounded-lg hover:bg-[#48B4A2] transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-50 p-4 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredUsers.slice(0, 10).map((user) => (
            <div
              key={user.id}
              className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="font-medium">
                  {user.profile?.displayName || 'No name'}
                </p>
                <p className="text-sm text-gray-600">{user.profile?.email}</p>
                <p className="text-xs text-gray-500">ID: {user.id}</p>
                <p className="text-xs text-gray-500">
                  Joined:{' '}
                  {user.profile?.joinedAt?.toDate
                    ? user.profile.joinedAt.toDate().toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <p className="text-gray-500 text-center py-4">No users found</p>
          )}

          {filteredUsers.length > 10 && (
            <p className="text-sm text-gray-500 text-center">
              Showing first 10 of {filteredUsers.length} results
            </p>
          )}
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">User Details</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong>{' '}
                {selectedUser.profile?.displayName || 'Not set'}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.profile?.email}
              </p>
              <p>
                <strong>User ID:</strong> {selectedUser.id}
              </p>
              <p>
                <strong>Age:</strong>{' '}
                {selectedUser.profile?.age || 'Not provided'}
              </p>
              <p>
                <strong>Timezone:</strong>{' '}
                {selectedUser.profile?.timezone || 'Not set'}
              </p>
              <p>
                <strong>Joined:</strong>{' '}
                {selectedUser.profile?.joinedAt?.toDate
                  ? selectedUser.profile.joinedAt.toDate().toLocaleDateString()
                  : 'Unknown'}
              </p>
              <p>
                <strong>Last Login:</strong>{' '}
                {selectedUser.profile?.lastLoginAt?.toDate
                  ? selectedUser.profile.lastLoginAt
                      .toDate()
                      .toLocaleDateString()
                  : 'Unknown'}
              </p>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
