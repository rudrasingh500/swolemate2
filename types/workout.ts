import { Database } from "../lib/supabase/supabase.types";

export type WorkoutPlan = Database['public']['Tables']['workout_plans']['Row'];

export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  duration: string;
};

export type DailyPlan = {
  day: string;
  timeFrame: string;
  exercises: Exercise[];
};

export type PreDefinedPlan = {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  exercises: Exercise[];
};