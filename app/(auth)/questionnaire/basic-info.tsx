import { useState } from 'react';
import { View, TextInput, Alert, ImageBackground } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { router } from 'expo-router';
import { supabase } from '../../../lib/supabase/supabase';
import questionnaire_styles from '@/styles/questionnaire_style';

export default function BasicInfo() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);

  async function saveBasicInfo() {
    if (!height || !weight || !age) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          height: parseFloat(height),
          weight: parseFloat(weight),
          age: parseInt(age),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      router.push('/questionnaire/medical-info');
    } catch (error) {
      Alert.alert('Error', 'Failed to save information');
      console.error('Error saving basic info:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={questionnaire_styles.container}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={questionnaire_styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={questionnaire_styles.overlay}>
          <View style={questionnaire_styles.content}>
            <Text h2 style={questionnaire_styles.title}>Basic Information</Text>
            <Text style={questionnaire_styles.subtitle}>Step 1 of 5</Text>

            <View style={questionnaire_styles.inputContainer}>
              <TextInput
                style={questionnaire_styles.input}
                placeholder="Height (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <TextInput
                style={questionnaire_styles.input}
                placeholder="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <TextInput
                style={questionnaire_styles.input}
                placeholder="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />

              <Button
                title="Next"
                onPress={saveBasicInfo}
                loading={loading}
                containerStyle={questionnaire_styles.buttonContainer}
                buttonStyle={questionnaire_styles.button}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
