import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Divider } from '@rneui/themed';
import { supabase } from '@/lib/supabase/supabase';
import { WorkoutLog } from '@/types/workout-log';
import { format, parseISO, isToday, isYesterday } from 'date-fns';

interface ExerciseWorkoutHistoryProps {
  profileId: string;
  exerciseName: string;
}

export default function ExerciseWorkoutHistory({ profileId, exerciseName }: ExerciseWorkoutHistoryProps) {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkoutLogs();
  }, [profileId, exerciseName]);

  const fetchWorkoutLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get logs for this specific exercise from the past 30 days
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const { data, error } = await supabase.rpc('get_workout_logs_by_period', {
        user_id: profileId,
        start_date: startDate.toISOString(),
        end_date: new Date().toISOString()
      });

      if (error) throw error;

      // Filter logs for this specific exercise
      const exerciseLogs = (data || []).filter(log => 
        log.exercise_name.toLowerCase() === exerciseName.toLowerCase()
      );

      setLogs(exerciseLogs);
    } catch (err) {
      console.error('Error fetching exercise logs:', err);
      setError('Failed to load workout history');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'EEEE, MMM d');
    }
  };

  // Render log details based on exercise type
  const renderLogDetails = (log: WorkoutLog) => {
    const logData = log.log_data as any;

    switch (log.exercise_type) {
      case 'strength':
        return (
          <View style={styles.logDetails}>
            {logData.sets && logData.sets.map((set: any, index: number) => (
              <View key={index} style={styles.setRow}>
                <Text style={styles.setText}>Set {set.set_number}:</Text>
                <Text style={styles.setDetails}>{set.weight} lbs × {set.reps} reps</Text>
              </View>
            ))}
          </View>
        );

      case 'duration':
        return (
          <View style={styles.logDetails}>
            {logData.sets && logData.sets.map((set: any, index: number) => (
              <View key={index} style={styles.setRow}>
                <Text style={styles.setText}>Set {set.set_number}:</Text>
                <Text style={styles.setDetails}>
                  {set.duration} {set.duration_unit}
                </Text>
              </View>
            ))}
          </View>
        );

      case 'cardio':
        return (
          <View style={styles.logDetails}>
            {logData.distance && (
              <View style={styles.cardioRow}>
                <Text style={styles.cardioLabel}>Distance:</Text>
                <Text style={styles.cardioValue}>
                  {logData.distance} {logData.distance_unit || 'km'}
                </Text>
              </View>
            )}
            {logData.duration && (
              <View style={styles.cardioRow}>
                <Text style={styles.cardioLabel}>Duration:</Text>
                <Text style={styles.cardioValue}>
                  {logData.duration} {logData.duration_unit || 'min'}
                </Text>
              </View>
            )}
            {logData.pace && (
              <View style={styles.cardioRow}>
                <Text style={styles.cardioLabel}>Pace:</Text>
                <Text style={styles.cardioValue}>{logData.pace}</Text>
              </View>
            )}
          </View>
        );

      default:
        return <Text>No details available</Text>;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Workout History</Text>
        <Text style={styles.loadingText}>Loading workout history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Workout History</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (logs.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Workout History</Text>
        <Text style={styles.emptyText}>No workout logs found for this exercise.</Text>
        <Text style={styles.emptySubtext}>Complete a workout to see your history here!</Text>
      </View>
    );
  }

  // Group logs by date
  const groupedLogs = logs.reduce((groups, log) => {
    const date = format(parseISO(log.logged_at), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {} as Record<string, WorkoutLog[]>);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout History</Text>
      
      <ScrollView style={styles.scrollContainer} nestedScrollEnabled={true}>
        {Object.keys(groupedLogs)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort dates in descending order
          .map((date) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{formatDate(date)}</Text>
              
              {groupedLogs[date].map((log) => (
                <Card key={log.id} containerStyle={styles.logCard}>
                  <View style={styles.logHeader}>
                    <Text style={styles.logTime}>
                      {format(parseISO(log.logged_at), 'h:mm a')}
                    </Text>
                  </View>
                  
                  <View style={styles.exerciseTypeContainer}>
                    <Text style={styles.exerciseType}>
                      {log.exercise_type.charAt(0).toUpperCase() + log.exercise_type.slice(1)}
                    </Text>
                  </View>
                  
                  {renderLogDetails(log)}
                  
                  {log.notes && (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Notes:</Text>
                      <Text style={styles.notesText}>{log.notes}</Text>
                    </View>
                  )}
                </Card>
              ))}
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  scrollContainer: {
    maxHeight: 400,
  },
  dateGroup: {
    marginBottom: 15,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ccc',
  },
  logCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  logTime: {
    fontSize: 12,
    color: '#aaa',
  },
  exerciseTypeContainer: {
    marginBottom: 10,
  },
  exerciseType: {
    fontSize: 14,
    color: '#ccc',
    fontStyle: 'italic',
  },
  logDetails: {
    marginVertical: 5,
  },
  setRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  setText: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 60,
    color: '#ccc',
  },
  setDetails: {
    fontSize: 14,
    color: '#ccc',
  },
  cardioRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  cardioLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 80,
    color: '#ccc',
  },
  cardioValue: {
    fontSize: 14,
    color: '#ccc',
  },
  notesContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#ccc',
  },
  notesText: {
    fontSize: 14,
    color: '#ccc',
  },
  loadingText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
});
