import React, { useState, useEffect } from 'react';
import { View, ScrollView, Platform, Text as RNText, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text } from '@rneui/themed';
import widget_style from '@/styles/health-widget_style';
import AppleHealthKit, { HealthKitPermissions, HealthInputOptions, HealthUnit, HealthValue } from 'react-native-health';


// Define types for health data
interface HealthData {
  steps: number;
  heartRate: number;
  sleepHours: number;
  stepsHistory: { date: string; steps: number }[];
  heartRateHistory: { date: string; value: number }[];
  sleepHistory: { date: string; hours: number }[];
  isUsingMockData: boolean;
  isLoading: boolean;
  error: string | null;
}

export default function HealthWidgets() {
  const [healthData, setHealthData] = useState<HealthData>({
    isUsingMockData: true,
    isLoading: false,
    error: null,
    steps: 0,
    heartRate: 0,
    sleepHours: 0,
    stepsHistory: [{date: 'Day 1', steps: 2000}, {date: 'Day 2', steps: 4000}, {date: 'Day 3', steps: 3000}],
    heartRateHistory: [{date: 'Day 1', value: 65}, {date: 'Day 2', value: 72}, {date: 'Day 3', value: 68}],
    sleepHistory: [{date: 'Day 1', hours: 6}, {date: 'Day 2', hours: 7.5}, {date: 'Day 3', hours: 8}],
  });
  const [hasPermissions, setHasPermission] = useState(false);

  // useEffect(() => {
  //   initializeHealthKit();
  // }, []);
  
  const initializeHealthKit = () => {
    console.log('Initializing HealthKit...');
    console.log('Platform:', Platform.OS);
    if (Platform.OS === 'ios' && AppleHealthKit) {
      setHealthData(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { Permissions } = AppleHealthKit.Constants;

      const permissions: HealthKitPermissions = {
        permissions: {
          read: [
            Permissions.Steps,
            Permissions.HeartRate,
            Permissions.SleepAnalysis
          ],
          write: [],
        },
      };
      console.log('Requesting permissions:', permissions);
      
      AppleHealthKit.initHealthKit(permissions, (error: string) => {
        if (error) {
          console.error('Error initializing HealthKit:', error);
          setHealthData(prev => ({ 
            ...prev, 
            isUsingMockData: true, 
            isLoading: false,
            error: 'Failed to initialize HealthKit' 
          }));
          return;
        }
        setHasPermission(true);
        fetchHealthData();
      });
    } else {
      console.log('HealthKit is not available on this platform.');
      setHealthData(prev => ({ 
        ...prev,
        isUsingMockData: true, 
        error: Platform.OS === 'ios' ? 'HealthKit module not available' : 'HealthKit is only available on iOS'
      }));
    }
  };

  const fetchHealthData = async () => {
    if (Platform.OS !== 'ios' || !AppleHealthKit) return;

    try {
      setHealthData(prev => ({ ...prev, isLoading: true, error: null }));
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Get data for the last week

      const options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        includeManuallyAdded: true,
      };

      // Fetch all health data in parallel
      await Promise.all([
        fetchStepsData(options),
        fetchHeartRateData(options),
        fetchSleepData(options)
      ]);

      setHealthData(prev => ({ ...prev, isLoading: false, isUsingMockData: false }));
    } catch (error) {
      console.error('Error fetching health data:', error);
      setHealthData(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to fetch health data', 
        isUsingMockData: true 
      }));
    }
  };

  const fetchStepsData = (options: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const stepsHistory: { date: string; steps: number }[] = [];
        const endDate = new Date(options.endDate);
        
        for (let i = 2; i >= 0; i--) {
          const date = new Date(endDate);
          date.setDate(endDate.getDate() - i);
          
          const dayStartDate = new Date(date);
          dayStartDate.setHours(0, 0, 0, 0);
          
          const dayEndDate = new Date(date);
          dayEndDate.setHours(23, 59, 59, 999);
          console.log(`Fetching steps for date: ${date.toLocaleDateString()}`);
          console.log(`Day start: ${dayStartDate.toLocaleDateString()}, Day end: ${dayEndDate.toLocaleDateString()}`);
          
          const dayOptions = {
            date: dayStartDate.toISOString(),
            includeManuallyAdded: options.includeManuallyAdded
          };
          
          const daySteps = await getStepCountForDay(dayOptions);
          
          stepsHistory.push({
            date: formatDate(date),
            steps: daySteps
          });
        }
        
        console.log('Steps history:', stepsHistory);
        
        const todaySteps = stepsHistory.length > 0 ? stepsHistory[stepsHistory.length - 1].steps : 0;
        console.log('Today steps:', todaySteps);
        
        setHealthData(prev => ({
          ...prev,
          steps: todaySteps,
          stepsHistory
        }));
        
        resolve(null);
      } catch (error) {
        console.error('Error fetching steps:', error);
        reject(error);
      }
    });
  };
  
  const getStepCountForDay = (options: any): Promise<number> => {
    return new Promise((resolve, reject) => {
      console.log(`Fetching steps for date: ${options.date}`);
      AppleHealthKit.getStepCount(options, (error: string, results: HealthValue) => {
        if (error) {
          console.error(`Error fetching steps for ${options.date}:`, error);
          reject(error);
          return;
        }
        
        if (!results || results.value === null) {
          resolve(0);
          return;
        }
        
        console.log(`Steps for ${options.date.split('T')[0]}:`, results.value);
        resolve(results.value);
      });
    });
  };

  const fetchHeartRateData = (options: any) => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getHeartRateSamples(options, (error: string, results: any[]) => {
        if (error) {
          console.error('Error fetching heart rate:', error);
          reject(error);
          return;
        }
        
        if (results.length === 0) {
          // No data available, keep using mock data for heart rate
          resolve(null);
          return;
        }

        const heartRateHistory = results
          .reduce((acc: any[], item: any) => {
            const date = formatDate(new Date(item.startDate));
            const existing = acc.find(x => x.date === date);
            if (existing) {
              existing.values.push(item.value);
            } else {
              acc.push({ date, values: [item.value] });
            }
            return acc;
          }, [])
          .map(item => ({
            date: item.date,
            value: Math.round(item.values.reduce((a: number, b: number) => a + b, 0) / item.values.length)
          }))
          .slice(-5);

        const latestHeartRate = results.length > 0 ? Math.round(results[results.length - 1].value) : 0;

        setHealthData(prev => ({
          ...prev,
          heartRate: latestHeartRate,
          heartRateHistory: heartRateHistory.length > 0 ? heartRateHistory : prev.heartRateHistory
        }));
        
        resolve(null);
      });
    });
  };

  const fetchSleepData = (options: any) => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getSleepSamples(options, (error: string, results: any[]) => {
        if (error) {
          console.error('Error fetching sleep data:', error);
          reject(error);
          return;
        }
        
        if (results.length === 0) {
          // No data available, keep using mock data for sleep
          resolve(null);
          return;
        }

        const sleepHistory = results
          .reduce((acc: any[], item: any) => {
            const date = formatDate(new Date(item.startDate));
            const start = new Date(item.startDate);
            const end = new Date(item.endDate);
            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

            const existing = acc.find(x => x.date === date);
            if (existing) {
              existing.hours += hours;
            } else {
              acc.push({ date, hours });
            }
            return acc;
          }, [])
          .map(item => ({
            date: item.date,
            hours: Number(item.hours.toFixed(1))
          }))
          .slice(-5);

        const todaySleep = sleepHistory.length > 0 ? sleepHistory[sleepHistory.length - 1].hours : 0;

        setHealthData(prev => ({
          ...prev,
          sleepHours: todaySleep,
          sleepHistory: sleepHistory.length > 0 ? sleepHistory : prev.sleepHistory
        }));
        
        resolve(null);
      });
    });
  };

  // Format dates to short form (e.g., "Mon", "Tue")
  const formatDate = (date: Date): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  // Simple chart visualization using View elements
  const renderSimpleChart = (data: any[], type: string, color: string = '#e74c3c') => {
    let maxValue = 0;
    if (type === 'steps') {
      maxValue = Math.max(...data.map(item => item.steps));
    } else if (type === 'heart rate') {
      maxValue = Math.max(...data.map(item => item.value));
    } else if (type === 'sleep') {
      maxValue = Math.max(...data.map(item => item.hours));
    } else {
      console.error('Invalid chart type:', type);
    }
    return (
      <View style={widget_style.chartContainer}>
        {data.map((item, index) => {
          const value = item.value || item.steps || item.hours || 0;
          const height = (value / maxValue) * 60;
          return (
            <View key={index} style={widget_style.chartColumn}>
              <View 
                style={[
                  widget_style.chartBar,
                  { height: `${Math.max(5, height)}%`, backgroundColor: color }
                ]} 
              />
              <RNText style={widget_style.chartLabel}>{item.date}</RNText>
            </View>
          );
        })}
      </View>
    );
  };

  const renderMockDataBanner = () => {
    if (!healthData.isUsingMockData) return null;
    
    return (
      <View style={widget_style.mockDataBanner}>
        <Text style={widget_style.mockDataText}>Using Sample Data</Text>
        <Text style={widget_style.mockDataSubtext}>
          {Platform.OS === 'ios' 
            ? 'Health permissions required' 
            : 'Health features available on iOS only'}
        </Text>
      </View>
    );
  };

  return (
    <View style={widget_style.wrapper}>
      {renderMockDataBanner()}
      
      {healthData.error && (
        <View style={widget_style.errorContainer}>
          <Text style={widget_style.errorText}>{healthData.error}</Text>
        </View>
      )}
      
      {healthData.isLoading ? (
        <View style={widget_style.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={widget_style.loadingText}>Loading health data...</Text>
        </View>
      ) : (
        <>
          <ScrollView horizontal style={widget_style.container} showsHorizontalScrollIndicator={false}>
            <View style={widget_style.widget}>
              <Text style={widget_style.title}>Steps</Text>
              <Text style={widget_style.value}>{healthData.steps.toLocaleString()}</Text>
              <View style={widget_style.chartPlaceholder}>
                {renderSimpleChart(healthData.stepsHistory, "steps", '#e74c3c')}
              </View>
            </View>

            <View style={widget_style.widget}>
              <Text style={widget_style.title}>Heart Rate</Text>
              <Text style={widget_style.value}>{healthData.heartRate} BPM</Text>
              <View style={widget_style.chartPlaceholder}>
                {renderSimpleChart(healthData.heartRateHistory, "heart rate", '#3498db')}
              </View>
            </View>

            <View style={widget_style.widget}>
              <Text style={widget_style.title}>Sleep</Text>
              <Text style={widget_style.value}>{healthData.sleepHours.toFixed(1)}h</Text>
              <View style={widget_style.chartPlaceholder}>
                {renderSimpleChart(healthData.sleepHistory, "sleep", '#9b59b6')}
              </View>
            </View>
          </ScrollView>
          
          {(healthData.isUsingMockData || healthData.error) && (
            <TouchableOpacity style={widget_style.refreshButton} onPress={() => {
              console.log('Connect to Health button clicked');
              initializeHealthKit();
            }}>
              <Text style={widget_style.refreshButtonText}>
                {healthData.isUsingMockData ? 'Connect to Health' : 'Retry'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}
