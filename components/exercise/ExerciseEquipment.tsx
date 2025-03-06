import { View, Text } from 'react-native';
import { Card } from '@rneui/themed';
import detail_styles from '@/styles/excercise-details_style';

interface ExerciseEquipmentProps {
  equipment: string;
  bodyPart: string;
}

export default function ExerciseEquipment({ equipment, bodyPart }: ExerciseEquipmentProps) {
  return (
    <Card containerStyle={detail_styles.card}>
      <Card.Title style={detail_styles.cardTitle}>Equipment & Body Part</Card.Title>
      <View style={detail_styles.chipContainer}>
        <View style={detail_styles.chip}>
          <Text style={detail_styles.chipText}>Equipment: {equipment}</Text>
        </View>
        <View style={detail_styles.chip}>
          <Text style={detail_styles.chipText}>Body Part: {bodyPart}</Text>
        </View>
      </View>
    </Card>
  );
}