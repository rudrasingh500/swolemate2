import { StyleSheet, Dimensions } from "react-native";

const chart_styles = StyleSheet.create({
    container: {
      borderRadius: 10,
      padding: 15,
      marginVertical: 10,
    },
    darkCard: {
      borderRadius: 10,
      padding: 15,
      marginVertical: 10,
      backgroundColor: '#222',
      borderColor: '#333',
      width: '100%',
      marginHorizontal: 0
    },
    cardTitle: {
      color: 'white',
    },
    metricSelector: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 15,
    },
    metricButton: {
      paddingVertical: 8,
      paddingHorizontal: 15,
      marginHorizontal: 5,
      borderRadius: 20,
      backgroundColor: '#333',
    },
    metricButtonActive: {
      backgroundColor: '#e74c3c',
    },
    metricButtonText: {
      color: '#ccc',
      fontWeight: 'bold',
    },
    metricButtonTextActive: {
      color: '#fff',
    },
    timeRangeSelector: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 15,
    },
    timeButton: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginHorizontal: 2,
      borderRadius: 15,
      backgroundColor: '#333',
    },
    timeButtonActive: {
      backgroundColor: '#e74c3c',
    },
    timeButtonText: {
      color: '#ccc',
      fontSize: 12,
    },
    timeButtonTextActive: {
      color: '#fff',
    },
    chart: {
      marginVertical: 8,
      borderRadius: 16,
      alignSelf: 'center',
      overflow: 'hidden',
      width: '100%',
      marginHorizontal: 0,
    },
    miniChart: {
      borderRadius: 8,
      alignSelf: 'flex-start',
      overflow: 'hidden',
      marginHorizontal: 0,
    },
    metricLabel: {
      textAlign: 'center',
      color: '#ccc',
      marginTop: 5,
      fontSize: 12,
    },
    loadingContainer: {
      height: 220,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noDataText: {
      textAlign: 'center',
      color: '#ccc',
      padding: 10,
      fontSize: 16,
      fontWeight: 'bold',
    },
    noDataSubtext: {
      textAlign: 'center',
      color: '#aaa',
      marginBottom: 20,
      fontSize: 14,
    },
    miniContainer: {
      width: 120,
      height: 100,
      padding: 5,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    miniTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#ccc',
      marginBottom: 5,
    },
    miniText: {
      fontSize: 10,
      color: '#ccc',
      textAlign: 'center',
    },
  });
  export default chart_styles;