// components/settings/ThemeSettings.jsx - Dark mode toggle component
import React from 'react';
import { useTheme } from '../../hooks/useTheme';

export default function ThemeSettings() {
  const { isDarkMode, toggleDarkMode, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-border transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
            Theme Preferences
          </h3>
          <p className="text-gray-600 dark:text-dark-text-secondary text-sm mt-1">
            Customize the appearance of RxLedger to match your preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{isDarkMode ? '🌙' : '☀️'}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-lg">
                {isDarkMode ? '🌙' : '☀️'}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-dark-text">
                Dark Mode
              </h4>
              <p className="text-xs text-gray-600 dark:text-dark-text-secondary">
                {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1B59AE] focus:ring-offset-2 ${
              isDarkMode ? 'bg-[#1B59AE]' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={isDarkMode}
            aria-labelledby="dark-mode-label"
          >
            <span className="sr-only">Toggle dark mode</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isDarkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Theme Preview */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-dark-border">
          <h4 className="text-sm font-medium text-gray-900 dark:text-dark-text mb-3">
            Theme Preview
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {/* Light Theme Preview */}
            <div
              className={`p-3 rounded-lg border-2 transition-colors ${
                !isDarkMode
                  ? 'border-[#1B59AE] bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Light</span>
                <span className="text-sm">☀️</span>
              </div>
              <div className="bg-white p-2 rounded border">
                <div className="h-2 bg-gray-200 rounded mb-1"></div>
                <div className="h-2 bg-gray-100 rounded w-3/4"></div>
              </div>
            </div>

            {/* Dark Theme Preview */}
            <div
              className={`p-3 rounded-lg border-2 transition-colors ${
                isDarkMode
                  ? 'border-[#1B59AE] bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700 dark:text-dark-text">
                  Dark
                </span>
                <span className="text-sm">🌙</span>
              </div>
              <div className="bg-slate-800 p-2 rounded border border-slate-700">
                <div className="h-2 bg-slate-600 rounded mb-1"></div>
                <div className="h-2 bg-slate-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Benefits */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Theme Benefits
          </h4>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              {isDarkMode
                ? 'Reduced eye strain in low light'
                : 'Better visibility in bright environments'}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              {isDarkMode
                ? 'Improved battery life on OLED displays'
                : 'Enhanced readability during daytime'}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              Automatic preference saving across sessions
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
