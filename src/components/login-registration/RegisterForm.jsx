// components/RegisterForm.jsx - Enhanced with medication system integration
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../../utils/firebase';
import { encryptionService } from '../../services/encryptionService';
import Turnstile from './Turnstile';
import { verifyTurnstile } from '../../utils/turnstile';

export default function RegisterForm({ onLogin }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Enhanced user profile creation with medication system setup
  const createUserProfile = async (userId, userEmail, profileData) => {
    try {
      // Create user profile document
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        profile: {
          email: userEmail,
          displayName: profileData.name,
          age: profileData.age ? parseInt(profileData.age) : null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          joinedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        },
        communitySettings: {
          allowAnonymousSharing: false, // Default to private
          shareAgeRange: true,
          shareConditionType: false,
          sharedExperiences: [],
        },
        // Initialize encryption key for this user
        encryptionVersion: '1.0',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Test encryption setup (ensure it works for this user)
      const testKey = encryptionService.generateUserKey(userId, userEmail);
      const testData = { test: 'encryption_working' };
      const encrypted = encryptionService.encryptMedicalData(testData, testKey);
      const decrypted = encryptionService.decryptMedicalData(
        encrypted,
        testKey,
      );

      if (decrypted.test !== 'encryption_working') {
        throw new Error('Encryption setup failed');
      }

      console.log('✅ User profile and encryption setup completed');
      return true;
    } catch (error) {
      console.error('❌ Error creating user profile:', error);
      throw error;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!name.trim()) {
        setError('Name is required');
        return;
      }
      if (!email.trim()) {
        setError('Email is required');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (!captcha) {
        setError('Please complete the captcha');
        return;
      }

      // Verify captcha
      const captchaRes = await verifyTurnstile(captcha);
      if (!captchaRes.success) {
        setError('Captcha verification failed');
        return;
      }

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Update display name in Auth
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Create user profile with medication system setup
      await createUserProfile(userCredential.user.uid, email, {
        name,
        age,
        email,
      });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);

      // User-friendly error messages
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setLoading(true);

    try {
      if (!captcha) {
        setError('Please complete the captcha');
        return;
      }

      // Verify captcha
      const captchaRes = await verifyTurnstile(captcha);
      if (!captchaRes.success) {
        setError('Captcha verification failed');
        return;
      }

      // Sign in with Google
      const cred = await signInWithPopup(auth, googleProvider);

      // Create user profile with medication system setup
      await createUserProfile(cred.user.uid, cred.user.email, {
        name: cred.user.displayName || '',
        age: '', // Google doesn't provide age
        email: cred.user.email || '',
      });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Google registration error:', err);

      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-up cancelled');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email');
      } else {
        setError(err.message || 'Google sign-up failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#1B59AE]">Create Account</h2>
        <p className="text-gray-600 mt-2">
          Join RxLedger for secure medication tracking
        </p>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age (Optional)
          </label>
          <input
            type="number"
            placeholder="Your age"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="1"
            max="120"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
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
            Password *
          </label>
          <input
            type="password"
            placeholder="Create a strong password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1B59AE] focus:border-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
        </div>

        <div>
          <Turnstile onSuccess={setCaptcha} />
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
          {loading ? 'Creating Account...' : 'Create Account'}
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
          onClick={handleGoogleRegister}
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
          {loading ? 'Signing up...' : 'Sign up with Google'}
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onLogin}
          className="text-[#1B59AE] font-medium hover:underline"
          disabled={loading}
        >
          Sign in here
        </button>
      </p>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>
          By creating an account, you agree to our Terms of Service and Privacy
          Policy.
        </p>
        <p className="mt-1">🔒 All medical data is encrypted and secure.</p>
      </div>
    </div>
  );
}
