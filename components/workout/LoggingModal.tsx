import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Text, Button, Icon } from '@rneui/themed';
import { 
  determineExerciseType, 
  ExerciseType, 
  LogData, 
  StrengthSet, 
  DurationSet,
  isStrengthLogData,
  isDurationLogData,
  isCardioLogData
} from '@/types/workout-log';
import { supabase } from '@/lib/supabase/supabase';
import log_styles from '@/styles/logging-modal _style';

interface LoggingModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (logData: LogData, exerciseType: ExerciseType, notes: string, complete: boolean) => Promise<void>;
  exerciseName: string;
  savedData?: {
    logData: LogData;
    exerciseType: ExerciseType;
    notes: string;
  };
}

export default function LoggingModal({ isVisible, onClose, onSubmit, exerciseName, savedData }: LoggingModalProps) {
  const [exerciseType, setExerciseType] = useState<ExerciseType>('strength');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Strength exercise state
  const [strengthSets, setStrengthSets] = useState<StrengthSet[]>([
    { set_number: 1, weight: 0, reps: 0, is_completed: false }
  ]);
  
  // Duration exercise state
  const [durationSets, setDurationSets] = useState<DurationSet[]>([
    { set_number: 1, duration: 0, duration_unit: 'sec', is_completed: false }
  ]);
  
  // For exact minute and second input
  const [minutesInputs, setMinutesInputs] = useState<number[]>([0]);
  const [secondsInputs, setSecondsInputs] = useState<number[]>([0]);
  
  // Cardio exercise state
  const [distance, setDistance] = useState<number | undefined>(undefined);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km');
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [durationUnit, setDurationUnit] = useState<'min' | 'sec'>('min');
  const [pace, setPace] = useState<string>('');
  const [caloriesBurned, setCaloriesBurned] = useState<number | undefined>(undefined);
  const [heartRate, setHeartRate] = useState<number | undefined>(undefined);
  
  // Determine exercise type on mount and load saved data if available
  useEffect(() => {
    if (exerciseName) {
      setExerciseType(determineExerciseType(exerciseName));
    }
    
    // Load saved data if available
    if (savedData) {
      setExerciseType(savedData.exerciseType);
      setNotes(savedData.notes);
      
      // Load saved sets based on exercise type
      if (savedData.exerciseType === 'strength' && isStrengthLogData(savedData.logData)) {
        setStrengthSets(savedData.logData.sets);
      } else if (savedData.exerciseType === 'duration' && isDurationLogData(savedData.logData)) {
        const sets = savedData.logData.sets;
        setDurationSets(sets);
        
        // Calculate minutes and seconds for each set
        const mins: number[] = [];
        const secs: number[] = [];
        sets.forEach(set => {
          const totalSeconds = set.duration;
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
          mins.push(minutes);
          secs.push(seconds);
        });
        
        setMinutesInputs(mins);
        setSecondsInputs(secs);
      } else if (savedData.exerciseType === 'cardio' && isCardioLogData(savedData.logData)) {
        const cardioData = savedData.logData;
        if (cardioData.distance) setDistance(cardioData.distance);
        if (cardioData.distance_unit) setDistanceUnit(cardioData.distance_unit);
        if (cardioData.duration) setDuration(cardioData.duration);
        if (cardioData.duration_unit) setDurationUnit(cardioData.duration_unit);
        if (cardioData.pace) setPace(cardioData.pace);
        if (cardioData.calories_burned) setCaloriesBurned(cardioData.calories_burned);
        if (cardioData.heart_rate_avg) setHeartRate(cardioData.heart_rate_avg);
      }
    }
  }, [exerciseName, savedData]);
  
  // Add a strength set
  const addStrengthSet = () => {
    setStrengthSets([
      ...strengthSets,
      {
        set_number: strengthSets.length + 1,
        weight: strengthSets[strengthSets.length - 1]?.weight || 0,
        reps: strengthSets[strengthSets.length - 1]?.reps || 0,
        is_completed: false
      }
    ]);
  };
  
  // Remove a strength set
  const removeStrengthSet = (index: number) => {
    if (strengthSets.length > 1) {
      const updatedSets = strengthSets.filter((_, i) => i !== index);
      // Update set numbers
      const renumberedSets = updatedSets.map((set, i) => ({
        ...set,
        set_number: i + 1
      }));
      setStrengthSets(renumberedSets);
    }
  };
  
  // Update a strength set
  const updateStrengthSet = (index: number, field: keyof StrengthSet, value: any) => {
    const updatedSets = [...strengthSets];
    updatedSets[index] = {
      ...updatedSets[index],
      [field]: field === 'weight' || field === 'reps' ? Number(value) : value
    };
    setStrengthSets(updatedSets);
  };
  
  // Add a duration set
  const addDurationSet = () => {
    setDurationSets([
      ...durationSets,
      {
        set_number: durationSets.length + 1,
        duration: durationSets[durationSets.length - 1]?.duration || 0,
        duration_unit: 'sec',
        is_completed: false
      }
    ]);
    
    // Add default values for minutes and seconds inputs
    setMinutesInputs([...minutesInputs, 0]);
    setSecondsInputs([...secondsInputs, 0]);
  };
  
  // Remove a duration set
  const removeDurationSet = (index: number) => {
    if (durationSets.length > 1) {
      const updatedSets = durationSets.filter((_, i) => i !== index);
      // Update set numbers
      const renumberedSets = updatedSets.map((set, i) => ({
        ...set,
        set_number: i + 1
      }));
      setDurationSets(renumberedSets);
      
      // Update minutes and seconds inputs
      const newMinutesInputs = [...minutesInputs];
      const newSecondsInputs = [...secondsInputs];
      newMinutesInputs.splice(index, 1);
      newSecondsInputs.splice(index, 1);
      setMinutesInputs(newMinutesInputs);
      setSecondsInputs(newSecondsInputs);
    }
  };
  
  // Update minutes for duration set
  const updateMinutes = (index: number, value: string) => {
    const minutes = value === '' ? 0 : Math.min(Math.max(0, parseInt(value) || 0), 999);
    const newMinutesInputs = [...minutesInputs];
    newMinutesInputs[index] = minutes;
    setMinutesInputs(newMinutesInputs);
    
    // Update the duration set with total seconds
    const seconds = secondsInputs[index] || 0;
    const totalSeconds = (minutes * 60) + seconds;
    
    const updatedSets = [...durationSets];
    updatedSets[index] = {
      ...updatedSets[index],
      duration: totalSeconds,
      duration_unit: 'sec'
    };
    setDurationSets(updatedSets);
  };
  
  // Update seconds for duration set
  const updateSeconds = (index: number, value: string) => {
    const seconds = value === '' ? 0 : Math.min(Math.max(0, parseInt(value) || 0), 59);
    const newSecondsInputs = [...secondsInputs];
    newSecondsInputs[index] = seconds;
    setSecondsInputs(newSecondsInputs);
    
    // Update the duration set with total seconds
    const minutes = minutesInputs[index] || 0;
    const totalSeconds = (minutes * 60) + seconds;
    
    const updatedSets = [...durationSets];
    updatedSets[index] = {
      ...updatedSets[index],
      duration: totalSeconds,
      duration_unit: 'sec'
    };
    setDurationSets(updatedSets);
  };
  
  // Toggle cardio distance unit
  const toggleDistanceUnit = () => {
    setDistanceUnit(distanceUnit === 'km' ? 'mi' : 'km');
  };
  
  // Toggle cardio duration unit
  const toggleCardioTimeUnit = () => {
    setDurationUnit(durationUnit === 'min' ? 'sec' : 'min');
  };
  
  // Handle form submission
  const handleSubmit = async (complete: boolean) => {
    try {
      setIsSubmitting(true);
      
      let logData: LogData;
      
      // Prepare log data based on exercise type
      switch (exerciseType) {
        case 'strength':
          logData = {
            sets: strengthSets.map(set => ({
              ...set,
              is_completed: true
            }))
          };
          break;
        case 'duration':
          logData = {
            sets: durationSets.map(set => ({
              ...set,
              is_completed: true
            }))
          };
          break;
        case 'cardio':
          logData = {
            distance,
            distance_unit: distanceUnit,
            duration,
            duration_unit: durationUnit,
            pace,
            calories_burned: caloriesBurned,
            heart_rate_avg: heartRate
          };
          break;
        default:
          throw new Error('Invalid exercise type');
      }
      
      await onSubmit(logData, exerciseType, notes, complete);
      if (complete) {
        resetForm();
      }
      onClose();
    } catch (error) {
      console.error('Error submitting workout log:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form state
  const resetForm = () => {
    setNotes('');
    setStrengthSets([{ set_number: 1, weight: 0, reps: 0, is_completed: false }]);
    setDurationSets([{ set_number: 1, duration: 0, duration_unit: 'sec', is_completed: false }]);
    setMinutesInputs([0]);
    setSecondsInputs([0]);
    setDistance(undefined);
    setDistanceUnit('km');
    setDuration(undefined);
    setDurationUnit('min');
    setPace('');
    setCaloriesBurned(undefined);
    setHeartRate(undefined);
  };
  
  // Format placeholder text with proper color
  const getPlaceholderTextColor = () => {
    return '#666';
  };
  
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={log_styles.modalOverlay}>
        <View style={log_styles.modalContent}>
          <View style={log_styles.modalHeader}>
            <Text h4 style={log_styles.modalTitle}>Log Workout: {exerciseName}</Text>
            <TouchableOpacity onPress={onClose} style={log_styles.closeButton}>
              <Icon name="close" type="material" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={log_styles.modalBody}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {/* Strength Exercise Form */}
            {exerciseType === 'strength' && (
              <View style={log_styles.formSection}>
                <Text style={log_styles.sectionTitle}>Strength Training</Text>
                
                {strengthSets.map((set, index) => (
                  <View key={index} style={log_styles.setRow}>
                    <View style={log_styles.setNumberContainer}>
                      <Text style={log_styles.setNumber}>Set {set.set_number}</Text>
                    </View>
                    
                    <View style={log_styles.inputGroup}>
                      <Text style={log_styles.inputLabel}>Weight</Text>
                      <TextInput
                        style={log_styles.input}
                        value={set.weight.toString()}
                        onChangeText={(value) => updateStrengthSet(index, 'weight', value)}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={getPlaceholderTextColor()}
                      />
                    </View>
                    
                    <View style={log_styles.inputGroup}>
                      <Text style={log_styles.inputLabel}>Reps</Text>
                      <TextInput
                        style={log_styles.input}
                        value={set.reps.toString()}
                        onChangeText={(value) => updateStrengthSet(index, 'reps', value)}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={getPlaceholderTextColor()}
                      />
                    </View>
                    
                    <TouchableOpacity 
                      onPress={() => removeStrengthSet(index)}
                      style={log_styles.removeButton}
                      disabled={strengthSets.length <= 1}
                    >
                      <Icon 
                        name="remove-circle-outline" 
                        type="material" 
                        size={24} 
                        color={strengthSets.length <= 1 ? '#ccc' : '#e74c3c'} 
                      />
                    </TouchableOpacity>
                  </View>
                ))}
                
                <Button
                  title="Add Set"
                  type="outline"
                  icon={<Icon name="add-circle-outline" type="material" size={20} color="#e74c3c" />}
                  buttonStyle={log_styles.addButton}
                  titleStyle={log_styles.addButtonText}
                  onPress={addStrengthSet}
                />
              </View>
            )}
            
            {/* Duration Exercise Form */}
            {exerciseType === 'duration' && (
              <View style={log_styles.formSection}>
                <Text style={log_styles.sectionTitle}>Duration Exercise</Text>
                
                {durationSets.map((set, index) => (
                  <View key={index} style={log_styles.setRow}>
                    <View style={log_styles.setNumberContainer}>
                      <Text style={log_styles.setNumber}>Set {set.set_number}</Text>
                    </View>
                    
                    <View style={log_styles.timeInputContainer}>
                      <View style={log_styles.timeInputGroup}>
                        <Text style={log_styles.inputLabel}>Minutes</Text>
                        <TextInput
                          style={log_styles.timeInput}
                          value={minutesInputs[index]?.toString() || '0'}
                          onChangeText={(value) => updateMinutes(index, value)}
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={getPlaceholderTextColor()}
                        />
                      </View>
                      
                      <Text style={log_styles.timeSeparator}>:</Text>
                      
                      <View style={log_styles.timeInputGroup}>
                        <Text style={log_styles.inputLabel}>Seconds</Text>
                        <TextInput
                          style={log_styles.timeInput}
                          value={secondsInputs[index]?.toString() || '0'}
                          onChangeText={(value) => updateSeconds(index, value)}
                          keyboardType="numeric"
                          placeholder="00"
                          placeholderTextColor={getPlaceholderTextColor()}
                        />
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      onPress={() => removeDurationSet(index)}
                      style={log_styles.removeButton}
                      disabled={durationSets.length <= 1}
                    >
                      <Icon 
                        name="remove-circle-outline" 
                        type="material" 
                        size={24} 
                        color={durationSets.length <= 1 ? '#ccc' : '#e74c3c'} 
                      />
                    </TouchableOpacity>
                  </View>
                ))}
                
                <Button
                  title="Add Set"
                  type="outline"
                  icon={<Icon name="add-circle-outline" type="material" size={20} color="#e74c3c" />}
                  buttonStyle={log_styles.addButton}
                  titleStyle={log_styles.addButtonText}
                  onPress={addDurationSet}
                />
              </View>
            )}
            
            {/* Cardio Exercise Form */}
            {exerciseType === 'cardio' && (
              <View style={log_styles.formSection}>
                <Text style={log_styles.sectionTitle}>Cardio Exercise</Text>
                
                <View style={log_styles.cardioRow}>
                  <View style={log_styles.cardioInputGroup}>
                    <Text style={log_styles.inputLabel}>Distance</Text>
                    <View style={log_styles.cardioInputContainer}>
                      <TextInput
                        style={log_styles.cardioInput}
                        value={distance !== undefined ? distance.toString() : ''}
                        onChangeText={(value) => setDistance(value ? Number(value) : undefined)}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={getPlaceholderTextColor()}
                      />
                      <TouchableOpacity 
                        style={log_styles.unitToggle}
                        onPress={toggleDistanceUnit}
                      >
                        <Text style={log_styles.unitText}>{distanceUnit}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                
                <View style={log_styles.cardioRow}>
                  <View style={log_styles.cardioInputGroup}>
                    <Text style={log_styles.inputLabel}>Duration</Text>
                    <View style={log_styles.cardioInputContainer}>
                      <TextInput
                        style={log_styles.cardioInput}
                        value={duration !== undefined ? duration.toString() : ''}
                        onChangeText={(value) => setDuration(value ? Number(value) : undefined)}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={getPlaceholderTextColor()}
                      />
                      <TouchableOpacity 
                        style={log_styles.unitToggle}
                        onPress={toggleCardioTimeUnit}
                      >
                        <Text style={log_styles.unitText}>{durationUnit}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                
                <View style={log_styles.cardioRow}>
                  <View style={log_styles.cardioInputGroup}>
                    <Text style={log_styles.inputLabel}>Pace (min/km or min/mile)</Text>
                    <TextInput
                      style={log_styles.fullWidthInput}
                      value={pace}
                      onChangeText={setPace}
                      placeholder="e.g. 5:30"
                      placeholderTextColor={getPlaceholderTextColor()}
                    />
                  </View>
                </View>
                
                <View style={log_styles.cardioRow}>
                  <View style={log_styles.cardioInputGroup}>
                    <Text style={log_styles.inputLabel}>Calories Burned</Text>
                    <TextInput
                      style={log_styles.fullWidthInput}
                      value={caloriesBurned !== undefined ? caloriesBurned.toString() : ''}
                      onChangeText={(value) => setCaloriesBurned(value ? Number(value) : undefined)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={getPlaceholderTextColor()}
                    />
                  </View>
                </View>
                
                <View style={log_styles.cardioRow}>
                  <View style={log_styles.cardioInputGroup}>
                    <Text style={log_styles.inputLabel}>Avg. Heart Rate (bpm)</Text>
                    <TextInput
                      style={log_styles.fullWidthInput}
                      value={heartRate !== undefined ? heartRate.toString() : ''}
                      onChangeText={(value) => setHeartRate(value ? Number(value) : undefined)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={getPlaceholderTextColor()}
                    />
                  </View>
                </View>
              </View>
            )}
            
            {/* Notes Section (common for all exercise types) */}
            <View style={log_styles.formSection}>
              <Text style={log_styles.sectionTitle}>Notes</Text>
              <TextInput
                style={log_styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes about your workout..."
                placeholderTextColor={getPlaceholderTextColor()}
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </ScrollView>
          
          <View style={log_styles.modalFooter}>
            <Button
              title="Cancel"
              type="outline"
              buttonStyle={log_styles.cancelButton}
              titleStyle={log_styles.cancelButtonText}
              onPress={onClose}
            />
            <View style={log_styles.actionButtons}>
              <Button
                title="Save"
                type="outline"
                buttonStyle={log_styles.saveProgressButton}
                titleStyle={log_styles.saveProgressButtonText}
                loading={isSaving}
                onPress={() => handleSubmit(false)}
                containerStyle={{ marginRight: 10 }}
              />
              <Button
                title="Complete"
                buttonStyle={log_styles.completeButton}
                loading={isSubmitting}
                onPress={() => handleSubmit(true)}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
