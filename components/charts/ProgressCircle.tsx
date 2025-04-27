import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressCircleProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  duration?: number;
  showPercentage?: boolean;
  label?: string;
  color?: string;
  trackColor?: string;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size = 120,
  strokeWidth = 10,
  duration = 1000,
  showPercentage = true,
  label,
  color,
  trackColor,
}) => {
  const { theme, isDark } = useTheme();
  const animatedProgress = useSharedValue(0);

  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    animatedProgress.value = withTiming(clampedProgress / 100, {
      duration,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, [clampedProgress, duration]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - animatedProgress.value);
    return {
      strokeDashoffset,
    };
  });

  const progressColor = color || theme.colors.primary[500];
  const progressTrackColor = trackColor || theme.colors.neutral[isDark ? 700 : 200];
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.neutral[isDark ? 300 : 700] }]}>
          {label}
        </Text>
      )}
      <View style={[styles.svgContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${centerX}, ${centerY}`}>
            {/* Background Circle */}
            <Circle
              cx={centerX}
              cy={centerY}
              r={radius}
              stroke={progressTrackColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress Circle */}
            <AnimatedCircle
              cx={centerX}
              cy={centerY}
              r={radius}
              stroke={progressColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animatedProps={animatedProps}
            />
          </G>
        </Svg>
        {showPercentage && (
          <View style={styles.percentageContainer}>
            <Text style={[styles.percentageText, { color: theme.colors.neutral[isDark ? 200 : 800] }]}>
              {clampedProgress}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  svgContainer: {
    position: 'relative',
  },
  percentageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: '700',
  },
});