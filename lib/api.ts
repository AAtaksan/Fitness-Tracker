import { supabase, Workout, Goal } from './supabase';

// Workouts API functions
export const getWorkouts = async (): Promise<Workout[]> => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
  
  return data || [];
};

export const addWorkout = async (workout: Omit<Workout, 'id' | 'created_at'>): Promise<Workout> => {
  const { data, error } = await supabase
    .from('workouts')
    .insert(workout)
    .select()
    .single();
    
  if (error) {
    console.error('Error adding workout:', error);
    throw error;
  }
  
  return data;
};

export const updateWorkout = async (id: string, updates: Partial<Workout>): Promise<Workout> => {
  const { data, error } = await supabase
    .from('workouts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
  
  return data;
};

export const deleteWorkout = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};

// Goals API functions
export const getGoals = async (): Promise<Goal[]> => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
  
  return data || [];
};

export const addGoal = async (goal: Omit<Goal, 'id' | 'created_at'>): Promise<Goal> => {
  const { data, error } = await supabase
    .from('goals')
    .insert(goal)
    .select()
    .single();
    
  if (error) {
    console.error('Error adding goal:', error);
    throw error;
  }
  
  return data;
};

export const updateGoal = async (id: string, updates: Partial<Goal>): Promise<Goal> => {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
  
  return data;
};

export const deleteGoal = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
}; 