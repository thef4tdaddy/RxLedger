# Dark Mode Implementation Guide

## Overview
RxLedger now supports a comprehensive dark mode system that automatically adapts to user preferences and provides a consistent experience across all components.

## Features
- **Automatic System Detection**: Detects user's system preference (light/dark)
- **Manual Toggle**: Easy-to-use toggle in Settings page
- **Persistent Storage**: Remembers user preference across sessions
- **Smooth Transitions**: Animated transitions between themes
- **Comprehensive Coverage**: All UI components support dark mode

## How to Use

### For Users
1. Go to **Settings** page
2. Find the **Theme Preferences** section
3. Toggle the **Dark Mode** switch
4. The setting is automatically saved and will persist across sessions

### For Developers

#### Using the Theme Hook
```jsx
import { useTheme } from '../hooks/useTheme';

function MyComponent() {
  const { isDarkMode, toggleDarkMode, isLoading } = useTheme();

  return (
    <div className="bg-white dark:bg-dark-surface">
      <button onClick={toggleDarkMode}>
        {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
      </button>
    </div>
  );
}
```

#### CSS Classes
The system uses Tailwind CSS with the following dark mode classes:

**Background Colors:**
- `dark:bg-dark-bg` - Main background
- `dark:bg-dark-surface` - Surface/card background
- `dark:bg-dark-card` - Card background

**Text Colors:**
- `dark:text-dark-text` - Primary text
- `dark:text-dark-text-secondary` - Secondary text

**Border Colors:**
- `dark:border-dark-border` - Border color

**Accent Colors:**
- `dark:text-dark-accent` - Accent color (links, buttons)

## Implementation Details

### File Structure
```
src/
├── context/
│   └── ThemeContext.jsx         # Theme provider
├── hooks/
│   └── useTheme.js              # Theme hook
├── components/
│   └── settings/
│       └── ThemeSettings.jsx    # Settings component
└── App.jsx                      # Main app with ThemeProvider
```

### Key Components

1. **ThemeProvider**: Wraps the entire app and manages theme state
2. **useTheme Hook**: Provides theme state and actions to components
3. **ThemeSettings**: User interface for theme preferences
4. **Tailwind Config**: Configured for class-based dark mode

### Color Palette
The dark mode uses a carefully selected color palette:
- Background: `#0f172a` (slate-900)
- Surface: `#1e293b` (slate-800)
- Card: `#334155` (slate-700)
- Border: `#475569` (slate-600)
- Text: `#f1f5f9` (slate-100)
- Secondary Text: `#cbd5e1` (slate-300)
- Accent: `#3b82f6` (blue-500)

## Benefits
- **Eye Strain Reduction**: Dark mode reduces eye strain in low-light conditions
- **Battery Life**: Improved battery life on OLED displays
- **Accessibility**: Better contrast options for users with light sensitivity
- **User Preference**: Respects system-wide dark mode preferences

## Future Enhancements
- Auto-scheduling (sunset/sunrise)
- Custom color themes
- High contrast mode
- Accessibility improvements