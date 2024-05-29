import React from 'react';

import {View, Text, StyleSheet} from 'react-native';

// import {BarChart} from 'react-native-chart-kit';
import {BarChart} from 'react-native-chart-kit';

import {Dimensions} from 'react-native';

const SalesCard = ({salesData}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Last 7 Days Sales</Text>

      <BarChart
        data={{
          labels: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
          ],

          datasets: [
            {
              data: salesData,
            },
          ],
        }}
        width={Dimensions.get('window').width - 80}
        height={200}
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: '#FFFFFF',

          backgroundGradientTo: '#FFFFFF',

          decimalPlaces: 2,

          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

          style: {
            borderRadius: 10,
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',

    borderRadius: 8,

    padding: 20,

    margin: 20,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,

      height: 4,
    },

    shadowOpacity: 0.3,

    shadowRadius: 4.65,

    elevation: 8,
  },

  cardTitle: {
    fontSize: 18,

    fontWeight: 'bold',

    marginBottom: 10,
  },
});

export default SalesCard;
