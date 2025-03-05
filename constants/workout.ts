import { PreDefinedPlan } from "../types/workout";

export const preDefinedPlans: PreDefinedPlan[] = [
  {
    id: 'beginner_strength',
    title: 'Beginner Strength',
    description: 'Perfect for those new to strength training',
    level: 'Beginner',
    category: 'Strength',
    exercises: [
      { name: 'Squats', sets: 3, reps: '10', duration: '10 mins' },
      { name: 'Bench Press', sets: 3, reps: '10', duration: '10 mins' },
      { name: 'Deadlifts', sets: 3, reps: '8', duration: '10 mins' }
    ]
  },
  {
    id: 'hiit_cardio',
    title: 'HIIT Focus',
    description: 'High-intensity interval training for maximum fat burn',
    level: 'Intermediate',
    category: 'Cardio',
    exercises: [
      { name: 'Burpees', sets: 4, reps: '20', duration: '5 mins' },
      { name: 'Mountain Climbers', sets: 4, reps: '30', duration: '5 mins' },
      { name: 'Jump Rope', sets: 4, reps: '50', duration: '5 mins' }
    ]
  },
  {
    id: 'advanced_bodybuilding',
    title: 'Advanced Bodybuilding',
    description: 'Intensive muscle-building program',
    level: 'Advanced',
    category: 'Hypertrophy',
    exercises: [
      { name: 'Incline Dumbbell Press', sets: 4, reps: '12', duration: '15 mins' },
      { name: 'Barbell Rows', sets: 4, reps: '12', duration: '15 mins' },
      { name: 'Leg Press', sets: 4, reps: '15', duration: '15 mins' }
    ]
  },
  {
    id: 'core_strength',
    title: 'Core Focus',
    description: 'Build a strong and stable core',
    level: 'All Levels',
    category: 'Core',
    exercises: [
      { name: 'Planks', sets: 3, reps: '60s', duration: '8 mins' },
      { name: 'Russian Twists', sets: 3, reps: '20', duration: '8 mins' },
      { name: 'Ab Rollouts', sets: 3, reps: '12', duration: '8 mins' }
    ]
  }
];