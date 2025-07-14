import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (import.meta.env.VITE_AUTH_BYPASS === 'true') {
      // Provide a dummy user object when bypassing auth
      setUser({ uid: 'bypass-user' });
      setInitializing(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  return { user, initializing };
}
