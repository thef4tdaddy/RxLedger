// pages/LoginPage.jsx - Updated to use enhanced auth components
import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function LoginPage() {
  const [mode, setMode] = useState('login');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              {/* Add your RxLedger logo here if you have one */}
              <div className="w-12 h-12 bg-[#1B59AE] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Rx</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-gray-600 mt-2">
              {mode === 'login'
                ? 'Sign in to access your secure medication tracker'
                : 'Join RxLedger for secure medication tracking'}
            </p>
          </div>

          {mode === 'login' ? (
            <LoginForm onRegister={() => setMode('register')} />
          ) : (
            <RegisterForm onLogin={() => setMode('login')} />
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <p className="text-xs text-gray-500 text-center">
            🔒 Your medical data is encrypted and secure. We never sell or share
            your personal information.
          </p>
        </div>
      </div>
    </div>
  );
}
