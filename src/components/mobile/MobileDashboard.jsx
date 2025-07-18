// components/mobile/MobileDashboard.jsx - Mobile-optimized dashboard
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useMedications } from '../../context/useMedications';
import {
  PlusIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const MobileDashboard = () => {
  const { isDarkMode: _isDarkMode } = useTheme();
  const { medications, stats } = useMedications();

  const quickActions = [
    {
      name: 'Log Entry',
      href: '/log',
      icon: PlusIcon,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      description: 'Track medication',
    },
    {
      name: 'Medications',
      href: '/medications',
      icon: ClipboardDocumentListIcon,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      description: 'Manage meds',
    },
    {
      name: 'Trends',
      href: '/trends',
      icon: ChartBarIcon,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      description: 'View progress',
    },
    {
      name: 'Community',
      href: '/community',
      icon: UserGroupIcon,
      color: 'bg-cyan-500',
      hoverColor: 'hover:bg-cyan-600',
      description: 'Share insights',
    },
  ];

  const statsCards = [
    {
      title: 'Total Medications',
      value: stats?.total || 0,
      icon: ClipboardDocumentListIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Taken Today',
      value: stats?.takenToday || 0,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Adherence Rate',
      value: `${stats?.adherenceRate || 0}%`,
      icon: ChartBarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'With Reminders',
      value: stats?.withReminders || 0,
      icon: ExclamationTriangleIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="pb-20 lg:pb-0">
      {' '}
      {/* Add padding for mobile bottom nav */}
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 m-4 rounded-xl">
        <h2 className="text-xl font-bold mb-2">Welcome back!</h2>
        <p className="text-blue-100">
          {stats?.takenToday || 0} of {stats?.total || 0} medications taken
          today
        </p>
      </div>
      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className={`${action.color} ${action.hoverColor} text-white p-4 rounded-xl shadow-sm transition-all duration-200 transform hover:scale-105`}
            >
              <action.icon className="h-6 w-6 mb-2" />
              <h4 className="font-medium">{action.name}</h4>
              <p className="text-sm opacity-90">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
      {/* Stats Cards */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-3">
          Today&apos;s Overview
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {statsCards.map((stat) => (
            <div
              key={stat.title}
              className={`${stat.bgColor} p-4 rounded-xl border border-gray-200 dark:border-dark-border`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Medications */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
            Recent Medications
          </h3>
          <Link
            to="/medications"
            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {medications.slice(0, 3).map((med) => (
            <div
              key={med.id}
              className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-dark-text">
                    {med.commonName || med.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                    {med.dosage} • {med.frequency}
                  </p>
                </div>
                <div className="flex items-center">
                  {med.takenToday ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {medications.length === 0 && (
            <div className="text-center py-8">
              <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-dark-text-secondary">
                No medications added yet
              </p>
              <Link
                to="/medications"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Add your first medication
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
