import { useState } from 'react';
import { View, ImageBackground, ScrollView, Alert } from 'react-native';
import { Button, Text, CheckBox } from '@rneui/themed';
import { router } from 'expo-router';
import { supabase } from '../../../lib/supabase/supabase';
import questionnaire_styles from '@/styles/questionnaire_style';
import { Goal } from '@/types/questionnaire';
import { fitnessGoals } from '@/constants/questionnaire';

export default function FitnessGoals() {
  const [loading, setLoading] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);

  const toggleGoal = (goal: Goal) => {
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  async function saveGoals() {
    if (selectedGoals.length === 0) {
      Alert.alert('Error', 'Please select at least one goal');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          fitness_goals: selectedGoals,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      router.push('/questionnaire/lifestyle-preferences');
    } catch (error) {
      Alert.alert('Error', 'Failed to save information');
      console.error('Error saving fitness goals:', error);
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
            <Text h2 style={questionnaire_styles.title}>Fitness Goals</Text>
            <Text style={questionnaire_styles.subtitle}>Step 3 of 5</Text>

            <ScrollView 
              style={questionnaire_styles.goalsContainer}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              {fitnessGoals.map(goal => (
                <CheckBox
                  key={goal.id}
                  title={goal.title}
                  subtitle={goal.description}
                  checked={selectedGoals.includes(goal.id)}
                  onPress={() => toggleGoal(goal.id)}
                  containerStyle={questionnaire_styles.checkboxContainer}
                  textStyle={questionnaire_styles.checkboxText}
                  wrapperStyle={questionnaire_styles.checkboxWrapper}
                />
              ))}
            </ScrollView>

            <Button
              title="Next"
              onPress={saveGoals}
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
