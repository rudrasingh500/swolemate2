import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { router } from 'expo-router';
import plan_styles from '@/styles/plan_style';
import { DailyPlan } from '@/types/workout';

interface CurrentPlanProps {
  weeklyPlan: DailyPlan[];
  currentGoal: string;
  onEditPlan: () => void;
}

export default function CurrentPlan({ weeklyPlan, currentGoal, onEditPlan }: CurrentPlanProps) {
  return (
    <View style={plan_styles.content}>
      <View style={plan_styles.goalContainer}>
        <View style={plan_styles.goalHeader}>
          <Text h4 style={plan_styles.goalTitle}>Current Goal</Text>
          <Button
            title="Edit Plan"
            type="outline"
            onPress={onEditPlan}
            containerStyle={plan_styles.editButton}
            buttonStyle={plan_styles.editButtonStyle}
            titleStyle={plan_styles.editButtonText}
          />
        </View>
        <Text style={plan_styles.goalText}>{currentGoal}</Text>
      </View>

      <ScrollView style={plan_styles.planContainer}>
        {weeklyPlan.map((day, index) => (
          <View key={index} style={plan_styles.dayContainer}>
            <View style={plan_styles.dayHeader}>
              <Text style={plan_styles.dayTitle}>{day.day}</Text>
              <Text style={plan_styles.timeFrame}>{day.timeFrame}</Text>
            </View>

            {day.exercises.map((exercise, exerciseIndex) => (
              <TouchableOpacity
                key={exerciseIndex}
                style={plan_styles.exerciseItem}
                onPress={() => {
                  router.push({
                    pathname: '/exercise-details',
                    params: { name: exercise.name }
                  });
                }}
              >
                <View style={plan_styles.exerciseHeader}>
                  <Text style={plan_styles.exerciseName}>{exercise.name}</Text>
                  <Text style={plan_styles.duration}>{exercise.duration}</Text>
                </View>
                <Text style={plan_styles.exerciseDetails}>
                  {exercise.sets} sets × {exercise.reps}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}