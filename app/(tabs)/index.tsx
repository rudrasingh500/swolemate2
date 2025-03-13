import { View, ImageBackground, ActivityIndicator, ScrollView } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/supabase';
import { Database } from '../../lib/supabase/supabase.types';
import { router, useNavigation } from 'expo-router';
import home_styles from '@/styles/home_style';
import { WorkoutPlan } from '@/types/workout';
import WorkoutList from '@/components/home/WorkoutList';
import StreakDisplay from '@/components/home/StreakDisplay';
import EmptyStateView from '@/components/home/EmptyStateView';
import HealthWidgets from '@/components/home/HealthWidgets';

export default function TabsMainScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [workoutStreak, setWorkoutStreak] = useState(0);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [tomorrowWorkouts, setTomorrowWorkouts] = useState<any[]>([]);

  useEffect(() => {
    fetchWorkoutPlan();

    // Add focus listener
    const unsubscribe = navigation.addListener('focus', () => {
      fetchWorkoutPlan();
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [navigation]);

  const fetchWorkoutPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: plan, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('profile_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No workout plan exists, create one
          const { data: newPlan, error: createError } = await supabase
            .from('workout_plans')
            .insert([{ profile_id: user.id }])
            .select()
            .single();

          if (createError) throw createError;
          setWorkoutPlan(newPlan);
          if (newPlan) {
            setWorkoutStreak(newPlan.current_streak || 0);
          }
          return;
        }
        throw error;
      }
      setWorkoutPlan(plan);
      if (plan) {
        setWorkoutStreak(plan.current_streak || 0);
        
        // Process workout plan data
        if (plan.plan_data) {
          const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
          const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString('en-US', { weekday: 'long' });
          
          const planData = plan.plan_data as any[];
          const todayPlan = planData.find(day => day.day === today);
          const tomorrowPlan = planData.find(day => day.day === tomorrow);

          // Set today's workouts
          if (todayPlan) {
            // First, get all completed workouts for today
            const { data: completedWorkouts } = await supabase
              .from('completed_workouts')
              .select('exercise_name')
              .eq('profile_id', user.id)
              .eq('workout_plan_id', plan.id)
              .eq('is_active', true)
              .gte('completed_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
              .lte('completed_at', new Date(new Date().setHours(23, 59, 59, 999)).toISOString());

            const completedExercises = new Set(
              completedWorkouts?.map(workout => workout.exercise_name) || []
            );

            setWorkouts(todayPlan.exercises.map((exercise: any, index: number) => ({
              id: index + 1,
              name: exercise.name,
              duration: exercise.duration,
              completed: completedExercises.has(exercise.name)
            })));
          }

          // Set tomorrow's workouts
          if (tomorrowPlan) {
            setTomorrowWorkouts(tomorrowPlan.exercises.map((exercise: any, index: number) => ({
              id: index + 1,
              name: exercise.name,
              duration: exercise.duration
            })));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching workout plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWorkoutCompletion = async (id: number) => {
    if (!workoutPlan) return;

    try {
      const updatedWorkouts = workouts.map(workout =>
        workout.id === id ? { ...workout, completed: !workout.completed } : workout
      );
      
      const workout = workouts.find(w => w.id === id);
      if (!workout) return;

      const now = new Date().toISOString();
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

      // Check for existing completion record for today
      const { data: existingCompletion, error: fetchError } = await supabase
        .from('completed_workouts')
        .select('id')
        .match({
          profile_id: workoutPlan.profile_id,
          workout_plan_id: workoutPlan.id,
          exercise_name: workout.name
        })
        .gte('completed_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
        .lte('completed_at', new Date(new Date().setHours(23, 59, 59, 999)).toISOString())
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (existingCompletion) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('completed_workouts')
          .update({
            is_active: updatedWorkouts.find(w => w.id === id)?.completed,
            updated_at: now
          })
          .eq('id', existingCompletion.id);

        if (updateError) throw updateError;
      } else if (updatedWorkouts.find(w => w.id === id)?.completed) {
        // Insert new completion record
        const { error: completionError } = await supabase
          .from('completed_workouts')
          .insert({
            profile_id: workoutPlan.profile_id,
            workout_plan_id: workoutPlan.id,
            exercise_name: workout.name,
            completed_at: now,
            device_id: 'web-app',
            is_active: true
          });

        if (completionError) throw completionError;
      }

      // Get current streak from completed workouts
      const { data: streakData, error: streakError } = await supabase
        .rpc('calculate_workout_streak', { user_id: workoutPlan.profile_id });

      if (streakError) throw streakError;

      const newStreak = streakData || 0;

      // Update workout completion status and streak in database
      const { error: planError } = await supabase
        .from('workout_plans')
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, workoutPlan.longest_streak || 0),
          last_workout_date: now,
          plan_data: workoutPlan.plan_data?.map((day: any) => {
            if (day.day === today) {
              return {
                ...day,
                exercises: day.exercises.map((exercise: any, index: number) => ({
                  ...exercise,
                  completed: updatedWorkouts.find(w => w.id === index + 1)?.completed || false
                }))
              };
            }
            return day;
          })
        })
        .eq('id', workoutPlan.id);

      if (planError) throw planError;
      
      setWorkoutStreak(newStreak);
      setWorkouts(updatedWorkouts);
      
      // Update the workout plan state to reflect the changes
      if (workoutPlan.plan_data) {
        setWorkoutPlan({
          ...workoutPlan,
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, workoutPlan.longest_streak || 0),
          plan_data: workoutPlan.plan_data.map((day: any) => {
            if (day.day === today) {
              return {
                ...day,
                exercises: day.exercises.map((exercise: any, index: number) => ({
                  ...exercise,
                  completed: updatedWorkouts.find(w => w.id === index + 1)?.completed || false
                }))
              };
            }
            return day;
          })
        });
      }
    } catch (error) {
      console.error('Error updating workout completion:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={[home_styles.container, home_styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  }
  if (!workoutPlan?.plan_data || (workoutPlan.plan_data as any[]).length === 0) {
    return (
      <View style={home_styles.container}>
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={home_styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={home_styles.overlay}>
            <ScrollView style={home_styles.content} contentContainerStyle={{ flexGrow: 1 }}>
              <EmptyStateView workoutStreak={workoutStreak} />
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    );
  }
  return (
    <View style={home_styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={home_styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={home_styles.overlay}>
          <ScrollView style={home_styles.content} contentContainerStyle={{ flexGrow: 1 }}>
            <StreakDisplay streak={workoutStreak} />
            
            <HealthWidgets />

            <View style={home_styles.workoutsContainer}>
              <WorkoutList 
                title="Today's Workouts" 
                workouts={workouts} 
                onToggleCompletion={toggleWorkoutCompletion} 
              />

              <WorkoutList 
                title="Tomorrow's Plans" 
                workouts={tomorrowWorkouts} 
                isPlanned={true} 
                style={{ marginTop: 30 }} 
              />

              <Button
                title="Workout Form Analysis"
                onPress={() => router.push('/form-analysis')}
                containerStyle={[home_styles.analysisButtonContainer, { overflow: 'hidden', borderRadius: 10 }]}
                buttonStyle={[home_styles.analysisButton, { borderRadius: 10, backgroundColor: '#e74c3c' }]}
              />
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}
