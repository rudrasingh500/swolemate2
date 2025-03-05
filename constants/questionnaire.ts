// Constants for questionnaire components
import { MedicalCondition, ActivityLevel, Goal, WorkoutEnvironment, DietaryPreference, WorkoutFrequency, WorkoutDay, Equipment } from '@/types/questionnaire';

// Medical Info Constants
export const medicalConditions = [
  { id: 'none' as MedicalCondition, title: 'No Medical Conditions', description: 'Healthy with no chronic conditions' },
  { id: 'diabetes' as MedicalCondition, title: 'Diabetes', description: 'Type 1 or Type 2 Diabetes' },
  { id: 'hypertension' as MedicalCondition, title: 'Hypertension', description: 'High blood pressure' },
  { id: 'heart_disease' as MedicalCondition, title: 'Heart Disease', description: 'Any cardiovascular conditions' },
  { id: 'asthma' as MedicalCondition, title: 'Asthma', description: 'Respiratory condition' },
  { id: 'injury' as MedicalCondition, title: 'Current Injury', description: 'Any physical injuries or limitations' },
];

export const activityLevels = [
  { id: 'sedentary' as ActivityLevel, title: 'Sedentary', description: 'Little to no exercise' },
  { id: 'light' as ActivityLevel, title: 'Lightly Active', description: '1-2 days/week of exercise' },
  { id: 'moderate' as ActivityLevel, title: 'Moderately Active', description: '3-4 days/week of exercise' },
  { id: 'active' as ActivityLevel, title: 'Active', description: '5-6 days/week of exercise' },
  { id: 'very_active' as ActivityLevel, title: 'Very Active', description: 'Exercise every day' },
];

// Fitness Goals Constants
export const fitnessGoals = [
  { id: 'build_muscle' as Goal, title: 'Build Muscle', description: 'Increase muscle mass and definition' },
  { id: 'lose_weight' as Goal, title: 'Lose Weight', description: 'Reduce body fat and improve composition' },
  { id: 'improve_strength' as Goal, title: 'Improve Strength', description: 'Increase overall strength and power' },
  { id: 'increase_endurance' as Goal, title: 'Increase Endurance', description: 'Enhance stamina and cardiovascular fitness' },
  { id: 'better_flexibility' as Goal, title: 'Better Flexibility', description: 'Improve mobility and flexibility' },
];

// Lifestyle Preferences Constants
export const workoutFrequencies = [
  { id: 'never' as WorkoutFrequency, title: 'Never', description: 'Currently not working out' },
  { id: '1-2_times' as WorkoutFrequency, title: '1-2 Times/Week', description: 'Light activity level' },
  { id: '3-4_times' as WorkoutFrequency, title: '3-4 Times/Week', description: 'Moderate activity level' },
  { id: '5-6_times' as WorkoutFrequency, title: '5-6 Times/Week', description: 'High activity level' },
  { id: 'daily' as WorkoutFrequency, title: 'Daily', description: 'Every day workout' },
];

export const workoutDayOptions = [
  { id: 'monday' as WorkoutDay, title: 'Monday' },
  { id: 'tuesday' as WorkoutDay, title: 'Tuesday' },
  { id: 'wednesday' as WorkoutDay, title: 'Wednesday' },
  { id: 'thursday' as WorkoutDay, title: 'Thursday' },
  { id: 'friday' as WorkoutDay, title: 'Friday' },
  { id: 'saturday' as WorkoutDay, title: 'Saturday' },
  { id: 'sunday' as WorkoutDay, title: 'Sunday' },
];

export const workoutEnvironments = [
  { id: 'gym' as WorkoutEnvironment, title: 'Gym', description: 'Commercial gym or fitness center' },
  { id: 'home' as WorkoutEnvironment, title: 'Home', description: 'Home workouts with available equipment' },
  { id: 'outdoors' as WorkoutEnvironment, title: 'Outdoors', description: 'Parks, trails, or outdoor spaces' },
];

export const dietaryPreferences = [
  { id: 'balanced' as DietaryPreference, title: 'Balanced Diet', description: 'Mix of all food groups' },
  { id: 'vegan' as DietaryPreference, title: 'Vegan', description: 'No animal products' },
  { id: 'vegetarian' as DietaryPreference, title: 'Vegetarian', description: 'Plant-based with dairy/eggs' },
  { id: 'keto' as DietaryPreference, title: 'Ketogenic', description: 'High-fat, low-carb' },
  { id: 'paleo' as DietaryPreference, title: 'Paleo', description: 'Whole foods based diet' },
  { id: 'other' as DietaryPreference, title: 'Other', description: 'Custom dietary preference' },
];

// Equipment Access Constants
export const equipmentList = [
  { id: 'dumbbells' as Equipment, title: 'Dumbbells', description: 'Free weights for various exercises' },
  { id: 'barbell' as Equipment, title: 'Barbell', description: 'For compound movements and heavy lifts' },
  { id: 'bench' as Equipment, title: 'Bench', description: 'For bench press and other exercises' },
  { id: 'squat_rack' as Equipment, title: 'Squat Rack', description: 'For squats and other barbell exercises' },
  { id: 'cables' as Equipment, title: 'Cable Machines', description: 'For isolation and resistance training' },
  { id: 'cardio_machines' as Equipment, title: 'Cardio Machines', description: 'Treadmill, bike, elliptical, etc.' },
  { id: 'resistance_bands' as Equipment, title: 'Resistance Bands', description: 'For mobility and resistance training' },
  { id: 'bodyweight_only' as Equipment, title: 'Bodyweight Only', description: 'No equipment needed' },
];