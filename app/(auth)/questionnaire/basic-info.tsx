import { useState } from 'react';
import { StyleSheet, View, TextInput, Alert, ImageBackground } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { router } from 'expo-router';

export default function BasicInfo() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);

  function saveBasicInfo() {
    if (!height || !weight || !age) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Save the data to local state or context if needed
      router.push('/questionnaire/medical-info');
    } catch (error) {
      Alert.alert('Error', 'Failed to save information');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text h2 style={styles.title}>Basic Information</Text>
            <Text style={styles.subtitle}>Step 1 of 5</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Height (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
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
                containerStyle={styles.buttonContainer}
                buttonStyle={styles.button}
              />
            </View>
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    color: '#e0e0e0',
    fontSize: 18,
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    gap: 15,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    color: 'white',
  },
  buttonContainer: {
    marginTop: 15,
    width: '100%',
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
  },
});