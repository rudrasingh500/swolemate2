import { View, Text } from 'react-native';
import { Card } from '@rneui/themed';
import detail_styles from '@/styles/excercise-details_style';

interface TargetMusclesProps {
  muscles: string[];
}

export default function TargetMuscles({ muscles }: TargetMusclesProps) {
  return (
    <Card containerStyle={detail_styles.card}>
      <Card.Title style={detail_styles.cardTitle}>Target Muscles</Card.Title>
      <View style={detail_styles.chipContainer}>
        {muscles.map((muscle, index) => (
          <View key={index} style={detail_styles.chip}>
            <Text style={detail_styles.chipText}>{muscle}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}