import { View, ImageBackground, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/supabase';
import React from 'react';
import plan_styles from '@/styles/plan_style';
import { WorkoutPlan, DailyPlan, PreDefinedPlan } from '@/types/workout';
import PreDefinedPlans from '@/components/workout/PreDefinedPlans';
import CurrentPlan from '@/components/workout/CurrentPlan';
import PlanConfirmationModal from '@/components/workout/PlanConfirmationModal';

export default function WorkoutPlanScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [currentGoal] = useState('Build Muscle & Strength');
  const [weeklyPlan, setWeeklyPlan] = useState<DailyPlan[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PreDefinedPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchWorkoutPlan();

    // Listen for workout log updates
    const channel = supabase
      .channel('workout_logs_changes_plan_screen')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'workout_logs'
      }, () => {
        // Increment the refresh trigger to reload workout history
        setHistoryRefreshTrigger(prev => prev + 1);
        // Also refresh the workout plan data
        fetchWorkoutPlan();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
            .insert([{ profile_id: user.id, plan_data: weeklyPlan }])
            .select()
            .single();

          if (createError) throw createError;
          setWorkoutPlan(newPlan);
          if (newPlan?.plan_data) {
            setWeeklyPlan(newPlan.plan_data as DailyPlan[]);
          }
          return;
        }
        throw error;
      }
      setWorkoutPlan(plan);
      if (plan?.plan_data) {
        setWeeklyPlan(plan.plan_data as DailyPlan[]);
      }
    } catch (error) {
      console.error('Error fetching workout plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyPreDefinedPlan = async (plan: PreDefinedPlan) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const weekDays = ['Monday', 'Wednesday', 'Friday'];
      const planData = weekDays.map(day => ({
        day,
        timeFrame: 'Flexible',
        exercises: plan.exercises
      }));

      const { error } = await supabase
        .from('workout_plans')
        .update({ plan_data: planData })
        .eq('profile_id', user.id);

      if (error) throw error;
      await fetchWorkoutPlan();
      setShowConfirmation(false);
      setSelectedPlan(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error applying predefined plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[plan_styles.container, plan_styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  }

  return (
    <>
      <View style={plan_styles.container}>
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={plan_styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={plan_styles.overlay}>
            {!workoutPlan || !workoutPlan.plan_data || (workoutPlan.plan_data as DailyPlan[]).length === 0 ? (
              <PreDefinedPlans
                onSelectPlan={(plan) => {
                  setSelectedPlan(plan);
                  setShowConfirmation(true);
                }}
                isInitialView={true}
              />
            ) : (
              isEditing ? (
                <PreDefinedPlans
                  onSelectPlan={(plan) => {
                    setSelectedPlan(plan);
                    setShowConfirmation(true);
                  }}
                  onBackToCurrentPlan={() => setIsEditing(false)}
                />
              ) : (
                <CurrentPlan
                  weeklyPlan={weeklyPlan}
                  currentGoal={currentGoal}
                  onEditPlan={() => setIsEditing(true)}
                />
              )
            )}
          </View>
        </ImageBackground>
      </View>

      <PlanConfirmationModal
        isVisible={showConfirmation}
        selectedPlan={selectedPlan}
        onConfirm={applyPreDefinedPlan}
        onCancel={() => {
          setShowConfirmation(false);
          setSelectedPlan(null);
        }}
      />
    </>
  );
}
