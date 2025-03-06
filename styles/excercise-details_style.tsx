import { StyleSheet } from "react-native";

const detail_styles = StyleSheet.create({
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
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
      paddingTop: 20,
    },
    returnButtonContainer: {
      marginTop: 20,
      marginBottom: 20,
      width: '100%',
      maxWidth: 200,
      alignSelf: 'flex-start',
    },
    returnButton: {
      backgroundColor: '#e74c3c',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingTop: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    backButton: {
      minWidth: 100,
      padding: 10,
    },
    backButtonText: {
      color: 'white',
      marginLeft: 5,
      fontSize: 16,
    },
    titleContainer: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      marginTop: 10,
    },
    title: {
      color: 'white',
      textAlign: 'center',
      fontSize: 24,
      fontWeight: 'bold',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 10,
      marginBottom: 20,
      padding: 15,
    },
    cardTitle: {
      color: 'white',
      fontSize: 20,
      textAlign: 'left',
      marginBottom: 15,
    },
    description: {
      color: 'white',
      fontSize: 16,
      marginBottom: 15,
    },
    metaInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    metaItem: {
      color: '#e0e0e0',
      backgroundColor: 'rgba(231, 76, 60, 0.3)',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      fontSize: 14,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    chip: {
      backgroundColor: 'rgba(231, 76, 60, 0.3)',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      marginBottom: 8,
    },
    gifContainer: {
      width: '100%',
      aspectRatio: 1/1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 10,
    },
    gif: {
      width: '100%',
      height: '100%',
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      maxWidth: '100%',
      alignSelf: 'flex-start',
    },
    chip: {
      backgroundColor: 'rgba(231, 76, 60, 0.3)',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      marginBottom: 8,
    },
    chipText: {
      color: 'white',
      fontSize: 14,
    },
    instructionItem: {
      flexDirection: 'row',
      marginBottom: 15,
      alignItems: 'flex-start',
    },
    instructionNumber: {
      color: '#e74c3c',
      fontSize: 16,
      fontWeight: 'bold',
      marginRight: 10,
      width: 25,
    },
    instructionText: {
      color: 'white',
      fontSize: 16,
      flex: 1,
    },
    benefitItem: {
      flexDirection: 'row',
      marginBottom: 10,
      alignItems: 'center',
    },
    bulletPoint: {
      color: '#e74c3c',
      fontSize: 20,
      marginRight: 10,
    },
    benefitText: {
      color: 'white',
      fontSize: 16,
      flex: 1,
    },
    errorText: {
      color: 'white',
      fontSize: 18,
      textAlign: 'center',
    },
});

export default detail_styles;