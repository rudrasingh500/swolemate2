import { Database } from "../lib/supabase/supabase.types";

export type WorkoutLog = Database['public']['Tables']['workout_logs']['Row'];

// Exercise types
export type ExerciseType = 'strength' | 'cardio' | 'duration';

// Base set interface
interface BaseSet {
  set_number: number;
  is_completed: boolean;
}

// Strength exercise set (weight and reps)
export interface StrengthSet extends BaseSet {
  weight: number;
  reps: number;
}

// Duration exercise set (time-based)
export interface DurationSet extends BaseSet {
  duration: number;
  duration_unit: 'sec' | 'min';
}

// Cardio exercise log data
export interface CardioLogData {
  distance?: number;
  distance_unit?: 'km' | 'mi';
  duration?: number;
  duration_unit?: 'min' | 'sec';
  pace?: string;
  calories_burned?: number;
  heart_rate_avg?: number;
}

// Strength exercise log data
export interface StrengthLogData {
  sets: StrengthSet[];
}

// Duration exercise log data
export interface DurationLogData {
  sets: DurationSet[];
}

// Union type for all log data types
export type LogData = StrengthLogData | CardioLogData | DurationLogData;

// Type guards to check log data type
export function isStrengthLogData(data: LogData): data is StrengthLogData {
  return 'sets' in data && Array.isArray((data as StrengthLogData).sets) && 
    (data as StrengthLogData).sets.length > 0 && 
    'weight' in (data as StrengthLogData).sets[0] && 
    'reps' in (data as StrengthLogData).sets[0];
}

export function isDurationLogData(data: LogData): data is DurationLogData {
  return 'sets' in data && Array.isArray((data as DurationLogData).sets) && 
    (data as DurationLogData).sets.length > 0 && 
    'duration' in (data as DurationLogData).sets[0] && 
    'duration_unit' in (data as DurationLogData).sets[0];
}

export function isCardioLogData(data: LogData): data is CardioLogData {
  return !('sets' in data);
}

// Workout in progress type
export interface WorkoutInProgress {
  exerciseName: string;
  exerciseType: ExerciseType;
  logData: LogData;
  notes: string;
}

// Helper function to determine exercise type based on name
export function determineExerciseType(exerciseName: string): ExerciseType {
  const lowerName = exerciseName.toLowerCase();
  
  // Cardio exercises
  if (
    lowerName.includes('run') || 
    lowerName.includes('jog') || 
    lowerName.includes('sprint') ||
    lowerName.includes('cardio') ||
    lowerName.includes('cycling') ||
    lowerName.includes('bike') ||
    lowerName.includes('swimming') ||
    lowerName.includes('row')
  ) {
    return 'cardio';
  }
  
  // Duration-based exercises
  if (
    lowerName.includes('plank') ||
    lowerName.includes('hold') ||
    lowerName.includes('hang') ||
    lowerName.includes('static') ||
    lowerName.includes('isometric')
  ) {
    return 'duration';
  }
  
  // Default to strength
  return 'strength';
}
