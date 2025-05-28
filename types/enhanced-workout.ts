export interface EnhancedExercise {
  name: string;
  sets: number;
  reps: string;
  duration?: string;
  weight?: string;
  restTime?: string;
  muscleGroups: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string[];
  instructions?: string[];
  alternativeExercises?: string[];
  form_tips?: string[];
}

export interface WorkoutWeek {
  week: number;
  description?: string;
  workouts: DayWorkout[];
}

export interface DayWorkout {
  day: string;
  title: string;
  description?: string;
  warmup?: EnhancedExercise[];
  exercises: EnhancedExercise[];
  cooldown?: EnhancedExercise[];
  estimatedDuration: string;
}

export interface EnhancedWorkoutPlan {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  category: 'Strength' | 'Hypertrophy' | 'Fat Loss' | 'Endurance' | 'Powerlifting' | 'Bodyweight' | 'HIIT' | 'Flexibility' | 'Sports';
  subCategory?: string;
  duration: string; // e.g., "4 weeks", "8 weeks", "ongoing"
  daysPerWeek: number;
  estimatedTimePerSession: string;
  equipment: string[];
  targetMuscleGroups: string[];
  primaryGoals: string[];
  difficultyRating: number; // 1-10
  weeks?: WorkoutWeek[];
  singleWeekTemplate?: DayWorkout[]; // For ongoing programs
  tags: string[];
  prerequisites?: string[];
  benefits: string[];
  whatToExpect?: string[];
}

export interface WorkoutCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  plans: EnhancedWorkoutPlan[];
}

export interface ProgressionRule {
  type: 'weekly' | 'session' | 'milestone';
  parameter: 'weight' | 'reps' | 'sets' | 'duration';
  increment: number | string;
  condition?: string;
} 