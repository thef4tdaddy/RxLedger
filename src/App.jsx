import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import MedicationsPage from './pages/MedicationsPage';
import LogEntryPage from './pages/LogEntryPage';
import TrendsPage from './pages/TrendsPage';
import CommunityPage from './pages/CommunityPage';
import AccountPage from './pages/AccountPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased">
      <BrowserRouter>
        <nav className="bg-gray-100 p-4 flex gap-4">
          <Link
            to="/"
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            Dashboard
          </Link>
          <Link
            to="/medications"
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            Medications
          </Link>
          <Link
            to="/log"
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            Log Entry
          </Link>
          <Link
            to="/trends"
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            Trends
          </Link>
          <Link
            to="/community"
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            Community
          </Link>
          <Link
            to="/account"
            className="font-medium text-gray-700 hover:text-blue-600"
          >
            Account
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/medications" element={<MedicationsPage />} />
          <Route path="/log" element={<LogEntryPage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
