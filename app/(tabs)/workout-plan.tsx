import { plan_stylesheet, View, ImageBackground, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase/supabase';
import React from 'react';
import plan_styles from '@/styles/plan_style';
import { WorkoutPlan, DailyPlan, PreDefinedPlan } from '@/types/workout';
import { preDefinedPlans } from '@/constants/workout';

export default function WorkoutPlanScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [currentGoal] = useState('Build Muscle & Strength');
  const [weeklyPlan, setWeeklyPlan] = useState<DailyPlan[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PreDefinedPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);


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

  const createWorkoutPlan = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('workout_plans')
        .insert([{ profile_id: user.id, plan_data: weeklyPlan }]);

      if (error) throw error;
      await fetchWorkoutPlan();
    } catch (error) {
      console.error('Error creating workout plan:', error);
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
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error applying predefined plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPrePlanView = (isInitialView = false) => (
    <ScrollView style={plan_styles.content}>
      {!isInitialView && (
        <View style={plan_styles.header}>
          <Button
            title="Back to Plan"
            type="outline"
            onPress={() => setIsEditing(false)}
            containerStyle={[plan_styles.backButton]}
            buttonStyle={[plan_styles.outlineButton]}
            titleStyle={[plan_styles.outlineButtonText]}
            icon={{
              name: 'arrow-left',
              type: 'feather',
              size: 20,
              color: '#e74c3c',
              style: { marginRight: 10 }
            }}
          />
        </View>
      )}
      <TouchableOpacity 
        style={plan_styles.aiSection}
        onPress={() => router.push('/questionnaire/basic-info')}
      >
        <Text h3 style={plan_styles.aiTitle}>AI-Tailored Workout Plan</Text>
        <Text style={plan_styles.aiDescription}>
          Get a personalized workout plan based on your goals, fitness level, and preferences
        </Text>
        <Button
          title="Create Custom Plan"
          onPress={() => router.push('/questionnaire/basic-info')}
          containerStyle={plan_styles.aiButton}
          buttonStyle={plan_styles.aiButtonStyle}
          titleStyle={plan_styles.buttonTitleStyle}
          icon={{
            name: 'cpu',
            type: 'feather',
            size: 20,
            color: 'white',
            style: { marginRight: 10 }
          }}
        />
      </TouchableOpacity>

      <Text h4 style={plan_styles.preDefinedTitle}>Pre-defined Workout Plans</Text>
      <View style={plan_styles.plansGrid}>
        {preDefinedPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={plan_styles.planCard}
            onPress={() => {
              setSelectedPlan(plan);
              setShowConfirmation(true);
            }}
          >
            <Text style={plan_styles.planTitle}>{plan.title}</Text>
            <Text style={plan_styles.planLevel}>{plan.level}</Text>
            <Text style={plan_styles.planDescription}>{plan.description}</Text>
            <Text style={plan_styles.planCategory}>{plan.category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

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
              renderPrePlanView(true)
            ) : (
              <View style={plan_styles.content}>
                {isEditing ? (
                  renderPrePlanView()
                ) : (
                  <>
                    <View style={plan_styles.goalContainer}>
                      <View style={plan_styles.goalHeader}>
                        <Text h4 style={plan_styles.goalTitle}>Current Goal</Text>
                        <Button
                          title="Edit Plan"
                          type="outline"
                          onPress={() => setIsEditing(true)}
                          containerStyle={plan_styles.editButton}
                          buttonStyle={plan_styles.editButtonStyle}
                          titleStyle={plan_styles.editButtonText}
                        />
                      </View>
                      <Text style={plan_styles.goalText}>{currentGoal}</Text>
                    </View>

                    <ScrollView style={plan_styles.planContainer}>
                      {weeklyPlan.map((day, index) => (
                        <View key={index} style={plan_styles.dayContainer}>
                          <View style={plan_styles.dayHeader}>
                            <Text style={plan_styles.dayTitle}>{day.day}</Text>
                            <Text style={plan_styles.timeFrame}>{day.timeFrame}</Text>
                          </View>

                          {day.exercises.map((exercise, exerciseIndex) => (
                            <TouchableOpacity
                              key={exerciseIndex}
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
                          ))}
                        </View>
                      ))}
                    </ScrollView>
                  </>
                )}
              </View>
            )}
          </View>
        </ImageBackground>
      </View>

      <Modal
        visible={showConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={plan_styles.modalContainer}>
          <View style={plan_styles.modalContent}>
            <Text style={plan_styles.modalTitle}>Confirm Plan Selection</Text>
            {selectedPlan && (
              <>
                <Text style={plan_styles.modalPlanTitle}>{selectedPlan.title}</Text>
                <Text style={plan_styles.modalDescription}>{selectedPlan.description}</Text>
                <View style={plan_styles.modalButtons}>
                  <Button
                    title="Confirm"
                    onPress={() => selectedPlan && applyPreDefinedPlan(selectedPlan)}
                    buttonStyle={plan_styles.confirmButton}
                  />
                  <Button
                    title="Cancel"
                    onPress={() => setShowConfirmation(false)}
                    type="outline"
                    buttonStyle={plan_styles.cancelButton}
                    titleStyle={plan_styles.cancelButtonText}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
