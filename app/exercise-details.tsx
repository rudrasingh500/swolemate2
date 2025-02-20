import { StyleSheet, View, ScrollView, ImageBackground } from 'react-native';
import { Text, Card, Button } from '@rneui/themed';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';

// Mock exercise data
const exerciseLibrary = {
  'Morning Cardio': {
    name: 'Morning Cardio',
    description: 'A low-intensity cardiovascular workout to start your day.',
    difficulty: 'Beginner',
    targetMuscles: ['Heart', 'Lungs', 'Legs'],
    instructions: [
      'Start with a 5-minute warm-up walk',
      'Gradually increase to a light jog or brisk walk',
      'Maintain steady breathing throughout',
      'Cool down with a 5-minute walk'
    ],
    benefits: [
      'Improves cardiovascular health',
      'Boosts energy levels',
      'Enhances mood',
      'Increases metabolism'
    ],
    duration: '30 mins',
    caloriesBurn: '200-300'
  },
  'Upper Body Strength': {
    name: 'Upper Body Strength',
    description: 'A comprehensive workout targeting all major upper body muscle groups.',
    difficulty: 'Intermediate',
    targetMuscles: ['Chest', 'Shoulders', 'Back', 'Arms'],
    instructions: [
      'Perform proper warm-up',
      'Start with compound exercises',
      'Focus on form over weight',
      'Rest 60-90 seconds between sets'
    ],
    benefits: [
      'Builds muscle strength',
      'Improves posture',
      'Enhances functional fitness',
      'Increases bone density'
    ],
    duration: '45 mins',
    caloriesBurn: '300-400'
  },
  'Evening Yoga': {
    name: 'Evening Yoga',
    description: 'A relaxing yoga session to end your day and improve flexibility.',
    difficulty: 'All Levels',
    targetMuscles: ['Core', 'Back', 'Hips', 'Legs'],
    instructions: [
      'Start with breathing exercises',
      'Move through poses slowly',
      'Hold each pose for 3-5 breaths',
      'End with meditation'
    ],
    benefits: [
      'Reduces stress',
      'Improves flexibility',
      'Enhances sleep quality',
      'Builds core strength'
    ],
    duration: '20 mins',
    caloriesBurn: '150-200'
  },
  'HIIT Session': {
    name: 'HIIT Session',
    description: 'High-intensity interval training for maximum calorie burn.',
    difficulty: 'Advanced',
    targetMuscles: ['Full Body'],
    instructions: [
      'Warm up thoroughly',
      '30 seconds high intensity',
      '30 seconds rest',
      'Repeat for designated intervals'
    ],
    benefits: [
      'Maximum calorie burn',
      'Improves endurance',
      'Increases metabolism',
      'Builds strength'
    ],
    duration: '40 mins',
    caloriesBurn: '400-600'
  },
  'Lower Body Focus': {
    name: 'Lower Body Focus',
    description: 'Targeted workout for building lower body strength and power.',
    difficulty: 'Intermediate',
    targetMuscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
    instructions: [
      'Start with dynamic stretches',
      'Focus on proper form',
      'Progressive weight increase',
      'Cool down with static stretches'
    ],
    benefits: [
      'Builds leg strength',
      'Improves stability',
      'Enhances athletic performance',
      'Boosts metabolism'
    ],
    duration: '50 mins',
    caloriesBurn: '350-450'
  }
};

export default function ExerciseDetails() {
  const params = useLocalSearchParams();
  const exerciseName = params.name as string;
  const exercise = Object.entries(exerciseLibrary).find(
    ([key]) => key.toLowerCase() === exerciseName?.toLowerCase()
  )?.[1];

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Exercise not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.content}>
              <Button
                icon={{ name: 'arrow-left', type: 'font-awesome', color: 'white' }}
                type="clear"
                onPress={() => router.back()}
                containerStyle={styles.backButton}
              />
              
              <Text h2 style={styles.title}>{exercise.name}</Text>
              
              <Card containerStyle={styles.card}>
                <Text style={styles.description}>{exercise.description}</Text>
                <View style={styles.metaInfo}>
                  <Text style={styles.metaItem}>Duration: {exercise.duration}</Text>
                  <Text style={styles.metaItem}>Difficulty: {exercise.difficulty}</Text>
                  <Text style={styles.metaItem}>Calories: {exercise.caloriesBurn}</Text>
                </View>
              </Card>

              <Card containerStyle={styles.card}>
                <Card.Title style={styles.cardTitle}>Target Muscles</Card.Title>
                <View style={styles.chipContainer}>
                  {exercise.targetMuscles.map((muscle, index) => (
                    <View key={index} style={styles.chip}>
                      <Text style={styles.chipText}>{muscle}</Text>
                    </View>
                  ))}
                </View>
              </Card>

              <Card containerStyle={styles.card}>
                <Card.Title style={styles.cardTitle}>Instructions</Card.Title>
                {exercise.instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <Text style={styles.instructionNumber}>{index + 1}</Text>
                    <Text style={styles.instructionText}>{instruction}</Text>
                  </View>
                ))}
              </Card>

              <Card containerStyle={styles.card}>
                <Card.Title style={styles.cardTitle}>Benefits</Card.Title>
                {exercise.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </Card>
            </View>
          </ScrollView>
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
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
  },
  title: {
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  cardTitle: {
    color: 'white',
    fontSize: 20,
    textAlign: 'left',
    marginBottom: 15,
  },
  description: {
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
  },
  metaInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaItem: {
    color: '#e0e0e0',
    backgroundColor: 'rgba(231, 76, 60, 0.3)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 14,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: 'rgba(231, 76, 60, 0.3)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  chipText: {
    color: 'white',
    fontSize: 14,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    width: 25,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  bulletPoint: {
    color: '#e74c3c',
    fontSize: 20,
    marginRight: 10,
  },
  benefitText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});