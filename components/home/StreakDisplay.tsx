import { View } from 'react-native';
import { Text } from '@rneui/themed';
import home_styles from '@/styles/home_style';

interface StreakDisplayProps {
  streak: number;
  isEmpty?: boolean;
}

export default function StreakDisplay({ streak, isEmpty = false }: StreakDisplayProps) {
  if (isEmpty) {
    return (
      <View style={home_styles.streakContainerEmpty}>
        <Text h1 style={home_styles.streakNumberEmpty}>{streak}</Text>
        <Text style={home_styles.streakTextEmpty}>Day Streak</Text>
      </View>
    );
  }

  return (
    <View style={home_styles.streakContainer}>
      <Text h2 style={home_styles.streakNumber}>{streak}</Text>
      <Text style={home_styles.streakText}>Day Streak</Text>
    </View>
  );
}