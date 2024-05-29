import React from 'react';
import {View} from 'react-native';
import {BarChart} from 'react-native-chart-kit';

const BarChartCard = () => {
  // Dummy data for the bar chart
  const barChartData = {
    labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
    datasets: [
      {
        data: [20, 45, 28, 35], // In-store stocks
      },
      {
        data: [10, 20, 15, 25], // In-transit stocks
      },
    ],
  };

  // Bar chart configuration
  const barChartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
  };

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <BarChart
        data={barChartData}
        width={300}
        height={200}
        yAxisLabel="Stocks"
        chartConfig={barChartConfig}
        verticalLabelRotation={30}
      />
    </View>
  );
};

export default BarChartCard;
