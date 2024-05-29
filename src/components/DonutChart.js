import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';

const DonutChart = ({percentage, text}) => {
  const diameter = Dimensions.get('window').width * 0.5;
  const radius = diameter / 2;
  const strokeWidth = 30;
  const circumference = Math.PI * diameter;
  const progress = (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={diameter} height={diameter} style={styles.chart}>
        <G rotation="-90" origin={`${radius}, ${radius}`}>
          {/* Background Circle */}
          <Circle
            cx="50%"
            cy="50%"
            r={radius - strokeWidth / 2}
            fill="transparent"
            stroke="#13AAB3"
            strokeWidth={strokeWidth}
          />
          {/* Blue Circle */}
          <Circle
            cx="50%"
            cy="50%"
            r={radius - strokeWidth / 2}
            fill="transparent"
            stroke="#50B3E4"
            strokeWidth={strokeWidth}
            strokeDasharray={`${progress}, ${circumference}`}
          />
        </G>
      </Svg>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 89,
    paddingVertical: 33,
    margintop: 20,
    elevation: 8,
    borderColor: 'black',
  },
  chart: {
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
});

export default DonutChart;
