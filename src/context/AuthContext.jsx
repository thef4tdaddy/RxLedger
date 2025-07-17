//src/context/AuthContext.jsx
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  signInAnonymously,
} from 'firebase/auth';
import { auth, googleProvider } from '../utils/firebase';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Handle bypass mode with real Firebase anonymous authentication
    if (import.meta.env.VITE_AUTH_BYPASS === 'true') {
      const createBypassUser = async () => {
        try {
          console.log('🔄 Creating bypass user with anonymous auth...');

          // Sign in anonymously to get real Firebase auth context
          const userCredential = await signInAnonymously(auth);

          // Create consistent bypass user object
          const bypassUser = {
            uid: 'bypass-user', // Consistent ID for data storage
            email: 'bypass@example.com',
            displayName: 'Demo User',
            emailVerified: true,
            isAnonymous: true,
            // Keep the real Firebase user properties for auth context
            ...userCredential.user,
          };

          console.log('✅ Bypass user created successfully');
          setUser(bypassUser);
          setLoading(false);
          setInitializing(false);
        } catch (error) {
          console.error('❌ Bypass auth error:', error);

          // Fallback to fake user if anonymous auth fails
          setUser({
            uid: 'bypass-user',
            email: 'bypass@example.com',
            displayName: 'Demo User',
            emailVerified: true,
          });
          setLoading(false);
          setInitializing(false);
        }
      };

      createBypassUser();
      return; // Don't set up the auth state listener in bypass mode
    }

    // Regular Firebase auth state listener for non-bypass mode
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signup = async (email, password) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    setLoading(true);
    try {
      // In bypass mode, just reset to bypass user instead of signing out
      if (import.meta.env.VITE_AUTH_BYPASS === 'true') {
        setUser({
          uid: 'bypass-user',
          email: 'bypass@example.com',
          displayName: 'Demo User',
          emailVerified: true,
        });
      } else {
        await signOut(auth);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    initializing,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!initializing && children}
    </AuthContext.Provider>
  );
}
