import { View, ScrollView, ImageBackground, ActivityIndicator, Alert, Platform } from 'react-native';
import { Text } from '@rneui/themed';
import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import mime from 'mime';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase/supabase';
import analysis_styles from '@/styles/form-analysis_style';
import FormAnalysisSlideshow from '@/components/analysis/FormAnalysisSlideshow';
import RecentEvaluation from '@/components/analysis/RecentEvaluation';
import PastEvaluationsList from '@/components/analysis/PastEvaluationsList';
import VideoCapture from '@/components/analysis/VideoCapture';
import { Video as CompressorVideo, Image as CompressorImage } from 'react-native-compressor';

// Type definitions for the analysis API response
interface EvaluationIssue {
  timestamp: string;
  coordinates?: { x: number; y: number } | null;
  description: string;
  correction: string;
}

interface EvaluationRep {
  rep_number: number;
  start_time?: string;
  end_time?: string;
  accuracy_score: number;
  issues: EvaluationIssue[];
}

interface AnalysisData {
  exercise: string;
  total_reps: number;
  reps: EvaluationRep[];
}

// Define a base Evaluation interface matching what's expected by the components
interface Evaluation {
  id: number;
  date: string;
  exercise: string;
  score: number;
  feedback: string;
}

// Extended interface with additional properties for our implementation
interface FormAnalysis extends Evaluation {
  exerciseName?: string;
  overallScore?: number;
  totalReps?: number;
  analysisData?: AnalysisData;
  videoUrl?: string;
}

export default function FormAnalysisScreen() {
  const { user } = useAuth();
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [recentEvaluation, setRecentEvaluation] = useState<FormAnalysis | null>(null);
  const [pastEvaluations, setPastEvaluations] = useState<Evaluation[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load past evaluations when user changes
  useEffect(() => {
    if (user) {
      loadPastEvaluations();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Load past evaluations from Supabase
  const loadPastEvaluations = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Query the form_analyses table for this user
      const { data, error } = await supabase
        .from('form_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        setIsLoading(false);
        return;
      }
      
      if (!data || data.length === 0) {
        setPastEvaluations([]);
        setRecentEvaluation(null);
        setIsLoading(false);
        return;
      }
      
      // Map database records to Evaluation objects with full analysis data
      const evaluations: FormAnalysis[] = await Promise.all(data.map(async record => {
        const analysisData = record.analysis_data;
        let parsedAnalysis: AnalysisData | undefined;
        
        // Parse the analysis data - handle different formats
        if (analysisData && analysisData.analysis) {
          if (typeof analysisData.analysis === 'object') {
            parsedAnalysis = analysisData.analysis as AnalysisData;
          } else if (typeof analysisData.analysis === 'string' && analysisData.analysis.startsWith('```json')) {
            // Handle case where analysis is stored as a string with markdown code blocks
            try {
              const cleanJsonStr = analysisData.analysis.replace(/```json\n|\n```/g, '');
              parsedAnalysis = JSON.parse(cleanJsonStr);
            } catch (e) {
              // If parsing fails, leave it undefined
            }
          }
        }
        
        // Get score from analysis data or calculate it
        const score = analysisData?.overallScore || 
          (parsedAnalysis?.reps ? calculateOverallScore(parsedAnalysis) : 0);
        
        // Get video URL from storage if available
        let videoUrl = undefined;
        if (record.video_storage_path) {
          videoUrl = await getVideoUrl(record.video_storage_path);
        }
        
        return {
          id: record.id,
          date: new Date(record.created_at).toISOString(),
          exercise: analysisData?.exercise || 'Unknown Exercise',
          score: score,
          feedback: `Completed ${analysisData?.total_reps || 0} reps with ${score}% accuracy`,
          analysisData: parsedAnalysis,
          exerciseName: analysisData?.exercise,
          overallScore: score,
          totalReps: analysisData?.total_reps,
          videoUrl: videoUrl,
        };
      }));
      
      setPastEvaluations(evaluations);
      
      // Set the most recent evaluation as the current one
      if (evaluations.length > 0) {
        setRecentEvaluation(evaluations[0]);
      }
      
      setIsLoading(false);
    } catch (error) {
      // Error handled silently
      setIsLoading(false);
    }
  };

  // Calculate overall score from analysis data
  const calculateOverallScore = (analysis: AnalysisData): number => {
    if (!analysis.reps || analysis.reps.length === 0) {
      return 0;
    }
    
    const totalScore = analysis.reps.reduce((sum: number, rep: EvaluationRep) => sum + rep.accuracy_score, 0);
    return Math.round(totalScore / analysis.reps.length);
  };

  // Handle video selection
  const handleVideoSelected = async (uri: string): Promise<void> => {
    setVideoUri(uri);
    await uploadAndAnalyzeVideo(uri);
  };

  // Upload video to Supabase storage and call the edge function
  const uploadAndAnalyzeVideo = async (uri: string): Promise<void> => {
    if (!user || !uri) {
      return;
    }

    try {
      setIsUploading(true);

      // Different approaches for web vs native
      if (Platform.OS === 'web') {
        // For web, we need to handle file differently
        // The URI might already be a blob URL or base64
        let fileBlob: Blob;
        let mimeType = 'video/mp4';
        let fileExtension = 'mp4';
        
        // If the URI is a base64 string
        if (uri.startsWith('data:')) {
          const base64 = uri.split(',')[1];
          const arrayBuffer = decode(base64);
          fileBlob = new Blob([arrayBuffer], { type: mimeType });
          
          // Try to get the mime type from the data URI
          const matches = uri.match(/^data:(.*?);/);
          if (matches && matches[1]) {
            mimeType = matches[1];
            // Get extension from mime type
            const extMatches = mimeType.match(/\/([a-zA-Z0-9]+)$/);
            if (extMatches && extMatches[1]) {
              fileExtension = extMatches[1];
            }
          }
        } else {
          // For blob URLs, fetch the blob
          const response = await fetch(uri);
          fileBlob = await response.blob();
          mimeType = fileBlob.type || mimeType;
          
          // Try to extract extension from mime type
          const extMatches = mimeType.match(/\/([a-zA-Z0-9]+)$/);
          if (extMatches && extMatches[1]) {
            fileExtension = extMatches[1];
          }
        }
        
        // In browser, we can't compress the video, so just upload as is
        // Generate file path with MP4 extension to ensure better compatibility
        const filePath = `${user.id}/${Date.now()}.mp4`;
        
        // Upload directly as blob
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('form_videos')
          .upload(filePath, fileBlob, {
            contentType: 'video/mp4'
          });
          
        if (uploadError) {
          Alert.alert('Error', 'Failed to upload video: ' + uploadError.message);
          setIsUploading(false);
          return;
        }
        
        setIsUploading(false);
        setIsAnalyzing(true);
        
        // Call edge function to analyze
        await processVideoWithEdgeFunction(filePath, user.id);
        
      } else {
        // Native platform approach (iOS/Android)
        // Get file info
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
          Alert.alert('Error', 'Selected video file does not exist');
          setIsUploading(false);
          return;
        }

        // Show a progress message
        setIsUploading(true);
        
        try {
          // 1. Compress and convert the video to MP4
          console.log('Compressing video...');
          const compressedUri = await CompressorVideo.compress(
            uri,
            {
              compressionMethod: 'auto',
              maxSize: 10 * 1024 * 1024, // Max 10MB
              minimumFileSizeForCompress: 0,
              progressDivider: 10
            },
            (progress) => {
              console.log(`Compression progress: ${Math.round(progress * 100)}%`);
            }
          );
          
          console.log('Video compressed successfully');
          console.log('Original URI:', uri);
          console.log('Compressed URI:', compressedUri);
          
          if (!compressedUri) {
            throw new Error('Video compression failed');
          }
          
          // Get info about the compressed file
          const compressedFileInfo = await FileSystem.getInfoAsync(compressedUri);
          console.log('Compressed file info:', compressedFileInfo);
          if ('size' in compressedFileInfo) {
            console.log('Compressed file size:', compressedFileInfo.size, 'bytes');
          }
          
          // Determine file type - always use mp4 for better compatibility
          const fileExtension = 'mp4';
          const mimeType = 'video/mp4';
          
          // Read the compressed file as base64
          console.log('Reading compressed file as base64...');
          const base64 = await FileSystem.readAsStringAsync(compressedUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          console.log('Base64 length:', base64.length);
          
          // Upload to Supabase storage with MP4 extension
          const filePath = `${user.id}/${Date.now()}.mp4`;
          console.log('Uploading to path:', filePath);
          
          const decoded = decode(base64);
          
          console.log('Starting upload to Supabase...');
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('form_videos')
            .upload(filePath, decoded, {
              contentType: 'video/mp4',
              duplex: 'half',
              cacheControl: '3600'
            });
            
          if (uploadError) {
            console.error('Upload error:', uploadError);
            
            // Fallback - try with minimal options
            console.log('Trying fallback upload method...');
            const fallbackResult = await supabase.storage
              .from('form_videos')
              .upload(filePath, decoded, {
                contentType: 'video/mp4'
              });
              
            if (fallbackResult.error) {
              throw new Error('Failed to upload video: ' + fallbackResult.error.message);
            }
            
            console.log('Fallback upload successful');
          } else {
            console.log('Upload successful');
          }
          
          // Clean up the temporary compressed file
          if (compressedUri !== uri) {
            try {
              await FileSystem.deleteAsync(compressedUri, { idempotent: true });
            } catch (cleanupError) {
              console.warn('Failed to clean up temporary file:', cleanupError);
            }
          }
          
          setIsUploading(false);
          setIsAnalyzing(true);
          
          // Call edge function to analyze
          await processVideoWithEdgeFunction(filePath, user.id);
          
        } catch (error) {
          console.error('Error processing video:', error);
          Alert.alert('Error', 'Failed to process video: ' + (error instanceof Error ? error.message : String(error)));
          setIsUploading(false);
          setIsAnalyzing(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred: ' + (error instanceof Error ? error.message : String(error)));
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };
  
  // Helper function to process video with edge function
  const processVideoWithEdgeFunction = async (filePath: string, userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-form', {
        body: {
          videoPath: filePath,
          userId: userId,
          bucketName: 'form_videos'
        }
      });

      if (error) {
        Alert.alert('Error', 'Failed to analyze video: ' + error.message);
        setIsAnalyzing(false);
        return false;
      }

      setIsAnalyzing(false);

      // Process the analysis data
      if (data) {
        let analysisData: AnalysisData;
        
        // Check if the response is in the unexpected format (wrapped in code blocks)
        if (data.analysis && typeof data.analysis === 'object' && data.analysis.error && typeof data.analysis.error === 'string') {
          try {
            // Extract JSON from markdown code block: ```json\n{...}\n```
            const jsonStr = data.analysis.error;
            // Remove the markdown code block wrappers
            const cleanJsonStr = jsonStr.replace(/```json\n|\n```/g, '');
            // Parse the cleaned JSON string
            const parsedData = JSON.parse(cleanJsonStr);
            
            if (parsedData && parsedData.exercise && parsedData.total_reps && parsedData.reps) {
              analysisData = parsedData as AnalysisData;
            } else {
              throw new Error("Parsed data missing required fields");
            }
          } catch (parseError) {
            Alert.alert('Error', 'Failed to parse analysis results: ' + String(parseError));
            return false;
          }
        } else if (data.analysis && typeof data.analysis === 'object' && data.analysis.exercise) {
          // If it's already in the expected format
          analysisData = data.analysis as AnalysisData;
        } else {
          Alert.alert('Error', 'Analysis results are not in the expected format');
          return false;
        }
        
        // Get video URL for the uploaded file
        let videoUrl = undefined;
        if (filePath) {
          videoUrl = await getVideoUrl(filePath);
        }
        
        // Now we should have a properly parsed analysisData object
        const overallScore = calculateOverallScore(analysisData);
        
        // Create a structured result
        const formAnalysis: FormAnalysis = {
          id: Date.now(),
          date: new Date().toISOString(),
          exercise: analysisData.exercise,
          score: overallScore,
          feedback: `Completed ${analysisData.total_reps} reps with ${overallScore}% accuracy`,
          analysisData: analysisData,
          exerciseName: analysisData.exercise,
          overallScore: overallScore,
          totalReps: analysisData.total_reps,
          videoUrl: videoUrl
        };

        // Save the analysis results to the form_analyses table
        try {
          const { data: insertData, error: insertError } = await supabase
            .from('form_analyses')
            .insert({
              user_id: userId,
              video_storage_path: filePath,
              analysis_data: {
                exercise: analysisData.exercise,
                total_reps: analysisData.total_reps,
                overallScore: overallScore,
                analysis: analysisData,
                videoUrl: videoUrl
              }
            });

          if (insertError) {
            Alert.alert('Warning', 'Analysis completed but failed to save to database: ' + insertError.message);
          }
        } catch (dbError) {
          Alert.alert('Warning', 'Analysis completed but failed to save to database');
        }

        // Don't manually update the state, instead reload from the database
        // to ensure we're displaying what was actually saved
        loadPastEvaluations();
        
        return true;
      } else {
        Alert.alert('Error', 'Analysis results are not in the expected format');
        return false;
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process with edge function: ' + (error instanceof Error ? error.message : String(error)));
      setIsAnalyzing(false);
      return false;
    }
  };

  // Format analysis for display in the slideshow
  const formatAnalysisForDisplay = (analysis: AnalysisData, videoUrl?: string) => {
    // Transform the API analysis format to match the slideshow component expectations
    return {
      overallScore: calculateOverallScore(analysis),
      generalFeedback: `Analysis of ${analysis.exercise} with ${analysis.total_reps} repetitions detected.`,
      recommendations: analysis.reps
        .flatMap((rep: EvaluationRep) => rep.issues)
        .map((issue: EvaluationIssue) => issue.correction)
        .filter((correction: string, index: number, self: string[]) => self.indexOf(correction) === index)
        .slice(0, 4),
      reps: analysis.reps.map((rep: EvaluationRep) => ({
        repNumber: rep.rep_number,
        score: rep.accuracy_score,
        mistakes: rep.issues.map((issue: EvaluationIssue) => ({
          issue: issue.description,
          correction: issue.correction,
          timestamp: issue.timestamp,
          // Use a placeholder image since we don't have actual frames
          imageUrl: require('../../assets/images/background.png')
        })),
        feedback: `Rep ${rep.rep_number} accuracy: ${rep.accuracy_score}%`
      })),
      workoutAdjustment: {
        recommendation: 'Based on your form analysis, we recommend:',
        changes: [
          'Focus on correcting identified form issues',
          'Consider recording another video after making corrections',
          'Track your progress over time to see improvements'
        ]
      },
      videoUrl: videoUrl
    };
  };

  const handleAnalysisPress = (evaluation: Evaluation) => {
    // Check if it's a FormAnalysis with analysisData
    if ('analysisData' in evaluation) {
      const formAnalysis = evaluation as FormAnalysis;
      if (formAnalysis.analysisData) {
        setSelectedAnalysis(formatAnalysisForDisplay(formAnalysis.analysisData, formAnalysis.videoUrl));
      } else {
        // If no analysis data is available, show an alert
        Alert.alert('Error', 'No detailed analysis data available for this workout');
      }
    } else {
      // If it's a basic Evaluation without analysis data
      Alert.alert('Error', 'No detailed analysis data available for this workout');
    }
  };

  const closeAnalysis = () => {
    setSelectedAnalysis(null);
  };

  // Function to get both public and signed URLs and validate them
  const getVideoUrl = async (filePath: string) => {
    try {
      console.log("Getting video URL for:", filePath);
      
      // Since the bucket is NOT public (as defined in the migration),
      // We should primarily use signed URLs which include authentication
      
      // Try signed URL first (with longer expiry)
      try {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('form_videos')
          .createSignedUrl(filePath, 24 * 3600); // 24-hour expiry for better usability
          
        if (signedUrlError) {
          console.error("Error getting signed URL:", signedUrlError);
        } else if (signedUrlData && signedUrlData.signedUrl) {
          console.log("Got signed URL:", signedUrlData.signedUrl);
          
          // Validate URL format
          if (signedUrlData.signedUrl.startsWith('http')) {
            // Test if URL is accessible
            try {
              const response = await fetch(signedUrlData.signedUrl, { method: 'HEAD' });
              if (response.ok) {
                console.log("URL is accessible:", response.status);
                return signedUrlData.signedUrl;
              } else {
                console.log("URL is not accessible:", response.status);
              }
            } catch (e) {
              console.log("Error testing URL accessibility:", e);
            }
            
            // Return the URL even if we couldn't validate it
            return signedUrlData.signedUrl;
          }
        }
      } catch (e) {
        console.error("Exception getting signed URL:", e);
      }
      
      // Try a direct download URL with sharing option
      try {
        console.log("Attempting to create a public share URL...");
        const { data: publicUrlData, error: publicUrlError } = await supabase.storage
          .from('form_videos')
          .createSignedUrl(filePath, 24 * 3600, {
            download: true,
            transform: {
              width: 1280,
              height: 720,
              quality: 80
            }
          });
          
        if (publicUrlError) {
          console.error("Error getting public URL:", publicUrlError);
        } else if (publicUrlData && publicUrlData.signedUrl) {
          console.log("Got public download URL:", publicUrlData.signedUrl);
          return publicUrlData.signedUrl;
        }
      } catch (e) {
        console.error("Exception getting public URL:", e);
      }
      
      // As a fallback, try downloading the file directly and creating a local blob URL
      // This works better on some platforms
      try {
        console.log("Attempting direct download as fallback...");
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('form_videos')
          .download(filePath);
          
        if (downloadError) {
          console.error("Download error:", downloadError);
        } else if (fileData) {
          // Create a blob URL from the downloaded file
          const blobUrl = URL.createObjectURL(fileData);
          console.log("Created local blob URL:", blobUrl);
          return blobUrl;
        }
      } catch (e) {
        console.error("Exception during direct download:", e);
      }
      
      // As a last resort, try the public URL (might not work if bucket isn't public)
      try {
        const { data: publicUrlData } = await supabase.storage
          .from('form_videos')
          .getPublicUrl(filePath);
          
        if (publicUrlData && publicUrlData.publicUrl) {
          console.log("Got public URL (unlikely to work if bucket is private):", publicUrlData.publicUrl);
          return publicUrlData.publicUrl;
        }
      } catch (e) {
        console.error("Error getting public URL:", e);
      }
      
      console.error("Failed to get any valid URL for video");
      return undefined;
    } catch (e) {
      console.error("Error in getVideoUrl:", e);
      return undefined;
    }
  };

  // Render component with loading state
  if (isLoading) {
    return (
      <View style={analysis_styles.container}>
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={analysis_styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={analysis_styles.overlay}>
            <View style={analysis_styles.loadingContainer}>
              <ActivityIndicator size="large" color="#e74c3c" />
              <Text style={analysis_styles.loadingText}>Loading your form analyses...</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

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
              
              {(isUploading || isAnalyzing) ? (
                <View style={analysis_styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#e74c3c" />
                  <Text style={analysis_styles.loadingText}>
                    {isUploading ? 'Uploading video...' : 'Analyzing form...'}
                  </Text>
                </View>
              ) : (
                <VideoCapture onVideoSelected={handleVideoSelected} />
              )}
              
              {recentEvaluation && !isAnalyzing && (
                <RecentEvaluation 
                  evaluation={recentEvaluation} 
                  onPress={() => handleAnalysisPress(recentEvaluation)} 
                />
              )}
            </View>
            
            {!isAnalyzing && pastEvaluations.length > 0 && (
            <PastEvaluationsList 
              evaluations={pastEvaluations} 
              onPress={handleAnalysisPress} 
            />
            )}
            
            {!isAnalyzing && pastEvaluations.length === 0 && !recentEvaluation && (
              <View style={{
                padding: 20,
                alignItems: 'center',
                marginTop: 30,
                marginBottom: 30
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 16,
                  textAlign: 'center',
                  opacity: 0.8
                }}>
                  No form analyses yet. Record a video of your workout to get started!
                </Text>
              </View>
            )}
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
