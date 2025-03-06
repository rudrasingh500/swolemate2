import { View } from 'react-native';
import { Card } from '@rneui/themed';
import { Image } from 'expo-image';
import detail_styles from '@/styles/excercise-details_style';

interface ExerciseGifProps {
  gifUrl: string;
}

export default function ExerciseGif({ gifUrl }: ExerciseGifProps) {
  return (
    <Card containerStyle={detail_styles.card}>
      <View style={detail_styles.gifContainer}>
        <Image
          source={{ uri: gifUrl }}
          style={detail_styles.gif}
          contentFit="contain"
          transition={1000}
        />
      </View>
    </Card>
  );
}