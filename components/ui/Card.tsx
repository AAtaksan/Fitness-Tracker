import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'elevated',
  padding = 'medium',
}) => {
  const { theme, isDark } = useTheme();

  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.neutral[isDark ? 800 : 50],
          shadowColor: isDark ? theme.colors.neutral[900] : theme.colors.neutral[900],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.4 : 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.neutral[isDark ? 700 : 300],
        };
      case 'filled':
        return {
          backgroundColor: theme.colors.neutral[isDark ? 700 : 100],
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: theme.colors.neutral[isDark ? 800 : 50],
          shadowColor: isDark ? theme.colors.neutral[900] : theme.colors.neutral[900],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.4 : 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 0,
        };
    }
  };

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return 8;
      case 'medium':
        return 16;
      case 'large':
        return 24;
      default:
        return 16;
    }
  };

  return (
    <View
      style={[
        styles.card,
        { padding: getPadding(), borderRadius: theme.borderRadius.medium },
        getCardStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    overflow: 'hidden',
  },
});