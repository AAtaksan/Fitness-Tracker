-- Add profile_id column to workouts table if you want to link to profile directly
-- (Uncomment if needed - only if your profile table has a different ID than auth.users)
-- ALTER TABLE public.workouts 
--   ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add profile_id column to goals table if you want to link to profile directly
-- (Uncomment if needed - only if your profile table has a different ID than auth.users)
-- ALTER TABLE public.goals 
--   ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Function to update profile statistics when workouts change
CREATE OR REPLACE FUNCTION update_profile_workout_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Assuming your profile table has columns like total_workouts, total_calories, etc.
  -- If your profile table doesn't have these columns, you might need to add them first
  
  -- Example update (uncomment and modify as needed for your profile table structure):
  -- UPDATE profiles 
  -- SET 
  --   total_workouts = (SELECT COUNT(*) FROM workouts WHERE user_id = NEW.user_id),
  --   total_calories = (SELECT COALESCE(SUM(calories), 0) FROM workouts WHERE user_id = NEW.user_id)
  -- WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update profile when workouts change
-- Uncomment these if your profile table has statistics fields you want to update

-- CREATE TRIGGER workout_inserted
-- AFTER INSERT ON public.workouts
-- FOR EACH ROW
-- EXECUTE FUNCTION update_profile_workout_stats();

-- CREATE TRIGGER workout_updated
-- AFTER UPDATE ON public.workouts
-- FOR EACH ROW
-- EXECUTE FUNCTION update_profile_workout_stats();

-- CREATE TRIGGER workout_deleted
-- AFTER DELETE ON public.workouts
-- FOR EACH ROW
-- EXECUTE FUNCTION update_profile_workout_stats();

-- Function to sync profile changes to workouts and goals
CREATE OR REPLACE FUNCTION sync_profile_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- If user deletes profile, cascade to workouts and goals
  -- (This is redundant if you have ON DELETE CASCADE foreign keys, but added for clarity)
  
  -- Example (uncomment if needed):
  -- DELETE FROM workouts WHERE user_id = OLD.id;
  -- DELETE FROM goals WHERE user_id = OLD.id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to sync profile changes
-- CREATE TRIGGER before_profile_delete
-- BEFORE DELETE ON public.profiles
-- FOR EACH ROW
-- EXECUTE FUNCTION sync_profile_changes(); 