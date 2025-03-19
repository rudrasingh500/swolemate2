import { useState } from 'react';
import { View, ImageBackground, ScrollView, Alert, TextInput } from 'react-native';
import { Button, Text, CheckBox } from '@rneui/themed';
import { router } from 'expo-router';
import { supabase } from '../../../lib/supabase/supabase';
import questionnaire_styles from '@/styles/questionnaire_style';
import { MedicalCondition, ActivityLevel } from '@/types/questionnaire';
import { medicalConditions, activityLevels } from '@/constants/questionnaire';

export default function MedicalInfo() {
  const [loading, setLoading] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<MedicalCondition[]>(['none']);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('sedentary');
  const [allergies, setAllergies] = useState('');
  const [sleepHours, setSleepHours] = useState('');

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
    <View style={questionnaire_styles.container}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={questionnaire_styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={questionnaire_styles.overlay}>
          <View style={questionnaire_styles.content}>
            <Text h2 style={questionnaire_styles.title}>Health Profile</Text>
            <Text style={questionnaire_styles.subtitle}>Step 2 of 5</Text>

            <ScrollView 
              style={questionnaire_styles.formContainer}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <Text style={questionnaire_styles.sectionTitle}>Medical Conditions</Text>
              {medicalConditions.map(condition => (
                <CheckBox
                  key={condition.id}
                  title={condition.title}
                  subtitle={condition.description}
                  checked={selectedConditions.includes(condition.id)}
                  onPress={() => toggleCondition(condition.id)}
                  containerStyle={questionnaire_styles.checkboxContainer}
                  textStyle={questionnaire_styles.checkboxText}
                  wrapperStyle={questionnaire_styles.checkboxWrapper}
                />
              ))}

              <Text style={questionnaire_styles.sectionTitle}>Activity Level</Text>
              {activityLevels.map(level => (
                <CheckBox
                  key={level.id}
                  title={level.title}
                  subtitle={level.description}
                  checked={activityLevel === level.id}
                  onPress={() => setActivityLevel(level.id)}
                  containerStyle={questionnaire_styles.checkboxContainer}
                  textStyle={questionnaire_styles.checkboxText}
                  wrapperStyle={questionnaire_styles.checkboxWrapper}
                />
              ))}

              <Text style={questionnaire_styles.sectionTitle}>Additional Information</Text>
              <TextInput
                style={questionnaire_styles.input}
                placeholder="Allergies (if any)"
                value={allergies}
                onChangeText={setAllergies}
                placeholderTextColor="#999"
              />
              <TextInput
                style={questionnaire_styles.input}
                placeholder="Average Sleep Hours"
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
              containerStyle={questionnaire_styles.buttonContainer}
              buttonStyle={questionnaire_styles.button}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
