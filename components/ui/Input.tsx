import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  onBlur?: () => void;
  autoComplete?: 'off' | 'email' | 'password' | 'name' | 'username';
  autoCorrect?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  rightIcon,
  disabled = false,
  onBlur,
  autoComplete = 'off',
  autoCorrect = false,
}) => {
  const { theme, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.neutral[isDark ? 300 : 700] }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isFocused
              ? theme.colors.primary[500]
              : error
              ? theme.colors.error[500]
              : theme.colors.neutral[isDark ? 600 : 300],
            backgroundColor: theme.colors.neutral[isDark ? 800 : 50],
          },
          disabled && { opacity: 0.6 },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.neutral[isDark ? 200 : 900],
              height: multiline ? numberOfLines * 24 : undefined,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.neutral[isDark ? 500 : 400]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          autoComplete={Platform.OS === 'web' ? autoComplete : undefined}
          autoCorrect={autoCorrect}
        />
        {secureTextEntry ? (
          <TouchableOpacity onPress={toggleShowPassword} style={styles.iconContainer}>
            {showPassword ? (
              <EyeOff size={20} color={theme.colors.neutral[isDark ? 400 : 500]} />
            ) : (
              <Eye size={20} color={theme.colors.neutral[isDark ? 400 : 500]} />
            )}
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.iconContainer}>{rightIcon}</View>
        ) : null}
      </View>
      {error && <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  iconContainer: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});