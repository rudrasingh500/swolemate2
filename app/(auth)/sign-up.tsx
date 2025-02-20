import { useState } from 'react';
import { StyleSheet, View, TextInput, Alert, ImageBackground } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { Link, router } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.push('/questionnaire/basic-info');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text h1 style={styles.title}>Create Account</Text>
            <Text h4 style={styles.subtitle}>Join Swolemate Today</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
              />

              <Button
                title="Sign Up"
                onPress={signUpWithEmail}
                loading={loading}
                containerStyle={styles.buttonContainer}
                buttonStyle={styles.button}
              />

              <Link href="/sign-in" style={styles.link}>
                <Text style={styles.linkText}>Already have an account? Sign In</Text>
              </Link>
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
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#e0e0e0',
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
  link: {
    marginTop: 20,
    alignSelf: 'center',
  },
  linkText: {
    color: '#e0e0e0',
  },
});