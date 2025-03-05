import { StyleSheet } from "react-native";

const auth_styles = StyleSheet.create({
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

export default auth_styles;