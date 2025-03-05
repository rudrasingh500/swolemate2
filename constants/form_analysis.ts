// Constants for form analysis components

// Analysis data structure for workout form evaluations
export const PLACEHOLDER_ANALYSIS = {
  overallScore: 85,
  generalFeedback: 'Overall form is good with room for improvement. Focus on maintaining proper alignment and control throughout the movement.',
  recommendations: [
    'Keep your core engaged throughout the movement',
    'Watch your knee alignment on descent',
    'Maintain a neutral spine position',
    'Focus on proper form throughout the movement'
  ],
  reps: [
    {
      repNumber: 1,
      score: 88,
      mistakes: [
        {
          issue: 'Knee caving inward slightly',
          correction: 'Focus on pushing knees outward in line with toes',
          imageUrl: require('../assets/images/background.png') // Placeholder image
        }
      ],
      feedback: 'Good depth and control, minor knee alignment issue'
    },
    {
      repNumber: 2,
      score: 82,
      mistakes: [
        {
          issue: 'Slight forward lean',
          correction: 'Keep chest up and core engaged',
          imageUrl: require('../assets/images/background.png') // Placeholder image
        }
      ],
      feedback: 'Maintain more upright posture'
    }
  ],
  workoutAdjustment: {
    recommendation: 'Based on your form analysis, we recommend:',
    changes: [
      'Maintain current weight but focus on form improvements',
      'Add 2-3 additional warm-up sets',
      'Consider incorporating mobility work for hip flexors'
    ]
  }
};

// Sample past evaluations for display in the form analysis screen
export const PAST_EVALUATIONS = [
  {
    id: 1,
    date: '2024-02-15',
    exercise: 'Deadlift',
    score: 78,
    feedback: 'Keep your back straight throughout the movement.',
  },
  {
    id: 2,
    date: '2024-02-12',
    exercise: 'Bench Press',
    score: 92,
    feedback: 'Excellent form and control.',
  },
];

// Recent evaluation sample data
export const RECENT_EVALUATION = {
  date: '2024-02-17',
  exercise: 'Squat',
  score: 85,
  feedback: 'Good form overall. Watch knee alignment.',
};