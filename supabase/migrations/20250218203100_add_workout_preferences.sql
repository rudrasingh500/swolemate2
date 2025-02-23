alter table profiles
  add column if not exists current_workout_frequency text,
  add column if not exists planned_workout_frequency text,
  add column if not exists preferred_workout_days text[];