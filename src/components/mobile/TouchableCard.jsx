// components/mobile/TouchableCard.jsx - Touch-friendly card component
import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

const TouchableCard = ({
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'default', // 'default', 'elevated', 'outlined'
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const { isDarkMode: _isDarkMode } = useTheme();

  const baseClasses =
    'relative transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';

  const variantClasses = {
    default:
      'bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg shadow-sm hover:shadow-md',
    elevated:
      'bg-white dark:bg-dark-surface rounded-xl shadow-md hover:shadow-lg',
    outlined:
      'bg-transparent border-2 border-gray-300 dark:border-dark-border rounded-lg hover:border-gray-400 dark:hover:border-gray-500',
  };

  const pressedClasses = isPressed ? 'scale-95' : 'scale-100';
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer hover:scale-105';

  const handleTouchStart = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleTouchEnd = () => {
    if (!disabled) {
      setIsPressed(false);
    }
  };

  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${pressedClasses} ${disabledClasses} ${className}`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : -1}
      onKeyPress={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled) {
          e.preventDefault();
          onClick(e);
        }
      }}
    >
      {children}
    </div>
  );
};

export default TouchableCard;
