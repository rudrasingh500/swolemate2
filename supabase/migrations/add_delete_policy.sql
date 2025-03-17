-- Add DELETE policy to workout_logs table
CREATE POLICY "Users can delete own workout logs" 
  ON workout_logs 
  FOR DELETE 
  USING (auth.uid() = profile_id);
