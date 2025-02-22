alter table profiles
  add column if not exists workout_environments text[],
  add column if not exists dietary_preference text,
  add column if not exists work_schedule text,
  add column if not exists work_type text;