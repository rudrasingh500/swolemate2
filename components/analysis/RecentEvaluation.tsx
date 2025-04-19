import { View, TouchableOpacity } from 'react-native';
import { Text, Card } from '@rneui/themed';
import analysis_styles from '@/styles/form-analysis_style';

interface RecentEvaluationProps {
  evaluation: {
    date: string;
    exercise: string;
    score: number;
    feedback: string;
  };
  onPress: () => void;
}

export default function RecentEvaluation({ evaluation, onPress }: RecentEvaluationProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card containerStyle={analysis_styles.recentEvalCard}>
        <Card.Title style={analysis_styles.cardTitle}>Most Recent Evaluation</Card.Title>
        <View style={analysis_styles.scoreContainer}>
          <Text style={analysis_styles.scoreText}>{evaluation.score}%</Text>
          <Text style={analysis_styles.scoreLabel}>Form Score</Text>
        </View>
        <Text style={analysis_styles.evaluationText}>Exercise: {evaluation.exercise}</Text>
        <Text style={analysis_styles.evaluationText}>Date: {evaluation.date}</Text>
        <Text style={analysis_styles.evaluationText}>Feedback: {evaluation.feedback}</Text>
      </Card>
    </TouchableOpacity>
  );
}