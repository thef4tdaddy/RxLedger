// components/mobile/MobileNavigation.jsx - Mobile-optimized navigation
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import {
  HomeIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  PlusIcon as PlusIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid';

const MobileNavigation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isDarkMode: _isDarkMode } = useTheme();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Add Entry',
      href: '/log',
      icon: PlusIcon,
      iconSolid: PlusIconSolid,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Medications',
      href: '/medications',
      icon: ClipboardDocumentListIcon,
      iconSolid: ClipboardDocumentListIconSolid,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Trends',
      href: '/trends',
      icon: ChartBarIcon,
      iconSolid: ChartBarIconSolid,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      name: 'Community',
      href: '/community',
      icon: UserGroupIcon,
      iconSolid: UserGroupIconSolid,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Cog6ToothIcon,
      iconSolid: Cog6ToothIconSolid,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  const isActive = (href) =>
    location.pathname === href ||
    (href === '/dashboard' && location.pathname === '/');

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-card focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-dark-text">
              RxLedger
            </h1>
          </div>

          {/* Quick Action Button */}
          <Link
            to="/log"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Log
          </Link>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-dark-surface shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-dark-border">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
              Navigation
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-card"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = isActive(item.href) ? item.iconSolid : item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? `${item.color} ${item.bgColor} dark:bg-dark-card`
                        : 'text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-card'
                    }`}
                  >
                    <Icon className="mr-3 h-6 w-6" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border z-30">
        <div className="grid grid-cols-5 gap-1 px-2 py-1">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = isActive(item.href) ? item.iconSolid : item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                  isActive(item.href)
                    ? `${item.color} ${item.bgColor} dark:bg-dark-card`
                    : 'text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-card'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1 font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
