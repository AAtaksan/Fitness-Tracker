import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
}) => {
  const { theme, isDark } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.neutral[isDark ? 700 : 300];
    
    switch (variant) {
      case 'primary':
        return theme.colors.primary[500];
      case 'secondary':
        return theme.colors.secondary[500];
      case 'outline':
        return 'transparent';
      case 'danger':
        return theme.colors.error[500];
      default:
        return theme.colors.primary[500];
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.neutral[isDark ? 400 : 500];

    if (variant === 'outline') {
      return theme.colors.primary[isDark ? 300 : 600];
    }
    
    return variant === 'outline' ? theme.colors.neutral[isDark ? 100 : 900] : theme.colors.neutral[100];
  };

  const getBorderColor = () => {
    if (disabled) return theme.colors.neutral[isDark ? 700 : 300];
    
    if (variant === 'outline') {
      return theme.colors.primary[isDark ? 300 : 600];
    }
    
    return 'transparent';
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return styles.buttonSmall;
      case 'medium':
        return styles.buttonMedium;
      case 'large':
        return styles.buttonLarge;
      default:
        return styles.buttonMedium;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return styles.textSmall;
      case 'medium':
        return styles.textMedium;
      case 'large':
        return styles.textLarge;
      default:
        return styles.textMedium;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonSize(),
        { backgroundColor: getBackgroundColor(), borderColor: getBorderColor() },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[getTextSize(), { color: getTextColor() }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonMedium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  textSmall: {
    fontSize: 12,
    fontWeight: '500',
  },
  textMedium: {
    fontSize: 14,
    fontWeight: '600',
  },
  textLarge: {
    fontSize: 16,
    fontWeight: '600',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.7,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
});