import { StyleSheet } from "react-native";
import common_styles from "./common_style";

const plan_styles = StyleSheet.create({
    ...common_styles,
    loadingContainer: {
      ...common_styles.loadingContainer,
    },
    noWorkoutPlanContainer: {
      flex: 1,
    },
    noWorkoutPlanText: {
      color: 'white',
      textAlign: 'center',
      marginBottom: 20,
    },
    createPlanButton: {
      width: '80%',
      alignSelf: 'center',
      marginTop: 20,
    },
    createPlanButtonStyle: {
      backgroundColor: '#e74c3c',
      paddingVertical: 15,
      borderRadius: 10,
    },
    overlay: {
      ...common_styles.overlay,
      paddingTop: 80,
    },
    content: {
      ...common_styles.content,
      paddingHorizontal: 15,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    backButton: {
      minWidth: 120,
      marginRight: 10,
    },
    outlineButton: {
      borderColor: '#e74c3c',
      borderWidth: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    outlineButtonText: {
      color: '#e74c3c',
      fontSize: 16,
    },
    goalContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 10,
      padding: 15,
      marginBottom: 20,
      marginTop: 20,
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    editButton: {
      minWidth: 100,
    },
    editButtonStyle: {
      borderColor: '#e74c3c',
    },
    editButtonText: {
      color: '#e74c3c',
    },
    goalTitle: {
      color: 'white',
      marginBottom: 5,
    },
    goalText: {
      color: '#e0e0e0',
      fontSize: 16,
    },
    planContainer: {
      flex: 1,
    },
    dayContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
    },
    dayHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    dayTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    timeFrame: {
      color: '#e0e0e0',
      fontSize: 14,
    },
    exerciseItem: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    },
    exerciseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    exerciseName: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
    },
    duration: {
      color: '#e0e0e0',
      fontSize: 14,
    },
    exerciseDetails: {
      color: '#e0e0e0',
      fontSize: 14,
    },
    aiSection: {
      backgroundColor: 'rgba(231, 76, 60, 0.1)',
      borderRadius: 15,
      padding: 20,
      marginBottom: 30,
      marginHorizontal: 5,
      borderWidth: 2,
      borderColor: 'rgba(231, 76, 60, 0.3)',
    },
    aiTitle: {
      color: 'white',
      marginBottom: 10,
      textAlign: 'center',
    },
    aiDescription: {
      color: '#e0e0e0',
      textAlign: 'center',
      fontSize: 16,
      marginBottom: 20,
    },
    aiButton: {
      width: '100%',
      maxWidth: 300,
      alignSelf: 'center',
    },
    aiButtonStyle: {
      backgroundColor: '#e74c3c',
      paddingVertical: 15,
      borderRadius: 10,
    },
    buttonTitleStyle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    preDefinedTitle: {
      color: 'white',
      marginBottom: 20,
      textAlign: 'center',
    },
    plansGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 20,
      paddingHorizontal: 10,
      width: '100%',
    },
    planCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 10,
      padding: 15,
      width: '100%',
      marginBottom: 0,
    },
    planTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    planLevel: {
      color: '#e74c3c',
      fontSize: 14,
      marginBottom: 5,
    },
    planDescription: {
      color: '#e0e0e0',
      fontSize: 14,
      marginBottom: 10,
    },
    planCategory: {
      color: '#e0e0e0',
      fontSize: 12,
      opacity: 0.8,
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
      width: '80%',
      alignItems: 'center',
    },
    modalTitle: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    modalPlanTitle: {
      color: '#e74c3c',
      fontSize: 20,
      marginBottom: 10,
    },
    modalDescription: {
      color: '#e0e0e0',
      textAlign: 'center',
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 15,
    },
    confirmButton: {
      backgroundColor: '#e74c3c',
      paddingHorizontal: 30,
      borderRadius: 8,
    },
    cancelButton: {
      borderColor: '#e74c3c',
      paddingHorizontal: 30,
      borderRadius: 8,
    },
    cancelButtonText: {
      color: '#e74c3c',
    },
});

export default plan_styles;