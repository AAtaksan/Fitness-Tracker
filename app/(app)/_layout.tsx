import React from 'react';
import { Tabs } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, Redirect } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Chrome as Home, Dumbbell, ChartBar as BarChart2, User } from 'lucide-react-native';

export default function AppLayout() {
  const { user, isLoading } = useAuth();
  const { theme, isDark } = useTheme();
  const router = useRouter();

  // If still loading, don't render anything
  if (isLoading) return null;

  // If user is not logged in, redirect to auth
  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.neutral[isDark ? 400 : 500],
        tabBarStyle: {
          backgroundColor: theme.colors.neutral[isDark ? 900 : 50],
          borderTopColor: theme.colors.neutral[isDark ? 800 : 200],
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: theme.colors.neutral[isDark ? 900 : 50],
        },
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          color: theme.colors.neutral[isDark ? 100 : 900],
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerTitle: 'FitTrack Dashboard',
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />,
          headerTitle: 'Track Workout',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <BarChart2 color={color} size={size} />,
          headerTitle: 'Activity History',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          headerTitle: 'My Profile',
        }}
      />
    </Tabs>
  );
}