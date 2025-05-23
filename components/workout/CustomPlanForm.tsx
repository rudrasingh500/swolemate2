import React, { useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Button, Icon } from '@rneui/themed';
import { DailyPlan, Exercise } from '@/types/workout';
import plan_styles from '@/styles/plan_style'; // Assuming plan_styles can be reused or adapted

interface CustomPlanFormProps {
  onSavePlan: (planData: DailyPlan[]) => void;
  onCancel: () => void;
  initialPlanData?: DailyPlan[]; // Optional: for editing existing custom plans in the future
}

const CustomPlanForm: React.FC<CustomPlanFormProps> = ({ onSavePlan, onCancel, initialPlanData }) => {
  const [days, setDays] = useState<DailyPlan[]>(
    initialPlanData || [
      { day: 'Monday', timeFrame: 'Flexible', exercises: [] },
      { day: 'Tuesday', timeFrame: 'Flexible', exercises: [] },
      { day: 'Wednesday', timeFrame: 'Flexible', exercises: [] },
      { day: 'Thursday', timeFrame: 'Flexible', exercises: [] },
      { day: 'Friday', timeFrame: 'Flexible', exercises: [] },
      { day: 'Saturday', timeFrame: 'Flexible', exercises: [] },
      { day: 'Sunday', timeFrame: 'Flexible', exercises: [] },
    ]
  );

  const handleDayChange = (index: number, field: keyof DailyPlan, value: string) => {
    const newDays = [...days];
    (newDays[index] as any)[field] = value;
    setDays(newDays);
  };

  const handleExerciseChange = (dayIndex: number, exerciseIndex: number, field: keyof Exercise, value: string) => {
    const newDays = [...days];
    (newDays[dayIndex].exercises[exerciseIndex] as any)[field] = value;
    setDays(newDays);
  };

  const addExercise = (dayIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].exercises.push({ name: '', sets: 3, reps: '10', duration: 'N/A' });
    setDays(newDays);
  };

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].exercises.splice(exerciseIndex, 1);
    setDays(newDays);
  };

  const handleSave = () => {
    // Filter out days with no exercises before saving
    const planToSave = days.filter(day => day.exercises.length > 0);
    onSavePlan(planToSave);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text h4 style={[plan_styles.title, styles.formTitle]}>Create Your Custom Plan</Text>
      
      {days.map((day, dayIndex) => (
        <View key={dayIndex} style={styles.dayContainer}>
          <TextInput
            style={styles.dayInput}
            value={day.day}
            onChangeText={(text) => handleDayChange(dayIndex, 'day', text)}
            placeholder="Day (e.g., Monday)"
            placeholderTextColor="#aaa"
          />
          {/* <TextInput
            style={styles.timeFrameInput}
            value={day.timeFrame}
            onChangeText={(text) => handleDayChange(dayIndex, 'timeFrame', text)}
            placeholder="Time Frame (e.g., Morning)"
          /> */}

          {day.exercises.map((exercise, exerciseIndex) => (
            <View key={exerciseIndex} style={styles.exerciseEntryContainer}>
              <View style={styles.exerciseInputRow}>
                <TextInput
                  style={[styles.input, styles.exerciseNameInput]}
                  value={exercise.name}
                  onChangeText={(text) => handleExerciseChange(dayIndex, exerciseIndex, 'name', text)}
                  placeholder="Exercise Name"
                  placeholderTextColor="#aaa"
                />
                <TouchableOpacity onPress={() => removeExercise(dayIndex, exerciseIndex)} style={styles.removeButton}>
                  <Icon name="close-circle" type="material-community" color="#e74c3c" size={24} />
                </TouchableOpacity>
              </View>
              <View style={styles.exerciseInputRow}>
                <TextInput
                  style={[styles.input, styles.setsInput]}
                  value={String(exercise.sets)}
                  onChangeText={(text) => handleExerciseChange(dayIndex, exerciseIndex, 'sets', text)}
                  placeholder="Sets"
                  keyboardType="numeric"
                  placeholderTextColor="#aaa"
                />
                <TextInput
                  style={[styles.input, styles.repsInput]}
                  value={String(exercise.reps)}
                  onChangeText={(text) => handleExerciseChange(dayIndex, exerciseIndex, 'reps', text)}
                  placeholder="Reps"
                  placeholderTextColor="#aaa"
                />
                {/* <TextInput
                  style={[styles.input, styles.durationInput]}
                  value={exercise.duration}
                  onChangeText={(text) => handleExerciseChange(dayIndex, exerciseIndex, 'duration', text)}
                  placeholder="Duration (optional)"
                /> */}
              </View>
            </View>
          ))}
          <Button 
            title="Add Exercise to This Day"
            onPress={() => addExercise(dayIndex)} 
            type="outline"
            buttonStyle={styles.addExerciseButton}
            titleStyle={styles.addExerciseButtonText}
            icon={<Icon name="plus" type="material-community" color="#e74c3c" size={18} />} 
          />
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <Button 
          title="Save Plan" 
          onPress={handleSave} 
          buttonStyle={[plan_styles.button, styles.saveButton]} 
          titleStyle={plan_styles.buttonText} 
        />
        <Button 
          title="Cancel" 
          onPress={onCancel} 
          buttonStyle={[plan_styles.button, styles.cancelButton]} 
          titleStyle={[plan_styles.buttonText]} 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  formTitle: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  dayContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
  },
  dayInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 5,
    marginBottom: 10,
  },
  exerciseEntryContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
  },
  exerciseInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 5,
    fontSize: 15,
  },
  exerciseNameInput: {
    flex: 1,
    marginRight: 10,
  },
  setsInput: {
    flex: 1,
    marginRight: 5,
  },
  repsInput: {
    flex: 1,
    marginLeft: 5,
  },
  removeButton: {
    padding: 5,
  },
  addExerciseButton: {
    borderColor: '#e74c3c',
    borderWidth: 1,
    marginTop: 10,
  },
  addExerciseButtonText: {
    color: '#e74c3c',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40, // Extra space at the bottom
  },
  saveButton: {
    backgroundColor: '#e74c3c',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    marginBottom: 10,
  },
});

export default CustomPlanForm;