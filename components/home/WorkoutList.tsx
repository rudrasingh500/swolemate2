import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@rneui/themed';
import { router } from 'expo-router';
import home_styles from '@/styles/home_style';

interface WorkoutItem {
  id: number;
  name: string;
  duration: string;
  completed?: boolean;
}

interface WorkoutListProps {
  title: string;
  workouts: WorkoutItem[];
  onToggleCompletion?: (id: number) => void;
  isPlanned?: boolean;
  style?: object;
}

export default function WorkoutList({ title, workouts, onToggleCompletion, isPlanned = false, style }: WorkoutListProps) {
  return (
    <>
      <Text style={[home_styles.sectionTitle, style]}>{title}</Text>
      <ScrollView style={home_styles.workoutsList}>
        {workouts.length > 0 ? (
          workouts.map(workout => (
            <View key={workout.id} style={home_styles.workoutItem}>
              <TouchableOpacity
                style={home_styles.workoutInfo}
                onPress={() => {
                  router.push({
                    pathname: '/exercise-details',
                    params: { name: workout.name }
                  });
                }}
              >
                <View>
                  <Text style={home_styles.workoutName}>{workout.name}</Text>
                  <Text style={home_styles.workoutDuration}>{workout.duration}</Text>
                </View>
              </TouchableOpacity>
              <View style={home_styles.statusContainer}>
                {isPlanned ? (
                  <Text style={[home_styles.workoutStatus, home_styles.planned]}>Planned</Text>
                ) : (
                  <>
                    <Text style={[home_styles.workoutStatus, workout.completed ? home_styles.completed : home_styles.scheduled]}>
                      {workout.completed ? 'Completed' : 'Scheduled'}
                    </Text>
                    {onToggleCompletion && (
                      <TouchableOpacity
                        onPress={() => onToggleCompletion(workout.id)}
                        style={home_styles.checkboxContainer}
                      >
                        <View style={[home_styles.checkbox, workout.completed && home_styles.checkboxCompleted]}>
                          {workout.completed && <Text style={home_styles.checkmark}>✓</Text>}
                        </View>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={home_styles.noWorkoutsContainer}>
            <Text style={home_styles.noWorkoutsText}>No workouts scheduled {isPlanned ? 'for tomorrow' : 'for today'}</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}