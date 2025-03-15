import { StyleSheet } from "react-native";

const log_styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      maxHeight: '80%',
      backgroundColor: '#1a1a1a',
      borderRadius: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#333',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#333',
      backgroundColor: '#222',
    },
    modalTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    closeButton: {
      padding: 5,
    },
    modalBody: {
      padding: 15,
      maxHeight: '70%',
      backgroundColor: '#1a1a1a',
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
      borderTopWidth: 1,
      borderTopColor: '#333',
      backgroundColor: '#222',
    },
    formSection: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'white',
    },
    setRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    setNumberContainer: {
      width: 60,
      marginRight: 10,
    },
    setNumber: {
      fontSize: 14,
      fontWeight: 'bold',
      color: 'white',
    },
    inputGroup: {
      flex: 1,
      marginRight: 10,
    },
    timeInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10,
    },
    timeInputGroup: {
      flex: 1,
    },
    timeInput: {
      borderWidth: 1,
      borderColor: '#444',
      borderRadius: 5,
      padding: 8,
      fontSize: 14,
      backgroundColor: '#2a2a2a',
      color: 'white',
      textAlign: 'center',
    },
    timeSeparator: {
      color: 'white',
      fontSize: 20,
      marginHorizontal: 5,
      fontWeight: 'bold',
    },
    inputLabel: {
      fontSize: 12,
      color: '#ccc',
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#444',
      borderRadius: 5,
      padding: 8,
      fontSize: 14,
      backgroundColor: '#2a2a2a',
      color: 'white',
    },
    removeButton: {
      padding: 5,
    },
    addButton: {
      borderColor: '#e74c3c',
      borderRadius: 5,
      marginTop: 10,
    },
    addButtonText: {
      color: '#e74c3c',
    },
    unitToggle: {
      backgroundColor: '#333',
      padding: 8,
      borderRadius: 5,
      marginLeft: 5,
      minWidth: 40,
      alignItems: 'center',
    },
    unitText: {
      color: 'white',
      fontSize: 14,
    },
    cardioRow: {
      marginBottom: 15,
    },
    cardioInputGroup: {
      width: '100%',
    },
    cardioInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardioInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#444',
      borderRadius: 5,
      padding: 8,
      fontSize: 14,
      backgroundColor: '#2a2a2a',
      color: 'white',
    },
    fullWidthInput: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#444',
      borderRadius: 5,
      padding: 8,
      fontSize: 14,
      backgroundColor: '#2a2a2a',
      color: 'white',
    },
    notesInput: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#444',
      borderRadius: 5,
      padding: 10,
      fontSize: 14,
      textAlignVertical: 'top',
      minHeight: 100,
      backgroundColor: '#2a2a2a',
      color: 'white',
    },
    cancelButton: {
      borderColor: '#999',
      borderRadius: 5,
    },
    cancelButtonText: {
      color: '#999',
    },
    actionButtons: {
      flexDirection: 'row',
    },
    saveProgressButton: {
      borderColor: '#e74c3c',
      borderRadius: 5,
    },
    saveProgressButtonText: {
      color: '#e74c3c',
    },
    completeButton: {
      backgroundColor: '#e74c3c',
      borderRadius: 5,
    },
  });

  export default log_styles;
  