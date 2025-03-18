-- Create workout_logs table
CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  exercise_type TEXT NOT NULL, -- 'strength', 'cardio', 'duration', etc.
  log_data JSONB NOT NULL, -- Flexible structure based on exercise_type
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own workout logs" 
  ON workout_logs 
  FOR SELECT 
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own workout logs" 
  ON workout_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own workout logs" 
  ON workout_logs 
  FOR UPDATE 
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own workout logs" 
  ON workout_logs 
  FOR DELETE 
  USING (auth.uid() = profile_id);

-- Create indexes for faster queries
CREATE INDEX workout_logs_profile_id_idx ON workout_logs(profile_id);
CREATE INDEX workout_logs_workout_plan_id_idx ON workout_logs(workout_plan_id);
CREATE INDEX workout_logs_exercise_name_idx ON workout_logs(exercise_name);
CREATE INDEX workout_logs_logged_at_idx ON workout_logs(logged_at);

-- Add comments
COMMENT ON TABLE workout_logs IS 'Stores detailed workout logs for exercises';
COMMENT ON COLUMN workout_logs.exercise_type IS 'Type of exercise: strength, cardio, duration, etc.';
COMMENT ON COLUMN workout_logs.log_data IS 'JSON data structure containing exercise-specific log details';

-- Create trigger for updated_at
CREATE TRIGGER workout_logs_updated_at
  BEFORE UPDATE ON workout_logs
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

-- Create function to get workout logs for a specific time period
CREATE OR REPLACE FUNCTION get_workout_logs_by_period(
  user_id UUID,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  id UUID,
  exercise_name TEXT,
  exercise_type TEXT,
  log_data JSONB,
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wl.id,
    wl.exercise_name,
    wl.exercise_type,
    wl.log_data,
    wl.notes,
    wl.logged_at
  FROM 
    workout_logs wl
  WHERE 
    wl.profile_id = user_id
    AND wl.logged_at >= start_date
    AND wl.logged_at <= end_date
  ORDER BY 
    wl.logged_at DESC;
END;
$$;

-- Create function to get exercise progress data
CREATE OR REPLACE FUNCTION get_exercise_progress(
  user_id UUID,
  exercise TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  logged_at TIMESTAMP WITH TIME ZONE,
  log_data JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wl.logged_at,
    wl.log_data
  FROM 
    workout_logs wl
  WHERE 
    wl.profile_id = user_id
    AND wl.exercise_name = exercise
    AND wl.logged_at >= start_date
    AND wl.logged_at <= end_date
  ORDER BY 
    wl.logged_at ASC;
END;
$$;
