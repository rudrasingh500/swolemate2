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
  onCreateCustomPlan: () => void; // New prop for creating a custom plan
}

export default function CurrentPlan({ weeklyPlan, currentGoal, onEditPlan, onCreateCustomPlan }: CurrentPlanProps) { // Added onCreateCustomPlan
  const [userId, setUserId] = useState<string | null>(null);
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({}); // Key will be `${dayIndex}-${exerciseIndex}`
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

  const toggleExerciseExpansion = (dayIndex: number, exerciseIndex: number) => {
    const key = `${dayIndex}-${exerciseIndex}`;
    setExpandedExercises(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  return (
    <View style={plan_styles.content}>
      <View style={plan_styles.goalContainer}>
        <View style={plan_styles.goalHeader}>
          <Text h4 style={plan_styles.goalTitle}>Current Goal</Text>
        </View>
        <Text style={plan_styles.goalText}>{currentGoal}</Text>
        <View style={plan_styles.buttonRow}> 
          <Button
            title="Edit Plan"
            type="outline"
            onPress={onEditPlan} // This now leads to PreDefinedPlans or custom creation choice
            containerStyle={plan_styles.editButton}
            buttonStyle={plan_styles.editButtonStyle}
            titleStyle={plan_styles.editButtonText}
          />
          <Button
            title="New Custom Plan"
            type="outline"
            onPress={onCreateCustomPlan} // Button to go to custom plan creation
            containerStyle={[plan_styles.editButton, { marginLeft: 10 }]} // Adjust styling as needed
            buttonStyle={plan_styles.editButtonStyle}
            titleStyle={plan_styles.editButtonText}
            icon={{ name: 'add-circle-outline', type: 'ionicon', size: 18, color: '#e74c3c', style: { marginRight: 5 } }}
          />
        </View>
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

            {day.exercises.map((exercise, exerciseIndex) => {
              const uniqueKey = `${index}-${exerciseIndex}`; // Use day index (index) and exercise index
              return (
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
                    onPress={() => toggleExerciseExpansion(index, exerciseIndex)} // Pass day and exercise index
                  >
                    <Text style={plan_styles.expandButtonText}>
                      {expandedExercises[uniqueKey] ? 'Hide Progress' : 'Show Progress'}
                    </Text>
                    <Icon 
                      name={expandedExercises[uniqueKey] ? 'chevron-up' : 'chevron-down'} 
                      type="material-community" 
                      size={16} 
                      color="#e74c3c" 
                    />
                  </TouchableOpacity>
                )}
                
                {userId && expandedExercises[uniqueKey] && (
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
            );
          })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
