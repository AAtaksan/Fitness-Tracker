-- Create workouts table
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  distance FLOAT,
  calories INTEGER NOT NULL,
  notes TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT TRUE,
  location JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target FLOAT NOT NULL,
  current FLOAT NOT NULL,
  unit TEXT NOT NULL,
  type TEXT NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Create policies for the workouts table
CREATE POLICY "Users can read their own workouts"
  ON public.workouts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts"
  ON public.workouts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts"
  ON public.workouts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts"
  ON public.workouts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for the goals table
CREATE POLICY "Users can read their own goals"
  ON public.goals
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
  ON public.goals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON public.goals
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON public.goals
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON public.workouts (user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals (user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON public.workouts (date);
CREATE INDEX IF NOT EXISTS idx_goals_deadline ON public.goals (deadline);

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workouts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated; 