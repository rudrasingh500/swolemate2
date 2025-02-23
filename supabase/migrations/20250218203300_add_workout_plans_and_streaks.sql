-- Create workout_plans table
CREATE TABLE workout_plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  plan_data jsonb DEFAULT '[]'::jsonb,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_workout_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own workout plan" 
  ON workout_plans 
  FOR SELECT 
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can update own workout plan" 
  ON workout_plans 
  FOR UPDATE 
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own workout plan"
  ON workout_plans
  FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Add comments
COMMENT ON TABLE workout_plans IS 'Stores user workout plans and progress';
COMMENT ON COLUMN workout_plans.plan_data IS 'Stores the user''s current workout plan as a JSON array';
COMMENT ON COLUMN workout_plans.current_streak IS 'Number of consecutive days the user has worked out';
COMMENT ON COLUMN workout_plans.longest_streak IS 'Longest workout streak achieved by the user';
COMMENT ON COLUMN workout_plans.last_workout_date IS 'Date and time of the user''s last completed workout';

-- Create trigger for updated_at
CREATE TRIGGER workout_plans_updated_at
  BEFORE UPDATE ON workout_plans
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

-- Update handle_new_user function to create workout plan
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    avatar_url,
    medical_conditions,
    fitness_goals,
    available_equipment
  )
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    ARRAY[]::text[],
    ARRAY[]::text[],
    ARRAY[]::text[]
  );

  -- Create initial workout plan
  INSERT INTO public.workout_plans (profile_id)
  VALUES (new.id);

  RETURN new;
END;
$$ language plpgsql security definer;