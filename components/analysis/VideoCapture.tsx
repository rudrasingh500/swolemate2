import { View } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import analysis_styles from '@/styles/form-analysis_style';

interface VideoCaptureProps {
  onVideoSelected: (uri: string) => void;
  disabled?: boolean;
}

export default function VideoCapture({ onVideoSelected, disabled = false }: VideoCaptureProps) {
  const [videoUri, setVideoUri] = useState<string | null>(null);

  async function startRecording() {
    if (disabled) return;
    
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
        const uri = result.assets[0].uri;
        setVideoUri(uri);
        onVideoSelected(uri);
        console.log('Video recorded:', result.assets[0]);
      }
    } catch (error) {
      console.error('Error recording video:', error);
      alert('Failed to record video');
    }
  }

  async function pickVideo() {
    if (disabled) return;
    
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
        const uri = result.assets[0].uri;
        setVideoUri(uri);
        onVideoSelected(uri);
        console.log('Video selected:', result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      alert('Failed to select video');
    }
  }

  return (
    <View style={analysis_styles.analysisSection}>
      <Button
        title="Start Form Analysis"
        icon={<Ionicons name="videocam" size={24} color="white" style={analysis_styles.buttonIcon} />}
        containerStyle={analysis_styles.mainButtonContainer}
        buttonStyle={[
          analysis_styles.mainButton,
          disabled && { backgroundColor: '#666', opacity: 0.5 }
        ]}
        onPress={startRecording}
        disabled={disabled}
      />
      <Text style={analysis_styles.uploadText}>or</Text>
      <Button
        title="Upload Video"
        type="clear"
        titleStyle={[
          analysis_styles.uploadButtonText,
          disabled && { color: '#888', opacity: 0.5 }
        ]}
        icon={<Ionicons name="cloud-upload" size={20} color={disabled ? "#888" : "#e0e0e0"} style={analysis_styles.buttonIcon} />}
        onPress={pickVideo}
        disabled={disabled}
      />
    </View>
  );
}