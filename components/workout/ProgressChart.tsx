import React, { useState, useEffect } from 'react';
import { View, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Card, Button } from '@rneui/themed';
import { supabase } from '@/lib/supabase/supabase';
import { format, subDays, subMonths, parseISO } from 'date-fns';
import chart_styles from '@/styles/progress-chart_style';
import ChartRenderer from './ChartRenderer';

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
      // Fetch exercise logs for the selected period
      
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
      
      // Check if logs exist for this exercise
      
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
      
      // Process the fetched logs
      
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
    // Process chart data from logs
    
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
    
    // Process different types of logs

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
    
    // Format data for chart display

    // Ensure we have at least one data point
    if (values.length === 0) {
      // Use default data if no values are available
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
        <View style={chart_styles.miniContainer}>
          <Text style={chart_styles.miniText}>No data yet</Text>
        </View>
      );
    }
    
    return (
      <Card containerStyle={chart_styles.darkCard}>
        <Card.Title style={chart_styles.cardTitle}>Progress Chart: {exerciseName}</Card.Title>
        <Text style={chart_styles.noDataText}>No progress data available yet.</Text>
        <Text style={chart_styles.noDataSubtext}>Complete a workout to see your progress!</Text>
        
        <ChartRenderer
          chartData={dummyData}
          metric={metric}
          width={Dimensions.get('window').width - 40}
          height={220}
        />
      </Card>
    );
  }

  // Mini chart version (simplified for display in exercise list)
  if (mini) {
    return (
      <View style={chart_styles.miniContainer}>
        {isLoading ? (
          <Text style={chart_styles.miniText}>Loading...</Text>
        ) : chartData.datasets[0].data.every((val: number) => val === 0) ? (
          <Text style={chart_styles.miniText}>No data yet</Text>
        ) : (
          <>
            <Text style={chart_styles.miniTitle}>Progress</Text>
            <ChartRenderer
              chartData={chartData}
              metric={metric}
              width={Dimensions.get('window').width - 60}
              height={70}
              isMini={true}
            />
          </>
        )}
      </View>
    );
  }

  // Full chart version
  return (
    <>
      <Card containerStyle={chart_styles.darkCard}>
        <Card.Title style={chart_styles.cardTitle}>Progress Chart: {exerciseName}</Card.Title>
        
        <View style={chart_styles.metricSelector}>
          <TouchableOpacity
            style={[chart_styles.metricButton, metric === 'weight' ? chart_styles.metricButtonActive : {}]}
            onPress={() => setMetric('weight')}
          >
            <Text style={[chart_styles.metricButtonText, metric === 'weight' ? chart_styles.metricButtonTextActive : {}]}>
              Weight
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[chart_styles.metricButton, metric === 'volume' ? chart_styles.metricButtonActive : {}]}
            onPress={() => setMetric('volume')}
          >
            <Text style={[chart_styles.metricButtonText, metric === 'volume' ? chart_styles.metricButtonTextActive : {}]}>
              Volume
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={chart_styles.timeRangeSelector}>
          {(['1w', '1m', '3m', '6m', '1y'] as TimeRange[]).map((range) => (
            <TouchableOpacity
              key={range}
              style={[chart_styles.timeButton, timeRange === range ? chart_styles.timeButtonActive : {}]}
              onPress={() => selectTimeRange(range)}
            >
              <Text style={[chart_styles.timeButtonText, timeRange === range ? chart_styles.timeButtonTextActive : {}]}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {isLoading ? (
          <View style={chart_styles.loadingContainer}>
            <Text style={{ color: 'white' }}>Loading chart data...</Text>
          </View>
        ) : (
          <View style={{ width: '100%', alignItems: 'center' }}>
            <ChartRenderer
              chartData={chartData}
              metric={metric}
              width={Dimensions.get('window').width - 50}
              height={220}
            />
          </View>
        )}
        
        <Text style={chart_styles.metricLabel}>
          {metric === 'weight' ? 'Maximum Weight (lbs)' : 
           metric === 'volume' ? 'Total Volume (weight × reps)' :
           metric === 'duration' ? 'Duration (seconds)' :
           metric === 'distance' ? 'Distance (km)' : ''}
        </Text>
      </Card>
    </>
  );
}
