import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  showPercentage?: boolean;
  color?: string;
  trackColor?: string;
  duration?: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 10,
  showPercentage = false,
  color,
  trackColor,
  duration = 800,
  label,
}) => {
  const { theme, isDark } = useTheme();
  const animatedProgress = useSharedValue(0);

  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  useEffect(() => {
    animatedProgress.value = withTiming(clampedProgress / 100, {
      duration,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, [clampedProgress, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value * 100}%`,
    };
  });

  const progressColor = color || theme.colors.primary[500];
  const progressTrackColor = trackColor || theme.colors.neutral[isDark ? 700 : 200];

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: theme.colors.neutral[isDark ? 300 : 700] }]}>
            {label}
          </Text>
          {showPercentage && (
            <Text style={[styles.percentage, { color: theme.colors.neutral[isDark ? 300 : 700] }]}>
              {clampedProgress}%
            </Text>
          )}
        </View>
      )}
      <View style={[styles.track, { backgroundColor: progressTrackColor, height }]}>
        <Animated.View
          style={[
            styles.progress,
            { backgroundColor: progressColor, height },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  track: {
    width: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 6,
  },
});