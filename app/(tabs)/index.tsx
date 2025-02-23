import { StyleSheet, View, ImageBackground, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/supabase.types';
import { router } from 'expo-router';

type WorkoutPlan = Database['public']['Tables']['workout_plans']['Row'];

export default function TabsMainScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [workoutStreak, setWorkoutStreak] = useState(0);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [tomorrowWorkouts, setTomorrowWorkouts] = useState<any[]>([]);


  useEffect(() => {
    fetchWorkoutPlan();
  }, []);

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
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  }

  if (!workoutPlan?.plan_data || (workoutPlan.plan_data as any[]).length === 0) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <View style={styles.content}>
              <View style={styles.emptyStateContainer}>
                <View style={styles.streakContainerEmpty}>
                  <Text h1 style={styles.streakNumberEmpty}>{workoutStreak}</Text>
                  <Text style={styles.streakTextEmpty}>Day Streak</Text>
                </View>

                <View style={styles.noWorkoutPlanContent}>
                  <Text h3 style={styles.welcomeText}>Welcome to Swolemate</Text>
                  <Text style={styles.noWorkoutPlanText}>
                    Let's start your fitness journey by creating a personalized workout plan
                  </Text>
                  <View style={styles.buttonContainer}>
                    <Button
                      title="Create Workout Plan"
                      onPress={() => router.push('/workout-plan')}
                      containerStyle={[styles.createPlanButton, { width: '100%', maxWidth: 300 }]}
                      buttonStyle={styles.createPlanButtonStyle}
                      titleStyle={styles.buttonTitleStyle}
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
                      containerStyle={[styles.createPlanButton, { width: '100%', maxWidth: 300 }]}
                      buttonStyle={styles.analysisButtonStyle}
                      titleStyle={styles.buttonTitleStyle}
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
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.streakContainer}>
              <Text h2 style={styles.streakNumber}>{workoutStreak}</Text>
              <Text style={styles.streakText}>Day Streak</Text>
            </View>

            <View style={styles.workoutsContainer}>
              <Text style={styles.sectionTitle}>Today's Workouts</Text>
              <ScrollView style={styles.workoutsList}>
                {workouts.length > 0 ? (
                  workouts.map(workout => (
                    <View key={workout.id} style={styles.workoutItem}>
                      <TouchableOpacity
                        style={styles.workoutInfo}
                        onPress={() => {
                          router.push({
                            pathname: '/exercise-details',
                            params: { name: workout.name }
                          });
                        }}
                      >
                        <View>
                          <Text style={styles.workoutName}>{workout.name}</Text>
                          <Text style={styles.workoutDuration}>{workout.duration}</Text>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.statusContainer}>
                        <Text style={[styles.workoutStatus, workout.completed ? styles.completed : styles.scheduled]}>
                          {workout.completed ? 'Completed' : 'Scheduled'}
                        </Text>
                        <TouchableOpacity
                          onPress={() => toggleWorkoutCompletion(workout.id)}
                          style={styles.checkboxContainer}
                        >
                          <View style={[styles.checkbox, workout.completed && styles.checkboxCompleted]}>
                            {workout.completed && <Text style={styles.checkmark}>✓</Text>}
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.noWorkoutsContainer}>
                    <Text style={styles.noWorkoutsText}>No workouts scheduled for today</Text>
                  </View>
                )}
              </ScrollView>

              <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Tomorrow's Plans</Text>
              <ScrollView style={styles.workoutsList}>
                {tomorrowWorkouts.length > 0 ? (
                  tomorrowWorkouts.map(workout => (
                    <View key={workout.id} style={styles.workoutItem}>
                      <TouchableOpacity
                        style={styles.workoutInfo}
                        onPress={() => {
                          router.push({
                            pathname: '/exercise-details',
                            params: { name: workout.name }
                          });
                        }}
                      >
                        <View>
                          <Text style={styles.workoutName}>{workout.name}</Text>
                          <Text style={styles.workoutDuration}>{workout.duration}</Text>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.statusContainer}>
                        <Text style={[styles.workoutStatus, styles.planned]}>Planned</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.noWorkoutsContainer}>
                    <Text style={styles.noWorkoutsText}>No workouts scheduled for tomorrow</Text>
                  </View>
                )}
              </ScrollView>

              <Button
                title="Workout Form Analysis"
                onPress={() => router.push('/form-analysis')}
                containerStyle={[styles.analysisButtonContainer, { overflow: 'hidden', borderRadius: 10 }]}
                buttonStyle={[styles.analysisButton, { borderRadius: 10, backgroundColor: '#e74c3c' }]}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  noWorkoutsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 10,
  },
  noWorkoutsText: {
    color: '#e0e0e0',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingTop: 40,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  streakContainerEmpty: {
    alignItems: 'center',
    marginBottom: 60,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    padding: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  streakNumberEmpty: {
    color: '#e74c3c',
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  streakTextEmpty: {
    color: '#e74c3c',
    fontSize: 20,
    opacity: 0.8,
  },
  welcomeText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 32,
  },
  noWorkoutPlanText: {
    color: '#e0e0e0',
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    alignItems: 'center',
  },
  createPlanButton: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 10,
    overflow: 'hidden',
  },
  createPlanButtonStyle: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
    height: 50,
  },
  analysisButtonStyle: {
    backgroundColor: 'rgba(231, 76, 60, 0.6)',
    paddingVertical: 15,
    borderRadius: 10,
    height: 50,
  },
  buttonTitleStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    padding: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  streakNumber: {
    color: '#e74c3c',
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  streakText: {
    color: '#e74c3c',
    fontSize: 20,
    opacity: 0.8,
  },
  workoutsContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  workoutsList: {
    flex: 1,
    marginBottom: 15,
  },
  workoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  workoutInfo: {
    flex: 1,
    marginRight: 15,
  },
  workoutName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  workoutDuration: {
    color: '#e0e0e0',
    fontSize: 14,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  workoutStatus: {
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  completed: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    color: '#2ecc71',
  },
  scheduled: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    color: '#e74c3c',
  },
  planned: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    color: '#3498db',
  },
  checkboxContainer: {
    padding: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#e74c3c',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
  },
  analysisButtonContainer: {
    marginTop: 20,
    width: '100%',
  },
  analysisButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
  },
  noWorkoutPlanContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});