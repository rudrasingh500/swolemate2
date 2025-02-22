import { StyleSheet, View, ScrollView, ImageBackground, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button, Card } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Video } from 'expo-av';

const PLACEHOLDER_ANALYSIS = {
  overallScore: 85,
  generalFeedback: 'Overall form is good with room for improvement. Focus on maintaining proper alignment and control throughout the movement.',
  recommendations: [
    'Keep your core engaged throughout the movement',
    'Watch your knee alignment on descent',
    'Maintain a neutral spine position',
    'Focus on proper form throughout the movement'
  ],
  reps: [
    {
      repNumber: 1,
      score: 88,
      mistakes: [
        {
          issue: 'Knee caving inward slightly',
          correction: 'Focus on pushing knees outward in line with toes',
          imageUrl: require('../../assets/images/background.png') // Placeholder image
        }
      ],
      feedback: 'Good depth and control, minor knee alignment issue'
    },
    {
      repNumber: 2,
      score: 82,
      mistakes: [
        {
          issue: 'Slight forward lean',
          correction: 'Keep chest up and core engaged',
          imageUrl: require('../../assets/images/background.png') // Placeholder image
        }
      ],
      feedback: 'Maintain more upright posture'
    }
  ],
  workoutAdjustment: {
    recommendation: 'Based on your form analysis, we recommend:',
    changes: [
      'Maintain current weight but focus on form improvements',
      'Add 2-3 additional warm-up sets',
      'Consider incorporating mobility work for hip flexors'
    ]
  }
};

export default function FormAnalysisScreen() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
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

  const handleAnalysisPress = (evaluation) => {
    setSelectedAnalysis(PLACEHOLDER_ANALYSIS);
    setCurrentSlide(0);
  };

  const closeAnalysis = () => {
    setSelectedAnalysis(null);
    setCurrentSlide(0);
  };

  const nextSlide = () => {
    if (selectedAnalysis && currentSlide < selectedAnalysis.reps.length + 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const renderAnalysisContent = () => {
    if (!selectedAnalysis) return null;

    if (currentSlide === 0) {
      // Overview slide
      return (
        <View style={styles.slideContent}>
          <Text h3 style={styles.slideTitle}>Overall Analysis</Text>
          <Text style={styles.dateText}>{recentEvaluation.date}</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{selectedAnalysis.overallScore}%</Text>
            <Text style={styles.scoreLabel}>Form Score</Text>
          </View>
          <Text style={styles.feedbackText}>{selectedAnalysis.generalFeedback}</Text>
          <Text style={styles.subheading}>Key Points to Improve:</Text>
          {selectedAnalysis.recommendations.map((rec, index) => (
            <Text key={index} style={styles.bulletPoint}>• {rec}</Text>
          ))}
        </View>
      );
    } else if (currentSlide <= selectedAnalysis.reps.length) {
      // Rep analysis slides
      const rep = selectedAnalysis.reps[currentSlide - 1];
      return (
        <View style={styles.slideContent}>
          <Text h3 style={styles.slideTitle}>Rep {rep.repNumber} Analysis</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{rep.score}%</Text>
            <Text style={styles.scoreLabel}>Rep Score</Text>
          </View>
          {rep.mistakes.map((mistake, index) => (
            <View key={index} style={styles.mistakeContainer}>
              <ImageBackground
                source={mistake.imageUrl}
                style={styles.mistakeImage}
                resizeMode="cover"
              >
                <View style={styles.mistakeOverlay}>
                  <Text style={styles.mistakeText}>Issue: {mistake.issue}</Text>
                  <Text style={styles.mistakeText}>How to Fix: {mistake.correction}</Text>
                </View>
              </ImageBackground>
            </View>
          ))}
          <Text style={styles.feedbackText}>{rep.feedback}</Text>
        </View>
      );
    } else {
      // Workout adjustment slide
      return (
        <View style={styles.slideContent}>
          <Text h3 style={styles.slideTitle}>Workout Recommendations</Text>
          <Text style={styles.feedbackText}>{selectedAnalysis.workoutAdjustment.recommendation}</Text>
          {selectedAnalysis.workoutAdjustment.changes.map((change, index) => (
            <Text key={index} style={styles.bulletPoint}>• {change}</Text>
          ))}
        </View>
      );
    }
  };

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
                  containerStyle={styles.mainButtonContainer}
                  buttonStyle={styles.mainButton}
                  onPress={startRecording}
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
                <TouchableOpacity onPress={() => handleAnalysisPress(recentEvaluation)}>
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
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.bottomSection}>
              <Text h3 style={styles.sectionTitle}>Past Evaluations</Text>
              {pastEvaluations.map(evaluation => (
                <TouchableOpacity key={evaluation.id} onPress={() => handleAnalysisPress(evaluation)}>
                  <Card containerStyle={styles.evaluationCard}>
                    <View style={styles.evaluationHeader}>
                      <Text style={styles.exerciseText}>{evaluation.exercise}</Text>
                      <Text style={styles.scoreChip}>{evaluation.score}%</Text>
                    </View>
                    <Text style={styles.dateText}>{evaluation.date}</Text>
                    <Text style={styles.feedbackText}>{evaluation.feedback}</Text>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Modal
            visible={selectedAnalysis !== null}
            animationType="slide"
            transparent={true}
            onRequestClose={closeAnalysis}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.progressBar}>
                  <View 
                    style={[styles.progressFill, { 
                      width: `${(currentSlide / (selectedAnalysis ? selectedAnalysis.reps.length + 1 : 1)) * 100}%` 
                    }]} 
                  />
                </View>
                <ScrollView style={styles.slideContentScroll}>
                  {renderAnalysisContent()}
                </ScrollView>
                <View style={styles.navigationContainer}>
                  <Button
                    title="Previous"
                    onPress={prevSlide}
                    disabled={currentSlide === 0}
                    buttonStyle={styles.navButton}
                    titleStyle={styles.navButtonText}
                    disabledStyle={styles.navButtonDisabled}
                    disabledTitleStyle={styles.navButtonTextDisabled}
                  />
                  <Button
                    title="Close"
                    onPress={closeAnalysis}
                    buttonStyle={[styles.navButton, styles.closeButton]}
                    titleStyle={styles.navButtonText}
                  />
                  <Button
                    title="Next"
                    onPress={nextSlide}
                    disabled={selectedAnalysis && currentSlide === selectedAnalysis.reps.length + 1}
                    buttonStyle={styles.navButton}
                    titleStyle={styles.navButtonText}
                    disabledStyle={styles.navButtonDisabled}
                    disabledTitleStyle={styles.navButtonTextDisabled}
                  />
                </View>
              </View>
            </View>
          </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    maxHeight: '80%',
    height: Dimensions.get('window').height * 0.8,
    display: 'flex',
    flexDirection: 'column'
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  slideContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    overflow: 'auto',
    marginBottom: 10
  },
  slideTitle: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 25,
    fontSize: 28,
    fontWeight: 'bold',
  },
  scoreContainer: {
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 25,
  },
  scoreText: {
    color: '#e74c3c',
    fontSize: 56,
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: '#e0e0e0',
    fontSize: 18,
    marginTop: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  feedbackText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  subheading: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
    width: '100%',
  },
  bulletPoint: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
    marginBottom: 10,
    lineHeight: 22,
  },
  mistakeContainer: {
    marginVertical: 15,
    borderRadius: 15,
    overflow: 'hidden',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  mistakeImage: {
    width: '100%',
    height: 200,
  },
  mistakeOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  mistakeText: {
    color: 'white',
    marginBottom: 8,
    fontSize: 15,
    lineHeight: 22,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 25,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  navButton: {
  backgroundColor: 'rgba(231, 76, 60, 0.2)',
  borderRadius: 8,
  paddingVertical: 12,
  paddingHorizontal: 20,
  minWidth: 100,
},
closeButton: {
  backgroundColor: 'rgba(231, 76, 60, 0.4)',
},
navButtonText: {
  color: '#e74c3c',
  fontSize: 16,
  fontWeight: 'bold',
},
navButtonDisabled: {
  backgroundColor: 'rgba(150, 150, 150, 0.2)',
},
navButtonTextDisabled: {
  color: 'rgba(150, 150, 150, 0.5)',
},
});