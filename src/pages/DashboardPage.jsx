// pages/DashboardPage.jsx - Enhanced with Firebase integration
import React from 'react';
import { useMedications } from '../context/MedicationContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsRow from '../components/dashboard/StatsRow';
import ManufacturerChart from '../components/dashboard/ManufacturerChart';
import MoodEnergyChart from '../components/dashboard/MoodEnergyChart';
import SideEffectsChart from '../components/dashboard/SideEffectsChart';
import QuickLogEntry from '../components/dashboard/QuickLogEntry';
import RecentActivity from '../components/dashboard/RecentActivity';
import useAuth from '../hooks/useAuth';

// Error boundary for dashboard components
function DashboardError({ error, retry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="text-red-500 text-2xl mr-3">⚠️</div>
        <h3 className="text-lg font-semibold text-red-900">Dashboard Error</h3>
      </div>
      <p className="text-red-800 mb-4">
        We're having trouble loading your dashboard. This might be a temporary
        issue.
      </p>
      <button
        onClick={retry}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

// Loading skeleton for dashboard
function DashboardSkeleton() {
  return (
    <div className="p-6 max-w-6xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-12 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Additional components skeleton */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-36 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Welcome message for new users
function WelcomeMessage({ user }) {
  return (
    <div className="bg-gradient-to-r from-[#1B59AE] to-[#48B4A2] text-white p-6 rounded-lg mb-8">
      <div className="flex items-center">
        <div className="text-4xl mr-4">👋</div>
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Welcome to RxLedger, {user?.displayName || 'there'}!
          </h2>
          <p className="text-blue-100 mb-4">
            Your secure medication tracking dashboard is ready. Start by adding
            your first medication.
          </p>
          <a
            href="#/medications"
            className="inline-flex items-center bg-white text-[#1B59AE] px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Add Your First Medication
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function EnhancedDashboard() {
  const { user } = useAuth();
  const { medications, loading, error } = useMedications();

  // Show loading skeleton while data loads
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <DashboardError error={error} retry={() => window.location.reload()} />
      </div>
    );
  }

  const hasNoMedications = !medications || medications.length === 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <DashboardHeader user={user} medications={medications} />

      {/* Show welcome message for new users */}
      {hasNoMedications && <WelcomeMessage user={user} />}

      {/* Stats Row - always show, even with empty data */}
      <StatsRow medications={medications} />

      {hasNoMedications ? (
        // Empty state with helpful suggestions
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No medications tracked yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start tracking your medications to see insights, trends, and manage
            your health more effectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#/medications"
              className="bg-[#1B59AE] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#48B4A2] transition-colors"
            >
              Add Medications
            </a>
            <a
              href="#/community"
              className="border border-[#1B59AE] text-[#1B59AE] px-6 py-3 rounded-lg font-medium hover:bg-[#1B59AE] hover:text-white transition-colors"
            >
              Explore Community
            </a>
          </div>
        </div>
      ) : (
        // Full dashboard with data
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ManufacturerChart medications={medications} />
            <MoodEnergyChart medications={medications} />
          </div>

          <SideEffectsChart medications={medications} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <QuickLogEntry medications={medications} />
            <RecentActivity medications={medications} />
          </div>
        </>
      )}

      {/* Footer info for dashboard */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>
          🔒 Your data is encrypted and secure • Last updated:{' '}
          {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}
