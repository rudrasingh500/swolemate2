import { View, Text } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { router } from 'expo-router';
import detail_styles from '@/styles/excercise-details_style';

interface ExerciseHeaderProps {
  title: string;
}

export default function ExerciseHeader({ title }: ExerciseHeaderProps) {
  return (
    <>
      <View style={detail_styles.header}>
        <Button
          icon={<Icon name="arrow-back" color="white" size={28} />}
          title="Back"
          type="clear"
          onPress={() => router.back()}
          containerStyle={detail_styles.backButton}
          titleStyle={detail_styles.backButtonText}
        />
      </View>
      <View style={detail_styles.titleContainer}>
        <Text style={detail_styles.title}>{title}</Text>
      </View>
    </>
  );
}