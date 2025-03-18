import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import chart_styles from '@/styles/progress-chart_style';

interface ChartRendererProps {
  chartData: {
    labels: string[];
    datasets: { data: number[] }[];
  };
  metric: 'weight' | 'volume' | 'duration' | 'distance';
  height?: number;
  width?: number;
  isMini?: boolean;
}

export default function ChartRenderer({
  chartData,
  metric,
  height = 220,
  width = Dimensions.get('window').width - 50,
  isMini = false
}: ChartRendererProps) {
  // Determine the appropriate style based on the context
  const chartStyle = isMini 
    ? chart_styles.miniChart 
    : chart_styles.chart;

  // Adjust padding based on context
  const paddingLeft = isMini ? 60 : 80;
  const paddingRight = isMini ? 10 : 20;
  
  // Adjust dot size based on context
  const dotRadius = isMini ? '3' : '5';
  const strokeWidth = isMini ? '1' : '2';
  
  return (
    <LineChart
      data={chartData}
      width={width}
      height={height}
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
          r: dotRadius,
          strokeWidth: strokeWidth,
          stroke: '#e74c3c',
        },
        propsForBackgroundLines: {
          strokeWidth: 1,
          strokeDasharray: isMini ? '3, 3' : '5, 5',
          stroke: isMini ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
        },
        propsForLabels: {
          fontSize: 10,
          fontWeight: 'bold',
        },
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        formatYLabel: (value) => Math.round(Number(value)).toString(),
        formatXLabel: (value) => value,
        horizontalLabelRotation: 0,
        verticalLabelRotation: 0,
      }}
      bezier
      style={chartStyle}
      yAxisLabel={metric === 'weight' ? '' : ''}
      yAxisSuffix={metric === 'weight' ? ' lbs' : ''}
      withHorizontalLines={!isMini}
      withVerticalLines={!isMini}
      withInnerLines={!isMini}
      withOuterLines={isMini || !isMini}
      withVerticalLabels={!isMini}
      withHorizontalLabels={!isMini}
      withDots={isMini ? chartData.datasets[0].data.length > 1 : true}
      fromZero={true}
      segments={isMini ? undefined : 5}
    />
  );
}