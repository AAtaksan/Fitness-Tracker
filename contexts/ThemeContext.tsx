import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeColors {
  primary: Record<number, string>;
  secondary: Record<number, string>;
  accent: Record<number, string>;
  success: Record<number, string>;
  error: Record<number, string>;
  warning: Record<number, string>;
  info: Record<number, string>;
  neutral: Record<number, string>;
}

interface ThemeContextType {
  theme: {
    colors: ThemeColors;
    borderRadius: {
      small: number;
      medium: number;
      large: number;
      full: number;
    };
  };
  isDark: boolean;
  themeType: ThemeType;
  setThemeType: (type: ThemeType) => void;
}

const lightColors: ThemeColors = {
  primary: {
    50: '#e6f0ff',
    100: '#cce1ff',
    200: '#99c3ff',
    300: '#66a4ff',
    400: '#3386ff',
    500: '#3B82F6', // Main primary blue
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#e7f8f8',
    100: '#d0f1f1',
    200: '#a0e3e3',
    300: '#71d5d5',
    400: '#41c7c7',
    500: '#10B981', // Main green
    600: '#0e9f73',
    700: '#0c8565',
    800: '#0a6c57',
    900: '#085249',
  },
  accent: {
    50: '#fff1e6',
    100: '#ffe3cc',
    200: '#ffc799',
    300: '#ffab66',
    400: '#ff8f33',
    500: '#F97316', // Main orange
    600: '#e65c00',
    700: '#cc5200',
    800: '#b34700',
    900: '#993d00',
  },
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

const darkColors: ThemeColors = {
  primary: {
    50: '#1e3a8a',
    100: '#1e40af',
    200: '#1d4ed8',
    300: '#2563eb',
    400: '#3b82f6',
    500: '#3B82F6', // Main primary blue
    600: '#60a5fa',
    700: '#93c5fd',
    800: '#bfdbfe',
    900: '#dbeafe',
  },
  secondary: {
    50: '#085249',
    100: '#0a6c57',
    200: '#0c8565',
    300: '#0e9f73',
    400: '#10B981',
    500: '#10B981', // Main green
    600: '#41c7c7',
    700: '#71d5d5',
    800: '#a0e3e3',
    900: '#d0f1f1',
  },
  accent: {
    50: '#993d00',
    100: '#b34700',
    200: '#cc5200',
    300: '#e65c00',
    400: '#f97316',
    500: '#F97316', // Main orange
    600: '#ff8f33',
    700: '#ffab66',
    800: '#ffc799',
    900: '#ffe3cc',
  },
  success: {
    50: '#064e3b',
    100: '#065f46',
    200: '#047857',
    300: '#059669',
    400: '#10b981',
    500: '#10b981',
    600: '#34d399',
    700: '#6ee7b7',
    800: '#a7f3d0',
    900: '#d1fae5',
  },
  error: {
    50: '#7f1d1d',
    100: '#991b1b',
    200: '#b91c1c',
    300: '#dc2626',
    400: '#ef4444',
    500: '#ef4444',
    600: '#f87171',
    700: '#fca5a5',
    800: '#fecaca',
    900: '#fee2e2',
  },
  warning: {
    50: '#78350f',
    100: '#92400e',
    200: '#b45309',
    300: '#d97706',
    400: '#f59e0b',
    500: '#f59e0b',
    600: '#fbbf24',
    700: '#fcd34d',
    800: '#fde68a',
    900: '#fef3c7',
  },
  info: {
    50: '#1e3a8a',
    100: '#1e40af',
    200: '#1d4ed8',
    300: '#2563eb',
    400: '#3b82f6',
    500: '#3b82f6',
    600: '#60a5fa',
    700: '#93c5fd',
    800: '#bfdbfe',
    900: '#dbeafe',
  },
  neutral: {
    50: '#111827',
    100: '#1f2937',
    200: '#374151',
    300: '#4b5563',
    400: '#6b7280',
    500: '#9ca3af',
    600: '#d1d5db',
    700: '#1a1a1a',
    800: '#e5e7eb',
    900: '#f3f4f6',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('system');
  
  const isDark = themeType === 'system' 
    ? systemColorScheme === 'dark'
    : themeType === 'dark';
  
  const theme = {
    colors: isDark ? darkColors : lightColors,
    borderRadius: {
      small: 4,
      medium: 8,
      large: 16,
      full: 9999,
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, themeType, setThemeType }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};