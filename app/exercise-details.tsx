import { View, ScrollView, ImageBackground, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import detail_styles from '@/styles/excercise-details_style';
import exerciseLibrary from '@/constants/exercise_lib';
import ExerciseHeader from '@/components/exercise/ExerciseHeader';
import ExerciseOverview from '@/components/exercise/ExerciseOverview';
import TargetMuscles from '@/components/exercise/TargetMuscles';
import ExerciseInstructions from '@/components/exercise/ExerciseInstructions';
import ExerciseBenefits from '@/components/exercise/ExerciseBenefits';
import ExerciseGif from '@/components/exercise/ExerciseGif';
import ExerciseEquipment from '@/components/exercise/ExerciseEquipment';
import ProgressChart from '@/components/workout/ProgressChart';
import WorkoutHistory from '@/components/global/WorkoutHistory';
import { fetchExercises } from '@/lib/api/exercise';

interface ApiExercise {
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  id: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

// Helper function to capitalize first letter of each word
function capitalizeWords(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to convert plural exercise names to singular
function singularizeExerciseName(name: string): string {
  // Common plural endings
  if (name.endsWith('s') && !name.endsWith('ss')) {
    return name.slice(0, -1);
  }
  return name;
}

export default function ExerciseDetailsScreen() {
  const { name } = useLocalSearchParams();
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);

  // Listen for workout log updates
  useEffect(() => {
    const channel = supabase
      .channel('workout_logs_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'workout_logs'
      }, () => {
        // Increment the refresh trigger to reload workout history
        setHistoryRefreshTrigger(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  useEffect(() => {
    // Get the current user
    async function getCurrentUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }
    
    getCurrentUser();
    
    async function getExerciseData() {
      try {
        setLoading(true);
        // First try to get data from API
        if (typeof name === 'string') {
          // Process the search term to handle case sensitivity and plural forms
          const processedName = singularizeExerciseName(name.toLowerCase().trim());
          const exerciseData = await fetchExercises({ name: processedName, limit: 1 });
          
          if (exerciseData && exerciseData.length > 0) {
            const apiExercise = exerciseData[0] as ApiExercise;
            
            // Format the exercise name (capitalize and singularize)
            const formattedName = capitalizeWords(singularizeExerciseName(apiExercise.name));
            
            // Format bodyPart and equipment (capitalize)
            const formattedBodyPart = capitalizeWords(apiExercise.bodyPart);
            const formattedEquipment = capitalizeWords(apiExercise.equipment);
            const formattedTarget = capitalizeWords(apiExercise.target);
            
            // Map API data to our component structure
            setExercise({
              name: formattedName,
              gifUrl: apiExercise.gifUrl,
              bodyPart: formattedBodyPart,
              equipment: formattedEquipment,
              description: `${formattedName} is a ${formattedBodyPart} exercise using ${formattedEquipment}.`,
              duration: '30-45 mins', // Default values since API doesn't provide these
              difficulty: 'Intermediate',
              caloriesBurn: '200-300 kcal',
              targetMuscles: [formattedTarget, ...apiExercise.secondaryMuscles.map(muscle => capitalizeWords(muscle))],
              instructions: apiExercise.instructions.map(instruction => 
                instruction.charAt(0).toUpperCase() + instruction.slice(1)
              ),
              benefits: [
                `Targets the ${formattedTarget} muscle group`,
                `Improves strength and endurance`,
                `Uses ${formattedEquipment} for resistance`,
                `Enhances ${formattedBodyPart} development`
              ]
            });
            setLoading(false);
            return;
          }
        }
        
        // Fallback to local data if API fails or no results
        if (typeof name === 'string' && name in exerciseLibrary) {
          setExercise(exerciseLibrary[name as keyof typeof exerciseLibrary]);
        } else {
          setError('Exercise not found');
        }
      } catch (err) {
        console.error('Error fetching exercise:', err);
        setError('Failed to load exercise data');
        
        // Fallback to local data if available
        if (typeof name === 'string' && name in exerciseLibrary) {
          setExercise(exerciseLibrary[name as keyof typeof exerciseLibrary]);
        }
      } finally {
        setLoading(false);
      }
    }
    
    getExerciseData();
  }, [name]);

  if (loading) {
    return (
      <View style={[detail_styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={{ marginTop: 20, color: '#fff' }}>Loading exercise details...</Text>
      </View>
    );
  }

  if (error || !exercise) {
    return (
      <View style={[detail_styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff', fontSize: 18 }}>{error || 'Exercise not found'}</Text>
      </View>
    );
  }

  return (
    <View style={detail_styles.container}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={detail_styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={detail_styles.overlay}>
          <ExerciseHeader title={exercise.name} />
          <ScrollView style={detail_styles.content}>
            {exercise.gifUrl && (
              <ExerciseGif gifUrl={exercise.gifUrl} />
            )}
            
            <ExerciseOverview 
              description={exercise.description}
              duration={exercise.duration}
              difficulty={exercise.difficulty}
              caloriesBurn={exercise.caloriesBurn}
            />
            
            <ExerciseEquipment 
              equipment={exercise.equipment}
              bodyPart={exercise.bodyPart}
            />

            <TargetMuscles muscles={exercise.targetMuscles} />

            <ExerciseInstructions instructions={exercise.instructions} />

            <ExerciseBenefits benefits={exercise.benefits} />
            
            {userId && (
              <View style={detail_styles.progressSection}>
                <Text style={detail_styles.progressTitle}>Your Progress</Text>
                <ProgressChart 
                  profileId={userId} 
                  exerciseName={exercise.name} 
                />
                <WorkoutHistory
                  profileId={userId}
                  exerciseName={exercise.name}
                  refreshTrigger={historyRefreshTrigger}
                />
              </View>
            )}
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}
