// components/mobile/MobileForm.jsx - Mobile-optimized form components
import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// Mobile-optimized input field
export const MobileInput = ({ label, error, className = '', ...props }) => {
  const { isDarkMode: _isDarkMode } = useTheme();

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full px-4 py-3 text-base border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-surface dark:text-dark-text ${
          error ? 'border-red-500' : ''
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

// Mobile-optimized select dropdown
export const MobileSelect = ({
  label,
  error,
  className = '',
  children,
  ...props
}) => {
  const { isDarkMode: _isDarkMode } = useTheme();

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`w-full px-4 py-3 text-base border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-surface dark:text-dark-text ${
          error ? 'border-red-500' : ''
        }`}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

// Mobile-optimized textarea
export const MobileTextarea = ({ label, error, className = '', ...props }) => {
  const { isDarkMode: _isDarkMode } = useTheme();

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`w-full px-4 py-3 text-base border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-surface dark:text-dark-text resize-none ${
          error ? 'border-red-500' : ''
        }`}
        rows={4}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

// Mobile-optimized button
export const MobileButton = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary:
      'bg-gray-200 dark:bg-dark-card hover:bg-gray-300 dark:hover:bg-dark-border text-gray-900 dark:text-dark-text focus:ring-gray-500',
    outline:
      'border-2 border-gray-300 dark:border-dark-border hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-dark-text focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-6 py-4 text-lg',
  };

  const widthClasses = fullWidth ? 'w-full' : '';
  const disabledClasses =
    disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${disabledClasses} ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

// Mobile-optimized checkbox
export const MobileCheckbox = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center">
        <input
          {...props}
          type="checkbox"
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-dark-border rounded dark:bg-dark-surface"
        />
        {label && (
          <label className="ml-3 text-sm text-gray-700 dark:text-dark-text">
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

// Mobile-optimized toggle switch
export const MobileToggle = ({ label, enabled, onChange, className = '' }) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {label && (
        <span className="text-sm text-gray-700 dark:text-dark-text">
          {label}
        </span>
      )}
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-dark-card'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
