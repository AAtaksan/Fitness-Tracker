import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';

// User type
interface User {
  id: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the current session
    const getSession = async () => {
      setIsLoading(true);
      
      // Check for existing session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (currentSession?.user) {
        const userData: User = {
          id: currentSession.user.id,
          email: currentSession.user.email || '',
          created_at: currentSession.user.created_at || new Date().toISOString(),
        };
        setUser(userData);
      }
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, currentSession) => {
          setSession(currentSession);
          
          if (currentSession?.user) {
            const userData: User = {
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              created_at: currentSession.user.created_at || new Date().toISOString(),
            };
            setUser(userData);
          } else {
            setUser(null);
          }
        }
      );
      
      setIsLoading(false);
      
      // Cleanup subscription
      return () => {
        subscription.unsubscribe();
      };
    };

    getSession();
  }, []);

  const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
    });
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://your-app-url.com/reset-password',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signUp,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};