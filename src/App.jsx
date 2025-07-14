import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import MedicationsPage from './pages/MedicationsPage';
import LogEntryPage from './pages/LogEntryPage';
import TrendsPage from './pages/TrendsPage';
import CommunityPage from './pages/CommunityPage';
import AccountPage from './pages/AccountPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import PrivacyPolicy from './components/shared/PrivacyPolicy';
import TermsOfService from './components/shared/TOS';

export default function App() {
  return (
    <div className="min-h-screen bg-[#A3B5AC] text-gray-800 font-sans antialiased">
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/medications" element={<MedicationsPage />} />
          <Route path="/log" element={<LogEntryPage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
