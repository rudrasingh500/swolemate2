import { StyleSheet } from "react-native";

const profile_styles = StyleSheet.create({
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
    header: {
      alignItems: 'center',
      padding: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      marginHorizontal: 20,
      borderRadius: 15,
    },
    avatar: {
      backgroundColor: '#e74c3c',
      marginBottom: 15,
    },
    name: {
      color: 'white',
      marginBottom: 5,
    },
    email: {
      color: '#e0e0e0',
    },
    editContainer: {
      width: '100%',
      alignItems: 'center',
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 10,
      padding: 15,
      marginVertical: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
    },
    editButtons: {
      flexDirection: 'row',
      gap: 10,
    },
    editButton: {
      minWidth: 100,
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
    editProfileButton: {
      marginTop: 15,
      width: '100%',
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      marginTop: 20,
      marginHorizontal: 20,
      borderRadius: 15,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      color: 'white',
    },
    statLabel: {
      color: '#e0e0e0',
    },
    achievementsContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 10,
      padding: 15,
      marginTop: 20,
      marginHorizontal: 20,
    },
    achievementsTitle: {
      color: 'white',
      marginBottom: 15,
    },
    achievementsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 10,
    },
    achievementCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 8,
      padding: 12,
      width: '31%',
      alignItems: 'center',
      minWidth: 100,
    },
    achievementIcon: {
      fontSize: 24,
      marginBottom: 8,
    },
    achievementTitle: {
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
      marginBottom: 4,
    },
    achievementDesc: {
      color: '#e0e0e0',
      fontSize: 12,
      textAlign: 'center',
    },
    signOutButton: {
      margin: 20,
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
    modalIcon: {
      fontSize: 48,
      marginBottom: 15,
    },
    modalTitle: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    modalDescription: {
      color: '#e0e0e0',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 15,
    },
    modalDate: {
      color: '#e74c3c',
      fontSize: 14,
      marginBottom: 5,
    },
    modalProgress: {
      color: '#e0e0e0',
      fontSize: 14,
      marginBottom: 20,
    },
    modalCloseButton: {
      backgroundColor: '#e74c3c',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 8,
    },
    modalCloseButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
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
    editProfileButton: {
      marginTop: 15,
      width: '100%',
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      marginTop: 20,
      marginHorizontal: 20,
      borderRadius: 15,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      color: 'white',
    },
    statLabel: {
      color: '#e0e0e0',
    },
    achievementsContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 10,
      padding: 15,
      marginTop: 20,
      marginHorizontal: 20,
    },
    achievementsTitle: {
      color: 'white',
      marginBottom: 15,
    },
    achievementsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 10,
    },
    achievementCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 8,
      padding: 12,
      width: '31%',
      alignItems: 'center',
      minWidth: 100,
    },
    achievementIcon: {
      fontSize: 24,
      marginBottom: 8,
    },
    achievementTitle: {
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
      marginBottom: 4,
    },
    achievementDesc: {
      color: '#e0e0e0',
      fontSize: 12,
      textAlign: 'center',
    },
    signOutButton: {
      margin: 20,
    },
});

export default profile_styles;