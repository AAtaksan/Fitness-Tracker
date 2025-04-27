-- This script adds sample workout and goal data
-- Your Supabase user ID has been inserted below

-- Sample workout data
INSERT INTO public.workouts (user_id, title, type, duration, distance, calories, notes, date, completed, location)
VALUES
  ('05eeb7d1-f991-49e9-8125-46bc13a80127', 'Morning Run', 'running', 45, 5.2, 420, 'Felt great today!', NOW() - INTERVAL '1 day', true, '{"latitude": 40.7128, "longitude": -74.0060}'),
  ('05eeb7d1-f991-49e9-8125-46bc13a80127', 'Upper Body Workout', 'gym', 60, NULL, 350, 'Focused on chest and arms', NOW() - INTERVAL '2 days', true, NULL),
  ('05eeb7d1-f991-49e9-8125-46bc13a80127', 'Evening Ride', 'cycling', 75, 18.5, 480, 'Scenic route through the park', NOW() - INTERVAL '3 days', true, '{"latitude": 40.7580, "longitude": -73.9855}'),
  ('05eeb7d1-f991-49e9-8125-46bc13a80127', 'Trail Run', 'running', 55, 6.8, 520, 'Hilly terrain', NOW() - INTERVAL '5 days', true, '{"latitude": 40.7951, "longitude": -73.9651}'),
  ('05eeb7d1-f991-49e9-8125-46bc13a80127', 'Swimming Session', 'swimming', 40, 1.5, 300, 'Worked on technique', NOW() - INTERVAL '7 days', true, NULL);

-- Sample goal data
INSERT INTO public.goals (user_id, title, target, current, unit, type, deadline)
VALUES
  ('05eeb7d1-f991-49e9-8125-46bc13a80127', 'Weekly Workouts', 5, 3, 'workouts', 'workout', NOW() + INTERVAL '7 days'),
  ('05eeb7d1-f991-49e9-8125-46bc13a80127', 'Weekly Distance', 20, 12.5, 'km', 'distance', NOW() + INTERVAL '7 days'),
  ('05eeb7d1-f991-49e9-8125-46bc13a80127', 'Daily Calories Burned', 500, 350, 'cal', 'calories', NOW() + INTERVAL '1 day');

-- If you have a profiles table and want to update stats (uncomment and adjust as needed)
-- UPDATE profiles
-- SET
--   total_workouts = 5,
--   total_distance = 32.0,
--   total_calories = 2070
-- WHERE id = '05eeb7d1-f991-49e9-8125-46bc13a80127'; 