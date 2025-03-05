// Type definitions for questionnaire components

// Medical Info Types
export type MedicalCondition = 'none' | 'diabetes' | 'hypertension' | 'heart_disease' | 'asthma' | 'injury';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

// Fitness Goals Types
export type Goal = 'build_muscle' | 'lose_weight' | 'improve_strength' | 'increase_endurance' | 'better_flexibility';

// Lifestyle Preferences Types
export type WorkoutEnvironment = 'gym' | 'home' | 'outdoors';
export type DietaryPreference = 'balanced' | 'vegan' | 'vegetarian' | 'keto' | 'paleo' | 'other';
export type WorkoutFrequency = 'never' | '1-2_times' | '3-4_times' | '5-6_times' | 'daily';
export type WorkoutDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Equipment Access Types
export type Equipment = 'dumbbells' | 'barbell' | 'bench' | 'squat_rack' | 'cables' | 'cardio_machines' | 'resistance_bands' | 'bodyweight_only';