import { Achievement } from "../types/profile";

export const achievements: Achievement[] = [
  {
    id: 1,
    icon: '🏃',
    title: 'First Workout',
    description: 'Completed your first workout',
    earnedDate: '2024-02-15',
    progress: '1/1 workouts'
  },
  {
    id: 2,
    icon: '🔥',
    title: 'Week Streak',
    description: 'Worked out 7 days in a row',
    earnedDate: '2024-02-20',
    progress: '7/7 days'
  },
  {
    id: 3,
    icon: '⭐',
    title: 'Form Master',
    description: 'Perfect form in 5 exercises',
    earnedDate: 'Not earned yet',
    progress: '3/5 exercises'
  }
];