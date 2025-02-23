CREATE TABLE completed_workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  device_id TEXT,
  is_active boolean DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Add RLS policies
ALTER TABLE completed_workouts ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own completed workouts
CREATE POLICY "Users can view their own completed workouts"
  ON completed_workouts
  FOR SELECT
  USING (auth.uid() = profile_id);

-- Allow users to insert their own completed workouts
CREATE POLICY "Users can insert their own completed workouts"
  ON completed_workouts
  FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Allow users to update their own completed workouts
CREATE POLICY "Users can update their own completed workouts"
  ON completed_workouts
  FOR UPDATE
  USING (auth.uid() = profile_id);

-- Create index for faster queries
CREATE INDEX completed_workouts_profile_id_idx ON completed_workouts(profile_id);
CREATE INDEX completed_workouts_workout_plan_id_idx ON completed_workouts(workout_plan_id);
CREATE INDEX completed_workouts_completed_at_idx ON completed_workouts(completed_at);

-- Create function to calculate workout streak
CREATE OR REPLACE FUNCTION calculate_workout_streak(user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    current_streak INTEGER := 0;
    last_workout_date DATE := NULL;
BEGIN
    -- Get the last workout date and initialize variables
    SELECT DATE(completed_at)
    INTO last_workout_date
    FROM completed_workouts
    WHERE profile_id = user_id
    ORDER BY completed_at DESC
    LIMIT 1;

    -- If no workouts found, return 0
    IF last_workout_date IS NULL THEN
        RETURN 0;
    END IF;

    -- If last workout is not today or yesterday, streak is broken
    IF last_workout_date < CURRENT_DATE - INTERVAL '1 day' THEN
        RETURN 0;
    END IF;

    -- Calculate the streak by counting consecutive days backwards
    WITH RECURSIVE workout_dates AS (
        SELECT DISTINCT DATE(completed_at) as workout_date
        FROM completed_workouts
        WHERE profile_id = user_id
        AND is_active = true
    )
    SELECT COUNT(*)
    INTO current_streak
    FROM (
        SELECT workout_date,
               workout_date - (ROW_NUMBER() OVER (ORDER BY workout_date DESC))::INTEGER AS grp
        FROM workout_dates
        WHERE workout_date >= CURRENT_DATE - INTERVAL '30 days'
          AND workout_date <= CURRENT_DATE
    ) sub
    WHERE grp = (SELECT workout_date - (ROW_NUMBER() OVER (ORDER BY workout_date DESC))::INTEGER
                 FROM workout_dates
                 WHERE workout_date = last_workout_date);

    RETURN current_streak;
END;
$$;