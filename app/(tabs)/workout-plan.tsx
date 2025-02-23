import { StyleSheet, View, ImageBackground, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/supabase.types';

type WorkoutPlan = Database['public']['Tables']['workout_plans']['Row'];

type Exercise = {
  name: string;
  sets: number;
  reps: string;
  duration: string;
};

type DailyPlan = {
  day: string;
  timeFrame: string;
  exercises: Exercise[];
};

type PreDefinedPlan = {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  exercises: Exercise[];
};

export default function WorkoutPlanScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [currentGoal] = useState('Build Muscle & Strength');
  const [weeklyPlan, setWeeklyPlan] = useState<DailyPlan[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PreDefinedPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const preDefinedPlans: PreDefinedPlan[] = [
    {
      id: 'beginner_strength',
      title: 'Beginner Strength',
      description: 'Perfect for those new to strength training',
      level: 'Beginner',
      category: 'Strength',
      exercises: [
        { name: 'Squats', sets: 3, reps: '10', duration: '10 mins' },
        { name: 'Bench Press', sets: 3, reps: '10', duration: '10 mins' },
        { name: 'Deadlifts', sets: 3, reps: '8', duration: '10 mins' }
      ]
    },
    {
      id: 'hiit_cardio',
      title: 'HIIT Focus',
      description: 'High-intensity interval training for maximum fat burn',
      level: 'Intermediate',
      category: 'Cardio',
      exercises: [
        { name: 'Burpees', sets: 4, reps: '20', duration: '5 mins' },
        { name: 'Mountain Climbers', sets: 4, reps: '30', duration: '5 mins' },
        { name: 'Jump Rope', sets: 4, reps: '50', duration: '5 mins' }
      ]
    },
    {
      id: 'advanced_bodybuilding',
      title: 'Advanced Bodybuilding',
      description: 'Intensive muscle-building program',
      level: 'Advanced',
      category: 'Hypertrophy',
      exercises: [
        { name: 'Incline Dumbbell Press', sets: 4, reps: '12', duration: '15 mins' },
        { name: 'Barbell Rows', sets: 4, reps: '12', duration: '15 mins' },
        { name: 'Leg Press', sets: 4, reps: '15', duration: '15 mins' }
      ]
    },
    {
      id: 'core_strength',
      title: 'Core Focus',
      description: 'Build a strong and stable core',
      level: 'All Levels',
      category: 'Core',
      exercises: [
        { name: 'Planks', sets: 3, reps: '60s', duration: '8 mins' },
        { name: 'Russian Twists', sets: 3, reps: '20', duration: '8 mins' },
        { name: 'Ab Rollouts', sets: 3, reps: '12', duration: '8 mins' }
      ]
    }
  ];

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

  const renderPrePlanView = () => (
    <ScrollView style={styles.content}>
      <View style={styles.header}>
        <Button
          title="Back to Plan"
          type="outline"
          onPress={() => setIsEditing(false)}
          containerStyle={[styles.backButton]}
          buttonStyle={[styles.outlineButton]}
          titleStyle={[styles.outlineButtonText]}
          icon={{
            name: 'arrow-left',
            type: 'feather',
            size: 20,
            color: '#e74c3c',
            style: { marginRight: 10 }
          }}
        />
      </View>
      <TouchableOpacity 
        style={styles.aiSection}
        onPress={() => router.push('/questionnaire/basic-info')}
      >
        <Text h3 style={styles.aiTitle}>AI-Tailored Workout Plan</Text>
        <Text style={styles.aiDescription}>
          Get a personalized workout plan based on your goals, fitness level, and preferences
        </Text>
        <Button
          title="Create Custom Plan"
          onPress={() => router.push('/questionnaire/basic-info')}
          containerStyle={styles.aiButton}
          buttonStyle={styles.aiButtonStyle}
          titleStyle={styles.buttonTitleStyle}
          icon={{
            name: 'cpu',
            type: 'feather',
            size: 20,
            color: 'white',
            style: { marginRight: 10 }
          }}
        />
      </TouchableOpacity>

      <Text h4 style={styles.preDefinedTitle}>Pre-defined Workout Plans</Text>
      <View style={styles.plansGrid}>
        {preDefinedPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.planCard}
            onPress={() => {
              setSelectedPlan(plan);
              setShowConfirmation(true);
            }}
          >
            <Text style={styles.planTitle}>{plan.title}</Text>
            <Text style={styles.planLevel}>{plan.level}</Text>
            <Text style={styles.planDescription}>{plan.description}</Text>
            <Text style={styles.planCategory}>{plan.category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  }

  if (!workoutPlan || !workoutPlan.plan_data || (workoutPlan.plan_data as DailyPlan[]).length === 0) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            {renderPrePlanView()}
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
            {isEditing ? (
              renderPrePlanView()
            ) : (
              <>
                <View style={styles.goalContainer}>
                  <View style={styles.goalHeader}>
                    <Text h4 style={styles.goalTitle}>Current Goal</Text>
                    <Button
                      title="Edit Plan"
                      type="outline"
                      onPress={() => setIsEditing(true)}
                      containerStyle={styles.editButton}
                      buttonStyle={styles.editButtonStyle}
                      titleStyle={styles.editButtonText}
                    />
                  </View>
                  <Text style={styles.goalText}>{currentGoal}</Text>
                </View>

                <ScrollView style={styles.planContainer}>
                  {weeklyPlan.map((day, index) => (
                    <View key={index} style={styles.dayContainer}>
                      <View style={styles.dayHeader}>
                        <Text style={styles.dayTitle}>{day.day}</Text>
                        <Text style={styles.timeFrame}>{day.timeFrame}</Text>
                      </View>

                      {day.exercises.map((exercise, exerciseIndex) => (
                        <TouchableOpacity
                          key={exerciseIndex}
                          style={styles.exerciseItem}
                          onPress={() => {
                            router.push({
                              pathname: '/exercise-details',
                              params: { name: exercise.name }
                            });
                          }}
                        >
                          <View style={styles.exerciseHeader}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                            <Text style={styles.duration}>{exercise.duration}</Text>
                          </View>
                          <Text style={styles.exerciseDetails}>
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
        </View>
      </ImageBackground>

      <Modal
        visible={showConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Plan Selection</Text>
            {selectedPlan && (
              <>
                <Text style={styles.modalPlanTitle}>{selectedPlan.title}</Text>
                <Text style={styles.modalDescription}>{selectedPlan.description}</Text>
                <View style={styles.modalButtons}>
                  <Button
                    title="Confirm"
                    onPress={() => selectedPlan && applyPreDefinedPlan(selectedPlan)}
                    buttonStyle={styles.confirmButton}
                  />
                  <Button
                    title="Cancel"
                    onPress={() => setShowConfirmation(false)}
                    type="outline"
                    buttonStyle={styles.cancelButton}
                    titleStyle={styles.cancelButtonText}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noWorkoutPlanContainer: {
    flex: 1,
  },
  noWorkoutPlanText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  createPlanButton: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
  },
  createPlanButtonStyle: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingTop: 80,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    minWidth: 120,
    marginRight: 10,
  },
  outlineButton: {
    borderColor: '#e74c3c',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  outlineButtonText: {
    color: '#e74c3c',
    fontSize: 16,
  },
  goalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    marginTop: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  editButton: {
    minWidth: 100,
  },
  editButtonStyle: {
    borderColor: '#e74c3c',
  },
  editButtonText: {
    color: '#e74c3c',
  },
  goalTitle: {
    color: 'white',
    marginBottom: 5,
  },
  goalText: {
    color: '#e0e0e0',
    fontSize: 16,
  },
  planContainer: {
    flex: 1,
  },
  dayContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeFrame: {
    color: '#e0e0e0',
    fontSize: 14,
  },
  exerciseItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  exerciseName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  duration: {
    color: '#e0e0e0',
    fontSize: 14,
  },
  exerciseDetails: {
    color: '#e0e0e0',
    fontSize: 14,
  },
  aiSection: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  aiTitle: {
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  aiDescription: {
    color: '#e0e0e0',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  aiButton: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  aiButtonStyle: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonTitleStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  preDefinedTitle: {
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginBottom: 0,
  },
  planTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  planLevel: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 5,
  },
  planDescription: {
    color: '#e0e0e0',
    fontSize: 14,
    marginBottom: 10,
  },
  planCategory: {
    color: '#e0e0e0',
    fontSize: 12,
    opacity: 0.8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    borderRadius: 15,
    padding: 25,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalPlanTitle: {
    color: '#e74c3c',
    fontSize: 20,
    marginBottom: 10,
  },
  modalDescription: {
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  confirmButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelButton: {
    borderColor: '#e74c3c',
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#e74c3c',
  },
});