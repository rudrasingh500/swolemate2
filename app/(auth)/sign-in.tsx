import { useState } from 'react';
import {View, TextInput, Alert, ImageBackground } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { Link, router } from 'expo-router';
import { supabase } from '../../lib/supabase/supabase';
import auth_styles from '@/styles/auth_style';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(tabs)');
    }
    setLoading(false);
  }

  return (
    <View style={auth_styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={auth_styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={auth_styles.overlay}>
          <View style={auth_styles.content}>
            <Text h1 style={auth_styles.title}>Swolemate</Text>
            <Text h4 style={auth_styles.subtitle}>Your AI Workout Partner</Text>

            <View style={auth_styles.inputContainer}>
              <TextInput
                style={auth_styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
              <TextInput
                style={auth_styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
              />

              <Button
                title="Sign In"
                onPress={signInWithEmail}
                loading={loading}
                containerStyle={auth_styles.buttonContainer}
                buttonStyle={auth_styles.button}
              />

              <Link href="/sign-up" style={auth_styles.link}>
                <Text style={auth_styles.linkText}>Don't have an account? Sign Up</Text>
              </Link>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}