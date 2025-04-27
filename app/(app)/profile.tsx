import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'expo-router';
import { Moon, Sun, Bell, Settings, LogOut, User, Camera, Award, ChartBar as BarChart3 } from 'lucide-react-native';
import { getWorkouts, getGoals } from '@/lib/api';
import { Workout, Goal } from '@/lib/supabase';

export default function ProfileScreen() {
  const { theme, isDark, setThemeType } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [stepTrackingEnabled, setStepTrackingEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    workoutsCount: 0,
    goalsCount: 0,
    achievements: 0
  });
  
  // Fetch user statistics
  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const [workouts, goals] = await Promise.all([
          getWorkouts(),
          getGoals()
        ]);
        
        setStats({
          workoutsCount: workouts.length,
          goalsCount: goals.length,
          achievements: Math.min(
            // Calculate achievement count based on workouts and goals
            // In a real app, this would come from a specific API endpoint
            Math.floor(workouts.length / 3) + Math.floor(goals.length / 2), 
            20 // Cap at 20 for mock data
          )
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
        
        // Use mock data if fetch fails
        if (__DEV__) {
          setStats({
            workoutsCount: 28,
            goalsCount: 4,
            achievements: 12
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStats();
  }, [user]);
  
  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)');
  };
  
  const toggleTheme = () => {
    setThemeType(isDark ? 'light' : 'dark');
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.colors.neutral[isDark ? 900 : 50] }
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View 
            style={[
              styles.avatar,
              { backgroundColor: theme.colors.primary[isDark ? 800 : 100] }
            ]}
          >
            <User size={40} color={theme.colors.primary[isDark ? 300 : 600]} />
          </View>
          <TouchableOpacity 
            style={[
              styles.cameraButton,
              { backgroundColor: theme.colors.primary[500] }
            ]}
          >
            <Camera size={18} color={theme.colors.neutral[100]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={[styles.userName, { color: theme.colors.neutral[isDark ? 100 : 900] }]}>
            {user?.email?.split('@')[0] || 'User'}
          </Text>
          <Text style={[styles.email, { color: theme.colors.neutral[isDark ? 400 : 500] }]}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>
      </View>
      
      {/* Statistics */}
      <View style={styles.statsContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary[500]} />
          </View>
        ) : (
          <>
            <Card style={styles.statCard}>
              <View style={[
                styles.statIconContainer,
                { backgroundColor: theme.colors.primary[isDark ? 900 : 50] }
              ]}>
                <Award size={24} color={theme.colors.primary[500]} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.neutral[isDark ? 100 : 900] }]}>
                {stats.achievements}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.neutral[isDark ? 400 : 500] }]}>
                Achievements
              </Text>
            </Card>
            
            <Card style={styles.statCard}>
              <View style={[
                styles.statIconContainer,
                { backgroundColor: theme.colors.secondary[isDark ? 900 : 50] }
              ]}>
                <BarChart3 size={24} color={theme.colors.secondary[500]} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.neutral[isDark ? 100 : 900] }]}>
                {stats.workoutsCount}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.neutral[isDark ? 400 : 500] }]}>
                Workouts
              </Text>
            </Card>
            
            <Card style={styles.statCard}>
              <View style={[
                styles.statIconContainer,
                { backgroundColor: theme.colors.error[isDark ? 900 : 50] }
              ]}>
                <Award size={24} color={theme.colors.error[500]} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.neutral[isDark ? 100 : 900] }]}>
                {stats.goalsCount}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.neutral[isDark ? 400 : 500] }]}>
                Goals
              </Text>
            </Card>
          </>
        )}
      </View>
      
      {/* Settings */}
      <Text style={[styles.sectionTitle, { color: theme.colors.neutral[isDark ? 300 : 700] }]}>
        Settings
      </Text>
      
      <Card>
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <View style={[
              styles.settingIconContainer,
              { backgroundColor: theme.colors.primary[isDark ? 900 : 50] }
            ]}>
              {isDark ? (
                <Moon size={20} color={theme.colors.primary[500]} />
              ) : (
                <Sun size={20} color={theme.colors.primary[500]} />
              )}
            </View>
            <Text style={[styles.settingLabel, { color: theme.colors.neutral[isDark ? 200 : 800] }]}>
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.colors.neutral[400], true: theme.colors.primary[500] }}
            thumbColor={
              isDark
                ? theme.colors.neutral[50]
                : isDark
                ? theme.colors.neutral[200]
                : theme.colors.neutral[100]
            }
          />
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <View style={[
              styles.settingIconContainer,
              { backgroundColor: theme.colors.warning[isDark ? 900 : 50] }
            ]}>
              <Bell size={20} color={theme.colors.warning[500]} />
            </View>
            <Text style={[styles.settingLabel, { color: theme.colors.neutral[isDark ? 200 : 800] }]}>
              Notifications
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: theme.colors.neutral[400], true: theme.colors.primary[500] }}
            thumbColor={
              notificationsEnabled
                ? theme.colors.neutral[50]
                : isDark
                ? theme.colors.neutral[200]
                : theme.colors.neutral[100]
            }
          />
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <View style={[
              styles.settingIconContainer,
              { backgroundColor: theme.colors.info[isDark ? 900 : 50] }
            ]}>
              <Settings size={20} color={theme.colors.info[500]} />
            </View>
            <Text style={[styles.settingLabel, { color: theme.colors.neutral[isDark ? 200 : 800] }]}>
              Step Tracking
            </Text>
          </View>
          <Switch
            value={stepTrackingEnabled}
            onValueChange={setStepTrackingEnabled}
            trackColor={{ false: theme.colors.neutral[400], true: theme.colors.primary[500] }}
            thumbColor={
              stepTrackingEnabled
                ? theme.colors.neutral[50]
                : isDark
                ? theme.colors.neutral[200]
                : theme.colors.neutral[100]
            }
          />
        </View>
      </Card>
      
      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          icon={<LogOut size={18} color={theme.colors.primary[isDark ? 300 : 600]} />}
        />
      </View>
      
      {Platform.OS === 'web' && (
        <Image
          source={{ uri: 'https://images.pexels.com/photos/2780762/pexels-photo-2780762.jpeg' }}
          style={styles.backgroundImage}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  statCard: {
    width: '31%',
    alignItems: 'center',
    padding: 12,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  logoutContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    opacity: 0.03,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});