import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get the environment variables
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type Workout = {
  id: string;
  user_id: string;
  title: string;
  type: string;
  duration: number;
  distance?: number;
  calories: number;
  notes?: string;
  date: string;
  completed: boolean;
  location?: {
    latitude: number;
    longitude: number;
  };
  created_at: string;
}

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  type: string;
  deadline?: string;
  created_at: string;
}