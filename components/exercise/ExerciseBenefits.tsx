import { View, Text } from 'react-native';
import { Card } from '@rneui/themed';
import detail_styles from '@/styles/excercise-details_style';

interface ExerciseBenefitsProps {
  benefits: string[];
}

export default function ExerciseBenefits({ benefits }: ExerciseBenefitsProps) {
  return (
    <Card containerStyle={detail_styles.card}>
      <Card.Title style={detail_styles.cardTitle}>Benefits</Card.Title>
      {benefits.map((benefit, index) => (
        <View key={index} style={detail_styles.benefitItem}>
          <Text style={detail_styles.bulletPoint}>•</Text>
          <Text style={detail_styles.benefitText}>{benefit}</Text>
        </View>
      ))}
    </Card>
  );
}