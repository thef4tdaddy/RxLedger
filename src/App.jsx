import { HashRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import MedicationsPage from './pages/MedicationsPage';
import LogEntryPage from './pages/LogEntryPage';
import TrendsPage from './pages/TrendsPage';
import CommunityPage from './pages/CommunityPage';
import AccountPage from './pages/AccountPage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import PrivacyPolicy from './components/shared/PrivacyPolicy';
import TermsOfService from './components/shared/TOS';
import useAuth from './hooks/useAuth';

export default function App() {
  const { user, initializing } = useAuth();

  if (initializing) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#A3B5AC] text-gray-800 font-sans antialiased">
      <HashRouter>
        <Header />

        {user ? (
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/medications" element={<MedicationsPage />} />
            <Route path="/log" element={<LogEntryPage />} />
            <Route path="/trends" element={<TrendsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="*" element={<LoginPage />} />
          </Routes>
        )}

        <Footer />
      </HashRouter>
    </div>
  );
}
