import { Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, Redirect } from 'expo-router';
import { useEffect } from 'react';

export default function AuthLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // User is authenticated, redirect to app
      router.replace('/(app)');
    }
  }, [user, isLoading, router]);

  // If still loading, don't render anything
  if (isLoading) return null;

  // If user is already logged in, redirect to the app
  if (user) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Sign In' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Forgot Password' }} />
    </Stack>
  );
}