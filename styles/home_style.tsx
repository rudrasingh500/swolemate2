import { StyleSheet } from "react-native";
import common_styles from "./common_style";

const home_styles = StyleSheet.create({
    ...common_styles,
    noWorkoutsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 10,
      marginBottom: 10,
    },
    noWorkoutsText: {
      color: '#e0e0e0',
      fontSize: 16,
      textAlign: 'center',
    },
    sectionTitle: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    overlay: {
      ...common_styles.overlay,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    content: {
      ...common_styles.content,
      paddingTop: 40,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    streakContainerEmpty: {
      alignItems: 'center',
      marginBottom: 60,
      backgroundColor: 'rgba(231, 76, 60, 0.1)',
      padding: 30,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'rgba(231, 76, 60, 0.3)',
    },
    streakNumberEmpty: {
      color: '#e74c3c',
      fontSize: 64,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    streakTextEmpty: {
      color: '#e74c3c',
      fontSize: 20,
      opacity: 0.8,
    },
    welcomeText: {
      color: 'white',
      textAlign: 'center',
      marginBottom: 15,
      fontSize: 32,
    },
    noWorkoutPlanText: {
      color: '#e0e0e0',
      textAlign: 'center',
      fontSize: 18,
      lineHeight: 24,
      marginBottom: 40,
      paddingHorizontal: 20,
    },
    buttonContainer: {
      width: '100%',
      gap: 15,
      alignItems: 'center',
    },
    createPlanButton: {
      width: '100%',
      maxWidth: 300,
      borderRadius: 10,
      overflow: 'hidden',
    },
    createPlanButtonStyle: {
      backgroundColor: '#e74c3c',
      paddingVertical: 15,
      borderRadius: 10,
      height: 50,
    },
    analysisButtonStyle: {
      backgroundColor: 'rgba(231, 76, 60, 0.6)',
      paddingVertical: 15,
      borderRadius: 10,
      height: 50,
    },
    buttonTitleStyle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    streakContainer: {
      alignItems: 'center',
      marginBottom: 30,
      backgroundColor: 'rgba(231, 76, 60, 0.1)',
      padding: 30,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'rgba(231, 76, 60, 0.3)',
    },
    streakNumber: {
      color: '#e74c3c',
      fontSize: 64,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    streakText: {
      color: '#e74c3c',
      fontSize: 20,
      opacity: 0.8,
    },
    workoutsContainer: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 15,
      padding: 20,
      marginBottom: 20,
    },
    workoutsList: {
      flex: 1,
      marginBottom: 15,
    },
    workoutItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
    },
    workoutInfo: {
      flex: 1,
      marginRight: 15,
    },
    workoutName: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 4,
    },
    workoutDuration: {
      color: '#e0e0e0',
      fontSize: 14,
    },
    statusContainer: {
      alignItems: 'flex-end',
    },
    workoutStatus: {
      fontSize: 12,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 12,
      marginBottom: 8,
    },
    completed: {
      backgroundColor: 'rgba(46, 204, 113, 0.2)',
      color: '#2ecc71',
    },
    scheduled: {
      backgroundColor: 'rgba(231, 76, 60, 0.2)',
      color: '#e74c3c',
    },
    planned: {
      backgroundColor: 'rgba(52, 152, 219, 0.2)',
      color: '#3498db',
    },
    checkboxContainer: {
      padding: 4,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#e74c3c',
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxCompleted: {
      backgroundColor: '#e74c3c',
    },
    checkmark: {
      color: 'white',
      fontSize: 16,
    },
    analysisButtonContainer: {
      marginTop: 20,
      width: '100%',
    },
    analysisButton: {
      backgroundColor: '#e74c3c',
      paddingVertical: 15,
      borderRadius: 10,
    },
    noWorkoutPlanContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
});
export default home_styles;