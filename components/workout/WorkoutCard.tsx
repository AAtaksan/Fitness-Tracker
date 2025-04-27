import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDistance, formatDuration } from 'date-fns';
import { Clock, Flame, MapPin, ChartBar as BarChart } from 'lucide-react-native';

interface WorkoutCardProps {
  workout: {
    id: string;
    type: string;
    title: string;
    date: Date;
    duration: number; // in minutes
    distance?: number; // in kilometers
    calories: number;
    completed: boolean;
  };
  onPress: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onPress }) => {
  const { theme, isDark } = useTheme();

  const getWorkoutTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'running':
        return theme.colors.success[500];
      case 'cycling':
        return theme.colors.primary[500];
      case 'gym':
        return theme.colors.secondary[500];
      case 'swimming':
        return theme.colors.info[500];
      case 'walking':
        return theme.colors.warning[500];
      default:
        return theme.colors.accent[500];
    }
  };

  const formatWorkoutDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View
              style={[
                styles.typeIndicator,
                { backgroundColor: getWorkoutTypeColor(workout.type) },
              ]}
            />
            <Text style={[styles.title, { color: theme.colors.neutral[isDark ? 100 : 900] }]}>
              {workout.title}
            </Text>
          </View>
          <Text style={[styles.date, { color: theme.colors.neutral[isDark ? 400 : 500] }]}>
            {formatDistance(workout.date, new Date(), { addSuffix: true })}
          </Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Clock size={16} color={theme.colors.neutral[isDark ? 300 : 600]} />
            <Text style={[styles.statText, { color: theme.colors.neutral[isDark ? 300 : 600] }]}>
              {formatWorkoutDuration(workout.duration)}
            </Text>
          </View>
          
          {workout.distance && (
            <View style={styles.statItem}>
              <MapPin size={16} color={theme.colors.neutral[isDark ? 300 : 600]} />
              <Text style={[styles.statText, { color: theme.colors.neutral[isDark ? 300 : 600] }]}>
                {workout.distance} km
              </Text>
            </View>
          )}
          
          <View style={styles.statItem}>
            <Flame size={16} color={theme.colors.neutral[isDark ? 300 : 600]} />
            <Text style={[styles.statText, { color: theme.colors.neutral[isDark ? 300 : 600] }]}>
              {workout.calories} cal
            </Text>
          </View>
        </View>

        {workout.completed && (
          <View
            style={[
              styles.completedBadge,
              { backgroundColor: theme.colors.success[isDark ? 900 : 100] },
            ]}
          >
            <Text
              style={[
                styles.completedText,
                { color: theme.colors.success[isDark ? 300 : 700] },
              ]}
            >
              Completed
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    position: 'relative',
    overflow: 'visible',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  date: {
    fontSize: 12,
    marginLeft: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  statText: {
    fontSize: 14,
    marginLeft: 4,
  },
  completedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '500',
  },
});