import { StyleSheet, View, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useState } from 'react';
import { router } from 'expo-router';

export default function TabsMainScreen() {
  // Placeholder data
  const [workoutStreak, setWorkoutStreak] = useState(5);
  const [workouts, setWorkouts] = useState([
    { id: 1, name: 'Morning Cardio', duration: '30 mins', completed: true },
    { id: 2, name: 'Upper Body Strength', duration: '45 mins', completed: false },
    { id: 3, name: 'Evening Yoga', duration: '20 mins', completed: false },
  ]);

  // Tomorrow's workout plans
  const [tomorrowWorkouts] = useState([
    { id: 4, name: 'HIIT Session', duration: '40 mins', type: 'planned' },
    { id: 5, name: 'Lower Body Focus', duration: '50 mins', type: 'planned' },
  ]);

  const toggleWorkoutCompletion = (id: number) => {
    setWorkouts(prevWorkouts => {
      const updatedWorkouts = prevWorkouts.map(workout =>
        workout.id === id ? { ...workout, completed: !workout.completed } : workout
      );
      
      // Update streak if all workouts are completed
      const allCompleted = updatedWorkouts.every(workout => workout.completed);
      if (allCompleted) {
        setWorkoutStreak(prev => prev + 1);
      }
      
      return updatedWorkouts;
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.streakContainer}>
              <Text h2 style={styles.streakNumber}>{workoutStreak}</Text>
              <Text style={styles.streakText}>Day Streak</Text>
            </View>

            <View style={styles.workoutsContainer}>
              <Text style={styles.sectionTitle}>Today's Workouts</Text>
              <ScrollView style={styles.workoutsList}>
                {workouts.map(workout => (
                  <View key={workout.id} style={styles.workoutItem}>
                    <View>
                      <Text style={styles.workoutName}>{workout.name}</Text>
                      <Text style={styles.workoutDuration}>{workout.duration}</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.workoutItem, styles.statusContainer]}
                      onPress={() => {
                        router.push({
                          pathname: '/exercise-details',
                          params: { name: workout.name }
                        });
                      }}
                    >
                      <Text style={[styles.workoutStatus, workout.completed ? styles.completed : styles.scheduled]}>
                        {workout.completed ? 'Completed' : 'Scheduled'}
                      </Text>
                      <View style={[styles.checkbox, workout.completed && styles.checkboxCompleted]}>
                        {workout.completed && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Tomorrow's Plans</Text>
              <ScrollView style={styles.workoutsList}>
                {tomorrowWorkouts.map(workout => (
                  <View key={workout.id} style={styles.workoutItem}>
                    <View>
                      <Text style={styles.workoutName}>{workout.name}</Text>
                      <Text style={styles.workoutDuration}>{workout.duration}</Text>
                    </View>
                    <View style={styles.statusContainer}>
                      <Text style={[styles.workoutStatus, styles.planned]}>Planned</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <Button
                title="Workout Form Analysis"
                onPress={() => router.push('/record')}
                containerStyle={[styles.analysisButtonContainer, { overflow: 'hidden', borderRadius: 10 }]}
                buttonStyle={[styles.analysisButton, { borderRadius: 10, backgroundColor: '#e74c3c' }]}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingTop: 40,
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 20,
  },
  streakNumber: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  streakText: {
    color: '#e0e0e0',
    fontSize: 18,
  },
  workoutsContainer: {
    flex: 1,
  },
  sectionTitle: {
    color: 'white',
    marginBottom: 20,
  },
  workoutsList: {
    flex: 1,
  },
  workoutItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  workoutDuration: {
    color: '#e0e0e0',
    fontSize: 14,
  },
  workoutStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  completed: {
    color: '#4CAF50',
  },
  scheduled: {
    color: '#FFC107',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#FFC107',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  planned: {
    color: '#64B5F6',
  },
  analysisButtonContainer: {
    marginTop: 20,
    width: '100%',
  },
  analysisButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
  },
});