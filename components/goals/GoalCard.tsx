import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useTheme } from '@/contexts/ThemeContext';
import { Trophy, CreditCard as Edit2 } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface GoalCardProps {
  goal: {
    id: string;
    title: string;
    target: number;
    current: number;
    unit: string;
    deadline?: Date;
    type: 'workout' | 'distance' | 'calories' | 'steps' | 'weight' | 'custom';
  };
  onPress: () => void;
  onEdit: () => void;
  showAnimation?: boolean;
}

export const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  onPress, 
  onEdit,
  showAnimation = false 
}) => {
  const { theme, isDark } = useTheme();
  const progress = Math.min(Math.round((goal.current / goal.target) * 100), 100);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (showAnimation) {
      scale.value = withSequence(
        withDelay(
          200,
          withSpring(1.05, { damping: 2 })
        ),
        withSpring(1)
      );
      
      rotation.value = withSequence(
        withDelay(
          200,
          withSpring(-5, { damping: 3 })
        ),
        withSpring(5, { damping: 3 }),
        withSpring(0)
      );
    }
  }, [showAnimation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ]
    };
  });

  const getGoalColor = (type: string) => {
    switch (type) {
      case 'workout':
        return theme.colors.primary[500];
      case 'distance':
        return theme.colors.secondary[500];
      case 'calories':
        return theme.colors.error[500];
      case 'steps':
        return theme.colors.info[500];
      case 'weight':
        return theme.colors.warning[500];
      default:
        return theme.colors.accent[500];
    }
  };

  const getGoalIcon = (type: string) => {
    return <Trophy size={20} color={getGoalColor(type)} />;
  };

  const isCompleted = progress >= 100;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <Card>
          <View style={styles.headerContainer}>
            <View style={styles.titleRow}>
              <View style={styles.iconContainer}>
                {getGoalIcon(goal.type)}
              </View>
              <Text style={[styles.title, { color: theme.colors.neutral[isDark ? 100 : 900] }]}>
                {goal.title}
              </Text>
            </View>
            <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <Edit2 size={16} color={theme.colors.neutral[isDark ? 400 : 500]} />
            </TouchableOpacity>
          </View>

          <View style={styles.progressSection}>
            <ProgressBar
              progress={progress}
              showPercentage
              color={getGoalColor(goal.type)}
              height={8}
            />
            
            <View style={styles.statsRow}>
              <Text style={[styles.currentValue, { color: theme.colors.neutral[isDark ? 300 : 700] }]}>
                {goal.current} {goal.unit}
              </Text>
              <Text style={[styles.targetValue, { color: theme.colors.neutral[isDark ? 400 : 500] }]}>
                of {goal.target} {goal.unit}
              </Text>
            </View>
          </View>

          {goal.deadline && (
            <Text style={[styles.deadline, { color: theme.colors.neutral[isDark ? 400 : 500] }]}>
              Deadline: {goal.deadline.toLocaleDateString()}
            </Text>
          )}

          {isCompleted && (
            <View 
              style={[
                styles.completedBadge, 
                { backgroundColor: theme.colors.success[isDark ? 900 : 100] }
              ]}
            >
              <Text 
                style={[
                  styles.completedText, 
                  { color: theme.colors.success[isDark ? 300 : 700] }
                ]}
              >
                Goal Achieved!
              </Text>
            </View>
          )}
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  progressSection: {
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  currentValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  targetValue: {
    fontSize: 14,
    marginLeft: 4,
  },
  deadline: {
    fontSize: 12,
    marginTop: 4,
  },
  completedBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
  },
});