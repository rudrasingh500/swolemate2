import { StyleSheet, Dimensions } from "react-native";

const analysis_styles = StyleSheet.create({
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
    },
    scrollView: {
      flex: 1,
    },
    topSection: {
      padding: 20,
      marginBottom: 20,
    },
    title: {
      color: 'white',
      textAlign: 'center',
      marginBottom: 30,
    },
    analysisSection: {
      alignItems: 'center',
      marginBottom: 30,
    },
    mainButtonContainer: {
      width: '80%',
      marginBottom: 10,
    },
    mainButton: {
      backgroundColor: '#e74c3c',
      paddingVertical: 15,
      borderRadius: 10,
    },
    uploadText: {
      color: '#e0e0e0',
      marginVertical: 10,
    },
    uploadButtonText: {
      color: '#e0e0e0',
    },
    buttonIcon: {
      marginRight: 8,
    },
    recentEvalCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 10,
      marginBottom: 20,
      padding: 20,
    },
    scoreContainer: {
      alignItems: 'center',
      marginBottom: 15,
    },
    scoreText: {
      color: '#e74c3c',
      fontSize: 48,
      fontWeight: 'bold',
    },
    scoreLabel: {
      color: '#e0e0e0',
      fontSize: 16,
    },
    bottomSection: {
      padding: 20,
    },
    sectionTitle: {
      color: 'white',
      marginBottom: 20,
    },
    evaluationCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 10,
      marginBottom: 10,
      padding: 15,
    },
    evaluationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    exerciseText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    scoreChip: {
      color: 'white',
      backgroundColor: '#e74c3c',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 15,
    },
    dateText: {
      color: '#e0e0e0',
      marginBottom: 5,
    },
    feedbackText: {
      color: 'white',
      marginTop: 5,
    },
    cardTitle: {
      color: 'white',
      fontSize: 20,
      marginBottom: 15,
      textAlign: 'center',
    },
    evaluationText: {
      color: 'white',
      marginBottom: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
      backgroundColor: 'rgba(40, 40, 40, 0.95)',
      borderRadius: 15,
      padding: 25,
      width: '90%',
      maxHeight: '80%',
      height: Dimensions.get('window').height * 0.8,
      display: 'flex',
      flexDirection: 'column'
    },
    progressBar: {
      width: '100%',
      height: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 2,
      marginBottom: 20,
      overflow: 'hidden',
    },
    slideContent: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
      overflow: 'auto',
      marginBottom: 10
    },
    slideTitle: {
      color: 'white',
      textAlign: 'center',
      marginBottom: 25,
      fontSize: 28,
      fontWeight: 'bold',
    },
    scoreContainer: {
      backgroundColor: 'rgba(231, 76, 60, 0.15)',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      width: '100%',
      marginBottom: 25,
    },
    scoreText: {
      color: '#e74c3c',
      fontSize: 56,
      fontWeight: 'bold',
    },
    scoreLabel: {
      color: '#e0e0e0',
      fontSize: 18,
      marginTop: 5,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    feedbackText: {
      color: 'white',
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
      marginVertical: 20,
      paddingHorizontal: 10,
    },
    subheading: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 15,
      textAlign: 'center',
      width: '100%',
    },
    bulletPoint: {
      color: 'white',
      fontSize: 16,
      marginLeft: 15,
      marginBottom: 10,
      lineHeight: 22,
    },
    mistakeContainer: {
      marginVertical: 15,
      borderRadius: 15,
      overflow: 'hidden',
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    mistakeImage: {
      width: '100%',
      height: 200,
    },
    mistakeOverlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 20,
    },
    mistakeText: {
      color: 'white',
      marginBottom: 8,
      fontSize: 15,
      lineHeight: 22,
    },
    navigationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 25,
      marginTop: 20,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.2)',
    },
    navButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 100,
  },
  closeButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.4)',
  },
  navButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
  navButtonTextDisabled: {
    color: 'rgba(150, 150, 150, 0.5)',
  },
  progressFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#e74c3c',
    borderRadius: 2,
    transition: 'width 0.3s ease-in-out'
  }
});
export default analysis_styles;