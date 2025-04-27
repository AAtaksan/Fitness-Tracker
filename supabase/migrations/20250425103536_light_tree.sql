/*
  # Initial Schema Setup for FitTrack App

  1. New Tables
    - `profiles`
      - Extends auth.users with additional user profile data
      - Stores user preferences and fitness metrics
    
    - `workouts`
      - Stores workout records
      - Tracks type, duration, distance, calories, etc.
    
    - `goals`
      - Stores user fitness goals
      - Tracks progress towards targets

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Ensure data isolation between users

  3. Changes
    - Initial schema creation
    - Basic RLS policies
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  height numeric(5,2),
  weight numeric(5,2),
  date_of_birth date,
  gender text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  type text NOT NULL,
  duration integer NOT NULL, -- in minutes
  distance numeric(10,2), -- in kilometers
  calories integer,
  notes text,
  location_data jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz DEFAULT now()
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  type text NOT NULL,
  target numeric NOT NULL,
  current numeric DEFAULT 0,
  unit text NOT NULL,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Workouts policies
CREATE POLICY "Users can view own workouts"
  ON workouts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own workouts"
  ON workouts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts"
  ON workouts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts"
  ON workouts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can view own goals"
  ON goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals"
  ON goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();