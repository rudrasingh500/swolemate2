import { StyleSheet } from "react-native"

const landing_styles = StyleSheet.create({
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
export default landing_styles;