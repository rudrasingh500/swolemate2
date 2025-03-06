import { View, Text } from 'react-native';
import { Card } from '@rneui/themed';
import detail_styles from '@/styles/excercise-details_style';

interface ExerciseInstructionsProps {
  instructions: string[];
}

export default function ExerciseInstructions({ instructions }: ExerciseInstructionsProps) {
  return (
    <Card containerStyle={detail_styles.card}>
      <Card.Title style={detail_styles.cardTitle}>Instructions</Card.Title>
      {instructions.map((instruction, index) => (
        <View key={index} style={detail_styles.instructionItem}>
          <Text style={detail_styles.instructionNumber}>{index + 1}</Text>
          <Text style={detail_styles.instructionText}>{instruction}</Text>
        </View>
      ))}
    </Card>
  );
}