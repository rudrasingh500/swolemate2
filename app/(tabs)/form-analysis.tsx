import { StyleSheet, View, ScrollView, ImageBackground } from 'react-native';
import { Text, Button, Card } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Video } from 'expo-av';

export default function FormAnalysisScreen() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [recentEvaluation] = useState({
    date: '2024-02-17',
    exercise: 'Squat',
    score: 85,
    feedback: 'Good form overall. Watch knee alignment.',
  });
  const [pastEvaluations] = useState([
    {
      id: 1,
      date: '2024-02-15',
      exercise: 'Deadlift',
      score: 78,
      feedback: 'Keep your back straight throughout the movement.',
    },
    {
      id: 2,
      date: '2024-02-12',
      exercise: 'Bench Press',
      score: 92,
      feedback: 'Excellent form and control.',
    },
  ]);

  async function startRecording() {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        alert('Camera permission is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setVideoUri(result.assets[0].uri);
        console.log('Video recorded:', result.assets[0]);
      }
    } catch (error) {
      console.error('Error recording video:', error);
      alert('Failed to record video');
    }
  }

  async function pickVideo() {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert('Gallery permission is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setVideoUri(result.assets[0].uri);
        console.log('Video selected:', result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      alert('Failed to select video');
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.topSection}>
              <Text h2 style={styles.title}>Form Analysis</Text>
              <View style={styles.analysisSection}>
                <Button
                  title="Start Form Analysis"
                  icon={<Ionicons name="videocam" size={24} color="white" style={styles.buttonIcon} />}
                  containerStyle={[styles.mainButtonContainer, { overflow: 'hidden' }]}
                  buttonStyle={[styles.mainButton, { borderRadius: 10, backgroundColor: 'rgba(231, 76, 60, 0.9)' }]}
                  onPress={startRecording}
                  raised
                />
                <Text style={styles.uploadText}>or</Text>
                <Button
                  title="Upload Video"
                  type="clear"
                  titleStyle={styles.uploadButtonText}
                  icon={<Ionicons name="cloud-upload" size={20} color="#e0e0e0" style={styles.buttonIcon} />}
                  onPress={pickVideo}
                />
              </View>

              {recentEvaluation && (
                <Card containerStyle={styles.recentEvalCard}>
                  <Card.Title style={styles.cardTitle}>Most Recent Evaluation</Card.Title>
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>{recentEvaluation.score}%</Text>
                    <Text style={styles.scoreLabel}>Form Score</Text>
                  </View>
                  <Text style={styles.evaluationText}>Exercise: {recentEvaluation.exercise}</Text>
                  <Text style={styles.evaluationText}>Date: {recentEvaluation.date}</Text>
                  <Text style={styles.evaluationText}>Feedback: {recentEvaluation.feedback}</Text>
                </Card>
              )}
            </View>

            <View style={styles.bottomSection}>
              <Text h3 style={styles.sectionTitle}>Past Evaluations</Text>
              {pastEvaluations.map(evaluation => (
                <Card key={evaluation.id} containerStyle={styles.evaluationCard}>
                  <View style={styles.evaluationHeader}>
                    <Text style={styles.exerciseText}>{evaluation.exercise}</Text>
                    <Text style={styles.scoreChip}>{evaluation.score}%</Text>
                  </View>
                  <Text style={styles.dateText}>{evaluation.date}</Text>
                  <Text style={styles.feedbackText}>{evaluation.feedback}</Text>
                </Card>
              ))}
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingTop: 60,
  },
  scrollView: {
    flex: 1,
  },
  topSection: {
    padding: 20,
    marginBottom: 20,
  },
  title: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  analysisSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainButtonContainer: {
    width: '80%',
    marginBottom: 10,
  },
  mainButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
  },
  uploadText: {
    color: '#e0e0e0',
    marginVertical: 10,
  },
  uploadButtonText: {
    color: '#e0e0e0',
  },
  buttonIcon: {
    marginRight: 8,
  },
  recentEvalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreText: {
    color: '#e74c3c',
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: '#e0e0e0',
    fontSize: 16,
  },
  bottomSection: {
    padding: 20,
  },
  sectionTitle: {
    color: 'white',
    marginBottom: 20,
  },
  evaluationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
  },
  evaluationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreChip: {
    color: 'white',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  dateText: {
    color: '#e0e0e0',
    marginBottom: 5,
  },
  feedbackText: {
    color: 'white',
    marginTop: 5,
  },
  cardTitle: {
    color: 'white',
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  evaluationText: {
    color: 'white',
    marginBottom: 5,
  },
});