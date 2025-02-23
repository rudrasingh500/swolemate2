import { StyleSheet, View, ImageBackground } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { Link } from 'expo-router';
import React from 'react';

const ForwardedButton = React.forwardRef((props, ref) => (
  <Button {...props} />
));

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text h1 style={styles.title}>Swolemate</Text>
              <Text h4 style={styles.subtitle}>Your AI-Powered Workout Partner</Text>
            </View>

            <View style={styles.buttonGroup}>
              <Link href="/sign-in" asChild>
                <ForwardedButton
                  title="Login"
                  type="outline"
                  containerStyle={styles.buttonContainer}
                  buttonStyle={styles.outlineButton}
                  titleStyle={styles.outlineButtonText}
                />
              </Link>
              <Link href="/sign-up" asChild>
                <ForwardedButton
                  title="Sign Up"
                  containerStyle={styles.buttonContainer}
                  buttonStyle={styles.primaryButton}
                />
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
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 70,
  },
  titleContainer: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
  },
  subtitle: {
    color: '#e0e0e0',
    textAlign: 'left',
    marginBottom: 25,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  outlineButton: {
    borderColor: 'white',
    borderWidth: 2,
    paddingVertical: 15,
    borderRadius: 10,
  },
  outlineButtonText: {
    color: 'white',
  },
})