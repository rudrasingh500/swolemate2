-- Create the storage bucket for form analysis videos
insert into storage.buckets (id, name, public)
values ('form_videos', 'form_videos', false)
on conflict (id) do nothing;

-- Add RLS policies for the form_videos bucket (adjust as needed for your auth setup)
-- Allow authenticated users to upload videos
create policy "Allow authenticated upload" on storage.objects
for insert to authenticated with check (bucket_id = 'form_videos');

-- Allow authenticated users to read their own videos (assuming user_id is part of the path or metadata)
-- This policy might need refinement based on how video paths are structured.
-- Example: Allow read if the user_id is in the path like 'user_id/video.mp4'
-- create policy "Allow authenticated read own videos" on storage.objects
-- for select to authenticated using (
--   bucket_id = 'form_videos' and
--   auth.uid()::text = split_part(name, '/', 1) -- Adjust path splitting logic if needed
-- );

-- Or, a simpler policy allowing read access to all authenticated users if ownership isn't strictly enforced by path
create policy "Allow authenticated read" on storage.objects
for select to authenticated using (bucket_id = 'form_videos');


-- Create the table to store form analysis results
create table public.form_analyses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade, -- Link to user
    video_storage_path text not null,                       -- Path to the video in the 'form_videos' bucket
    analysis_data jsonb not null,                            -- Full JSON result from Gemini
    exercise_name text generated always as (analysis_data->>'exercise') stored, -- Generated column for easy querying
    total_reps integer generated always as ((analysis_data->>'total_reps')::integer) stored, -- Generated column
    -- Consider adding an average accuracy if needed, might require calculation during insert/update
    -- average_accuracy numeric,
    created_at timestamp with time zone default now() not null
);

-- Add RLS policies for the form_analyses table
alter table public.form_analyses enable row level security;

create policy "Allow authenticated read own analyses" on public.form_analyses
for select to authenticated using (auth.uid() = user_id);

create policy "Allow authenticated insert own analyses" on public.form_analyses
for insert to authenticated with check (auth.uid() = user_id);

-- Add indexes for potentially queried columns
create index idx_form_analyses_user_id on public.form_analyses(user_id);
create index idx_form_analyses_created_at on public.form_analyses(created_at desc);