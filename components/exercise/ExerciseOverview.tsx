import { View, Text } from 'react-native';
import { Card } from '@rneui/themed';
import detail_styles from '@/styles/excercise-details_style';

interface ExerciseOverviewProps {
  description: string;
  duration: string;
  difficulty: string;
  caloriesBurn: string;
}

export default function ExerciseOverview({ 
  description, 
  duration, 
  difficulty, 
  caloriesBurn 
}: ExerciseOverviewProps) {
  return (
    <Card containerStyle={detail_styles.card}>
      <Text style={detail_styles.description}>{description}</Text>
      <View style={detail_styles.metaInfo}>
        <Text style={detail_styles.metaItem}>Duration: {duration}</Text>
        <Text style={detail_styles.metaItem}>Difficulty: {difficulty}</Text>
        <Text style={detail_styles.metaItem}>Calories: {caloriesBurn}</Text>
      </View>
    </Card>
  );
}