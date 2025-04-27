import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { WorkoutForm } from '@/components/workout/WorkoutForm';
import { useRouter } from 'expo-router';
import { addWorkout } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import * as Location from 'expo-location';

export default function WorkoutScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitWorkout = async (workoutData: {
    title: string;
    type: string;
    duration: number;
    distance?: number;
    calories: number;
    notes?: string;
    useLocation: boolean;
  }) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to add a workout');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get location if requested
      let locationData = undefined;
      
      if (workoutData.useLocation) {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          
          if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({});
            locationData = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            };
          }
        } catch (error) {
          console.log('Error getting location:', error);
        }
      }
      
      // Prepare workout data
      const workout = {
        user_id: user.id,
        title: workoutData.title,
        type: workoutData.type.toLowerCase(),
        duration: workoutData.duration,
        distance: workoutData.distance,
        calories: workoutData.calories,
        notes: workoutData.notes,
        date: new Date().toISOString(),
        completed: true,
        location: locationData
      };
      
      // Add workout to database
      await addWorkout(workout);
      
      // Navigate to history screen
      router.push('/history');
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert(
        'Error',
        'There was a problem saving your workout. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.neutral[isDark ? 900 : 50] }
    ]}>
      <WorkoutForm onSubmit={handleSubmitWorkout} isLoading={isSubmitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});