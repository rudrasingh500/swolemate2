import { View, ImageBackground, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/supabase';
import React from 'react';
import plan_styles from '@/styles/plan_style';
import { WorkoutPlan, DailyPlan, PreDefinedPlan } from '@/types/workout';
import PreDefinedPlans from '@/components/workout/PreDefinedPlans';
import CurrentPlan from '@/components/workout/CurrentPlan';
import PlanConfirmationModal from '@/components/workout/PlanConfirmationModal';
import CustomPlanForm from '@/components/workout/CustomPlanForm'; // Will be created next

export default function WorkoutPlanScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [currentGoal, setCurrentGoal] = useState('Build Muscle & Strength'); // Made into state
  const [weeklyPlan, setWeeklyPlan] = useState<DailyPlan[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PreDefinedPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Kept for now, might be removed later
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);
  const [currentView, setCurrentView] = useState<'current' | 'predefined' | 'custom'>('current'); // Manages which view to show

  useEffect(() => {
    fetchWorkoutPlan(); // Initial fetch

    const channel = supabase
      .channel('workout_logs_changes_plan_screen')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'workout_logs'
      }, () => {
        setHistoryRefreshTrigger(prev => prev + 1);
        // fetchWorkoutPlan(); // Removed, handled by the effect below
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs once on mount

  // Effect to refetch workout plan when historyRefreshTrigger changes
  useEffect(() => {
    if (historyRefreshTrigger > 0) { // Avoid fetching on initial mount if trigger is 0
      fetchWorkoutPlan();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyRefreshTrigger]);

  // Effect to determine initial view after loading
  useEffect(() => {
    if (!isLoading) {
      if (!workoutPlan || !workoutPlan.plan_data || (workoutPlan.plan_data as DailyPlan[]).length === 0) {
        setCurrentView('predefined');
      } else {
        setCurrentView('current');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, workoutPlan]);

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
      setCurrentView('current');
    } catch (error) {
      console.error('Error applying predefined plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCustomPlan = async (customPlanData: DailyPlan[]) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('workout_plans')
        .update({ plan_data: customPlanData })
        .eq('profile_id', user.id);

      if (error) {
        if (error.code === 'PGRST116' || (error.message && error.message.includes('violates foreign key constraint'))) { 
             console.warn('Update failed, attempting to insert new plan for custom save:', error);
             const { data: newPlan, error: createError } = await supabase
                .from('workout_plans')
                .insert([{ profile_id: user.id, plan_data: customPlanData }])
                .select()
                .single();
            if (createError) throw createError;
            setWorkoutPlan(newPlan); // Update state if a new plan was created
        } else {
            throw error;
        }
      }
      
      await fetchWorkoutPlan(); 
      setCurrentView('current');
    } catch (error) {
      console.error('Error saving custom plan:', error);
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
            {currentView === 'custom' ? (
              <CustomPlanForm
                onSavePlan={handleSaveCustomPlan}
                onCancel={() => setCurrentView(workoutPlan && workoutPlan.plan_data && (workoutPlan.plan_data as DailyPlan[]).length > 0 ? 'current' : 'predefined')}
              />
            ) : currentView === 'predefined' ? (
              <PreDefinedPlans
                onSelectPlan={(plan) => {
                  setSelectedPlan(plan);
                  setShowConfirmation(true);
                }}
                isInitialView={!workoutPlan || !workoutPlan.plan_data || (workoutPlan.plan_data as DailyPlan[]).length === 0}
                onBackToCurrentPlan={() => setCurrentView('current')}
                onCreateCustomPlan={() => setCurrentView('custom')} // Prop to be added to PreDefinedPlans
              />
            ) : ( // currentView === 'current' or default
              <CurrentPlan
                weeklyPlan={weeklyPlan}
                currentGoal={currentGoal}
                onEditPlan={() => setCurrentView('predefined')} // "Edit" now goes to predefined/custom choice
                onCreateCustomPlan={() => setCurrentView('custom')} // Prop to be added to CurrentPlan
              />
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
