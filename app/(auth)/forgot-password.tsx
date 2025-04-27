import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { KeyRound, Mail, ArrowLeft } from 'lucide-react-native';

export default function ForgotPassword() {
  const { theme, isDark } = useTheme();
  const { resetPassword } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await resetPassword(email);
      
      if (resetError) {
        setError(resetError.message || 'Failed to send password reset email');
      } else {
        setSuccess(true);
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
      
      <Card style={styles.card}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton}>
            <ArrowLeft size={20} color={theme.colors.neutral[isDark ? 400 : 500]} />
            <Text style={[styles.backText, { color: theme.colors.neutral[isDark ? 400 : 500] }]}>
              Back to Sign In
            </Text>
          </TouchableOpacity>
        </Link>
        
        <Text style={[styles.title, { color: theme.colors.neutral[isDark ? 100 : 900] }]}>
          Reset Password
        </Text>
        
        {!success ? (
          <>
            <Text style={[styles.description, { color: theme.colors.neutral[isDark ? 300 : 600] }]}>
              Enter your email address and we'll send you a link to reset your password.
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
            
            <Button
              title="Send Reset Link"
              onPress={handleResetPassword}
              loading={loading}
              fullWidth
              icon={<KeyRound size={18} color={theme.colors.neutral[100]} />}
            />
          </>
        ) : (
          <View style={styles.successContainer}>
            <Text style={[
              styles.successTitle, 
              { color: theme.colors.success[isDark ? 300 : 700] }
            ]}>
              Email Sent!
            </Text>
            <Text style={[
              styles.successDescription, 
              { color: theme.colors.neutral[isDark ? 300 : 600] }
            ]}>
              Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
            </Text>
            <Button
              title="Back to Sign In"
              onPress={() => router.replace('/')}
              variant="outline"
              fullWidth
            />
          </View>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
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
  successContainer: {
    alignItems: 'center',
    padding: 16,
  },
  successTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  successDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
});