import { StyleSheet } from 'react-native';

const widget_style = StyleSheet.create({
    wrapper: {
      position: 'relative',
    },
    mockDataBanner: {
      backgroundColor: 'rgba(231, 76, 60, 0.9)',
      padding: 8,
      borderRadius: 8,
      marginBottom: 10,
    },
    mockDataText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    mockDataSubtext: {
      color: '#fff',
      fontSize: 12,
      textAlign: 'center',
      opacity: 0.8,
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
    },
    loadingText: {
      marginTop: 10,
      color: '#fff',
      fontSize: 16,
    },
    errorContainer: {
      backgroundColor: 'rgba(231, 76, 60, 0.2)',
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
    },
    errorText: {
      color: '#e74c3c',
      textAlign: 'center',
    },
    container: {
      flexGrow: 0,
      marginVertical: 15,
    },
    widget: {
      backgroundColor: 'rgba(30, 30, 30, 0.7)',
      borderRadius: 15,
      padding: 15,
      marginRight: 15,
      width: 180,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    title: {
      fontSize: 16,
      color: '#fff',
      marginBottom: 5,
      fontWeight: '600',
    },
    value: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 10,
    },
    chartPlaceholder: {
      height: 120,
      backgroundColor: 'rgba(20, 20, 20, 0.3)',
      borderRadius: 8,
      padding: 10,
      justifyContent: 'flex-end',
    },
    chartContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      height: '100%',
      paddingHorizontal: 5,
    },
    chartColumn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: '100%',
      marginHorizontal: 2,
    },
    chartBar: {
      width: 10,
      backgroundColor: '#e74c3c',
      borderRadius: 5,
      minHeight: 5,
    },
    chartLabel: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 10,
      marginTop: 5,
    },
    refreshButton: {
      backgroundColor: '#3498db',
      padding: 12,
      borderRadius: 10,
      marginTop: 10,
      alignItems: 'center',
    },
    refreshButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
  
  export default widget_style;