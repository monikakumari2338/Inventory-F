import React from 'react';
import {View, Text} from 'react-native';
import {PieChart} from 'react-native-chart-kit';

const DoughnutChartCard = () => {
  const staticData = {
    inStore: 1660,
    inTransit: 953,
  };

  const chartData = [
    {
      name: 'In Store',
      population: staticData.inStore || 0,
      color: '#FF6347',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'In Transit',
      population: staticData.inTransit || 0,
      color: '#87CEEB',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return (
    <View>
      <PieChart
        data={chartData}
        width={200}
        height={200}
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="45"
        absolute
        hasLegend={false} // Disable legend
        propsForDots={{r: '-20%'}} // Set the radius of the center circle to create a hole
      />
      {chartData.map(dataPoint => (
        <View key={dataPoint.name}>
          <Text>{`${dataPoint.name}: ${dataPoint.population}`}</Text>
        </View>
      ))}
    </View>
  );
};

export default DoughnutChartCard;
