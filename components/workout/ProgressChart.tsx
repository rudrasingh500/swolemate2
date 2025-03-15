import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text, Card, Button } from '@rneui/themed';
import { LineChart } from 'react-native-chart-kit';
import { supabase } from '@/lib/supabase/supabase';
import { format, subDays, subMonths, parseISO } from 'date-fns';

interface ProgressChartProps {
  profileId: string;
  exerciseName: string;
  mini?: boolean;
}

type TimeRange = '1w' | '1m' | '3m' | '6m' | '1y';

export default function ProgressChart({ profileId, exerciseName, mini = false }: ProgressChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [{ data: [] }]
  });
  const [metric, setMetric] = useState<'weight' | 'volume' | 'duration' | 'distance'>('weight');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const [modalVisible, setModalVisible] = useState(false);

  // Force refresh every 5 seconds when mini chart is displayed
  useEffect(() => {
    if (mini) {
      const interval = setInterval(() => {
        // Only refresh if it's been more than 5 seconds since the last fetch
        if (Date.now() - lastFetchTime > 5000) {
          fetchProgressData();
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [mini, lastFetchTime]);

  useEffect(() => {
    fetchProgressData();
  }, [profileId, exerciseName, timeRange, metric]);

  const fetchProgressData = async () => {
    setLastFetchTime(Date.now());
    try {
      setIsLoading(true);
      setError(null);

      // Calculate date range based on selected time range
      let startDate;
      const endDate = new Date();

      switch (timeRange) {
        case '1w':
          startDate = subDays(endDate, 7);
          break;
        case '1m':
          startDate = subMonths(endDate, 1);
          break;
        case '3m':
          startDate = subMonths(endDate, 3);
          break;
        case '6m':
          startDate = subMonths(endDate, 6);
          break;
        case '1y':
          startDate = subMonths(endDate, 12);
          break;
        default:
          startDate = subMonths(endDate, 1);
      }

      // Fetch exercise logs for the selected period
      console.log('Fetching progress data for:', exerciseName);
      console.log('Date range:', startDate.toISOString(), 'to', endDate.toISOString());
      
      // First, check if there are any logs for this exercise
      const { data: logsCheck, error: logsCheckError } = await supabase
        .from('workout_logs')
        .select('id')
        .eq('profile_id', profileId)
        .eq('exercise_name', exerciseName)
        .limit(1);
        
      if (logsCheckError) {
        console.error('Error checking logs:', logsCheckError);
        throw logsCheckError;
      }
      
      console.log('Logs check result:', logsCheck?.length > 0 ? 'Logs found' : 'No logs found');
      
      // If no logs found, don't bother with the RPC call
      if (!logsCheck || logsCheck.length === 0) {
        setChartData({
          labels: [],
          datasets: [{ data: [] }]
        });
        return;
      }
      
      // Fetch logs directly instead of using RPC
      const { data: logs, error: logsError } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('profile_id', profileId)
        .eq('exercise_name', exerciseName)
        .gte('logged_at', startDate.toISOString())
        .lte('logged_at', endDate.toISOString())
        .order('logged_at', { ascending: true });
      
      if (logsError) {
        console.error('Error fetching logs:', logsError);
        throw logsError;
      }
      
      console.log('Fetched logs:', logs?.length || 0);
      
      // Process data for chart
      processChartData(logs || []);
    } catch (err) {
      console.error('Error fetching progress data:', err);
      setError('Failed to load progress data');
      setChartData({
        labels: [],
        datasets: [{ data: [] }]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processChartData = (logs: any[]) => {
    console.log('Processing chart data, logs count:', logs.length);
    console.log('Log sample:', logs.length > 0 ? JSON.stringify(logs[0]) : 'No logs');
    
    if (logs.length === 0) {
      // If no data, provide a default dataset for mini charts to avoid empty display
      if (mini) {
        setChartData({
          labels: ['', '', ''],
          datasets: [{ data: [0, 0, 0] }]
        });
      } else {
        setChartData({
          labels: [],
          datasets: [{ data: [] }]
        });
      }
      return;
    }

    // Process logs based on exercise type and selected metric
    let processedData: { date: Date; value: number }[] = [];

    // Group logs by exercise type
    const strengthLogs = logs.filter(log => log.exercise_type === 'strength');
    const durationLogs = logs.filter(log => log.exercise_type === 'duration');
    const cardioLogs = logs.filter(log => log.exercise_type === 'cardio');
    
    console.log('Strength logs:', strengthLogs.length);
    console.log('Duration logs:', durationLogs.length);
    console.log('Cardio logs:', cardioLogs.length);

    if (strengthLogs.length > 0) {
      // Process strength logs
      if (metric === 'weight') {
        // For weight metric, get the maximum weight used in any set
        processedData = strengthLogs.map(log => {
          const logData = log.log_data as any;
          const maxWeight = Math.max(...(logData.sets || []).map((set: any) => set.weight || 0));
          return {
            date: parseISO(log.logged_at),
            value: maxWeight
          };
        });
      } else if (metric === 'volume') {
        // For volume metric, calculate total volume (weight × reps) across all sets
        processedData = strengthLogs.map(log => {
          const logData = log.log_data as any;
          const totalVolume = (logData.sets || []).reduce((sum: number, set: any) => {
            return sum + (set.weight || 0) * (set.reps || 0);
          }, 0);
          return {
            date: parseISO(log.logged_at),
            value: totalVolume
          };
        });
      }
    } else if (durationLogs.length > 0) {
      // Process duration logs - show total duration in seconds
      processedData = durationLogs.map(log => {
        const logData = log.log_data as any;
        let totalDuration = 0;
        
        if (logData.sets && Array.isArray(logData.sets)) {
          totalDuration = logData.sets.reduce((sum: number, set: any) => {
            return sum + (set.duration || 0);
          }, 0);
        } else if (logData.duration) {
          totalDuration = logData.duration;
        }
        
        return {
          date: parseISO(log.logged_at),
          value: totalDuration
        };
      });
      
      // Set metric to 'duration' for proper labeling
      setMetric('duration');
    } else if (cardioLogs.length > 0) {
      // Process cardio logs - show distance or duration based on available data
      processedData = cardioLogs.map(log => {
        const logData = log.log_data as any;
        
        // Prefer distance if available, otherwise use duration
        if (logData.distance) {
          if (metric !== 'distance') setMetric('distance');
          return {
            date: parseISO(log.logged_at),
            value: logData.distance
          };
        } else {
          if (metric !== 'duration') setMetric('duration');
          return {
            date: parseISO(log.logged_at),
            value: logData.duration || 0
          };
        }
      });
    }

    // Sort by date
    processedData.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Format for chart
    const labels = processedData.map(item => format(item.date, mini ? 'MM/dd' : 'MM/dd/yy'));
    const values = processedData.map(item => item.value);
    
    console.log('Processed data points:', processedData.length);
    console.log('Chart labels:', labels);
    console.log('Chart values:', values);

    // Ensure we have at least one data point
    if (values.length === 0) {
      console.log('No values after processing, using default data');
      setChartData({
        labels: ['No Data'],
        datasets: [{ data: [0] }]
      });
      return;
    }

    setChartData({
      labels,
      datasets: [{ data: values }]
    });
  };

  const toggleMetric = () => {
    setMetric(metric === 'weight' ? 'volume' : 'weight');
  };

  const selectTimeRange = (range: TimeRange) => {
    setTimeRange(range);
  };

  // If there's no data to display
  if (!isLoading && (chartData.labels.length === 0 || chartData.datasets[0].data.length === 0 || 
      (chartData.datasets[0].data.length === 1 && chartData.datasets[0].data[0] === 0 && chartData.labels[0] === 'No Data'))) {
    // Create a dummy chart with zero data to ensure the component renders
    const dummyData = {
      labels: ['No Data'],
      datasets: [{ data: [0] }]
    };
    
    if (mini) {
      return (
        <View style={styles.miniContainer}>
          <Text style={styles.miniText}>No data yet</Text>
        </View>
      );
    }
    
    return (
      <Card containerStyle={styles.darkCard}>
        <Card.Title style={styles.cardTitle}>Progress Chart: {exerciseName}</Card.Title>
        <Text style={styles.noDataText}>No progress data available yet.</Text>
        <Text style={styles.noDataSubtext}>Complete a workout to see your progress!</Text>
        
        <LineChart
          data={dummyData}
          width={Dimensions.get('window').width - 60}
          height={220}
          chartConfig={{
            backgroundColor: '#222',
            backgroundGradientFrom: '#222',
            backgroundGradientTo: '#222',
            decimalPlaces: 0,
            color: (opacity = 0.2) => `rgba(231, 76, 60, ${opacity})`,
            labelColor: (opacity = 0.5) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '0',
              strokeWidth: '0',
            },
          }}
          bezier
          style={styles.chart}
          withDots={false}
          withShadow={false}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={false}
          withVerticalLabels={false}
          withHorizontalLabels={false}
        />
      </Card>
    );
  }

  // Mini chart version (simplified for display in exercise list)
  if (mini) {
    return (
      <View style={styles.miniContainer}>
        {isLoading ? (
          <Text style={styles.miniText}>Loading...</Text>
        ) : chartData.datasets[0].data.every((val: number) => val === 0) ? (
          <Text style={styles.miniText}>No data yet</Text>
        ) : (
          <>
            <Text style={styles.miniTitle}>Progress</Text>
            <LineChart
              data={chartData}
              width={120}
              height={80}
              chartConfig={{
                backgroundColor: '#222',
                backgroundGradientFrom: '#222',
                backgroundGradientTo: '#222',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '3',
                  strokeWidth: '1',
                  stroke: '#e74c3c',
                },
              }}
              bezier
              style={styles.miniChart}
              withDots={chartData.datasets[0].data.length > 1}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={false}
              withVerticalLabels={false}
              withHorizontalLabels={false}
            />
          </>
        )}
      </View>
    );
  }

  // Full chart version
  return (
    <>
      <Card containerStyle={styles.darkCard}>
        <Card.Title style={styles.cardTitle}>Progress Chart: {exerciseName}</Card.Title>
        
        <View style={styles.metricSelector}>
          <TouchableOpacity
            style={[styles.metricButton, metric === 'weight' ? styles.metricButtonActive : {}]}
            onPress={() => setMetric('weight')}
          >
            <Text style={[styles.metricButtonText, metric === 'weight' ? styles.metricButtonTextActive : {}]}>
              Weight
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.metricButton, metric === 'volume' ? styles.metricButtonActive : {}]}
            onPress={() => setMetric('volume')}
          >
            <Text style={[styles.metricButtonText, metric === 'volume' ? styles.metricButtonTextActive : {}]}>
              Volume
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.timeRangeSelector}>
          {(['1w', '1m', '3m', '6m', '1y'] as TimeRange[]).map((range) => (
            <TouchableOpacity
              key={range}
              style={[styles.timeButton, timeRange === range ? styles.timeButtonActive : {}]}
              onPress={() => selectTimeRange(range)}
            >
              <Text style={[styles.timeButtonText, timeRange === range ? styles.timeButtonTextActive : {}]}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={{ color: 'white' }}>Loading chart data...</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <LineChart
                data={chartData}
                width={Math.max(Dimensions.get('window').width - 60, chartData.labels.length * 50)}
                height={220}
                chartConfig={{
                  backgroundColor: '#222',
                  backgroundGradientFrom: '#222',
                  backgroundGradientTo: '#222',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '5',
                    strokeWidth: '2',
                    stroke: '#e74c3c',
                  },
                }}
                bezier
                style={styles.chart}
                yAxisLabel={metric === 'weight' ? '' : ''}
                yAxisSuffix={metric === 'weight' ? ' lbs' : ''}
              />
            </ScrollView>
          </TouchableOpacity>
        )}
        
        <Text style={styles.metricLabel}>
          {metric === 'weight' ? 'Maximum Weight (lbs)' : 
           metric === 'volume' ? 'Total Volume (weight × reps)' :
           metric === 'duration' ? 'Duration (seconds)' :
           metric === 'distance' ? 'Distance (km)' : ''}
        </Text>
      </Card>
      
      {/* Full-screen chart modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Progress Chart: {exerciseName}</Text>
            
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 40}
              height={300}
              chartConfig={{
                backgroundColor: '#222',
                backgroundGradientFrom: '#222',
                backgroundGradientTo: '#222',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#e74c3c',
                },
              }}
              bezier
              style={styles.modalChart}
              yAxisLabel={metric === 'weight' ? '' : ''}
              yAxisSuffix={metric === 'weight' ? ' lbs' : ''}
            />
            
            <Text style={styles.metricLabel}>
              {metric === 'weight' ? 'Maximum Weight (lbs)' : 
              metric === 'volume' ? 'Total Volume (weight × reps)' :
              metric === 'duration' ? 'Duration (seconds)' :
              metric === 'distance' ? 'Distance (km)' : ''}
            </Text>
            
            <Button
              title="Close"
              onPress={() => setModalVisible(false)}
              buttonStyle={styles.closeButton}
              containerStyle={styles.closeButtonContainer}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalChart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonContainer: {
    width: 150,
  },
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
  },
  miniTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ccc',
    marginBottom: 5,
  },
  miniChart: {
    borderRadius: 8,
  },
  miniText: {
    fontSize: 10,
    color: '#ccc',
    textAlign: 'center',
  },
});
