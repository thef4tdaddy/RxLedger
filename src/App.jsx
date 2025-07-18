// App.jsx - Complete integration with Firebase and medication system
import { HashRouter, Routes, Route } from 'react-router-dom';
import { MedicationProvider } from './context/MedicationContext';
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
import { Footer } from './components/shared/Footer';
import MobileNavigation from './components/mobile/MobileNavigation';
import PrivacyPolicy from './components/shared/PrivacyPolicy';
import { TermsOfService } from './components/shared/TOS';
import { useAuth } from './context/useAuth';

// Loading component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#A3B5AC] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B59AE] mx-auto"></div>
        <p className="mt-4 text-gray-700 font-medium">Loading RxLedger...</p>
        <p className="text-sm text-gray-600 mt-2">
          Initializing secure medication tracking
        </p>
      </div>
    </div>
  );
}

// Error boundary component
function ErrorBoundary({ children }) {
  try {
    return children;
  } catch (error) {
    console.error('App Error:', error);
    return (
      <div className="min-h-screen bg-[#A3B5AC] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            We&apos;re having trouble loading the app. Please refresh the page
            and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#1B59AE] text-white px-4 py-2 rounded-lg hover:bg-[#48B4A2] transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
}

// Authenticated app content
function AuthenticatedApp({ user }) {
  return (
    <MedicationProvider>
      <div className="lg:flex lg:min-h-screen">
        {/* Desktop Header */}
        <div className="hidden lg:block">
          <Header user={user} />
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation />

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:ml-0">
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
            {/* Catch-all route for authenticated users */}
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </MedicationProvider>
  );
}

// Unauthenticated app content
function UnauthenticatedApp() {
  return (
    <>
      <Routes>
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        {/* All other routes redirect to login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  const { user, initializing } = useAuth();

  // Show loading screen while determining auth state
  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#A3B5AC] text-gray-800 font-sans antialiased">
        <HashRouter>
          {user ? <AuthenticatedApp user={user} /> : <UnauthenticatedApp />}
        </HashRouter>
      </div>
    </ErrorBoundary>
  );
}
