import { View, ImageBackground, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/supabase';
import { Database } from '../../lib/supabase/supabase.types';
import { router, useNavigation } from 'expo-router';
import home_styles from '@/styles/home_style';
import { WorkoutPlan } from '@/types/workout';

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
            <View style={home_styles.content}>
              <View style={home_styles.emptyStateContainer}>
                <View style={home_styles.streakContainerEmpty}>
                  <Text h1 style={home_styles.streakNumberEmpty}>{workoutStreak}</Text>
                  <Text style={home_styles.streakTextEmpty}>Day Streak</Text>
                </View>

                <View style={home_styles.noWorkoutPlanContent}>
                  <Text h3 style={home_styles.welcomeText}>Welcome to Swolemate</Text>
                  <Text style={home_styles.noWorkoutPlanText}>
                    Let's start your fitness journey by creating a personalized workout plan
                  </Text>
                  <View style={home_styles.buttonContainer}>
                    <Button
                      title="Create Workout Plan"
                      onPress={() => router.push('/workout-plan')}
                      containerStyle={[home_styles.createPlanButton, { width: '100%', maxWidth: 300 }]}
                      buttonStyle={home_styles.createPlanButtonStyle}
                      titleStyle={home_styles.buttonTitleStyle}
                      icon={{
                        name: 'plus-circle',
                        type: 'feather',
                        size: 20,
                        color: 'white',
                        style: { marginRight: 10 }
                      }}
                    />
                    <Button
                      title="Workout Form Analysis"
                      onPress={() => router.push('/form-analysis')}
                      containerStyle={[home_styles.createPlanButton, { width: '100%', maxWidth: 300 }]}
                      buttonStyle={home_styles.analysisButtonStyle}
                      titleStyle={home_styles.buttonTitleStyle}
                      icon={{
                        name: 'camera',
                        type: 'feather',
                        size: 20,
                        color: 'white',
                        style: { marginRight: 10 }
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
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
          <View style={home_styles.content}>
            <View style={home_styles.streakContainer}>
              <Text h2 style={home_styles.streakNumber}>{workoutStreak}</Text>
              <Text style={home_styles.streakText}>Day Streak</Text>
            </View>

            <View style={home_styles.workoutsContainer}>
              <Text style={home_styles.sectionTitle}>Today's Workouts</Text>
              <ScrollView style={home_styles.workoutsList}>
                {workouts.length > 0 ? (
                  workouts.map(workout => (
                    <View key={workout.id} style={home_styles.workoutItem}>
                      <TouchableOpacity
                        style={home_styles.workoutInfo}
                        onPress={() => {
                          router.push({
                            pathname: '/exercise-details',
                            params: { name: workout.name }
                          });
                        }}
                      >
                        <View>
                          <Text style={home_styles.workoutName}>{workout.name}</Text>
                          <Text style={home_styles.workoutDuration}>{workout.duration}</Text>
                        </View>
                      </TouchableOpacity>
                      <View style={home_styles.statusContainer}>
                        <Text style={[home_styles.workoutStatus, workout.completed ? home_styles.completed : home_styles.scheduled]}>
                          {workout.completed ? 'Completed' : 'Scheduled'}
                        </Text>
                        <TouchableOpacity
                          onPress={() => toggleWorkoutCompletion(workout.id)}
                          style={home_styles.checkboxContainer}
                        >
                          <View style={[home_styles.checkbox, workout.completed && home_styles.checkboxCompleted]}>
                            {workout.completed && <Text style={home_styles.checkmark}>✓</Text>}
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={home_styles.noWorkoutsContainer}>
                    <Text style={home_styles.noWorkoutsText}>No workouts scheduled for today</Text>
                  </View>
                )}
              </ScrollView>

              <Text style={[home_styles.sectionTitle, { marginTop: 30 }]}>Tomorrow's Plans</Text>
              <ScrollView style={home_styles.workoutsList}>
                {tomorrowWorkouts.length > 0 ? (
                  tomorrowWorkouts.map(workout => (
                    <View key={workout.id} style={home_styles.workoutItem}>
                      <TouchableOpacity
                        style={home_styles.workoutInfo}
                        onPress={() => {
                          router.push({
                            pathname: '/exercise-details',
                            params: { name: workout.name }
                          });
                        }}
                      >
                        <View>
                          <Text style={home_styles.workoutName}>{workout.name}</Text>
                          <Text style={home_styles.workoutDuration}>{workout.duration}</Text>
                        </View>
                      </TouchableOpacity>
                      <View style={home_styles.statusContainer}>
                        <Text style={[home_styles.workoutStatus, home_styles.planned]}>Planned</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={home_styles.noWorkoutsContainer}>
                    <Text style={home_styles.noWorkoutsText}>No workouts scheduled for tomorrow</Text>
                  </View>
                )}
              </ScrollView>

              <Button
                title="Workout Form Analysis"
                onPress={() => router.push('/form-analysis')}
                containerStyle={[home_styles.analysisButtonContainer, { overflow: 'hidden', borderRadius: 10 }]}
                buttonStyle={[home_styles.analysisButton, { borderRadius: 10, backgroundColor: '#e74c3c' }]}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
