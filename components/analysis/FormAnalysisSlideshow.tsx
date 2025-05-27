import { View, ScrollView, Modal, TouchableOpacity, Platform, Dimensions, StyleSheet, Animated } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import analysis_styles from '@/styles/form-analysis_style';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

// Get screen dimensions
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Theme colors - should match your app's theme
const THEME = {
  primary: '#FF6B00',            // Primary orange color
  primaryDark: '#E05C00',        // Darker orange for pressed states
  background: '#000',            // Video background 
  text: '#FFFFFF',               // Text color on dark backgrounds
  backgroundLight: '#F8F9FA',    // Light background
  border: 'rgba(255,255,255,0.2)' // Border color for video player
};

// Local styles for video view
const videoStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.background,
    borderRadius: 12,
    overflow: 'hidden',
    borderColor: THEME.border,
    borderWidth: 1,
    width: '100%',
    height: '100%'
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  video: {
    width: '100%',
    height: '100%',
    minWidth: '100%',
    minHeight: '100%'
  },
  backButton: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: `${THEME.primary}EE`,
    padding: 8,
    borderRadius: 50,
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    width: 36,
    height: 36,
  },
  backButtonText: {
    color: THEME.text,
    fontWeight: 'bold',
    fontSize: 14
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center'
  },
  errorText: {
    color: THEME.text,
    marginBottom: 20,
    fontSize: 16
  },
  errorSubText: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10
  },
  loadingIndicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fadeContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  }
});

interface FormAnalysisProps {
  selectedAnalysis: any;
  isVisible: boolean;
  onClose: () => void;
  videoUrl?: string; // Allow manually passing a video URL
}

export default function FormAnalysisSlideshow({ selectedAnalysis, isVisible, onClose, videoUrl }: FormAnalysisProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isPortraitVideo, setIsPortraitVideo] = useState(false);
  const videoRef = useRef<Video>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Log the analysis object to help with debugging
  useEffect(() => {
    if (selectedAnalysis) {
      console.log('Selected analysis object keys:', Object.keys(selectedAnalysis));
      // Look for video-related fields
      for (const key of Object.keys(selectedAnalysis)) {
        if (key.toLowerCase().includes('video') || key.toLowerCase().includes('url')) {
          console.log(`Found possible video URL field: ${key}:`, selectedAnalysis[key]);
        }
      }
    }
  }, [selectedAnalysis]);

  // Reset slide position when a new slideshow is opened
  useEffect(() => {
    if (isVisible) {
      setCurrentSlide(0);
      setShowVideo(false);
      setVideoError(null);
      setIsPortraitVideo(false);
    }
  }, [isVisible, selectedAnalysis]);

  // Handle fade animations when switching between analysis and video
  useEffect(() => {
    if (showVideo) {
      // Fade in the video
      setIsVideoLoading(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out the video
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showVideo, fadeAnim]);

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

  // Get the video URI from the analysis object
  const getVideoUri = () => {
    // First check if a video URL was directly provided
    if (videoUrl) {
      console.log('Using provided videoUrl:', videoUrl);
      return videoUrl;
    }
    
    if (!selectedAnalysis) return null;
    
    // Try to find the video URL in various possible locations
    const possibleFields = [
      'videoUri', 
      'video_uri', 
      'videoUrl', 
      'video_url', 
      'url', 
      'video',
      'video_path',
      'video_link'
    ];
    
    // Try standard properties
    for (const field of possibleFields) {
      if (selectedAnalysis[field]) {
        console.log(`Found video URL in field '${field}':`, selectedAnalysis[field]);
        return selectedAnalysis[field];
      }
    }
    
    // Look in nested objects
    if (selectedAnalysis.form_analysis && typeof selectedAnalysis.form_analysis === 'object') {
      for (const field of possibleFields) {
        if (selectedAnalysis.form_analysis[field]) {
          console.log(`Found video URL in form_analysis.${field}:`, selectedAnalysis.form_analysis[field]);
          return selectedAnalysis.form_analysis[field];
        }
      }
    }
    
    // Try using Supabase storage URL format if we have a path reference
    if (selectedAnalysis.video_path) {
      const supabaseUrl = `https://your-supabase-project.supabase.co/storage/v1/object/public/${selectedAnalysis.video_path}`;
      console.log('Generated Supabase URL:', supabaseUrl);
      return supabaseUrl;
    }
    
    console.log('No video URL found in the analysis object');
    return null;
  };

  // Support both string and number timestamps
  const handleTimestampClick = (timestamp: string | number) => {
    let totalSeconds = 0;
    
    if (typeof timestamp === 'string') {
      // Convert "mm:ss:ms" format to seconds
      const timeComponents = timestamp.split(':');
      const minutes = parseInt(timeComponents[0] || '0', 10);
      const seconds = parseInt(timeComponents[1] || '0', 10);
      const milliseconds = timeComponents.length > 2 ? parseInt(timeComponents[2] || '0', 10) / 1000 : 0;
      
      totalSeconds = minutes * 60 + seconds + milliseconds;
    } else {
      // It's already a number
      totalSeconds = timestamp;
    }
    
    console.log(`Setting timestamp to ${totalSeconds} seconds`);
    setCurrentTimestamp(totalSeconds);
    setVideoError(null);
    setIsVideoLoading(true);
    setShowVideo(true);
  };

  const closeVideo = () => {
    // Fade out first, then hide the video
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowVideo(false);
      setVideoError(null);
    });
  };

  const handleVideoError = (error: string) => {
    console.error('Video playback error:', error);
    setVideoError('Failed to load video. Please try again.');
    setIsVideoLoading(false);
  };

  // Handle video ready for display
  const handleVideoReady = (event: any) => {
    // Fix for web positioning issue
    const webEvent = event as any;
    if (webEvent.srcElement) {
      // For web, directly modify the video element style
      webEvent.srcElement.style.position = "initial";
      
      // Check if the video is in portrait orientation
      if (event.naturalSize) {
        const { width, height } = event.naturalSize;
        const isPortrait = height > width;
        console.log(`Video dimensions: ${width}x${height}, isPortrait: ${isPortrait}`);
        
        // For portrait videos, directly set object-fit to cover
        if (isPortrait) {
          webEvent.srcElement.style.objectFit = "cover";
          webEvent.srcElement.style.width = "100%";
          webEvent.srcElement.style.height = "100%";
        }
        
        setIsPortraitVideo(isPortrait);
      }
    } else {
      // For native platforms, use the naturalSize
      if (event.naturalSize) {
        const { width, height } = event.naturalSize;
        const isPortrait = height > width;
        console.log(`Video dimensions: ${width}x${height}, isPortrait: ${isPortrait}`);
        setIsPortraitVideo(isPortrait);
      }
    }
    
    setIsVideoLoading(false);
  };

  const renderAnalysisContent = () => {
    if (!selectedAnalysis) return null;

    if (currentSlide === 0) {
      return (
        <View style={analysis_styles.slideContent}>
          <Text h3 style={analysis_styles.slideTitle}>Overall Analysis</Text>
          <Text style={analysis_styles.dateText}>{formatDate(selectedAnalysis.date)}</Text>
          
          <View style={analysis_styles.slideshowScoreContainer}>
            <Text style={analysis_styles.slideshowScoreText}>{selectedAnalysis.overallScore}%</Text>
            <Text style={analysis_styles.slideshowScoreLabel}>Form Score</Text>
          </View>
          <Text style={analysis_styles.feedbackText}>{selectedAnalysis.generalFeedback}</Text>
          <Text style={analysis_styles.subheading}>Key Points to Improve:</Text>
          {selectedAnalysis.recommendations?.map((rec: string, index: number) => (
            <Text key={index} style={analysis_styles.bulletPoint}>• {rec}</Text>
          ))}
        </View>
      );
    } else if (currentSlide <= selectedAnalysis.reps.length) {
      const rep = selectedAnalysis.reps[currentSlide - 1];
      
      if (!rep) return <Text>No data for this rep</Text>;
      
      // Support both naming conventions (API vs UI)
      const repNumber = rep.rep_number || rep.repNumber || currentSlide;
      const score = rep.accuracy_score || rep.score || 0;
      const issues = rep.issues || rep.mistakes || [];
      const feedback = rep.feedback || '';
      
      return (
        <View style={analysis_styles.slideContent}>
          <Text h3 style={analysis_styles.slideTitle}>Rep {repNumber} Analysis</Text>
          
          <View style={analysis_styles.slideshowScoreContainer}>
            <Text style={analysis_styles.slideshowScoreText}>{score}%</Text>
            <Text style={analysis_styles.slideshowScoreLabel}>Rep Score</Text>
          </View>
          
          {issues.map((issue: any, index: number) => {
            // Support both naming conventions
            const description = issue.description || issue.issue || '';
            const correction = issue.correction || '';
            const timestamp = issue.timestamp;
            
            return (
              <View key={index} style={analysis_styles.mistakeContainer}>
                <View style={analysis_styles.mistakeOverlay}>
                  <Text style={analysis_styles.mistakeText}>Issue: {description}</Text>
                  <Text style={analysis_styles.mistakeText}>How to Fix: {correction}</Text>
                  {timestamp && (
                    <TouchableOpacity 
                      style={analysis_styles.timestampButton}
                      onPress={() => handleTimestampClick(timestamp)}
                    >
                      <Text style={analysis_styles.timestampText}>
                        <Ionicons name="play-circle-outline" size={18} color="#fff" /> View at {typeof timestamp === 'string' ? timestamp : formatTimestamp(timestamp)}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
          
          {feedback && <Text style={analysis_styles.feedbackText}>{feedback}</Text>}
        </View>
      );
    } else {
      return (
        <View style={analysis_styles.slideContent}>
          <Text h3 style={analysis_styles.slideTitle}>Workout Recommendations</Text>
          <Text style={analysis_styles.feedbackText}>{selectedAnalysis.workoutAdjustment?.recommendation}</Text>
          {selectedAnalysis.workoutAdjustment?.changes?.map((change: string, index: number) => (
            <Text key={index} style={analysis_styles.bulletPoint}>• {change}</Text>
          ))}
        </View>
      );
    }
  };
  
  // Helper function to format timestamp in MM:SS format
  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Helper function to format ISO date strings to a user-friendly format
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid
      }
      
      // Format as "Month Day, Year at Time"
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original if error occurs
    }
  };

  // Effect to ensure video is paused when initially loaded
  useEffect(() => {
    if (showVideo && videoRef.current) {
      // Handle video initialization in a safer way
      const loadVideo = async () => {
        try {
          if (videoRef.current) {
            await videoRef.current.setStatusAsync({ 
              shouldPlay: false,
              positionMillis: currentTimestamp * 1000
            });
            console.log('Video loaded and paused successfully at position:', currentTimestamp);
          }
        } catch (error) {
          console.error('Error setting video status:', error);
          setVideoError('Error initializing video');
        } finally {
          setIsVideoLoading(false);
        }
      };
      
      loadVideo();
    }
  }, [showVideo, currentTimestamp]);

  const videoUri = getVideoUri();

  const renderVideoView = () => {
    if (videoError) {
      return (
        <View style={videoStyles.errorContainer}>
          <Text style={videoStyles.errorText}>{videoError}</Text>
          <Text style={videoStyles.errorSubText}>
            Video URL not found in analysis data
          </Text>
          <Text style={videoStyles.errorSubText}>
            Object keys: {selectedAnalysis ? Object.keys(selectedAnalysis).join(', ') : 'none'}
          </Text>
        </View>
      );
    } 
    
    if (!videoUri) {
      return (
        <View style={videoStyles.errorContainer}>
          <Text style={videoStyles.errorText}>No video available</Text>
          <Text style={videoStyles.errorSubText}>
            Ensure the video URL is properly set in the analysis data.
            Check console logs for details.
          </Text>
        </View>
      );
    }

    return (
      <View style={videoStyles.videoWrapper}>
        {isVideoLoading && (
          <View style={videoStyles.loadingIndicator}>
            <Text style={{ color: THEME.text, marginBottom: 10 }}>Loading video...</Text>
          </View>
        )}
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={videoStyles.video}
          useNativeControls
          resizeMode={isPortraitVideo ? ResizeMode.COVER : ResizeMode.CONTAIN}
          positionMillis={currentTimestamp * 1000}
          onError={() => handleVideoError('Error loading video')}
          onReadyForDisplay={handleVideoReady}
        />
      </View>
    );
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
          {!showVideo ? (
            <>
              <View style={analysis_styles.progressBar}>
                <View 
                  style={[analysis_styles.progressFill, { 
                    width: `${((currentSlide + 1) / (selectedAnalysis ? selectedAnalysis.reps.length + 2 : 1)) * 100}%`
                  }]} 
                />
              </View>
              <ScrollView 
                style={analysis_styles.slideContentScroll}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
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
            </>
          ) : (
            <Animated.View 
              style={[
                videoStyles.fadeContainer, 
                { opacity: fadeAnim }
              ]}
            >
              <View style={videoStyles.videoContainer}>
                {renderVideoView()}
                
                <TouchableOpacity 
                  style={videoStyles.backButton}
                  onPress={closeVideo}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
}