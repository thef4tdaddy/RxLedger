import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { updateUserInfo } from '../services/medicationService.js';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateUserInfo(userCredential.user);
      await sendEmailVerification(userCredential.user);
      alert('Verification email sent. Please check your inbox.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await updateUserInfo(cred.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <form onSubmit={handleRegister} className="flex flex-col gap-2">
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
    </div>
  );
}
