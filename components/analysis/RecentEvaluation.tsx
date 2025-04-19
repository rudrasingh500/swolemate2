import { View, TouchableOpacity } from 'react-native';
import { Text, Card } from '@rneui/themed';
import analysis_styles from '@/styles/form-analysis_style';
  evaluation: {
    date: string;
  evaluation: {
    date: string;
    exercise: string;
    score: number;
    feedback: string;
  };
    score: number;
    feedback: string;
  };
  onPress: () => void;
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