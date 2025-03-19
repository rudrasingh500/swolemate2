import { View, ImageBackground, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/supabase';
import { Database } from '../../lib/supabase/supabase.types';
import { router, useNavigation } from 'expo-router';
import home_styles from '@/styles/home_style';
import { WorkoutPlan } from '@/types/workout';
import { ExerciseType, LogData, WorkoutInProgress } from '@/types/workout-log';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WorkoutList from '@/components/home/WorkoutList';
import StreakDisplay from '@/components/home/StreakDisplay';
import EmptyStateView from '@/components/home/EmptyStateView';
import HealthWidgets from '@/components/home/HealthWidgets';
import LoggingModal from '@/components/workout/LoggingModal';
import WorkoutHistory from '@/components/global/WorkoutHistory';

export default function TabsMainScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [workoutStreak, setWorkoutStreak] = useState(0);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [tomorrowWorkouts, setTomorrowWorkouts] = useState<any[]>([]);
  const [loggingModalVisible, setLoggingModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [workoutsInProgress, setWorkoutsInProgress] = useState<Record<string, WorkoutInProgress>>({});
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [workoutToRemove, setWorkoutToRemove] = useState<number | null>(null);

  useEffect(() => {
    fetchWorkoutPlan();
    loadWorkoutsInProgress();

    // Add focus listener
    const unsubscribe = navigation.addListener('focus', () => {
      fetchWorkoutPlan();
      loadWorkoutsInProgress();
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [navigation]);
  
  // Load workouts in progress from AsyncStorage
  const loadWorkoutsInProgress = async () => {
    try {
      const savedWorkouts = await AsyncStorage.getItem('workoutsInProgress');
      if (savedWorkouts) {
        setWorkoutsInProgress(JSON.parse(savedWorkouts));
      }
    } catch (error) {
      console.error('Error loading workouts in progress:', error);
    }
  };
  
  // Save workouts in progress to AsyncStorage
  const saveWorkoutsInProgress = async (workouts: Record<string, WorkoutInProgress>) => {
    try {
      await AsyncStorage.setItem('workoutsInProgress', JSON.stringify(workouts));
    } catch (error) {
      console.error('Error saving workouts in progress:', error);
    }
  };

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

  // Handle workout selection for logging
  const handleWorkoutSelection = (id: number) => {
    const workout = workouts.find(w => w.id === id);
    if (!workout) return;
    
    if (workout.completed) {
      // If already completed, show confirmation dialog
      setWorkoutToRemove(id);
      setShowConfirmDialog(true);
    } else {
      // Check if there's a workout in progress
      const inProgressData = workoutsInProgress[workout.name];
      setSelectedWorkout(workout);
      setLoggingModalVisible(true);
    }
  };
  
  // Handle confirmation of workout removal
  const handleConfirmRemoval = () => {
    if (workoutToRemove !== null) {
      // If confirmed, toggle it off and delete the log
      toggleWorkoutCompletion(workoutToRemove, false);
      setWorkoutToRemove(null);
    }
    setShowConfirmDialog(false);
  };

  // Handle workout log submission
  const handleLogSubmit = async (workoutLogData: LogData, exerciseType: ExerciseType, notes: string, complete: boolean) => {
    if (!workoutPlan || !selectedWorkout) return;

    try {
      const now = new Date().toISOString();
      
      if (complete) {
        // Save workout log to database
        const { data: savedLog, error: logError } = await supabase
          .from('workout_logs')
          .insert({
            profile_id: workoutPlan.profile_id,
            workout_plan_id: workoutPlan.id,
            exercise_name: selectedWorkout.name,
            exercise_type: exerciseType,
            log_data: workoutLogData,
            notes: notes,
            logged_at: now
          })
          .select()
          .single();

        if (logError) throw logError;

        // Mark workout as completed
        await toggleWorkoutCompletion(selectedWorkout.id, true);
        
        // Remove from workouts in progress if it exists
        if (workoutsInProgress[selectedWorkout.name]) {
          const updatedWorkouts = { ...workoutsInProgress };
          delete updatedWorkouts[selectedWorkout.name];
          setWorkoutsInProgress(updatedWorkouts);
          saveWorkoutsInProgress(updatedWorkouts);
        }
        
        // Trigger history refresh
        setHistoryRefreshTrigger(prev => prev + 1);
        
        // Fetch workout plan to refresh the UI
        fetchWorkoutPlan();
      } else {
        // Save workout in progress to local storage
        const updatedWorkouts = {
          ...workoutsInProgress,
          [selectedWorkout.name]: {
            exerciseName: selectedWorkout.name,
            exerciseType,
            logData: workoutLogData,
            notes
          }
        };
        setWorkoutsInProgress(updatedWorkouts);
        saveWorkoutsInProgress(updatedWorkouts);
        
        // Update UI to show workout is in progress
        const updatedWorkoutsList = workouts.map(w => 
          w.id === selectedWorkout.id ? { ...w, inProgress: true } : w
        );
        setWorkouts(updatedWorkoutsList);
      }
      
      // Close modal
      setLoggingModalVisible(false);
      setSelectedWorkout(null);
    } catch (error) {
      console.error('Error submitting workout log:', error);
    }
  };

  // Toggle workout completion
  const toggleWorkoutCompletion = async (id: number, completed: boolean) => {
    if (!workoutPlan) return;

    try {
      const updatedWorkouts = workouts.map(workout =>
        workout.id === id ? { ...workout, completed } : workout
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
        if (completed) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('completed_workouts')
            .update({
              is_active: true,
              updated_at: now
            })
            .eq('id', existingCompletion.id);

          if (updateError) throw updateError;
        } else {
          // Delete the workout log when unchecking - with more specific query
          console.log('Attempting to delete workout log for:', workout.name);
          
          // First, find the log ID to delete
          const { data: logToDelete, error: findLogError } = await supabase
            .from('workout_logs')
            .select('id')
            .eq('profile_id', workoutPlan.profile_id)
            .eq('exercise_name', workout.name)
            .gte('logged_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
            .lte('logged_at', new Date(new Date().setHours(23, 59, 59, 999)).toISOString());
            
          if (findLogError) {
            console.error('Error finding workout log to delete:', findLogError);
          } else if (logToDelete && logToDelete.length > 0) {
            console.log('Found logs to delete:', logToDelete);
            
            // Delete each log found
            for (const log of logToDelete) {
              const { error: deleteLogError } = await supabase
                .from('workout_logs')
                .delete()
                .eq('id', log.id);
                
              if (deleteLogError) {
                console.error('Error deleting workout log:', deleteLogError);
              } else {
                console.log('Successfully deleted workout log with ID:', log.id);
              }
            }
            
            // Trigger history refresh after successful deletion
            setHistoryRefreshTrigger(prev => prev + 1);
          } else {
            console.log('No workout logs found to delete');
          }
          
          // Update completion record
          const { error: updateError } = await supabase
            .from('completed_workouts')
            .update({
              is_active: false,
              updated_at: now
            })
            .eq('id', existingCompletion.id);

          if (updateError) throw updateError;
        }
      } else if (completed) {
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
          plan_data: typeof workoutPlan.plan_data === 'object' && Array.isArray(workoutPlan.plan_data) 
            ? workoutPlan.plan_data.map((day: any) => {
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
            : workoutPlan.plan_data
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
          plan_data: typeof workoutPlan.plan_data === 'object' && Array.isArray(workoutPlan.plan_data)
            ? workoutPlan.plan_data.map((day: any) => {
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
            : workoutPlan.plan_data
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
            <ScrollView 
              style={home_styles.content} 
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
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
          <ScrollView 
              style={home_styles.content} 
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
            <StreakDisplay streak={workoutStreak} />
            
            <HealthWidgets />

            <View style={home_styles.workoutsContainer}>
            <WorkoutList 
              title="Today's Workouts" 
              workouts={workouts.map(workout => ({
                ...workout,
                inProgress: !!workoutsInProgress[workout.name]
              }))} 
              onToggleCompletion={handleWorkoutSelection}
              profileId={workoutPlan.profile_id}
              showProgress={true}
            />
              
              {workoutPlan && (
                <WorkoutHistory 
                  profileId={workoutPlan.profile_id} 
                  onViewAllHistory={() => router.push('/workout-plan')} 
                  refreshTrigger={historyRefreshTrigger}
                />
              )}

              <WorkoutList 
                title="Tomorrow's Plans" 
                workouts={tomorrowWorkouts} 
                isPlanned={true} 
                style={{ marginTop: 30 }}
                profileId={workoutPlan.profile_id}
                showProgress={false}
              />

              <Button
                title="Workout Form Analysis"
                onPress={() => router.push('/form-analysis')}
                containerStyle={[home_styles.analysisButtonContainer, { overflow: 'hidden', borderRadius: 10 }]}
                buttonStyle={[home_styles.analysisButton, { borderRadius: 10, backgroundColor: '#e74c3c' }]}
              />
            </View>
          </ScrollView>
          
          {/* Workout Logging Modal */}
          {selectedWorkout && (
            <LoggingModal
              isVisible={loggingModalVisible}
              onClose={() => {
                setLoggingModalVisible(false);
                setSelectedWorkout(null);
              }}
              onSubmit={handleLogSubmit}
              exerciseName={selectedWorkout.name}
              savedData={workoutsInProgress[selectedWorkout.name]}
            />
          )}
          
          {/* Confirmation Dialog */}
          <Modal
            visible={showConfirmDialog}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowConfirmDialog(false)}
          >
            <View style={home_styles.confirmationOverlay}>
              <View style={home_styles.confirmationDialog}>
                <Text style={home_styles.confirmationTitle}>Remove Workout</Text>
                <Text style={home_styles.confirmationText}>
                  Are you sure you want to remove this completed workout? This will delete the workout log.
                </Text>
                <View style={home_styles.confirmationButtons}>
                  <Button
                    title="Cancel"
                    type="outline"
                    buttonStyle={home_styles.cancelButton}
                    titleStyle={home_styles.cancelButtonText}
                    onPress={() => setShowConfirmDialog(false)}
                    containerStyle={{ flex: 1, marginRight: 10 }}
                  />
                  <Button
                    title="Remove"
                    buttonStyle={home_styles.removeButton}
                    onPress={handleConfirmRemoval}
                    containerStyle={{ flex: 1 }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </View>
  );
}
