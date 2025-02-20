import { StyleSheet, View, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useState } from 'react';
import { router } from 'expo-router';

type WorkoutPlan = {
  day: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    duration: string;
  }[];
  timeFrame: string;
};

export default function WorkoutPlanScreen() {
  const [currentGoal] = useState('Build Muscle & Strength');
  const [weeklyPlan] = useState<WorkoutPlan[]>([
    {
      day: 'Monday',
      timeFrame: '6:00 AM - 7:15 AM',
      exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: '8-10', duration: '15 mins' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', duration: '12 mins' },
        { name: 'Cable Flyes', sets: 3, reps: '12-15', duration: '10 mins' },
        { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', duration: '10 mins' },
      ],
    },
    {
      day: 'Tuesday',
      timeFrame: '5:30 PM - 6:45 PM',
      exercises: [
        { name: 'Barbell Squats', sets: 4, reps: '8-10', duration: '20 mins' },
        { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', duration: '15 mins' },
        { name: 'Leg Press', sets: 3, reps: '12-15', duration: '12 mins' },
        { name: 'Calf Raises', sets: 3, reps: '15-20', duration: '8 mins' },
      ],
    },
    {
      day: 'Wednesday',
      timeFrame: '6:00 AM - 7:00 AM',
      exercises: [
        { name: 'Pull-ups', sets: 4, reps: '6-8', duration: '15 mins' },
        { name: 'Barbell Rows', sets: 3, reps: '10-12', duration: '12 mins' },
        { name: 'Face Pulls', sets: 3, reps: '12-15', duration: '10 mins' },
        { name: 'Bicep Curls', sets: 3, reps: '12-15', duration: '10 mins' },
      ],
    },
    {
      day: 'Thursday',
      timeFrame: '5:30 PM - 6:30 PM',
      exercises: [
        { name: 'Overhead Press', sets: 4, reps: '8-10', duration: '15 mins' },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', duration: '10 mins' },
        { name: 'Front Raises', sets: 3, reps: '12-15', duration: '10 mins' },
        { name: 'Shrugs', sets: 3, reps: '12-15', duration: '10 mins' },
      ],
    },
    {
      day: 'Friday',
      timeFrame: '6:00 AM - 7:15 AM',
      exercises: [
        { name: 'Deadlifts', sets: 4, reps: '6-8', duration: '20 mins' },
        { name: 'Lat Pulldowns', sets: 3, reps: '10-12', duration: '12 mins' },
        { name: 'Cable Rows', sets: 3, reps: '12-15', duration: '12 mins' },
        { name: 'Hammer Curls', sets: 3, reps: '12-15', duration: '10 mins' },
      ],
    },
    {
      day: 'Saturday',
      timeFrame: '9:00 AM - 10:00 AM',
      exercises: [
        { name: 'Body Weight Squats', sets: 3, reps: '15-20', duration: '10 mins' },
        { name: 'Push-ups', sets: 3, reps: '12-15', duration: '10 mins' },
        { name: 'Plank Holds', sets: 3, reps: '30-45 sec', duration: '10 mins' },
        { name: 'Light Cardio', sets: 1, reps: '20 mins', duration: '20 mins' },
      ],
    },
    {
      day: 'Sunday',
      timeFrame: 'Rest Day',
      exercises: [
        { name: 'Light Walking', sets: 1, reps: '30 mins', duration: '30 mins' },
        { name: 'Stretching', sets: 1, reps: '15 mins', duration: '15 mins' },
      ],
    },
  ]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.goalContainer}>
              <View style={styles.goalHeader}>
                <Text h4 style={styles.goalTitle}>Current Goal</Text>
                <Button
                  title="Edit Plan"
                  type="outline"
                  onPress={() => {}}
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
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
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
});