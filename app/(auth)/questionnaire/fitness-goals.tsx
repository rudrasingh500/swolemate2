import { useState } from 'react';
import { StyleSheet, View, ImageBackground, ScrollView, Alert } from 'react-native';
import { Button, Text, CheckBox } from '@rneui/themed';
import { router } from 'expo-router';
import { supabase } from '../../../lib/supabase';

type Goal = 'build_muscle' | 'lose_weight' | 'improve_strength' | 'increase_endurance' | 'better_flexibility';

export default function FitnessGoals() {
  const [loading, setLoading] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);

  const goals = [
    { id: 'build_muscle' as Goal, title: 'Build Muscle', description: 'Increase muscle mass and definition' },
    { id: 'lose_weight' as Goal, title: 'Lose Weight', description: 'Reduce body fat and improve composition' },
    { id: 'improve_strength' as Goal, title: 'Improve Strength', description: 'Increase overall strength and power' },
    { id: 'increase_endurance' as Goal, title: 'Increase Endurance', description: 'Enhance stamina and cardiovascular fitness' },
    { id: 'better_flexibility' as Goal, title: 'Better Flexibility', description: 'Improve mobility and flexibility' },
  ];

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
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text h2 style={styles.title}>Fitness Goals</Text>
            <Text style={styles.subtitle}>Step 3 of 5</Text>

            <ScrollView style={styles.goalsContainer}>
              {goals.map(goal => (
                <CheckBox
                  key={goal.id}
                  title={goal.title}
                  subtitle={goal.description}
                  checked={selectedGoals.includes(goal.id)}
                  onPress={() => toggleGoal(goal.id)}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                  wrapperStyle={styles.checkboxWrapper}
                />
              ))}
            </ScrollView>

            <Button
              title="Next"
              onPress={saveGoals}
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
    marginBottom: 40,
    textAlign: 'center',
  },
  goalsContainer: {
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