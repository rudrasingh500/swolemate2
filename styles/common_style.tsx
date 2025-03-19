import { StyleSheet } from "react-native";

const common_styles = StyleSheet.create({
  // Layout
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },

  // Text Styles
  title: {
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#e0e0e0',
    marginBottom: 20,
    textAlign: 'center',
  },

  // Input Styles
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    color: 'white',
    marginBottom: 10,
  },

  // Button Styles
  buttonContainer: {
    marginTop: 15,
    width: '100%',
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
  },
  outlineButton: {
    borderColor: '#e74c3c',
    borderWidth: 1,
    paddingVertical: 15,
    borderRadius: 10,
  },
  outlineButtonText: {
    color: '#e74c3c',
  },

  // Card Styles
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ScrollView Styles
  scrollViewStyle: {
    flex: 1,
    showsVerticalScrollIndicator: false,
    showsHorizontalScrollIndicator: false,
  },
});

export default common_styles;