import { useState } from 'react';
import { StyleSheet, View, ImageBackground, ScrollView, Alert, TextInput } from 'react-native';
import { Button, Text, CheckBox } from '@rneui/themed';
import { router } from 'expo-router';
import { supabase } from '../../../lib/supabase/supabase';

type WorkoutEnvironment = 'gym' | 'home' | 'outdoors';
type DietaryPreference = 'balanced' | 'vegan' | 'vegetarian' | 'keto' | 'paleo' | 'other';
type WorkoutFrequency = 'never' | '1-2_times' | '3-4_times' | '5-6_times' | 'daily';
type WorkoutDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export default function LifestylePreferences() {
  const [loading, setLoading] = useState(false);
  const [workoutEnvironments, setWorkoutEnvironments] = useState<WorkoutEnvironment[]>([]);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>('balanced');
  const [workSchedule, setWorkSchedule] = useState('');
  const [workType, setWorkType] = useState('');
  const [currentFrequency, setCurrentFrequency] = useState<WorkoutFrequency>('never');
  const [plannedFrequency, setPlannedFrequency] = useState<WorkoutFrequency>('3-4_times');
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);

  const frequencies = [
    { id: 'never' as WorkoutFrequency, title: 'Never', description: 'Currently not working out' },
    { id: '1-2_times' as WorkoutFrequency, title: '1-2 Times/Week', description: 'Light activity level' },
    { id: '3-4_times' as WorkoutFrequency, title: '3-4 Times/Week', description: 'Moderate activity level' },
    { id: '5-6_times' as WorkoutFrequency, title: '5-6 Times/Week', description: 'High activity level' },
    { id: 'daily' as WorkoutFrequency, title: 'Daily', description: 'Every day workout' },
  ];

  const workoutDayOptions = [
    { id: 'monday' as WorkoutDay, title: 'Monday' },
    { id: 'tuesday' as WorkoutDay, title: 'Tuesday' },
    { id: 'wednesday' as WorkoutDay, title: 'Wednesday' },
    { id: 'thursday' as WorkoutDay, title: 'Thursday' },
    { id: 'friday' as WorkoutDay, title: 'Friday' },
    { id: 'saturday' as WorkoutDay, title: 'Saturday' },
    { id: 'sunday' as WorkoutDay, title: 'Sunday' },
  ];

  const environments = [
    { id: 'gym' as WorkoutEnvironment, title: 'Gym', description: 'Commercial gym or fitness center' },
    { id: 'home' as WorkoutEnvironment, title: 'Home', description: 'Home workouts with available equipment' },
    { id: 'outdoors' as WorkoutEnvironment, title: 'Outdoors', description: 'Parks, trails, or outdoor spaces' },
  ];

  const dietaryPreferences = [
    { id: 'balanced' as DietaryPreference, title: 'Balanced Diet', description: 'Mix of all food groups' },
    { id: 'vegan' as DietaryPreference, title: 'Vegan', description: 'No animal products' },
    { id: 'vegetarian' as DietaryPreference, title: 'Vegetarian', description: 'Plant-based with dairy/eggs' },
    { id: 'keto' as DietaryPreference, title: 'Ketogenic', description: 'High-fat, low-carb' },
    { id: 'paleo' as DietaryPreference, title: 'Paleo', description: 'Whole foods based diet' },
    { id: 'other' as DietaryPreference, title: 'Other', description: 'Custom dietary preference' },
  ];

  const toggleWorkoutDay = (day: WorkoutDay) => {
    setWorkoutDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const toggleEnvironment = (environment: WorkoutEnvironment) => {
    setWorkoutEnvironments(prev =>
      prev.includes(environment)
        ? prev.filter(e => e !== environment)
        : [...prev, environment]
    );
  };

  async function savePreferences() {
    if (workoutEnvironments.length === 0) {
      Alert.alert('Error', 'Please select at least one workout environment');
      return;
    }

    if (!workSchedule) {
      Alert.alert('Error', 'Please enter your work schedule');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          workout_environments: workoutEnvironments,
          dietary_preference: dietaryPreference,
          work_schedule: workSchedule,
          work_type: workType,
          current_workout_frequency: currentFrequency,
          planned_workout_frequency: plannedFrequency,
          preferred_workout_days: workoutDays,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      router.push('/questionnaire/equipment-access');
    } catch (error) {
      Alert.alert('Error', 'Failed to save information');
      console.error('Error saving lifestyle preferences:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text h2 style={styles.title}>Lifestyle Preferences</Text>
            <Text style={styles.subtitle}>Step 4 of 5</Text>

            <ScrollView style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Preferred Workout Environments</Text>
              {environments.map(env => (
                <CheckBox
                  key={env.id}
                  title={env.title}
                  subtitle={env.description}
                  checked={workoutEnvironments.includes(env.id)}
                  onPress={() => toggleEnvironment(env.id)}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                  wrapperStyle={styles.checkboxWrapper}
                />
              ))}

              <Text style={styles.sectionTitle}>Dietary Preference</Text>
              {dietaryPreferences.map(diet => (
                <CheckBox
                  key={diet.id}
                  title={diet.title}
                  subtitle={diet.description}
                  checked={dietaryPreference === diet.id}
                  onPress={() => setDietaryPreference(diet.id)}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                  wrapperStyle={styles.checkboxWrapper}
                />
              ))}

              <Text style={styles.sectionTitle}>Current Workout Frequency</Text>
              {frequencies.map(freq => (
                <CheckBox
                  key={freq.id}
                  title={freq.title}
                  subtitle={freq.description}
                  checked={currentFrequency === freq.id}
                  onPress={() => setCurrentFrequency(freq.id)}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                  wrapperStyle={styles.checkboxWrapper}
                />
              ))}

              <Text style={styles.sectionTitle}>Planned Workout Frequency</Text>
              {frequencies.map(freq => (
                <CheckBox
                  key={freq.id}
                  title={freq.title}
                  subtitle={freq.description}
                  checked={plannedFrequency === freq.id}
                  onPress={() => setPlannedFrequency(freq.id)}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                  wrapperStyle={styles.checkboxWrapper}
                />
              ))}

              <Text style={styles.sectionTitle}>Preferred Workout Days</Text>
              <View style={styles.daysContainer}>
                {workoutDayOptions.map(day => (
                  <CheckBox
                    key={day.id}
                    title={day.title}
                    checked={workoutDays.includes(day.id)}
                    onPress={() => toggleWorkoutDay(day.id)}
                    containerStyle={[styles.checkboxContainer, styles.dayCheckbox]}
                    textStyle={styles.checkboxText}
                    wrapperStyle={styles.checkboxWrapper}
                  />
                ))}
              </View>

              <Text style={styles.sectionTitle}>Work Information</Text>
              <TextInput
                style={styles.input}
                placeholder="Work Schedule (e.g., 9-5, shift work)"
                value={workSchedule}
                onChangeText={setWorkSchedule}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Work Type (e.g., office, manual labor)"
                value={workType}
                onChangeText={setWorkType}
                placeholderTextColor="#999"
              />
            </ScrollView>

            <Button
              title="Next"
              onPress={savePreferences}
              loading={loading}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.button}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
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
    padding: 20,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  title: {
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#e0e0e0',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  formContainer: {
    flex: 1,
    marginBottom: 20,
  },
  checkboxContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
  },
  checkboxText: {
    color: 'white',
    fontSize: 16,
  },
  checkboxWrapper: {
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    color: 'white',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 15,
    width: '100%',
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
  },
});