import { useState } from 'react';
import { View, ImageBackground, ScrollView, Alert, TextInput } from 'react-native';
import { Button, Text, CheckBox } from '@rneui/themed';
import { router } from 'expo-router';
import { supabase } from '../../../lib/supabase/supabase';
import questionnaire_styles from '@/styles/questionnaire_style';
import { WorkoutEnvironment, DietaryPreference, WorkoutFrequency, WorkoutDay } from '@/types/questionnaire';
import { workoutEnvironments, dietaryPreferences, workoutFrequencies, workoutDayOptions } from '@/constants/questionnaire';

export default function LifestylePreferences() {
  const [loading, setLoading] = useState(false);
  const [workoutEnvironments, setWorkoutEnvironments] = useState<WorkoutEnvironment[]>([]);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>('balanced');
  const [workSchedule, setWorkSchedule] = useState('');
  const [workType, setWorkType] = useState('');
  const [currentFrequency, setCurrentFrequency] = useState<WorkoutFrequency>('never');
  const [plannedFrequency, setPlannedFrequency] = useState<WorkoutFrequency>('3-4_times');
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);

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
    <View style={questionnaire_styles.container}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={questionnaire_styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={questionnaire_styles.overlay}>
          <View style={questionnaire_styles.content}>
            <Text h2 style={questionnaire_styles.title}>Lifestyle Preferences</Text>
            <Text style={questionnaire_styles.subtitle}>Step 4 of 5</Text>

            <ScrollView 
              style={questionnaire_styles.formContainer}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <Text style={questionnaire_styles.sectionTitle}>Preferred Workout Environments</Text>
              {workoutEnvironments.map(env => (
                <CheckBox
                  key={env.id}
                  title={env.title}
                  subtitle={env.description}
                  checked={workoutEnvironments.includes(env.id)}
                  onPress={() => toggleEnvironment(env.id)}
                  containerStyle={questionnaire_styles.checkboxContainer}
                  textStyle={questionnaire_styles.checkboxText}
                  wrapperStyle={questionnaire_styles.checkboxWrapper}
                />
              ))}

              <Text style={questionnaire_styles.sectionTitle}>Dietary Preference</Text>
              {dietaryPreferences.map(diet => (
                <CheckBox
                  key={diet.id}
                  title={diet.title}
                  subtitle={diet.description}
                  checked={dietaryPreference === diet.id}
                  onPress={() => setDietaryPreference(diet.id)}
                  containerStyle={questionnaire_styles.checkboxContainer}
                  textStyle={questionnaire_styles.checkboxText}
                  wrapperStyle={questionnaire_styles.checkboxWrapper}
                />
              ))}

              <Text style={questionnaire_styles.sectionTitle}>Current Workout Frequency</Text>
              {workoutFrequencies.map(freq => (
                <CheckBox
                  key={freq.id}
                  title={freq.title}
                  subtitle={freq.description}
                  checked={currentFrequency === freq.id}
                  onPress={() => setCurrentFrequency(freq.id)}
                  containerStyle={questionnaire_styles.checkboxContainer}
                  textStyle={questionnaire_styles.checkboxText}
                  wrapperStyle={questionnaire_styles.checkboxWrapper}
                />
              ))}

              <Text style={questionnaire_styles.sectionTitle}>Planned Workout Frequency</Text>
              {workoutFrequencies.map(freq => (
                <CheckBox
                  key={freq.id}
                  title={freq.title}
                  subtitle={freq.description}
                  checked={plannedFrequency === freq.id}
                  onPress={() => setPlannedFrequency(freq.id)}
                  containerStyle={questionnaire_styles.checkboxContainer}
                  textStyle={questionnaire_styles.checkboxText}
                  wrapperStyle={questionnaire_styles.checkboxWrapper}
                />
              ))}

              <Text style={questionnaire_styles.sectionTitle}>Preferred Workout Days</Text>
              <View style={questionnaire_styles.daysContainer}>
                {workoutDayOptions.map(day => (
                  <CheckBox
                    key={day.id}
                    title={day.title}
                    checked={workoutDays.includes(day.id)}
                    onPress={() => toggleWorkoutDay(day.id)}
                    containerStyle={[questionnaire_styles.checkboxContainer, questionnaire_styles.dayCheckbox]}
                    textStyle={questionnaire_styles.checkboxText}
                    wrapperStyle={questionnaire_styles.checkboxWrapper}
                  />
                ))}
              </View>

              <Text style={questionnaire_styles.sectionTitle}>Work Information</Text>
              <TextInput
                style={questionnaire_styles.input}
                placeholder="Work Schedule (e.g., 9-5, shift work)"
                value={workSchedule}
                onChangeText={setWorkSchedule}
                placeholderTextColor="#999"
              />
              <TextInput
                style={questionnaire_styles.input}
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
              containerStyle={questionnaire_styles.buttonContainer}
              buttonStyle={questionnaire_styles.button}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
