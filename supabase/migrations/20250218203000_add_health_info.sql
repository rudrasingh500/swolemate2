-- Add health information columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS height decimal,
ADD COLUMN IF NOT EXISTS weight decimal,
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS medical_conditions text[],
ADD COLUMN IF NOT EXISTS activity_level text CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'very_active', 'extra_active')),
ADD COLUMN IF NOT EXISTS fitness_goals text[],
ADD COLUMN IF NOT EXISTS available_equipment text[];

-- Update the handle_new_user function to include default values
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
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
  RETURN new;
END;
$$ language plpgsql security definer;