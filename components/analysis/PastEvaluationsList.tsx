import { View, TouchableOpacity } from 'react-native';
import { Text, Card } from '@rneui/themed';
import analysis_styles from '@/styles/form-analysis_style';

interface Evaluation {
  id: number;
  date: string;
  exercise: string;
  score: number;
  feedback: string;
}

interface PastEvaluationsListProps {
  evaluations: Evaluation[];
  onPress: (evaluation: Evaluation) => void;
}

export default function PastEvaluationsList({ evaluations, onPress }: PastEvaluationsListProps) {
  return (
    <View style={analysis_styles.bottomSection}>
      <Text h3 style={analysis_styles.sectionTitle}>Past Evaluations</Text>
      {evaluations.map(evaluation => (
        <TouchableOpacity key={evaluation.id} onPress={() => onPress(evaluation)}>
          <Card containerStyle={analysis_styles.evaluationCard}>
            <View style={analysis_styles.evaluationHeader}>
              <Text style={analysis_styles.exerciseText}>{evaluation.exercise}</Text>
              <Text style={analysis_styles.scoreChip}>{evaluation.score}%</Text>
            </View>
            <Text style={analysis_styles.dateText}>{evaluation.date}</Text>
            <Text style={analysis_styles.feedbackText}>{evaluation.feedback}</Text>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
}