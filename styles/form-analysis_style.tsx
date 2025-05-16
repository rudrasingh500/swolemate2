import { StyleSheet, Dimensions } from "react-native";
import common_styles from "./common_style";

const analysis_styles = StyleSheet.create({
    ...common_styles,
    overlay: {
      ...common_styles.overlay,
      paddingHorizontal: undefined,
      paddingBottom: undefined,
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
      color: '#bbb',
      fontSize: 14,
      marginBottom: 15,
    },
    feedbackText: {
      color: 'white',
      marginBottom: 20,
      lineHeight: 22,
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
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'rgba(40, 40, 40, 0.95)',
      borderRadius: 15,
      padding: 25,
      width: '90%',
      maxHeight: '80%',
      height: Dimensions.get('window').height * 0.8,
      display: 'flex',
      flexDirection: 'column',
      alignSelf: 'center',
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
      padding: 20,
    },
    slideContentScroll: {
      flex: 1,
    },
    slideTitle: {
      color: 'white',
      marginBottom: 10,
    },
    slideshowScoreContainer: {
      backgroundColor: 'rgba(231, 76, 60, 0.15)',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      width: '100%',
      marginBottom: 25,
    },
    slideshowScoreText: {
      color: '#e74c3c',
      fontSize: 56,
      fontWeight: 'bold',
    },
    slideshowScoreLabel: {
      color: '#e0e0e0',
      fontSize: 18,
      marginTop: 5,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    subheading: {
      color: 'white',
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 10,
    },
    bulletPoint: {
      color: 'white',
      marginBottom: 5,
      marginLeft: 5,
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
      padding: 20,
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
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: 10,
      padding: 30,
      marginVertical: 20,
    },
    loadingText: {
      color: 'white',
      marginTop: 15,
      fontSize: 16,
    },
    slideHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    slideIndicator: {
      textAlign: 'center',
      color: 'white',
      marginVertical: 10,
    },
    issueContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 10,
      padding: 15,
      marginVertical: 10,
    },
    issueImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 10,
    },
    issueText: {
      color: '#e74c3c',
      fontWeight: 'bold',
      marginBottom: 5,
    },
    correctionText: {
      color: 'white',
      marginBottom: 5,
    },
    // Video player styles
    videoContainer: {
      width: '100%',
      height: 220,
      backgroundColor: '#000',
      borderRadius: 8,
      marginBottom: 20,
      overflow: 'hidden',
      position: 'relative',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    video: {
      width: '100%',
      height: '100%',
      backgroundColor: '#000',
    },
    // Timestamp navigation button styles
    timestampButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(231, 76, 60, 0.1)',
      padding: 10,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    timestampText: {
      color: '#e74c3c',
      marginLeft: 10,
      fontSize: 14,
      fontWeight: 'bold',
    },
});

export default analysis_styles;