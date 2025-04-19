import { View } from 'react-native';
import { useState } from 'react';
import analysis_styles from '@/styles/form-analysis_style';

interface VideoCaptureProps {
  onVideoSelected: (uri: string) => void;
}

export default function VideoCapture({ onVideoSelected }: VideoCaptureProps) {
  const [videoUri, setVideoUri] = useState<string | null>(null);

  async function startRecording() {
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
        onVideoSelected(uri);
      alert('Failed to record video');
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
        const uri = result.assets[0].uri;
        setVideoUri(uri);
        onVideoSelected(uri);
        console.log('Video selected:', result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking video:', error);
        onVideoSelected(uri);
    }

  return (
    <View style={analysis_styles.analysisSection}>
      <Button
        title="Start Form Analysis"
        icon={<Ionicons name="videocam" size={24} color="white" style={analysis_styles.buttonIcon} />}
        containerStyle={analysis_styles.mainButtonContainer}
