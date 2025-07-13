import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getDocs(collection(db, 'users')).then((snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(list);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Display Name</th>
            <th className="px-4 py-2 border">Last Login</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2">{u.displayName}</td>
              <td className="border px-4 py-2">{u.lastLogin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
