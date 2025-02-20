/*
  # Create storage bucket for workout videos

  1. New Storage Bucket
    - `workout-videos` bucket for storing user workout videos
  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their own videos
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name)
VALUES ('workout-videos', 'workout-videos')
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can upload their own workout videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'workout-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own workout videos"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'workout-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own workout videos"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'workout-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own workout videos"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'workout-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);