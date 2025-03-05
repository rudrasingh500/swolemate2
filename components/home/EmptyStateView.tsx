import { View } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { router } from 'expo-router';
import home_styles from '@/styles/home_style';
import StreakDisplay from './StreakDisplay';

interface EmptyStateViewProps {
  workoutStreak: number;
}

export default function EmptyStateView({ workoutStreak }: EmptyStateViewProps) {
  return (
    <View style={home_styles.emptyStateContainer}>
      <StreakDisplay streak={workoutStreak} isEmpty={true} />

      <View style={home_styles.noWorkoutPlanContent}>
        <Text h3 style={home_styles.welcomeText}>Welcome to Swolemate</Text>
        <Text style={home_styles.noWorkoutPlanText}>
          Let's start your fitness journey by creating a personalized workout plan
        </Text>
        <View style={home_styles.buttonContainer}>
          <Button
            title="Create Workout Plan"
            onPress={() => router.push('/workout-plan')}
            containerStyle={[home_styles.createPlanButton, { width: '100%', maxWidth: 300 }]}
            buttonStyle={home_styles.createPlanButtonStyle}
            titleStyle={home_styles.buttonTitleStyle}
            icon={{
              name: 'plus-circle',
              type: 'feather',
              size: 20,
              color: 'white',
              style: { marginRight: 10 }
            }}
          />
          <Button
            title="Workout Form Analysis"
            onPress={() => router.push('/form-analysis')}
            containerStyle={[home_styles.createPlanButton, { width: '100%', maxWidth: 300 }]}
            buttonStyle={home_styles.analysisButtonStyle}
            titleStyle={home_styles.buttonTitleStyle}
            icon={{
              name: 'camera',
              type: 'feather',
              size: 20,
              color: 'white',
              style: { marginRight: 10 }
            }}
          />
        </View>
      </View>
    </View>
  );
}