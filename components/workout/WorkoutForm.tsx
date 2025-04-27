import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Platform } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { Clock, MapPin, Flame, Activity } from 'lucide-react-native';

const WORKOUT_TYPES = [
  'Running',
  'Cycling',
  'Gym',
  'Swimming',
  'Walking',
  'Yoga',
  'Hiking',
  'Other'
];

interface WorkoutFormProps {
  onSubmit: (workout: {
    title: string;
    type: string;
    duration: number;
    distance?: number;
    calories: number;
    notes?: string;
    useLocation: boolean;
  }) => void;
  isLoading?: boolean;
}

export const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSubmit, isLoading = false }) => {
  const { theme, isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [type, setType] = useState(WORKOUT_TYPES[0]);
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');
  const [useLocation, setUseLocation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Workout title is required';
    }

    if (!duration.trim()) {
      newErrors.duration = 'Duration is required';
    } else if (isNaN(Number(duration)) || Number(duration) <= 0) {
      newErrors.duration = 'Duration must be a positive number';
    }

    if (distance.trim() && (isNaN(Number(distance)) || Number(distance) < 0)) {
      newErrors.distance = 'Distance must be a positive number';
    }

    if (!calories.trim()) {
      newErrors.calories = 'Calories is required';
    } else if (isNaN(Number(calories)) || Number(calories) < 0) {
      newErrors.calories = 'Calories must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        title,
        type,
        duration: Number(duration),
        distance: distance ? Number(distance) : undefined,
        calories: Number(calories),
        notes: notes.trim() || undefined,
        useLocation,
      });
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={[styles.heading, { color: theme.colors.neutral[isDark ? 200 : 800] }]}>
          Log New Workout
        </Text>

        <Card>
          <Input
            label="Workout Title"
            placeholder="e.g., Morning Run"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />

          <Text style={[styles.label, { color: theme.colors.neutral[isDark ? 300 : 700] }]}>
            Workout Type
          </Text>
          <View style={styles.typeContainer}>
            {WORKOUT_TYPES.map((workoutType) => (
              <Button
                key={workoutType}
                title={workoutType}
                onPress={() => setType(workoutType)}
                variant={type === workoutType ? 'primary' : 'outline'}
                size="small"
                style={styles.typeButton}
              />
            ))}
          </View>

          <View style={styles.row}>
            <View style={styles.columnLeft}>
              <Input
                label="Duration (minutes)"
                placeholder="e.g., 30"
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
                error={errors.duration}
                rightIcon={<Clock size={18} color={theme.colors.neutral[isDark ? 400 : 500]} />}
              />
            </View>
            <View style={styles.columnRight}>
              <Input
                label="Distance (km)"
                placeholder="e.g., 5"
                value={distance}
                onChangeText={setDistance}
                keyboardType="decimal-pad"
                error={errors.distance}
                rightIcon={<MapPin size={18} color={theme.colors.neutral[isDark ? 400 : 500]} />}
              />
            </View>
          </View>

          <Input
            label="Calories Burned"
            placeholder="e.g., 300"
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
            error={errors.calories}
            rightIcon={<Flame size={18} color={theme.colors.neutral[isDark ? 400 : 500]} />}
          />

          <Input
            label="Notes (Optional)"
            placeholder="How did it feel? Any achievements?"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />

          {Platform.OS !== 'web' && (
            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { color: theme.colors.neutral[isDark ? 300 : 700] }]}>
                Track my route with GPS
              </Text>
              <Switch
                value={useLocation}
                onValueChange={setUseLocation}
                trackColor={{ false: theme.colors.neutral[400], true: theme.colors.primary[500] }}
                thumbColor={
                  useLocation
                    ? theme.colors.neutral[50]
                    : isDark
                    ? theme.colors.neutral[200]
                    : theme.colors.neutral[100]
                }
              />
            </View>
          )}

          <Button
            title="Log Workout"
            onPress={handleSubmit}
            fullWidth
            loading={isLoading}
            icon={<Activity size={18} color={theme.colors.neutral[100]} />}
          />
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  columnLeft: {
    flex: 1,
    marginRight: 8,
  },
  columnRight: {
    flex: 1,
    marginLeft: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  switchLabel: {
    fontSize: 16,
  },
});