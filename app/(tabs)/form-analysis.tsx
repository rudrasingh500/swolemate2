import { View, ScrollView, ImageBackground, Modal, TouchableOpacity } from 'react-native';
import { Text, Button, Card } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import analysis_styles from '@/styles/form-analysis_style';
import { PLACEHOLDER_ANALYSIS, PAST_EVALUATIONS, RECENT_EVALUATION } from '@/constants/form_analysis';

export default function FormAnalysisScreen() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [recentEvaluation] = useState(RECENT_EVALUATION);
  const [pastEvaluations] = useState(PAST_EVALUATIONS);

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
        <View style={analysis_styles.slideContent}>
          <Text h3 style={analysis_styles.slideTitle}>Overall Analysis</Text>
          <Text style={analysis_styles.dateText}>{recentEvaluation.date}</Text>
          <View style={analysis_styles.scoreContainer}>
            <Text style={analysis_styles.scoreText}>{selectedAnalysis.overallScore}%</Text>
            <Text style={analysis_styles.scoreLabel}>Form Score</Text>
          </View>
          <Text style={analysis_styles.feedbackText}>{selectedAnalysis.generalFeedback}</Text>
          <Text style={analysis_styles.subheading}>Key Points to Improve:</Text>
          {selectedAnalysis.recommendations.map((rec, index) => (
            <Text key={index} style={analysis_styles.bulletPoint}>• {rec}</Text>
          ))}
        </View>
      );
    } else if (currentSlide <= selectedAnalysis.reps.length) {
      // Rep analysis slides
      const rep = selectedAnalysis.reps[currentSlide - 1];
      return (
        <View style={analysis_styles.slideContent}>
          <Text h3 style={analysis_styles.slideTitle}>Rep {rep.repNumber} Analysis</Text>
          <View style={analysis_styles.scoreContainer}>
            <Text style={analysis_styles.scoreText}>{rep.score}%</Text>
            <Text style={analysis_styles.scoreLabel}>Rep Score</Text>
          </View>
          {rep.mistakes.map((mistake, index) => (
            <View key={index} style={analysis_styles.mistakeContainer}>
              <ImageBackground
                source={mistake.imageUrl}
                style={analysis_styles.mistakeImage}
                resizeMode="cover"
              >
                <View style={analysis_styles.mistakeOverlay}>
                  <Text style={analysis_styles.mistakeText}>Issue: {mistake.issue}</Text>
                  <Text style={analysis_styles.mistakeText}>How to Fix: {mistake.correction}</Text>
                </View>
              </ImageBackground>
            </View>
          ))}
          <Text style={analysis_styles.feedbackText}>{rep.feedback}</Text>
        </View>
      );
    } else {
      // Workout adjustment slide
      return (
        <View style={analysis_styles.slideContent}>
          <Text h3 style={analysis_styles.slideTitle}>Workout Recommendations</Text>
          <Text style={analysis_styles.feedbackText}>{selectedAnalysis.workoutAdjustment.recommendation}</Text>
          {selectedAnalysis.workoutAdjustment.changes.map((change, index) => (
            <Text key={index} style={analysis_styles.bulletPoint}>• {change}</Text>
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
    <View style={analysis_styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={analysis_styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={analysis_styles.overlay}>
          <ScrollView style={analysis_styles.scrollView}>
            <View style={analysis_styles.topSection}>
              <Text h2 style={analysis_styles.title}>Form Analysis</Text>
              <View style={analysis_styles.analysisSection}>
                <Button
                  title="Start Form Analysis"
                  icon={<Ionicons name="videocam" size={24} color="white" style={analysis_styles.buttonIcon} />}
                  containerStyle={analysis_styles.mainButtonContainer}
                  buttonStyle={analysis_styles.mainButton}
                  onPress={startRecording}
                />
                <Text style={analysis_styles.uploadText}>or</Text>
                <Button
                  title="Upload Video"
                  type="clear"
                  titleStyle={analysis_styles.uploadButtonText}
                  icon={<Ionicons name="cloud-upload" size={20} color="#e0e0e0" style={analysis_styles.buttonIcon} />}
                  onPress={pickVideo}
                />
              </View>
              {recentEvaluation && (
                <TouchableOpacity onPress={() => handleAnalysisPress(recentEvaluation)}>
                  <Card containerStyle={analysis_styles.recentEvalCard}>
                    <Card.Title style={analysis_styles.cardTitle}>Most Recent Evaluation</Card.Title>
                    <View style={analysis_styles.scoreContainer}>
                      <Text style={analysis_styles.scoreText}>{recentEvaluation.score}%</Text>
                      <Text style={analysis_styles.scoreLabel}>Form Score</Text>
                    </View>
                    <Text style={analysis_styles.evaluationText}>Exercise: {recentEvaluation.exercise}</Text>
                    <Text style={analysis_styles.evaluationText}>Date: {recentEvaluation.date}</Text>
                    <Text style={analysis_styles.evaluationText}>Feedback: {recentEvaluation.feedback}</Text>
                  </Card>
                </TouchableOpacity>
              )}
            </View>
            <View style={analysis_styles.bottomSection}>
              <Text h3 style={analysis_styles.sectionTitle}>Past Evaluations</Text>
              {pastEvaluations.map(evaluation => (
                <TouchableOpacity key={evaluation.id} onPress={() => handleAnalysisPress(evaluation)}>
                  <Card containerStyle={analysis_styles.evaluationCard}>
                    <View style={analysis_styles.evaluationHeader}>
                      <Text style={analysis_styles.exerciseText}>{evaluation.exercise}</Text>
                      <Text style={analysis_styles.scoreChip}>{evaluation.score}%</Text>
                    </View>
                    <Text style={analysis_styles.dateText}>{evaluation.date}</Text>
                    <Text style={analysis_styles.feedbackText}>{evaluation.feedback}</Text>
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
            <View style={analysis_styles.modalContainer}>
              <View style={analysis_styles.modalContent}>
                <View style={analysis_styles.progressBar}>
                  <View 
                    style={[analysis_styles.progressFill, { 
                      width: `${((currentSlide + 1) / (selectedAnalysis ? selectedAnalysis.reps.length + 2 : 1)) * 100}%` 
                    }]} 
                  />
                </View>
                <ScrollView style={analysis_styles.slideContentScroll}>
                  {renderAnalysisContent()}
                </ScrollView>
                <View style={analysis_styles.navigationContainer}>
                  <Button
                    title="Previous"
                    onPress={prevSlide}
                    disabled={currentSlide === 0}
                    buttonStyle={analysis_styles.navButton}
                    titleStyle={analysis_styles.navButtonText}
                    disabledStyle={analysis_styles.navButtonDisabled}
                    disabledTitleStyle={analysis_styles.navButtonTextDisabled}
                  />
                  <Button
                    title="Close"
                    onPress={closeAnalysis}
                    buttonStyle={[analysis_styles.navButton, analysis_styles.closeButton]}
                    titleStyle={analysis_styles.navButtonText}
                  />
                  <Button
                    title="Next"
                    onPress={nextSlide}
                    disabled={selectedAnalysis && currentSlide === selectedAnalysis.reps.length + 1}
                    buttonStyle={analysis_styles.navButton}
                    titleStyle={analysis_styles.navButtonText}
                    disabledStyle={analysis_styles.navButtonDisabled}
                    disabledTitleStyle={analysis_styles.navButtonTextDisabled}
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
