import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text h4 style={styles.modalTitle}>Log Workout: {exerciseName}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" type="material" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            {/* Strength Exercise Form */}
            {exerciseType === 'strength' && (
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Strength Training</Text>
                
                {strengthSets.map((set, index) => (
                  <View key={index} style={styles.setRow}>
                    <View style={styles.setNumberContainer}>
                      <Text style={styles.setNumber}>Set {set.set_number}</Text>
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Weight</Text>
                      <TextInput
                        style={styles.input}
                        value={set.weight.toString()}
                        onChangeText={(value) => updateStrengthSet(index, 'weight', value)}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={getPlaceholderTextColor()}
                      />
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Reps</Text>
                      <TextInput
                        style={styles.input}
                        value={set.reps.toString()}
                        onChangeText={(value) => updateStrengthSet(index, 'reps', value)}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={getPlaceholderTextColor()}
                      />
                    </View>
                    
                    <TouchableOpacity 
                      onPress={() => removeStrengthSet(index)}
                      style={styles.removeButton}
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
                  buttonStyle={styles.addButton}
                  titleStyle={styles.addButtonText}
                  onPress={addStrengthSet}
                />
              </View>
            )}
            
            {/* Duration Exercise Form */}
            {exerciseType === 'duration' && (
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Duration Exercise</Text>
                
                {durationSets.map((set, index) => (
                  <View key={index} style={styles.setRow}>
                    <View style={styles.setNumberContainer}>
                      <Text style={styles.setNumber}>Set {set.set_number}</Text>
                    </View>
                    
                    <View style={styles.timeInputContainer}>
                      <View style={styles.timeInputGroup}>
                        <Text style={styles.inputLabel}>Minutes</Text>
                        <TextInput
                          style={styles.timeInput}
                          value={minutesInputs[index]?.toString() || '0'}
                          onChangeText={(value) => updateMinutes(index, value)}
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={getPlaceholderTextColor()}
                        />
                      </View>
                      
                      <Text style={styles.timeSeparator}>:</Text>
                      
                      <View style={styles.timeInputGroup}>
                        <Text style={styles.inputLabel}>Seconds</Text>
                        <TextInput
                          style={styles.timeInput}
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
                      style={styles.removeButton}
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
                  buttonStyle={styles.addButton}
                  titleStyle={styles.addButtonText}
                  onPress={addDurationSet}
                />
              </View>
            )}
            
            {/* Cardio Exercise Form */}
            {exerciseType === 'cardio' && (
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Cardio Exercise</Text>
                
                <View style={styles.cardioRow}>
                  <View style={styles.cardioInputGroup}>
                    <Text style={styles.inputLabel}>Distance</Text>
                    <View style={styles.cardioInputContainer}>
                      <TextInput
                        style={styles.cardioInput}
                        value={distance !== undefined ? distance.toString() : ''}
                        onChangeText={(value) => setDistance(value ? Number(value) : undefined)}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={getPlaceholderTextColor()}
                      />
                      <TouchableOpacity 
                        style={styles.unitToggle}
                        onPress={toggleDistanceUnit}
                      >
                        <Text style={styles.unitText}>{distanceUnit}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                
                <View style={styles.cardioRow}>
                  <View style={styles.cardioInputGroup}>
                    <Text style={styles.inputLabel}>Duration</Text>
                    <View style={styles.cardioInputContainer}>
                      <TextInput
                        style={styles.cardioInput}
                        value={duration !== undefined ? duration.toString() : ''}
                        onChangeText={(value) => setDuration(value ? Number(value) : undefined)}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={getPlaceholderTextColor()}
                      />
                      <TouchableOpacity 
                        style={styles.unitToggle}
                        onPress={toggleCardioTimeUnit}
                      >
                        <Text style={styles.unitText}>{durationUnit}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                
                <View style={styles.cardioRow}>
                  <View style={styles.cardioInputGroup}>
                    <Text style={styles.inputLabel}>Pace (min/km or min/mile)</Text>
                    <TextInput
                      style={styles.fullWidthInput}
                      value={pace}
                      onChangeText={setPace}
                      placeholder="e.g. 5:30"
                      placeholderTextColor={getPlaceholderTextColor()}
                    />
                  </View>
                </View>
                
                <View style={styles.cardioRow}>
                  <View style={styles.cardioInputGroup}>
                    <Text style={styles.inputLabel}>Calories Burned</Text>
                    <TextInput
                      style={styles.fullWidthInput}
                      value={caloriesBurned !== undefined ? caloriesBurned.toString() : ''}
                      onChangeText={(value) => setCaloriesBurned(value ? Number(value) : undefined)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={getPlaceholderTextColor()}
                    />
                  </View>
                </View>
                
                <View style={styles.cardioRow}>
                  <View style={styles.cardioInputGroup}>
                    <Text style={styles.inputLabel}>Avg. Heart Rate (bpm)</Text>
                    <TextInput
                      style={styles.fullWidthInput}
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
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes about your workout..."
                placeholderTextColor={getPlaceholderTextColor()}
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              type="outline"
              buttonStyle={styles.cancelButton}
              titleStyle={styles.cancelButtonText}
              onPress={onClose}
            />
            <View style={styles.actionButtons}>
              <Button
                title="Save"
                type="outline"
                buttonStyle={styles.saveProgressButton}
                titleStyle={styles.saveProgressButtonText}
                loading={isSaving}
                onPress={() => handleSubmit(false)}
                containerStyle={{ marginRight: 10 }}
              />
              <Button
                title="Complete"
                buttonStyle={styles.completeButton}
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#222',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 15,
    maxHeight: '70%',
    backgroundColor: '#1a1a1a',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#222',
  },
  formSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  setNumberContainer: {
    width: 60,
    marginRight: 10,
  },
  setNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  inputGroup: {
    flex: 1,
    marginRight: 10,
  },
  timeInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  timeInputGroup: {
    flex: 1,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#2a2a2a',
    color: 'white',
    textAlign: 'center',
  },
  timeSeparator: {
    color: 'white',
    fontSize: 20,
    marginHorizontal: 5,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#2a2a2a',
    color: 'white',
  },
  removeButton: {
    padding: 5,
  },
  addButton: {
    borderColor: '#e74c3c',
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: '#e74c3c',
  },
  unitToggle: {
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
    minWidth: 40,
    alignItems: 'center',
  },
  unitText: {
    color: 'white',
    fontSize: 14,
  },
  cardioRow: {
    marginBottom: 15,
  },
  cardioInputGroup: {
    width: '100%',
  },
  cardioInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardioInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#2a2a2a',
    color: 'white',
  },
  fullWidthInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#2a2a2a',
    color: 'white',
  },
  notesInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 100,
    backgroundColor: '#2a2a2a',
    color: 'white',
  },
  cancelButton: {
    borderColor: '#999',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  saveProgressButton: {
    borderColor: '#e74c3c',
    borderRadius: 5,
  },
  saveProgressButtonText: {
    color: '#e74c3c',
  },
  completeButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 5,
  },
});
