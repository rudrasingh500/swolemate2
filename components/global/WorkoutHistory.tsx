
import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Icon } from '@rneui/themed';
import { supabase } from '@/lib/supabase/supabase';
import { WorkoutLog } from '@/types/workout-log';
import { format, parseISO, isToday, isYesterday, subDays } from 'date-fns';
import styles from '@/styles/workout-history_style';

interface WorkoutHistoryProps {
  profileId: string;
  exerciseName?: string;
  onViewAllHistory?: () => void;
  refreshTrigger?: number;
}

export default function WorkoutHistory({ 
  profileId, 
  exerciseName, 
  onViewAllHistory, 
  refreshTrigger = 0 
}: WorkoutHistoryProps) {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Determine if we're showing history for a specific exercise
  const isExerciseSpecific = !!exerciseName;

  useEffect(() => {
    fetchWorkoutLogs();
  }, [profileId, exerciseName, refreshTrigger]);

  const fetchWorkoutLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Calculate date range
      let startDate;
      const endDate = new Date().toISOString();
      
      if (isExerciseSpecific) {
        // For specific exercise, get logs from the past 30 days
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        startDate = startDate.toISOString();
      } else {
        // For general history, get logs from the past 7 days
        startDate = subDays(new Date(), 7).toISOString();
      }
      
      const { data, error } = await supabase.rpc('get_workout_logs_by_period', {
        user_id: profileId,
        start_date: startDate,
        end_date: endDate
      });

      if (error) throw error;

      // Filter logs for specific exercise if needed
      const filteredLogs = isExerciseSpecific
        ? (data || []).filter(log => 
            log.exercise_name.toLowerCase() === exerciseName.toLowerCase()
          )
        : (data || []);

      setLogs(filteredLogs);
    } catch (err) {
      console.error('Error fetching workout logs:', err);
      setError('Failed to load workout history');
    } finally {
      setIsLoading(false);
    }
  };

  // Group logs by date
  const groupedLogs = logs.reduce((groups, log) => {
    const date = format(parseISO(log.logged_at), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {} as Record<string, WorkoutLog[]>);

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
      <View style={isExerciseSpecific ? styles.container : styles.loadingContainer}>
        {isExerciseSpecific && <Text style={styles.title}>Workout History</Text>}
        <Text style={styles.loadingText}>Loading workout history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={isExerciseSpecific ? styles.container : styles.errorContainer}>
        {isExerciseSpecific && <Text style={styles.title}>Workout History</Text>}
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (logs.length === 0) {
    const emptyMessage = isExerciseSpecific
      ? 'No workout logs found for this exercise.'
      : 'No workout logs found for the past week.';
      
    return (
      <View style={isExerciseSpecific ? styles.container : styles.emptyContainer}>
        {isExerciseSpecific && <Text style={styles.title}>Workout History</Text>}
        <Text style={styles.emptyText}>{emptyMessage}</Text>
        <Text style={styles.emptySubtext}>Complete a workout to see your history here!</Text>
      </View>
    );
  }

  return (
    <View style={isExerciseSpecific ? styles.container : styles.generalContainer}>
      {isExerciseSpecific ? (
        <Text style={styles.title}>Workout History</Text>
      ) : (
        <View style={styles.header}>
          <Text style={styles.generalTitle}>Recent Workout History</Text>
          {onViewAllHistory && (
            <TouchableOpacity onPress={onViewAllHistory} style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Icon name="chevron-right" type="material" size={16} color="#e74c3c" />
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <ScrollView 
        style={isExerciseSpecific ? styles.scrollContainer : styles.generalScrollContainer} 
        nestedScrollEnabled={isExerciseSpecific}
      >
        {Object.keys(groupedLogs)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort dates in descending order
          .map((date) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{formatDate(date)}</Text>
              
              {groupedLogs[date].map((log) => (
                <Card key={log.id} containerStyle={styles.logCard}>
                  <View style={styles.logHeader}>
                    {!isExerciseSpecific && (
                      <Text style={styles.exerciseName}>{log.exercise_name}</Text>
                    )}
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
