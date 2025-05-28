import { EnhancedWorkoutPlan, WorkoutCategory } from '../types/enhanced-workout';

// STRENGTH TRAINING PROGRAMS
const strongLifts5x5: EnhancedWorkoutPlan = {
  id: 'stronglifts_5x5',
  title: 'StrongLifts 5×5',
  description: 'A proven strength building program focusing on compound movements with progressive overload.',
  level: 'Beginner',
  category: 'Strength',
  subCategory: 'Linear Progression',
  duration: '12 weeks',
  daysPerWeek: 3,
  estimatedTimePerSession: '45-60 minutes',
  equipment: ['Barbell', 'Weight plates', 'Squat rack', 'Bench'],
  targetMuscleGroups: ['Legs', 'Back', 'Chest', 'Shoulders', 'Arms'],
  primaryGoals: ['Build strength', 'Learn proper form', 'Increase muscle mass'],
  difficultyRating: 4,
  tags: ['Compound movements', 'Progressive overload', 'Full body'],
  prerequisites: ['Basic gym knowledge'],
  benefits: [
    'Rapid strength gains',
    'Simple and effective',
    'Builds muscle mass',
    'Improves bone density'
  ],
  whatToExpect: [
    'Increase weight every workout',
    'Focus on 5 compound exercises',
    'Rest days are crucial for recovery',
    'Expect plateau around week 8-12'
  ],
  singleWeekTemplate: [
    {
      day: 'Monday',
      title: 'Workout A',
      description: 'Squat, Bench Press, Barbell Row',
      estimatedDuration: '45-60 minutes',
      warmup: [
        {
          name: 'Light cardio',
          sets: 1,
          reps: '5-10 minutes',
          muscleGroups: ['Full body'],
          difficulty: 'Beginner',
          equipment: ['Treadmill or bike']
        },
        {
          name: 'Dynamic stretching',
          sets: 1,
          reps: '5 minutes',
          muscleGroups: ['Full body'],
          difficulty: 'Beginner',
          equipment: ['None']
        }
      ],
      exercises: [
        {
          name: 'Squat',
          sets: 5,
          reps: '5',
          restTime: '3-5 minutes',
          muscleGroups: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
          difficulty: 'Intermediate',
          equipment: ['Barbell', 'Squat rack'],
          instructions: [
            'Set bar at chest height',
            'Position bar on upper traps',
            'Walk out and set feet shoulder-width apart',
            'Break at hips and knees simultaneously',
            'Descend until hip crease below knee',
            'Drive through heels to stand'
          ],
          form_tips: [
            'Keep chest up and core tight',
            'Knees track over toes',
            'Full depth for maximum benefit'
          ],
          alternativeExercises: ['Goblet squat', 'Front squat', 'Box squat']
        },
        {
          name: 'Bench Press',
          sets: 5,
          reps: '5',
          restTime: '3-5 minutes',
          muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
          difficulty: 'Intermediate',
          equipment: ['Barbell', 'Bench'],
          instructions: [
            'Lie on bench with eyes under the bar',
            'Grip bar slightly wider than shoulders',
            'Create arch in lower back',
            'Unrack and lower to chest',
            'Press bar back to start position'
          ],
          form_tips: [
            'Keep shoulders pinned back',
            'Touch chest lightly',
            'Drive through legs for power'
          ],
          alternativeExercises: ['Dumbbell press', 'Push-ups', 'Incline press']
        },
        {
          name: 'Barbell Row',
          sets: 5,
          reps: '5',
          restTime: '3-5 minutes',
          muscleGroups: ['Back', 'Biceps', 'Rear delts'],
          difficulty: 'Intermediate',
          equipment: ['Barbell'],
          instructions: [
            'Deadlift bar to standing position',
            'Hinge at hips to 45-degree angle',
            'Let bar hang at arms length',
            'Pull bar to lower chest/upper abs',
            'Lower with control'
          ],
          form_tips: [
            'Keep back straight',
            'Pull with back muscles, not arms',
            'Squeeze shoulder blades together'
          ],
          alternativeExercises: ['T-bar row', 'Dumbbell row', 'Chest-supported row']
        }
      ],
      cooldown: [
        {
          name: 'Static stretching',
          sets: 1,
          reps: '10 minutes',
          muscleGroups: ['Full body'],
          difficulty: 'Beginner',
          equipment: ['None']
        }
      ]
    },
    {
      day: 'Wednesday',
      title: 'Workout B',
      description: 'Squat, Overhead Press, Deadlift',
      estimatedDuration: '45-60 minutes',
      exercises: [
        {
          name: 'Squat',
          sets: 5,
          reps: '5',
          restTime: '3-5 minutes',
          muscleGroups: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
          difficulty: 'Intermediate',
          equipment: ['Barbell', 'Squat rack'],
          instructions: [
            'Set bar at chest height',
            'Position bar on upper traps',
            'Walk out and set feet shoulder-width apart',
            'Break at hips and knees simultaneously',
            'Descend until hip crease below knee',
            'Drive through heels to stand'
          ]
        },
        {
          name: 'Overhead Press',
          sets: 5,
          reps: '5',
          restTime: '3-5 minutes',
          muscleGroups: ['Shoulders', 'Triceps', 'Core'],
          difficulty: 'Intermediate',
          equipment: ['Barbell'],
          instructions: [
            'Start with bar at shoulder height',
            'Grip slightly wider than shoulders',
            'Press bar straight up overhead',
            'Lock out arms completely',
            'Lower with control to shoulders'
          ],
          form_tips: [
            'Keep core tight throughout',
            'Bar path should be straight up',
            'Squeeze glutes for stability'
          ],
          alternativeExercises: ['Dumbbell press', 'Pike push-ups', 'Seated press']
        },
        {
          name: 'Deadlift',
          sets: 1,
          reps: '5',
          restTime: '3-5 minutes',
          muscleGroups: ['Hamstrings', 'Glutes', 'Back', 'Traps'],
          difficulty: 'Advanced',
          equipment: ['Barbell'],
          instructions: [
            'Stand with feet hip-width apart',
            'Bar over mid-foot',
            'Bend down and grip bar',
            'Chest up, shoulders over bar',
            'Drive through heels and hips forward',
            'Stand tall, shoulders back'
          ],
          form_tips: [
            'Keep bar close to body',
            'Neutral spine throughout',
            'Hip hinge movement pattern'
          ],
          alternativeExercises: ['Romanian deadlift', 'Sumo deadlift', 'Trap bar deadlift']
        }
      ]
    },
    {
      day: 'Friday',
      title: 'Workout A',
      description: 'Squat, Bench Press, Barbell Row',
      estimatedDuration: '45-60 minutes',
      exercises: [
        {
          name: 'Squat',
          sets: 5,
          reps: '5',
          restTime: '3-5 minutes',
          muscleGroups: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
          difficulty: 'Intermediate',
          equipment: ['Barbell', 'Squat rack']
        },
        {
          name: 'Bench Press',
          sets: 5,
          reps: '5',
          restTime: '3-5 minutes',
          muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
          difficulty: 'Intermediate',
          equipment: ['Barbell', 'Bench']
        },
        {
          name: 'Barbell Row',
          sets: 5,
          reps: '5',
          restTime: '3-5 minutes',
          muscleGroups: ['Back', 'Biceps', 'Rear delts'],
          difficulty: 'Intermediate',
          equipment: ['Barbell']
        }
      ]
    }
  ]
};

// PUSH/PULL/LEGS PROGRAM
const pushPullLegs: EnhancedWorkoutPlan = {
  id: 'push_pull_legs',
  title: 'Push/Pull/Legs Split',
  description: 'A popular bodybuilding split targeting specific movement patterns for optimal muscle development.',
  level: 'Intermediate',
  category: 'Hypertrophy',
  subCategory: 'Split Training',
  duration: 'Ongoing',
  daysPerWeek: 6,
  estimatedTimePerSession: '60-75 minutes',
  equipment: ['Barbell', 'Dumbbells', 'Cable machine', 'Pull-up bar'],
  targetMuscleGroups: ['Chest', 'Shoulders', 'Triceps', 'Back', 'Biceps', 'Legs'],
  primaryGoals: ['Muscle growth', 'Strength increase', 'Body composition'],
  difficultyRating: 6,
  tags: ['Split training', 'Hypertrophy', 'High volume'],
  prerequisites: ['6+ months training experience', 'Good form on compound lifts'],
  benefits: [
    'High training volume per muscle group',
    'Adequate recovery between sessions',
    'Flexibility in scheduling',
    'Progressive overload friendly'
  ],
  whatToExpect: [
    'Train each muscle group twice per week',
    'Higher volume than full body routines',
    'Need good recovery between sessions',
    'Results visible in 4-6 weeks'
  ],
  singleWeekTemplate: [
    {
      day: 'Monday',
      title: 'Push Day',
      description: 'Chest, Shoulders, Triceps',
      estimatedDuration: '60-75 minutes',
      exercises: [
        {
          name: 'Bench Press',
          sets: 4,
          reps: '6-8',
          restTime: '3 minutes',
          muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
          difficulty: 'Intermediate',
          equipment: ['Barbell', 'Bench']
        },
        {
          name: 'Incline Dumbbell Press',
          sets: 3,
          reps: '8-10',
          restTime: '2-3 minutes',
          muscleGroups: ['Upper chest', 'Shoulders', 'Triceps'],
          difficulty: 'Intermediate',
          equipment: ['Dumbbells', 'Incline bench']
        },
        {
          name: 'Overhead Press',
          sets: 3,
          reps: '8-10',
          restTime: '2-3 minutes',
          muscleGroups: ['Shoulders', 'Triceps'],
          difficulty: 'Intermediate',
          equipment: ['Barbell']
        },
        {
          name: 'Lateral Raises',
          sets: 3,
          reps: '12-15',
          restTime: '1-2 minutes',
          muscleGroups: ['Side delts'],
          difficulty: 'Beginner',
          equipment: ['Dumbbells']
        },
        {
          name: 'Dips',
          sets: 3,
          reps: '10-12',
          restTime: '2 minutes',
          muscleGroups: ['Triceps', 'Chest'],
          difficulty: 'Intermediate',
          equipment: ['Dip bars']
        },
        {
          name: 'Tricep Pushdowns',
          sets: 3,
          reps: '12-15',
          restTime: '1-2 minutes',
          muscleGroups: ['Triceps'],
          difficulty: 'Beginner',
          equipment: ['Cable machine']
        }
      ]
    },
    {
      day: 'Tuesday',
      title: 'Pull Day',
      description: 'Back, Biceps',
      estimatedDuration: '60-75 minutes',
      exercises: [
        {
          name: 'Deadlift',
          sets: 4,
          reps: '5-6',
          restTime: '3-4 minutes',
          muscleGroups: ['Back', 'Hamstrings', 'Glutes'],
          difficulty: 'Advanced',
          equipment: ['Barbell']
        },
        {
          name: 'Pull-ups',
          sets: 3,
          reps: '8-10',
          restTime: '2-3 minutes',
          muscleGroups: ['Lats', 'Biceps'],
          difficulty: 'Intermediate',
          equipment: ['Pull-up bar']
        },
        {
          name: 'Barbell Rows',
          sets: 3,
          reps: '8-10',
          restTime: '2-3 minutes',
          muscleGroups: ['Back', 'Biceps'],
          difficulty: 'Intermediate',
          equipment: ['Barbell']
        },
        {
          name: 'Cable Rows',
          sets: 3,
          reps: '10-12',
          restTime: '2 minutes',
          muscleGroups: ['Back', 'Biceps'],
          difficulty: 'Beginner',
          equipment: ['Cable machine']
        },
        {
          name: 'Barbell Curls',
          sets: 3,
          reps: '10-12',
          restTime: '1-2 minutes',
          muscleGroups: ['Biceps'],
          difficulty: 'Beginner',
          equipment: ['Barbell']
        },
        {
          name: 'Hammer Curls',
          sets: 3,
          reps: '12-15',
          restTime: '1-2 minutes',
          muscleGroups: ['Biceps', 'Forearms'],
          difficulty: 'Beginner',
          equipment: ['Dumbbells']
        }
      ]
    },
    {
      day: 'Wednesday',
      title: 'Legs Day',
      description: 'Quads, Hamstrings, Glutes, Calves',
      estimatedDuration: '60-75 minutes',
      exercises: [
        {
          name: 'Squat',
          sets: 4,
          reps: '6-8',
          restTime: '3-4 minutes',
          muscleGroups: ['Quads', 'Glutes'],
          difficulty: 'Intermediate',
          equipment: ['Barbell', 'Squat rack']
        },
        {
          name: 'Romanian Deadlift',
          sets: 3,
          reps: '8-10',
          restTime: '2-3 minutes',
          muscleGroups: ['Hamstrings', 'Glutes'],
          difficulty: 'Intermediate',
          equipment: ['Barbell']
        },
        {
          name: 'Leg Press',
          sets: 3,
          reps: '12-15',
          restTime: '2 minutes',
          muscleGroups: ['Quads', 'Glutes'],
          difficulty: 'Beginner',
          equipment: ['Leg press machine']
        },
        {
          name: 'Walking Lunges',
          sets: 3,
          reps: '12 each leg',
          restTime: '2 minutes',
          muscleGroups: ['Quads', 'Glutes'],
          difficulty: 'Intermediate',
          equipment: ['Dumbbells']
        },
        {
          name: 'Leg Curls',
          sets: 3,
          reps: '12-15',
          restTime: '1-2 minutes',
          muscleGroups: ['Hamstrings'],
          difficulty: 'Beginner',
          equipment: ['Leg curl machine']
        },
        {
          name: 'Calf Raises',
          sets: 4,
          reps: '15-20',
          restTime: '1 minute',
          muscleGroups: ['Calves'],
          difficulty: 'Beginner',
          equipment: ['Calf raise machine']
        }
      ]
    }
  ]
};

// HIIT FAT LOSS PROGRAM
const hiitFatLoss: EnhancedWorkoutPlan = {
  id: 'hiit_fat_loss',
  title: 'HIIT Fat Loss Circuit',
  description: 'High-intensity interval training designed for maximum calorie burn and fat loss.',
  level: 'Intermediate',
  category: 'Fat Loss',
  subCategory: 'HIIT',
  duration: '6 weeks',
  daysPerWeek: 4,
  estimatedTimePerSession: '30-40 minutes',
  equipment: ['Dumbbells', 'Kettlebell', 'Jump rope', 'None for bodyweight'],
  targetMuscleGroups: ['Full body'],
  primaryGoals: ['Fat loss', 'Cardiovascular fitness', 'Metabolic conditioning'],
  difficultyRating: 7,
  tags: ['HIIT', 'Fat loss', 'Cardio', 'Time efficient'],
  prerequisites: ['Basic fitness level', 'No injuries'],
  benefits: [
    'Rapid fat loss',
    'Improved cardiovascular health',
    'Time efficient workouts',
    'Increased metabolism'
  ],
  whatToExpect: [
    'High intensity intervals',
    'Short rest periods',
    'Full body engagement',
    'Results in 2-3 weeks'
  ],
  singleWeekTemplate: [
    {
      day: 'Monday',
      title: 'Full Body HIIT',
      description: 'Bodyweight circuit training',
      estimatedDuration: '30 minutes',
      exercises: [
        {
          name: 'Burpees',
          sets: 4,
          reps: '30 seconds work, 15 seconds rest',
          muscleGroups: ['Full body'],
          difficulty: 'Advanced',
          equipment: ['None']
        },
        {
          name: 'Mountain Climbers',
          sets: 4,
          reps: '30 seconds work, 15 seconds rest',
          muscleGroups: ['Core', 'Shoulders'],
          difficulty: 'Intermediate',
          equipment: ['None']
        },
        {
          name: 'Jump Squats',
          sets: 4,
          reps: '30 seconds work, 15 seconds rest',
          muscleGroups: ['Legs', 'Glutes'],
          difficulty: 'Intermediate',
          equipment: ['None']
        },
        {
          name: 'Push-ups',
          sets: 4,
          reps: '30 seconds work, 15 seconds rest',
          muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
          difficulty: 'Intermediate',
          equipment: ['None']
        },
        {
          name: 'High Knees',
          sets: 4,
          reps: '30 seconds work, 15 seconds rest',
          muscleGroups: ['Legs', 'Core'],
          difficulty: 'Beginner',
          equipment: ['None']
        }
      ]
    },
    {
      day: 'Wednesday',
      title: 'Strength HIIT',
      description: 'Weight-based interval training',
      estimatedDuration: '35 minutes',
      exercises: [
        {
          name: 'Kettlebell Swings',
          sets: 5,
          reps: '40 seconds work, 20 seconds rest',
          muscleGroups: ['Hamstrings', 'Glutes', 'Core'],
          difficulty: 'Intermediate',
          equipment: ['Kettlebell']
        },
        {
          name: 'Dumbbell Thrusters',
          sets: 5,
          reps: '40 seconds work, 20 seconds rest',
          muscleGroups: ['Full body'],
          difficulty: 'Advanced',
          equipment: ['Dumbbells']
        },
        {
          name: 'Renegade Rows',
          sets: 5,
          reps: '40 seconds work, 20 seconds rest',
          muscleGroups: ['Back', 'Core'],
          difficulty: 'Advanced',
          equipment: ['Dumbbells']
        },
        {
          name: 'Goblet Squats',
          sets: 5,
          reps: '40 seconds work, 20 seconds rest',
          muscleGroups: ['Legs', 'Core'],
          difficulty: 'Intermediate',
          equipment: ['Dumbbell']
        }
      ]
    }
  ]
};

// BODYWEIGHT PROGRAM
const bodyweightMastery: EnhancedWorkoutPlan = {
  id: 'bodyweight_mastery',
  title: 'Bodyweight Mastery',
  description: 'Build strength and muscle using only your bodyweight - perfect for home workouts.',
  level: 'All Levels',
  category: 'Bodyweight',
  subCategory: 'Progressive Calisthenics',
  duration: '8 weeks',
  daysPerWeek: 4,
  estimatedTimePerSession: '30-45 minutes',
  equipment: ['None', 'Pull-up bar (optional)'],
  targetMuscleGroups: ['Full body'],
  primaryGoals: ['Functional strength', 'Body control', 'Muscle endurance'],
  difficultyRating: 5,
  tags: ['Bodyweight', 'Home workout', 'Progressive'],
  prerequisites: ['None'],
  benefits: [
    'No equipment needed',
    'Improves functional strength',
    'Better body awareness',
    'Can be done anywhere'
  ],
  whatToExpect: [
    'Progressive difficulty increases',
    'Focus on form and control',
    'Bodyweight exercise mastery',
    'Visible strength gains in 4-6 weeks'
  ],
  singleWeekTemplate: [
    {
      day: 'Monday',
      title: 'Upper Body Power',
      description: 'Push-up variations and pulling movements',
      estimatedDuration: '35 minutes',
      exercises: [
        {
          name: 'Push-up Progression',
          sets: 4,
          reps: '8-15',
          restTime: '60-90 seconds',
          muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
          difficulty: 'Intermediate',
          equipment: ['None'],
          instructions: [
            'Start in plank position',
            'Lower chest to ground',
            'Push back to start position',
            'Maintain straight line from head to heels'
          ],
          form_tips: [
            'Engage core throughout',
            'Don\'t let hips sag',
            'Full range of motion'
          ],
          alternativeExercises: ['Knee push-ups', 'Incline push-ups', 'Diamond push-ups']
        },
        {
          name: 'Pike Push-ups',
          sets: 3,
          reps: '6-12',
          restTime: '60 seconds',
          muscleGroups: ['Shoulders', 'Triceps'],
          difficulty: 'Intermediate',
          equipment: ['None'],
          instructions: [
            'Start in downward dog position',
            'Lower head toward ground',
            'Push back to start position'
          ]
        },
        {
          name: 'Tricep Dips',
          sets: 3,
          reps: '8-15',
          restTime: '60 seconds',
          muscleGroups: ['Triceps', 'Shoulders'],
          difficulty: 'Intermediate',
          equipment: ['Chair or bench'],
          alternativeExercises: ['Floor dips', 'Bench dips']
        }
      ]
    },
    {
      day: 'Tuesday',
      title: 'Lower Body Strength',
      description: 'Squat and lunge variations',
      estimatedDuration: '35 minutes',
      exercises: [
        {
          name: 'Bodyweight Squats',
          sets: 4,
          reps: '15-25',
          restTime: '60 seconds',
          muscleGroups: ['Quads', 'Glutes', 'Hamstrings'],
          difficulty: 'Beginner',
          equipment: ['None']
        },
        {
          name: 'Bulgarian Split Squats',
          sets: 3,
          reps: '10-15 each leg',
          restTime: '60 seconds',
          muscleGroups: ['Quads', 'Glutes'],
          difficulty: 'Intermediate',
          equipment: ['Chair or bench']
        },
        {
          name: 'Single Leg Glute Bridges',
          sets: 3,
          reps: '12-20 each leg',
          restTime: '45 seconds',
          muscleGroups: ['Glutes', 'Hamstrings'],
          difficulty: 'Intermediate',
          equipment: ['None']
        },
        {
          name: 'Calf Raises',
          sets: 3,
          reps: '20-30',
          restTime: '45 seconds',
          muscleGroups: ['Calves'],
          difficulty: 'Beginner',
          equipment: ['None']
        }
      ]
    },
    {
      day: 'Thursday',
      title: 'Core & Conditioning',
      description: 'Core strength and cardio conditioning',
      estimatedDuration: '30 minutes',
      exercises: [
        {
          name: 'Plank Hold',
          sets: 3,
          reps: '30-60 seconds',
          restTime: '60 seconds',
          muscleGroups: ['Core', 'Shoulders'],
          difficulty: 'Intermediate',
          equipment: ['None']
        },
        {
          name: 'Mountain Climbers',
          sets: 4,
          reps: '20-30',
          restTime: '45 seconds',
          muscleGroups: ['Core', 'Shoulders', 'Legs'],
          difficulty: 'Intermediate',
          equipment: ['None']
        },
        {
          name: 'Bicycle Crunches',
          sets: 3,
          reps: '20-30',
          restTime: '45 seconds',
          muscleGroups: ['Core'],
          difficulty: 'Beginner',
          equipment: ['None']
        },
        {
          name: 'Burpees',
          sets: 3,
          reps: '8-15',
          restTime: '90 seconds',
          muscleGroups: ['Full body'],
          difficulty: 'Advanced',
          equipment: ['None']
        }
      ]
    },
    {
      day: 'Saturday',
      title: 'Full Body Flow',
      description: 'Dynamic movements and flexibility',
      estimatedDuration: '40 minutes',
      exercises: [
        {
          name: 'Sun Salutation Flow',
          sets: 3,
          reps: '5-8 flows',
          restTime: '60 seconds',
          muscleGroups: ['Full body'],
          difficulty: 'Intermediate',
          equipment: ['None']
        },
        {
          name: 'Bear Crawl',
          sets: 3,
          reps: '30 seconds',
          restTime: '60 seconds',
          muscleGroups: ['Full body'],
          difficulty: 'Intermediate',
          equipment: ['None']
        },
        {
          name: 'Dead Bug',
          sets: 3,
          reps: '10 each side',
          restTime: '45 seconds',
          muscleGroups: ['Core'],
          difficulty: 'Beginner',
          equipment: ['None']
        }
      ]
    }
  ]
};

// FLEXIBILITY & MOBILITY PROGRAM
const flexibilityFlow: EnhancedWorkoutPlan = {
  id: 'flexibility_flow',
  title: 'Flexibility & Mobility Flow',
  description: 'Improve flexibility, mobility, and reduce stress with guided stretching and yoga flows.',
  level: 'All Levels',
  category: 'Flexibility',
  subCategory: 'Yoga & Stretching',
  duration: 'Ongoing',
  daysPerWeek: 5,
  estimatedTimePerSession: '20-30 minutes',
  equipment: ['Yoga mat (optional)', 'None'],
  targetMuscleGroups: ['Full body'],
  primaryGoals: ['Flexibility', 'Stress relief', 'Injury prevention', 'Recovery'],
  difficultyRating: 3,
  tags: ['Flexibility', 'Yoga', 'Recovery', 'Mindfulness'],
  prerequisites: ['None'],
  benefits: [
    'Improved flexibility',
    'Better posture',
    'Stress reduction',
    'Enhanced recovery'
  ],
  whatToExpect: [
    'Gradual flexibility improvements',
    'Better sleep quality',
    'Reduced muscle tension',
    'Mind-body connection'
  ],
  singleWeekTemplate: [
    {
      day: 'Monday',
      title: 'Morning Energizer',
      description: 'Gentle wake-up flow to start the day',
      estimatedDuration: '20 minutes',
      exercises: [
        {
          name: 'Cat-Cow Stretch',
          sets: 1,
          reps: '10-15 movements',
          muscleGroups: ['Spine', 'Core'],
          difficulty: 'Beginner',
          equipment: ['None']
        },
        {
          name: 'Downward Dog',
          sets: 3,
          reps: '30-60 seconds',
          muscleGroups: ['Hamstrings', 'Calves', 'Shoulders'],
          difficulty: 'Beginner',
          equipment: ['None']
        },
        {
          name: 'Standing Forward Fold',
          sets: 2,
          reps: '45 seconds',
          muscleGroups: ['Hamstrings', 'Back'],
          difficulty: 'Beginner',
          equipment: ['None']
        }
      ]
    },
    {
      day: 'Wednesday',
      title: 'Hip Mobility Focus',
      description: 'Target tight hips and improve mobility',
      estimatedDuration: '25 minutes',
      exercises: [
        {
          name: 'Hip Circles',
          sets: 2,
          reps: '10 each direction',
          muscleGroups: ['Hips'],
          difficulty: 'Beginner',
          equipment: ['None']
        },
        {
          name: 'Pigeon Pose',
          sets: 2,
          reps: '60-90 seconds each side',
          muscleGroups: ['Hips', 'Glutes'],
          difficulty: 'Intermediate',
          equipment: ['None']
        },
        {
          name: 'Figure 4 Stretch',
          sets: 2,
          reps: '45 seconds each side',
          muscleGroups: ['Hips', 'Glutes'],
          difficulty: 'Beginner',
          equipment: ['None']
        }
      ]
    },
    {
      day: 'Friday',
      title: 'Evening Relaxation',
      description: 'Wind down and prepare for rest',
      estimatedDuration: '30 minutes',
      exercises: [
        {
          name: 'Child\'s Pose',
          sets: 3,
          reps: '60-90 seconds',
          muscleGroups: ['Back', 'Hips'],
          difficulty: 'Beginner',
          equipment: ['None']
        },
        {
          name: 'Legs Up Wall',
          sets: 1,
          reps: '5-10 minutes',
          muscleGroups: ['Legs', 'Back'],
          difficulty: 'Beginner',
          equipment: ['Wall']
        },
        {
          name: 'Savasana',
          sets: 1,
          reps: '5-10 minutes',
          muscleGroups: ['Full body relaxation'],
          difficulty: 'Beginner',
          equipment: ['None']
        }
      ]
    }
  ]
};

// WORKOUT CATEGORIES
export const workoutCategories: WorkoutCategory[] = [
  {
    id: 'strength',
    name: 'Strength Training',
    description: 'Build raw strength with compound movements',
    icon: 'barbell',
    color: '#e74c3c',
    plans: [strongLifts5x5]
  },
  {
    id: 'hypertrophy',
    name: 'Muscle Building',
    description: 'Maximize muscle growth and size',
    icon: 'muscle',
    color: '#3498db',
    plans: [pushPullLegs]
  },
  {
    id: 'fat_loss',
    name: 'Fat Loss',
    description: 'Burn calories and lose fat effectively',
    icon: 'fire',
    color: '#f39c12',
    plans: [hiitFatLoss]
  },
  {
    id: 'bodyweight',
    name: 'Bodyweight Training',
    description: 'No equipment needed - use your body as resistance',
    icon: 'body',
    color: '#27ae60',
    plans: [bodyweightMastery]
  },
  {
    id: 'flexibility',
    name: 'Flexibility & Recovery',
    description: 'Improve mobility and aid recovery',
    icon: 'stretch',
    color: '#9b59b6',
    plans: [flexibilityFlow]
  }
];

export const enhancedWorkoutPlans: EnhancedWorkoutPlan[] = [
  strongLifts5x5,
  pushPullLegs,
  hiitFatLoss,
  bodyweightMastery,
  flexibilityFlow
]; 