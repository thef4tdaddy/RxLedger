// components/LoginForm.jsx - Enhanced with medication system integration
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithRedirect,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider, db } from '../../utils/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginForm({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();

  // Update user's last login timestamp
  const updateLastLogin = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'profile.lastLoginAt': serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Could not update last login timestamp:', error);
      // Non-critical error, don't block login
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!email.trim()) {
        setError('Email is required');
        return;
      }
      if (!password) {
        setError('Password is required');
        return;
      }

      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Update last login timestamp
      await updateLastLogin(userCredential.user.uid);

      // Set persistence based on "Remember Me"
      if (rememberMe) {
        // Firebase Auth persistence is handled automatically
        localStorage.setItem('rxledger_remember', 'true');
      } else {
        localStorage.removeItem('rxledger_remember');
      }

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);

      // User-friendly error messages
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/user-disabled') {
        setError('This account has been disabled');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later');
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Sign in with Google - redirect will handle navigation
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      console.error('Google login error:', err);

      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups and try again');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError(
          'An account already exists with this email using a different sign-in method',
        );
      } else {
        setError('Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email.trim()) {
        setError('Please enter your email address');
        return;
      }

      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setError('');
    } catch (err) {
      console.error('Password reset error:', err);

      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="max-w-sm mx-auto p-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#1B59AE]">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            Enter your email address and we&apos;ll send you a reset link
          </p>
        </div>

        {resetEmailSent ? (
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
            <p className="text-green-800 text-sm">
              Password reset email sent! Check your inbox and follow the
              instructions.
            </p>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#1B59AE] text-white py-3 rounded-lg font-medium hover:bg-[#48B4A2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>
          </form>
        )}

        <button
          onClick={() => {
            setShowForgotPassword(false);
            setResetEmailSent(false);
            setError('');
          }}
          className="mt-4 w-full text-[#1B59AE] font-medium hover:underline"
          disabled={loading}
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#1B59AE]">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your RxLedger account</p>
      </div>

      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-[#1B59AE] focus:ring-[#1B59AE]"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-[#1B59AE] hover:underline"
            disabled={loading}
          >
            Forgot password?
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#1B59AE] text-white py-3 rounded-lg font-medium hover:bg-[#48B4A2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onRegister}
          className="text-[#1B59AE] font-medium hover:underline"
          disabled={loading}
        >
          Create one here
        </button>
      </p>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>🔒 Your data is encrypted and secure</p>
      </div>
    </div>
  );
}
