import { View, ScrollView, ImageBackground } from 'react-native';
import { Text, Card, Button, Icon } from '@rneui/themed';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import detail_styles from '@/styles/excercise-details_style';
import exerciseLibrary from '@/constants/exercise_lib';

export default function ExerciseDetailsScreen() {
  const { name } = useLocalSearchParams();
  const [exercise, setExercise] = useState(exerciseLibrary[name as keyof typeof exerciseLibrary]);

  return (
    <View style={detail_styles.container}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={detail_styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={detail_styles.overlay}>
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
            <Text h4 style={detail_styles.title}>{exercise.name}</Text>
          </View>
          <ScrollView style={detail_styles.content}>
            <Card containerStyle={detail_styles.card}>
              <Text style={detail_styles.description}>{exercise.description}</Text>
              <View style={detail_styles.metaInfo}>
                <Text style={detail_styles.metaItem}>Duration: {exercise.duration}</Text>
                <Text style={detail_styles.metaItem}>Difficulty: {exercise.difficulty}</Text>
                <Text style={detail_styles.metaItem}>Calories: {exercise.caloriesBurn}</Text>
              </View>
            </Card>

            <Card containerStyle={detail_styles.card}>
              <Card.Title style={detail_styles.cardTitle}>Target Muscles</Card.Title>
              <View style={detail_styles.chipContainer}>
                {exercise.targetMuscles.map((muscle, index) => (
                  <View key={index} style={detail_styles.chip}>
                    <Text style={detail_styles.chipText}>{muscle}</Text>
                  </View>
                ))}
              </View>
            </Card>

            <Card containerStyle={detail_styles.card}>
              <Card.Title style={detail_styles.cardTitle}>Instructions</Card.Title>
              {exercise.instructions.map((instruction, index) => (
                <View key={index} style={detail_styles.instructionItem}>
                  <Text style={detail_styles.instructionNumber}>{index + 1}</Text>
                  <Text style={detail_styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </Card>

            <Card containerStyle={detail_styles.card}>
              <Card.Title style={detail_styles.cardTitle}>Benefits</Card.Title>
              {exercise.benefits.map((benefit, index) => (
                <View key={index} style={detail_styles.benefitItem}>
                  <Text style={detail_styles.bulletPoint}>•</Text>
                  <Text style={detail_styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </Card>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}
