import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/ui/Card';
import { ProgressCircle } from '@/components/charts/ProgressCircle';
import { BarChart } from '@/components/charts/BarChart';
import { GoalCard } from '@/components/goals/GoalCard';
import { WorkoutCard } from '@/components/workout/WorkoutCard';
import { useRouter } from 'expo-router';
import { format, parseISO, isToday, isYesterday, isThisWeek, startOfWeek, endOfWeek } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { getWorkouts, getGoals } from '@/lib/api';
import { Workout, Goal } from '@/lib/supabase';

// Mock data - in a real app this would come from your API/database
const mockWorkoutData = [
  { x: 'Mon', y: 45 },
  { x: 'Tue', y: 30 },
  { x: 'Wed', y: 60 },
  { x: 'Thu', y: 0 },
  { x: 'Fri', y: 50 },
  { x: 'Sat', y: 75 },
  { x: 'Sun', y: 30 },
];

const mockCaloriesData = [
  { x: 'Mon', y: 350 },
  { x: 'Tue', y: 275 },
  { x: 'Wed', y: 400 },
  { x: 'Thu', y: 0 },
  { x: 'Fri', y: 320 },
  { x: 'Sat', y: 450 },
  { x: 'Sun', y: 200 },
];

const mockGoals = [
  {
    id: '1',
    title: 'Weekly Workouts',
    target: 5,
    current: 3,
    unit: 'workouts',
    type: 'workout',
  },
  {
    id: '2',
    title: 'Weekly Distance',
    target: 20,
    current: 12.5,
    unit: 'km',
    type: 'distance',
  },
  {
    id: '3',
    title: 'Daily Calories Burned',
    target: 500,
    current: 350,
    unit: 'cal',
    type: 'calories',
  },
];

const mockRecentWorkouts = [
  {
    id: '1',
    type: 'running',
    title: 'Morning Run',
    date: new Date(Date.now() - 86400000),
    duration: 45,
    distance: 5.2,
    calories: 420,
    completed: true,
  },
  {
    id: '2',
    type: 'gym',
    title: 'Upper Body Workout',
    date: new Date(Date.now() - 172800000),
    duration: 60,
    calories: 350,
    completed: true,
  },
];

// Default data for charts when no data is available
const defaultWorkoutChartData = [
  { x: 'Mon', y: 0 },
  { x: 'Tue', y: 0 },
  { x: 'Wed', y: 0 },
  { x: 'Thu', y: 0 },
  { x: 'Fri', y: 0 },
  { x: 'Sat', y: 0 },
  { x: 'Sun', y: 0 },
];

const defaultCaloriesChartData = [
  { x: 'Mon', y: 0 },
  { x: 'Tue', y: 0 },
  { x: 'Wed', y: 0 },
  { x: 'Thu', y: 0 },
  { x: 'Fri', y: 0 },
  { x: 'Sat', y: 0 },
  { x: 'Sun', y: 0 },
];

export default function Dashboard() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dailySteps, setDailySteps] = useState(6500); // Would come from health API
  const [todayDate, setTodayDate] = useState(new Date());
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [workoutChartData, setWorkoutChartData] = useState(defaultWorkoutChartData);
  const [caloriesChartData, setCaloriesChartData] = useState(defaultCaloriesChartData);

  // Calculate step progress (assuming a 10,000 step goal)
  const stepProgress = Math.round((dailySteps / 10000) * 100);

  // Function to load data from API
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch workouts and goals
      const workoutsData = await getWorkouts();
      const goalsData = await getGoals();
      
      setWorkouts(workoutsData);
      setGoals(goalsData);
      
      // Process workout data for charts
      processWorkoutDataForCharts(workoutsData);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
      
      // If in development, use mock data
      if (__DEV__) {
        setWorkouts(mockRecentWorkouts.map(w => ({
          ...w,
          user_id: user?.id || '',
          date: w.date.toISOString(),
          created_at: new Date().toISOString(),
        })));
        
        setGoals(mockGoals.map(g => ({
          ...g,
          user_id: user?.id || '',
          created_at: new Date().toISOString(),
        })));
        
        setWorkoutChartData(mockWorkoutData);
        setCaloriesChartData(mockCaloriesData);
      }
    }
  };

  // Process workout data for the weekly charts
  const processWorkoutDataForCharts = (workouts: Workout[]) => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);
    
    // Filter workouts for current week
    const thisWeekWorkouts = workouts.filter(workout => {
      const workoutDate = parseISO(workout.date);
      return workoutDate >= weekStart && workoutDate <= weekEnd;
    });
    
    // Initialize data structures for charts
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const workoutDurations = daysOfWeek.map(() => 0);
    const workoutCalories = daysOfWeek.map(() => 0);
    
    // Populate data
    thisWeekWorkouts.forEach(workout => {
      const workoutDate = parseISO(workout.date);
      const dayIndex = workoutDate.getDay() - 1; // 0 = Monday in our chart
      
      // Handle Sunday (getDay returns 0 for Sunday)
      const index = dayIndex === -1 ? 6 : dayIndex;
      
      workoutDurations[index] += workout.duration;
      workoutCalories[index] += workout.calories;
    });
    
    // Create chart data objects
    const workoutChartData = daysOfWeek.map((day, index) => ({
      x: day,
      y: workoutDurations[index]
    }));
    
    const caloriesChartData = daysOfWeek.map((day, index) => ({
      x: day,
      y: workoutCalories[index]
    }));
    
    setWorkoutChartData(workoutChartData);
    setCaloriesChartData(caloriesChartData);
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [user]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadData().finally(() => setRefreshing(false));
  }, []);

  // Loading state
  if (isLoading && !refreshing) {
    return (
      <View style={[
        styles.loadingContainer,
        { backgroundColor: theme.colors.neutral[isDark ? 900 : 50] }
      ]}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text style={[styles.loadingText, { color: theme.colors.neutral[isDark ? 300 : 600] }]}>
          Loading your fitness data...
        </Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.neutral[isDark ? 900 : 50] }
    ]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with date */}
        <View style={styles.headerContainer}>
          <Text style={[styles.dateText, { color: theme.colors.neutral[isDark ? 400 : 500] }]}>
            {format(todayDate, 'EEEE, MMMM d, yyyy')}
          </Text>
          <Text style={[styles.welcomeText, { color: theme.colors.neutral[isDark ? 100 : 900] }]}>
            Welcome Back!
          </Text>
        </View>

        {/* Daily Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statsCard}>
            <Text style={[styles.statsTitle, { color: theme.colors.neutral[isDark ? 300 : 700] }]}>
              Today's Steps
            </Text>
            <ProgressCircle 
              progress={stepProgress} 
              size={100} 
              label="Steps Goal" 
              color={theme.colors.primary[500]}
            />
            <Text style={[styles.statsValue, { color: theme.colors.neutral[isDark ? 100 : 900] }]}>
              {dailySteps.toLocaleString()} / 10,000
            </Text>
          </Card>
          
          <Card style={styles.statsCard}>
            <Text style={[styles.statsTitle, { color: theme.colors.neutral[isDark ? 300 : 700] }]}>
              Calories Burned
            </Text>
            <ProgressCircle 
              progress={70} 
              size={100} 
              label="Daily Goal" 
              color={theme.colors.secondary[500]}
            />
            <Text style={[styles.statsValue, { color: theme.colors.neutral[isDark ? 100 : 900] }]}>
              350 / 500 cal
            </Text>
          </Card>
        </View>

        {/* Your Goals Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.neutral[isDark ? 100 : 900] }]}>
            Your Goals
          </Text>
          
          {goals.length > 0 ? (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onPress={() => {}}
                onEdit={() => {}}
              />
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={[styles.emptyText, { color: theme.colors.neutral[isDark ? 300 : 600] }]}>
                No goals set yet. Create your first fitness goal!
              </Text>
            </Card>
          )}
        </View>

        {/* Weekly Activity Charts */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.neutral[isDark ? 100 : 900] }]}>
            Weekly Activity
          </Text>
          
          <BarChart
            data={workoutChartData}
            title="Workout Duration"
            yAxisLabel="minutes"
            color={theme.colors.primary[500]}
          />
          
          <BarChart
            data={caloriesChartData}
            title="Calories Burned"
            yAxisLabel="calories"
            color={theme.colors.error[500]}
          />
        </View>

        {/* Recent Workouts */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.neutral[isDark ? 100 : 900] }]}>
            Recent Workouts
          </Text>
          
          {workouts.length > 0 ? (
            workouts.slice(0, 3).map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={{
                  ...workout,
                  date: new Date(workout.date)
                }}
                onPress={() => router.push('/workout')}
              />
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={[styles.emptyText, { color: theme.colors.neutral[isDark ? 300 : 600] }]}>
                No workouts recorded yet. Start your fitness journey!
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 24,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
  },
  statsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 12,
    textAlign: 'center',
  },
  statsValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginTop: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  emptyCard: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
});