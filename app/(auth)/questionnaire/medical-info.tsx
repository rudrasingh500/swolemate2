import { useState } from 'react';
import { StyleSheet, View, ImageBackground, ScrollView, Alert, TextInput } from 'react-native';
import { Button, Text, CheckBox } from '@rneui/themed';
import { router } from 'expo-router';
import { supabase } from '../../../lib/supabase';

type MedicalCondition = 'none' | 'diabetes' | 'hypertension' | 'heart_disease' | 'asthma' | 'injury';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export default function MedicalInfo() {
  const [loading, setLoading] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<MedicalCondition[]>(['none']);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('sedentary');
  const [allergies, setAllergies] = useState('');
  const [sleepHours, setSleepHours] = useState('');

  const medicalConditions = [
    { id: 'none' as MedicalCondition, title: 'No Medical Conditions', description: 'Healthy with no chronic conditions' },
    { id: 'diabetes' as MedicalCondition, title: 'Diabetes', description: 'Type 1 or Type 2 Diabetes' },
    { id: 'hypertension' as MedicalCondition, title: 'Hypertension', description: 'High blood pressure' },
    { id: 'heart_disease' as MedicalCondition, title: 'Heart Disease', description: 'Any cardiovascular conditions' },
    { id: 'asthma' as MedicalCondition, title: 'Asthma', description: 'Respiratory condition' },
    { id: 'injury' as MedicalCondition, title: 'Current Injury', description: 'Any physical injuries or limitations' },
  ];

  const activityLevels = [
    { id: 'sedentary' as ActivityLevel, title: 'Sedentary', description: 'Little to no exercise' },
    { id: 'light' as ActivityLevel, title: 'Lightly Active', description: '1-2 days/week of exercise' },
    { id: 'moderate' as ActivityLevel, title: 'Moderately Active', description: '3-4 days/week of exercise' },
    { id: 'active' as ActivityLevel, title: 'Active', description: '5-6 days/week of exercise' },
    { id: 'very_active' as ActivityLevel, title: 'Very Active', description: 'Exercise every day' },
  ];

  const toggleCondition = (condition: MedicalCondition) => {
    if (condition === 'none') {
      setSelectedConditions(['none']);
    } else {
      setSelectedConditions(prev => {
        const newSelection = prev.filter(c => c !== 'none');
        return prev.includes(condition)
          ? newSelection.filter(c => c !== condition)
          : [...newSelection, condition];
      });
    }
  };

  async function saveMedicalInfo() {
    if (!sleepHours) {
      Alert.alert('Error', 'Please enter your average sleep hours');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const conditions = selectedConditions.includes('none') ? [] : selectedConditions;

      const { error } = await supabase
        .from('profiles')
        .update({
          medical_conditions: conditions,
          activity_level: activityLevel,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      router.push('/questionnaire/fitness-goals');
    } catch (error) {
      Alert.alert('Error', 'Failed to save information');
      console.error('Error saving medical info:', error);
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
            <Text h2 style={styles.title}>Health Profile</Text>
            <Text style={styles.subtitle}>Step 2 of 5</Text>

            <ScrollView style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Medical Conditions</Text>
              {medicalConditions.map(condition => (
                <CheckBox
                  key={condition.id}
                  title={condition.title}
                  subtitle={condition.description}
                  checked={selectedConditions.includes(condition.id)}
                  onPress={() => toggleCondition(condition.id)}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                  wrapperStyle={styles.checkboxWrapper}
                />
              ))}

              <Text style={styles.sectionTitle}>Activity Level</Text>
              {activityLevels.map(level => (
                <CheckBox
                  key={level.id}
                  title={level.title}
                  subtitle={level.description}
                  checked={activityLevel === level.id}
                  onPress={() => setActivityLevel(level.id)}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                  wrapperStyle={styles.checkboxWrapper}
                />
              ))}

              <Text style={styles.sectionTitle}>Additional Information</Text>
              <TextInput
                style={styles.input}
                placeholder="Allergies or Dietary Restrictions (Optional)"
                value={allergies}
                onChangeText={setAllergies}
                placeholderTextColor="#999"
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Average Sleep Hours per Night"
                value={sleepHours}
                onChangeText={setSleepHours}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </ScrollView>

            <Button
              title="Next"
              onPress={saveMedicalInfo}
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingTop: 20,
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