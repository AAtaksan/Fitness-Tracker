import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/ui/Card';

interface BarChartProps {
  data: Array<{ x: string; y: number }>;
  title: string;
  yAxisLabel?: string;
  color?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title, 
  yAxisLabel = '', 
  color 
}) => {
  const { theme, isDark } = useTheme();
  const chartColor = color || theme.colors.primary[500];
  const width = Dimensions.get('window').width - 48; // Adjust based on container padding

  return (
    <Card style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.neutral[isDark ? 200 : 800] }]}>
        {title}
      </Text>
      
      <View style={styles.chartContainer}>
        <VictoryChart
          width={width}
          height={220}
          domainPadding={{ x: 20 }}
          padding={{ top: 10, bottom: 40, left: 50, right: 20 }}
          theme={VictoryTheme.material}
        >
          <VictoryAxis
            tickFormat={(t) => t}
            style={{
              axis: { stroke: theme.colors.neutral[isDark ? 500 : 400] },
              ticks: { stroke: theme.colors.neutral[isDark ? 500 : 400], size: 5 },
              tickLabels: { 
                fill: theme.colors.neutral[isDark ? 400 : 600],
                fontSize: 10
              }
            }}
          />
          
          <VictoryAxis
            dependentAxis
            label={yAxisLabel}
            style={{
              axis: { stroke: theme.colors.neutral[isDark ? 500 : 400] },
              axisLabel: { 
                padding: 35,
                fill: theme.colors.neutral[isDark ? 400 : 600],
                fontSize: 12
              },
              grid: { 
                stroke: ({ tick }) => 
                  tick === 0 ? 'transparent' : theme.colors.neutral[isDark ? 700 : 200]
              },
              ticks: { stroke: theme.colors.neutral[isDark ? 500 : 400], size: 5 },
              tickLabels: { 
                fill: theme.colors.neutral[isDark ? 400 : 600],
                fontSize: 10
              }
            }}
          />
          
          <VictoryBar
            data={data}
            style={{
              data: { 
                fill: chartColor,
                width: 20
              }
            }}
            cornerRadius={{ top: 4 }}
            animate={{
              duration: 500,
              onLoad: { duration: 500 }
            }}
          />
        </VictoryChart>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  }
});