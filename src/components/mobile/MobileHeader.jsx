// components/mobile/MobileHeader.jsx - Mobile-optimized header
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { PlusIcon, BellIcon, UserIcon } from '@heroicons/react/24/outline';
import logoIcon from '../../assets/branding/logo-512-tight-crop.png';

const MobileHeader = () => {
  const location = useLocation();
  const { isDarkMode: _isDarkMode } = useTheme();

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/log': 'Log Entry',
      '/medications': 'Medications',
      '/trends': 'Trends',
      '/community': 'Community',
      '/settings': 'Settings',
      '/admin': 'Admin',
    };
    return titles[path] || 'RxLedger';
  };

  return (
    <header className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border sticky top-0 z-40 lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo and Title */}
        <div className="flex items-center">
          <img src={logoIcon} alt="RxLedger" className="h-8 w-8 mr-2" />
          <h1 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
            {getPageTitle()}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-card focus:outline-none focus:ring-2 focus:ring-blue-500">
            <BellIcon className="h-6 w-6" />
          </button>

          {/* Quick Log Entry */}
          {location.pathname !== '/log' && (
            <Link
              to="/log"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Log
            </Link>
          )}

          {/* Profile */}
          <Link
            to="/settings"
            className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-card focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <UserIcon className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
