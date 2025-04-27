import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { WorkoutCard } from '@/components/workout/WorkoutCard';
import { Card } from '@/components/ui/Card';
import { Search, CalendarDays, Filter } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { format, isToday, isYesterday, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import { getWorkouts } from '@/lib/api';
import { Workout } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function HistoryScreen() {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const data = await getWorkouts();
      setWorkouts(data);
    } catch (error) {
      console.error('Error loading workouts:', error);
      // If in development, use mock data
      if (__DEV__) {
        setWorkouts(generateWorkoutData().map(w => ({
          ...w,
          user_id: user?.id || '',
          date: w.date.toISOString(),
          created_at: new Date().toISOString(),
        })));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkouts();
    setRefreshing(false);
  };

  const getDateTitle = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isThisWeek(date)) return 'This Week';
    if (isThisMonth(date)) return 'This Month';
    return format(date, 'MMMM yyyy');
  };

  const groupWorkoutsByDate = () => {
    const filtered = searchQuery
      ? workouts.filter(workout => 
          workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workout.type.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : workouts;
      
    const grouped: Record<string, Workout[]> = {};
    
    filtered.forEach(workout => {
      const dateTitle = getDateTitle(workout.date);
      if (!grouped[dateTitle]) {
        grouped[dateTitle] = [];
      }
      grouped[dateTitle].push(workout);
    });
    
    return Object.keys(grouped).map(dateTitle => ({
      title: dateTitle,
      data: grouped[dateTitle]
    }));
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.neutral[isDark ? 900 : 50] }
    ]}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search workouts"
          value={searchQuery}
          onChangeText={handleSearch}
          rightIcon={<Search size={20} color={theme.colors.neutral[isDark ? 400 : 500]} />}
        />
        <View style={styles.filterButtonsContainer}>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              { backgroundColor: theme.colors.neutral[isDark ? 800 : 100] }
            ]}
          >
            <CalendarDays size={16} color={theme.colors.neutral[isDark ? 400 : 500]} />
            <Text style={[
              styles.filterButtonText,
              { color: theme.colors.neutral[isDark ? 400 : 500] }
            ]}>
              Date
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton,
              { backgroundColor: theme.colors.neutral[isDark ? 800 : 100] }
            ]}
          >
            <Filter size={16} color={theme.colors.neutral[isDark ? 400 : 500]} />
            <Text style={[
              styles.filterButtonText,
              { color: theme.colors.neutral[isDark ? 400 : 500] }
            ]}>
              Filter
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        </View>
      ) : (
        <SectionList
          sections={groupWorkoutsByDate()}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <WorkoutCard
              workout={{
                ...item,
                date: parseISO(item.date)
              }}
              onPress={() => {
                // View workout details (in a real app)
                console.log('View workout:', item.id);
              }}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={[
              styles.sectionHeader,
              { backgroundColor: theme.colors.neutral[isDark ? 900 : 50] }
            ]}>
              <Text style={[
                styles.sectionHeaderText,
                { color: theme.colors.neutral[isDark ? 300 : 700] }
              ]}>
                {title}
              </Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <Card style={styles.emptyCard}>
              <Text style={[
                styles.emptyText,
                { color: theme.colors.neutral[isDark ? 300 : 600] }
              ]}>
                {searchQuery 
                  ? 'No workouts found. Try adjusting your search.'
                  : 'No workout history yet. Start tracking your activities!'}
              </Text>
            </Card>
          )}
        />
      )}
    </View>
  );
}

// Simulated workout history data - only used in development if API fails
const generateWorkoutData = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 6);
  
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 13);
  
  return [
    {
      id: '1',
      type: 'running',
      title: 'Morning Run',
      date: today,
      duration: 45,
      distance: 5.2,
      calories: 420,
      completed: true,
    },
    {
      id: '2',
      type: 'gym',
      title: 'Upper Body Workout',
      date: yesterday,
      duration: 60,
      calories: 350,
      completed: true,
    },
    {
      id: '3',
      type: 'cycling',
      title: 'Evening Ride',
      date: twoDaysAgo,
      duration: 75,
      distance: 18.5,
      calories: 480,
      completed: true,
    },
    {
      id: '4',
      type: 'swimming',
      title: 'Pool Session',
      date: lastWeek,
      duration: 40,
      distance: 1.5,
      calories: 300,
      completed: true,
    },
    {
      id: '5',
      type: 'running',
      title: 'Trail Run',
      date: lastWeek,
      duration: 55,
      distance: 6.8,
      calories: 520,
      completed: true,
    },
    {
      id: '6',
      type: 'walking',
      title: 'City Walk',
      date: twoWeeksAgo,
      duration: 90,
      distance: 8.2,
      calories: 380,
      completed: true,
    },
    {
      id: '7',
      type: 'gym',
      title: 'Leg Day',
      date: twoWeeksAgo,
      duration: 70,
      calories: 400,
      completed: true,
    },
  ];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  filterButtonText: {
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  emptyCard: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});