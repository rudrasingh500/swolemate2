/*
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
  IF TG_TABLE_NAME = 'completed_workouts' THEN
    -- Check if the user has this achievement record
    SELECT EXISTS (
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
        -- Increment progress and check if earned
        UPDATE user_achievements
        SET progress = progress + 1,
            earned_at = CASE WHEN 1 >= achievement_target THEN NOW() ELSE earned_at END
        WHERE id = user_achievement_id;
      END IF;
    ELSE
      -- Create a new achievement record for the user
      INSERT INTO user_achievements (profile_id, achievement_id, progress, target, earned_at)
      VALUES (NEW.profile_id, first_workout_id, 1, (SELECT target FROM achievements WHERE id = first_workout_id), 
              CASE WHEN 1 >= (SELECT target FROM achievements WHERE id = first_workout_id) THEN NOW() ELSE NULL END);
    END IF;
  END IF;

  -- Handle Week Streak achievement
  IF TG_TABLE_NAME = 'user_streaks' THEN
    -- Get the current streak for the user
    SELECT current_streak INTO current_streak_var
    FROM user_streaks
    WHERE profile_id = NEW.profile_id;

    -- Check if the user has this achievement record
    SELECT EXISTS (
      SELECT 1 FROM user_achievements
      WHERE profile_id = NEW.profile_id AND achievement_id = week_streak_id
    ) INTO achievement_exists;

    IF achievement_exists THEN
      -- Get the user's current progress for this achievement
      SELECT id, progress, target
      INTO user_achievement_id, current_progress, achievement_target
      FROM user_achievements
      WHERE profile_id = NEW.profile_id AND achievement_id = week_streak_id;

      -- Update progress and check if earned
      UPDATE user_achievements
      SET progress = current_streak_var,
          earned_at = CASE WHEN current_streak_var >= achievement_target THEN NOW() ELSE earned_at END
      WHERE id = user_achievement_id;
    ELSE
      -- Create a new achievement record for the user
      INSERT INTO user_achievements (profile_id, achievement_id, progress, target, earned_at)
      VALUES (NEW.profile_id, week_streak_id, current_streak_var, 
              (SELECT target FROM achievements WHERE id = week_streak_id), 
              CASE WHEN current_streak_var >= (SELECT target FROM achievements WHERE id = week_streak_id) THEN NOW() ELSE NULL END);
    END IF;
  END IF;

  -- Handle Form Master achievement
  IF TG_TABLE_NAME = 'form_analysis_results' THEN
    -- Check if the form score is good (e.g., >= 80)
    IF NEW.overall_score >= 80 THEN
      -- Check if the user has this achievement record
      SELECT EXISTS (
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
          -- Increment progress and check if earned
          UPDATE user_achievements
          SET progress = progress + 1,
              earned_at = CASE WHEN progress + 1 >= achievement_target THEN NOW() ELSE earned_at END
          WHERE id = user_achievement_id;
        END IF;
      ELSE
        -- Create a new achievement record for the user
        INSERT INTO user_achievements (profile_id, achievement_id, progress, target)
        VALUES (NEW.profile_id, form_master_id, 1, (SELECT target FROM achievements WHERE id = form_master_id));
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger on completed_workouts table
DROP TRIGGER IF EXISTS after_workout_completed ON completed_workouts;
CREATE TRIGGER after_workout_completed
AFTER INSERT ON completed_workouts
FOR EACH ROW
EXECUTE FUNCTION update_achievements();

-- Create a trigger on user_streaks table
DROP TRIGGER IF EXISTS after_streak_updated ON user_streaks;
CREATE TRIGGER after_streak_updated
AFTER INSERT OR UPDATE ON user_streaks
FOR EACH ROW
EXECUTE FUNCTION update_achievements();

-- Create a trigger on form_analysis_results table
DROP TRIGGER IF EXISTS after_form_analysis_completed ON form_analysis_results;
CREATE TRIGGER after_form_analysis_completed
AFTER INSERT ON form_analysis_results
FOR EACH ROW
EXECUTE FUNCTION update_achievements();

COMMENT ON FUNCTION update_achievements() IS 'Updates user achievements based on completed workouts';
COMMENT ON TRIGGER after_workout_completed ON completed_workouts IS 'Trigger to update achievements after a workout is completed';
COMMENT ON TRIGGER after_streak_updated ON user_streaks IS 'Trigger to update achievements after a streak is updated';
COMMENT ON TRIGGER after_form_analysis_completed ON form_analysis_results IS 'Trigger to update achievements after form analysis is completed';
*/