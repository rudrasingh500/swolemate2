import { View } from 'react-native';
import { Text } from '@rneui/themed';
import profile_styles from '@/styles/profile_style';

interface ProfileStatsProps {
  workouts?: number;
  analyses?: number;
}

export default function ProfileStats({ workouts = 0, analyses = 0 }: ProfileStatsProps) {
  return (
    <View style={profile_styles.stats}>
      <View style={profile_styles.statItem}>
        <Text h4 style={profile_styles.statNumber}>{workouts}</Text>
        <Text style={profile_styles.statLabel}>Workouts</Text>
      </View>
      <View style={profile_styles.statItem}>
        <Text h4 style={profile_styles.statNumber}>{analyses}</Text>
        <Text style={profile_styles.statLabel}>Analysis</Text>
      </View>
    </View>
  );
}