import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, Mail, Lock, User } from 'lucide-react-native';

export default function SignUp() {
  const { theme, isDark } = useTheme();
  const { signUp } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await signUp(email, password);
      
      if (signUpError) {
        setError(signUpError.message || 'Failed to sign up');
      } else {
        // Since email confirmation is disabled, you can redirect to the app directly
        // Otherwise, you'd show a message asking to confirm email
        router.replace('/(app)');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[
      styles.container, 
      { backgroundColor: theme.colors.neutral[isDark ? 900 : 50] }
    ]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.headerContainer}>
        <Text style={[styles.logo, { color: theme.colors.primary[500] }]}>
          FitTrack
        </Text>
        <Text style={[styles.tagline, { color: theme.colors.neutral[isDark ? 300 : 600] }]}>
          Start your fitness journey
        </Text>
      </View>
      
      <Card style={styles.card}>
        <Text style={[styles.title, { color: theme.colors.neutral[isDark ? 100 : 900] }]}>
          Create Account
        </Text>
        
        {error && (
          <View style={[
            styles.errorContainer, 
            { backgroundColor: theme.colors.error[isDark ? 900 : 50] }
          ]}>
            <Text style={[
              styles.errorText, 
              { color: theme.colors.error[isDark ? 300 : 700] }
            ]}>
              {error}
            </Text>
          </View>
        )}
        
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          rightIcon={<Mail size={20} color={theme.colors.neutral[isDark ? 400 : 500]} />}
        />
        
        <Input
          label="Password"
          placeholder="Create password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          rightIcon={<Lock size={20} color={theme.colors.neutral[isDark ? 400 : 500]} />}
        />
        
        <Input
          label="Confirm Password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          rightIcon={<Lock size={20} color={theme.colors.neutral[isDark ? 400 : 500]} />}
        />
        
        <Button
          title="Sign Up"
          onPress={handleSignUp}
          loading={loading}
          fullWidth
          icon={<UserPlus size={18} color={theme.colors.neutral[100]} />}
        />
        
        <View style={styles.signinContainer}>
          <Text style={{ color: theme.colors.neutral[isDark ? 400 : 500] }}>
            Already have an account?
          </Text>
          <Link href="/" asChild>
            <TouchableOpacity>
              <Text style={[
                styles.signinText, 
                { color: theme.colors.primary[isDark ? 300 : 600] }
              ]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </Card>
      
      {Platform.OS === 'web' && (
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3757954/pexels-photo-3757954.jpeg' }}
          style={styles.backgroundImage}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  card: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 4,
  },
  signinText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
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
    opacity: 0.05,
  },
});