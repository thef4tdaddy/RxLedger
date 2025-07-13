import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { createUserProfile } from '../utils/user';
import Turnstile from './Turnstile';
import { verifyTurnstile } from '../utils/turnstile';

export default function RegisterForm({ onLogin }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!captcha) {
        setError('Please complete the captcha');
        return;
      }
      const captchaRes = await verifyTurnstile(captcha);
      if (!captchaRes.success) {
        setError('Captcha verification failed');
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await createUserProfile(userCredential.user.uid, {
        name,
        age,
        email,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    try {
      if (!captcha) {
        setError('Please complete the captcha');
        return;
      }
      const captchaRes = await verifyTurnstile(captcha);
      if (!captchaRes.success) {
        setError('Captcha verification failed');
        return;
      }
      const cred = await signInWithPopup(auth, googleProvider);
      await createUserProfile(cred.user.uid, {
        name: cred.user.displayName || '',
        age: '',
        email: cred.user.email || '',
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <form onSubmit={handleRegister} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          className="border p-2 rounded"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Turnstile onSuccess={setCaptcha} />
        {error && <p className="text-red-500">{error}</p>}
        <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Create Account
        </button>
      </form>
      <button
        onClick={handleGoogleRegister}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Sign up with Google
      </button>
      <p className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onLogin}
          className="text-blue-600 underline"
        >
          Log in
        </button>
      </p>
    </div>
  );
}
