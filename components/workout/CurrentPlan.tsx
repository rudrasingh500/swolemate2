import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Icon } from '@rneui/themed';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import plan_styles from '@/styles/plan_style';
import { DailyPlan } from '@/types/workout';
import ProgressChart from '@/components/workout/ProgressChart';
import WorkoutHistory from '@/components/global/WorkoutHistory';

interface CurrentPlanProps {
  weeklyPlan: DailyPlan[];
  currentGoal: string;
  onEditPlan: () => void;
}

export default function CurrentPlan({ weeklyPlan, currentGoal, onEditPlan }: CurrentPlanProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({});
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);

  useEffect(() => {
    // Get the current user
    async function getCurrentUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }
    
    getCurrentUser();
  }, []);

  // Listen for workout log updates
  useEffect(() => {
    const channel = supabase
      .channel('workout_logs_changes_plan')
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

  const toggleExerciseExpansion = (exerciseName: string) => {
    setExpandedExercises(prev => ({
      ...prev,
      [exerciseName]: !prev[exerciseName]
    }));
  };
  return (
    <View style={plan_styles.content}>
      <View style={plan_styles.goalContainer}>
        <View style={plan_styles.goalHeader}>
          <Text h4 style={plan_styles.goalTitle}>Current Goal</Text>
          <Button
            title="Edit Plan"
            type="outline"
            onPress={onEditPlan}
            containerStyle={plan_styles.editButton}
            buttonStyle={plan_styles.editButtonStyle}
            titleStyle={plan_styles.editButtonText}
          />
        </View>
        <Text style={plan_styles.goalText}>{currentGoal}</Text>
      </View>

      <ScrollView 
        style={plan_styles.planContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {weeklyPlan.map((day, index) => (
          <View key={index} style={plan_styles.dayContainer}>
            <View style={plan_styles.dayHeader}>
              <Text style={plan_styles.dayTitle}>{day.day}</Text>
              <Text style={plan_styles.timeFrame}>{day.timeFrame}</Text>
            </View>

            {day.exercises.map((exercise, exerciseIndex) => (
              <View key={exerciseIndex} style={plan_styles.exerciseContainer}>
                <TouchableOpacity
                  style={plan_styles.exerciseItem}
                  onPress={() => {
                    router.push({
                      pathname: '/exercise-details',
                      params: { name: exercise.name }
                    });
                  }}
                >
                  <View style={plan_styles.exerciseHeader}>
                    <Text style={plan_styles.exerciseName}>{exercise.name}</Text>
                    <Text style={plan_styles.duration}>{exercise.duration}</Text>
                  </View>
                  <Text style={plan_styles.exerciseDetails}>
                    {exercise.sets} sets × {exercise.reps}
                  </Text>
                </TouchableOpacity>
                
                {userId && (
                  <TouchableOpacity 
                    style={plan_styles.expandButton}
                    onPress={() => toggleExerciseExpansion(exercise.name)}
                  >
                    <Text style={plan_styles.expandButtonText}>
                      {expandedExercises[exercise.name] ? 'Hide Progress' : 'Show Progress'}
                    </Text>
                    <Icon 
                      name={expandedExercises[exercise.name] ? 'chevron-up' : 'chevron-down'} 
                      type="material-community" 
                      size={16} 
                      color="#e74c3c" 
                    />
                  </TouchableOpacity>
                )}
                
                {userId && expandedExercises[exercise.name] && (
                  <View style={plan_styles.progressContainer}>
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
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
