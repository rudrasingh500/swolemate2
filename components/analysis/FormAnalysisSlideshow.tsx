import { View, ScrollView, Modal } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useState, useEffect } from 'react';
import analysis_styles from '@/styles/form-analysis_style';

interface FormAnalysisProps {
  selectedAnalysis: any;
  isVisible: boolean;
  onClose: () => void;
}

export default function FormAnalysisSlideshow({ selectedAnalysis, isVisible, onClose }: FormAnalysisProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Reset slide position when a new slideshow is opened
  useEffect(() => {
    if (isVisible) {
      setCurrentSlide(0);
    }
  }, [isVisible]);

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
      return (
        <View style={analysis_styles.slideContent}>
          <Text h3 style={analysis_styles.slideTitle}>Overall Analysis</Text>
          <Text style={analysis_styles.dateText}>{selectedAnalysis.date}</Text>
          <View style={analysis_styles.scoreContainer}>
            <Text style={analysis_styles.scoreText}>{selectedAnalysis.overallScore}%</Text>
            <Text style={analysis_styles.scoreLabel}>Form Score</Text>
          </View>
          <Text style={analysis_styles.feedbackText}>{selectedAnalysis.generalFeedback}</Text>
          <Text style={analysis_styles.subheading}>Key Points to Improve:</Text>
          {selectedAnalysis.recommendations.map((rec: string, index: number) => (
            <Text key={index} style={analysis_styles.bulletPoint}>• {rec}</Text>
          ))}
        </View>
      );
    } else if (currentSlide <= selectedAnalysis.reps.length) {
      const rep = selectedAnalysis.reps[currentSlide - 1];
      return (
        <View style={analysis_styles.slideContent}>
          <Text h3 style={analysis_styles.slideTitle}>Rep {rep.repNumber} Analysis</Text>
          <View style={analysis_styles.scoreContainer}>
            <Text style={analysis_styles.scoreText}>{rep.score}%</Text>
            <Text style={analysis_styles.scoreLabel}>Rep Score</Text>
          </View>
          {rep.mistakes.map((mistake: any, index: number) => (
            <View key={index} style={analysis_styles.mistakeContainer}>
              <View style={analysis_styles.mistakeOverlay}>
                <Text style={analysis_styles.mistakeText}>Issue: {mistake.issue}</Text>
                <Text style={analysis_styles.mistakeText}>How to Fix: {mistake.correction}</Text>
              </View>
            </View>
          ))}
          <Text style={analysis_styles.feedbackText}>{rep.feedback}</Text>
        </View>
      );
    } else {
      return (
        <View style={analysis_styles.slideContent}>
          <Text h3 style={analysis_styles.slideTitle}>Workout Recommendations</Text>
          <Text style={analysis_styles.feedbackText}>{selectedAnalysis.workoutAdjustment.recommendation}</Text>
          {selectedAnalysis.workoutAdjustment.changes.map((change: string, index: number) => (
            <Text key={index} style={analysis_styles.bulletPoint}>• {change}</Text>
          ))}
        </View>
      );
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
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
              onPress={onClose}
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
  );
}