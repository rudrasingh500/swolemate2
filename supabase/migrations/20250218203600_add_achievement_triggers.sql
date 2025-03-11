-- Create a function to update achievements based on user actions
CREATE OR REPLACE FUNCTION update_achievements()
RETURNS TRIGGER AS $$
DECLARE
  first_workout_id UUID;
  week_streak_id UUID;
  form_master_id UUID;
  user_achievement_id UUID;
  current_progress INTEGER;
  achievement_target INTEGER;
  current_streak_var INTEGER;
  achievement_exists BOOLEAN;
BEGIN
  -- Get the achievement IDs for the ones we want to update
  SELECT id INTO first_workout_id FROM achievements WHERE title = 'First Workout';
  SELECT id INTO week_streak_id FROM achievements WHERE title = 'Week Streak';
  SELECT id INTO form_master_id FROM achievements WHERE title = 'Form Master';
  
  -- Handle First Workout achievement
  -- Check if this is the user's first workout
  IF first_workout_id IS NOT NULL THEN
    -- Check if the user has this achievement record
    SELECT EXISTS(
      SELECT 1 FROM user_achievements 
      WHERE profile_id = NEW.profile_id AND achievement_id = first_workout_id
    ) INTO achievement_exists;
    
    IF achievement_exists THEN
      -- Get the user's current progress for this achievement
      SELECT id, progress, target 
      INTO user_achievement_id, current_progress, achievement_target
      FROM user_achievements 
      WHERE profile_id = NEW.profile_id AND achievement_id = first_workout_id;
      
      -- If the achievement hasn't been earned yet
      IF current_progress < achievement_target THEN
        -- Update the progress to 1 (completed)
        UPDATE user_achievements 
        SET progress = 1, 
            earned_at = CASE WHEN 1 >= achievement_target THEN NOW() ELSE earned_at END
        WHERE id = user_achievement_id;
      END IF;
    ELSE
      -- Create a new achievement record for the user
      INSERT INTO user_achievements (profile_id, achievement_id, progress, target, earned_at)
      VALUES (
        NEW.profile_id, 
        first_workout_id, 
        1, 
        1, 
        NOW()
      );
    END IF;
  END IF;
  
  -- Handle Week Streak achievement
  IF week_streak_id IS NOT NULL THEN
    -- Calculate the current streak using the existing function
    SELECT calculate_workout_streak(NEW.profile_id) INTO current_streak_var;
    
    -- Check if the user has this achievement record
    SELECT EXISTS(
      SELECT 1 FROM user_achievements 
      WHERE profile_id = NEW.profile_id AND achievement_id = week_streak_id
    ) INTO achievement_exists;
    
    IF achievement_exists THEN
      -- Get the user's current progress for this achievement
      SELECT id, progress, target 
      INTO user_achievement_id, current_progress, achievement_target
      FROM user_achievements 
      WHERE profile_id = NEW.profile_id AND achievement_id = week_streak_id;
      
      -- Update the progress to the current streak
      UPDATE user_achievements 
      SET progress = current_streak_var, 
          earned_at = CASE WHEN current_streak_var >= achievement_target THEN NOW() ELSE earned_at END
      WHERE id = user_achievement_id;
    ELSE
      -- Create a new achievement record for the user
      INSERT INTO user_achievements (profile_id, achievement_id, progress, target, earned_at)
      VALUES (
        NEW.profile_id, 
        week_streak_id, 
        current_streak_var, 
        7, 
        CASE WHEN current_streak_var >= 7 THEN NOW() ELSE NULL END
      );
    END IF;
  END IF;
  
  -- Handle Form Master achievement
  IF form_master_id IS NOT NULL THEN
    -- Check if this is a new exercise (not previously completed)
    IF NOT EXISTS (
      SELECT 1 FROM completed_workouts 
      WHERE profile_id = NEW.profile_id 
      AND exercise_name = NEW.exercise_name 
      AND id <> NEW.id
    ) THEN
      -- Check if the user has this achievement record
      SELECT EXISTS(
        SELECT 1 FROM user_achievements 
        WHERE profile_id = NEW.profile_id AND achievement_id = form_master_id
      ) INTO achievement_exists;
      
      IF achievement_exists THEN
        -- Get the user's current progress for this achievement
        SELECT id, progress, target 
        INTO user_achievement_id, current_progress, achievement_target
        FROM user_achievements 
        WHERE profile_id = NEW.profile_id AND achievement_id = form_master_id;
        
        -- If the achievement hasn't been earned yet
        IF current_progress < achievement_target THEN
          -- Increment the progress by 1 for a new exercise
          UPDATE user_achievements 
          SET progress = progress + 1, 
              earned_at = CASE WHEN progress + 1 >= achievement_target THEN NOW() ELSE earned_at END
          WHERE id = user_achievement_id;
        END IF;
      ELSE
        -- Create a new achievement record for the user
        INSERT INTO user_achievements (profile_id, achievement_id, progress, target)
        VALUES (
          NEW.profile_id, 
          form_master_id, 
          1, 
          5
        );
      END IF;
    END IF;
  END IF;
  
  -- Update the workout_plans table with the current streak
  UPDATE workout_plans
  SET current_streak = current_streak_var,
      longest_streak = GREATEST(longest_streak, current_streak_var),
      last_workout_date = NEW.completed_at
  WHERE profile_id = NEW.profile_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to run after a workout is completed or updated (if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'after_workout_completed') THEN
    CREATE TRIGGER after_workout_completed
      AFTER INSERT ON completed_workouts
      FOR EACH ROW
      EXECUTE FUNCTION update_achievements();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'after_workout_updated') THEN
    CREATE TRIGGER after_workout_updated
      AFTER UPDATE OF is_active ON completed_workouts
      FOR EACH ROW
      WHEN (OLD.is_active <> NEW.is_active)
      EXECUTE FUNCTION update_achievements();
  END IF;
END
$$;

-- Add comment to explain the trigger
COMMENT ON FUNCTION update_achievements() IS 'Updates user achievements based on completed workouts';
COMMENT ON TRIGGER after_workout_completed ON completed_workouts IS 'Trigger to update achievements after a workout is completed';