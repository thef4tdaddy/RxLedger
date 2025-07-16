import './utils/sentry';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/AuthContext';
import { MedicationProvider } from './context/MedicationContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <MedicationProvider>
        <App />
        <Analytics />
      </MedicationProvider>
    </AuthProvider>
  </StrictMode>,
);
