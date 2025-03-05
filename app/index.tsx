import { View, ImageBackground } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { Link } from 'expo-router';
import React from 'react';
import landing_styles from '@/styles/landing-page_style';

const ForwardedButton = React.forwardRef((props, ref) => (
  <Button {...props} />
));

export default function LandingScreen() {
  return (
    <View style={landing_styles.container}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={landing_styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={landing_styles.overlay}>
          <View style={landing_styles.content}>
            <View style={landing_styles.titleContainer}>
              <Text h1 style={landing_styles.title}>Swolemate</Text>
              <Text h4 style={landing_styles.subtitle}>Your AI-Powered Workout Partner</Text>
            </View>

            <View style={landing_styles.buttonGroup}>
              <Link href="/sign-in" asChild>
                <ForwardedButton
                  title="Login"
                  type="outline"
                  containerStyle={landing_styles.buttonContainer}
                  buttonStyle={landing_styles.outlineButton}
                  titleStyle={landing_styles.outlineButtonText}
                />
              </Link>
              <Link href="/sign-up" asChild>
                <ForwardedButton
                  title="Sign Up"
                  containerStyle={landing_styles.buttonContainer}
                  buttonStyle={landing_styles.primaryButton}
                />
              </Link>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
