-- Create achievements table to store all available achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create user_achievements table to track user progress on achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  target INTEGER NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(profile_id, achievement_id)
);

-- Enable RLS on achievements table
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create policy for achievements table
CREATE POLICY "Anyone can view achievements" 
  ON achievements 
  FOR SELECT 
  USING (true);

-- Enable RLS on user_achievements table
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for user_achievements table
CREATE POLICY "Users can view their own achievements" 
  ON user_achievements 
  FOR SELECT 
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can update their own achievements" 
  ON user_achievements 
  FOR UPDATE 
  USING (auth.uid() = profile_id);

CREATE POLICY "System can insert user achievements"
  ON user_achievements
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for faster queries
CREATE INDEX user_achievements_profile_id_idx ON user_achievements(profile_id);
CREATE INDEX user_achievements_achievement_id_idx ON user_achievements(achievement_id);

-- Create triggers for updated_at
CREATE TRIGGER achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER user_achievements_updated_at
  BEFORE UPDATE ON user_achievements
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

-- Insert default achievements
INSERT INTO achievements (id, icon, title, description) VALUES
  (uuid_generate_v4(), '🏃', 'First Workout', 'Completed your first workout'),
  (uuid_generate_v4(), '🔥', 'Week Streak', 'Worked out 7 days in a row'),
  (uuid_generate_v4(), '⭐', 'Form Master', 'Perfect form in 5 exercises');

-- Update handle_new_user function to initialize user achievements
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  achievement_rec RECORD;
BEGIN
  -- Insert into profiles (existing code)
  INSERT INTO public.profiles (id, username, full_name, avatar_url, updated_at)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', now());
  
  -- Create initial workout plan (existing code)
  INSERT INTO public.workout_plans (profile_id)
  VALUES (new.id);
  
  -- Initialize user achievements
  FOR achievement_rec IN SELECT id, CASE 
                                    WHEN title = 'First Workout' THEN 1
                                    WHEN title = 'Week Streak' THEN 7
                                    WHEN title = 'Form Master' THEN 5
                                    ELSE 1
                                  END as target
                         FROM achievements
  LOOP
    INSERT INTO public.user_achievements (profile_id, achievement_id, progress, target)
    VALUES (new.id, achievement_rec.id, 0, achievement_rec.target);
  END LOOP;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;