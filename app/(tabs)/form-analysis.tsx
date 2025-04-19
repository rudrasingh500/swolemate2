import { View, ScrollView, ImageBackground } from 'react-native';
import { Text } from '@rneui/themed';
import { useState } from 'react';
import analysis_styles from '@/styles/form-analysis_style';
import { PLACEHOLDER_ANALYSIS, PAST_EVALUATIONS, RECENT_EVALUATION } from '@/constants/form_analysis';
import FormAnalysisSlideshow from '@/components/analysis/FormAnalysisSlideshow';
import RecentEvaluation from '@/components/analysis/RecentEvaluation';
import PastEvaluationsList from '@/components/analysis/PastEvaluationsList';
import VideoCapture from '@/components/analysis/VideoCapture';

export default function FormAnalysisScreen() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [recentEvaluation] = useState(RECENT_EVALUATION);
  const [pastEvaluations] = useState(PAST_EVALUATIONS);

  const handleAnalysisPress = (evaluation) => {
    setSelectedAnalysis(PLACEHOLDER_ANALYSIS);
  };
  const closeAnalysis = () => {
    setSelectedAnalysis(null);
  };

  return (
    <View style={analysis_styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={analysis_styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={analysis_styles.overlay}>
          <ScrollView 
            style={analysis_styles.scrollView}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <View style={analysis_styles.topSection}>
              <Text h2 style={analysis_styles.title}>Form Analysis</Text>
              <VideoCapture onVideoSelected={setVideoUri} />
              {recentEvaluation && (
                <RecentEvaluation 
                  evaluation={recentEvaluation} 
                  onPress={() => handleAnalysisPress(recentEvaluation)} 
                />
              )}
            </View>
            <PastEvaluationsList 
              evaluations={pastEvaluations} 
              onPress={handleAnalysisPress} 
            />
          </ScrollView>
          <FormAnalysisSlideshow 
            selectedAnalysis={selectedAnalysis} 
            isVisible={selectedAnalysis !== null} 
            onClose={closeAnalysis} 
          />
        </View>
      </ImageBackground>
    </View>
  );
}
