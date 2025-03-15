import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@rneui/themed';
import { router } from 'expo-router';
import home_styles from '@/styles/home_style';
import ProgressChart from '@/components/workout/ProgressChart';
import { supabase } from '@/lib/supabase/supabase';
import { useState, useEffect } from 'react';

interface WorkoutItem {
  id: number;
  name: string;
  duration: string;
  completed?: boolean;
  inProgress?: boolean;
}

interface WorkoutListProps {
  title: string;
  workouts: WorkoutItem[];
  onToggleCompletion?: (id: number) => void;
  isPlanned?: boolean;
  style?: object;
  profileId?: string;
  showProgress?: boolean;
}

export default function WorkoutList({ 
  title, 
  workouts, 
  onToggleCompletion, 
  isPlanned = false, 
  style,
  profileId,
  showProgress = true
}: WorkoutListProps) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (profileId) {
      setUserId(profileId);
    } else {
      // Get the current user if profileId is not provided
      const getCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }
      };
      
      getCurrentUser();
    }
  }, [profileId]);
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
                <View style={home_styles.workoutInfoContent}>
                  <View>
                    <Text style={home_styles.workoutName}>{workout.name}</Text>
                    <Text style={home_styles.workoutDuration}>{workout.duration}</Text>
                  </View>
                  
                  {/* Mini progress chart removed as requested */}
                </View>
              </TouchableOpacity>
              <View style={home_styles.statusContainer}>
                {isPlanned ? (
                  <Text style={[home_styles.workoutStatus, home_styles.planned]}>Planned</Text>
                ) : (
                  <>
                    <Text style={[
                      home_styles.workoutStatus, 
                      workout.completed ? home_styles.completed : 
                      workout.inProgress ? home_styles.inProgress : 
                      home_styles.scheduled
                    ]}>
                      {workout.completed ? 'Completed' : workout.inProgress ? 'In Progress' : 'Scheduled'}
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
