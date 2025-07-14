import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function LoginPage() {
  const [mode, setMode] = useState('login');

  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        {mode === 'login' ? 'Login to RxLedger' : 'Create Your Account'}
      </h1>
      {mode === 'login' ? (
        <LoginForm onRegister={() => setMode('register')} />
      ) : (
        <RegisterForm onLogin={() => setMode('login')} />
      )}
    </div>
  );
}
