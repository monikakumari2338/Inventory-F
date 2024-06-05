import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import DonutChart from '../components/DonutChart';
import {BearerToken} from '../BearerTokenContext/TokenContext';
import {IP} from '../IpAddress/CommonIP';
const Demo = () => {
  const [inventoryData, setInventoryData] = useState({
    inStore: 0,
    inTransit: 0,
  });
  const {token} = BearerToken();
  useEffect(() => {
    // Replace with your actual API endpoint
    const apiUrl = IP + '/product/dashboard/storeandtransit/getinventory';

    // Fetch data from the API
    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setInventoryData(data);
      })
      .catch(error => console.log('Error fetching data:', error));
  }, []);

  // Calculate the percentage for inStore and inTransit
  const inStorePercentage =
    (inventoryData.inStore /
      (inventoryData.inStore + inventoryData.inTransit)) *
    100;
  const inTransitPercentage =
    (inventoryData.inTransit /
      (inventoryData.inStore + inventoryData.inTransit)) *
    100;
  const total = inventoryData.inStore + inventoryData.inTransit;

  return (
    <View style={styles.container}>
      <DonutChart
        percentage={inTransitPercentage}
        // text={`${inStorePercentage.toFixed(2)}% In Store`}
      />
      <Text style={{top: -292, left: -100, fontSize: 20, marginBottom: -30}}>
        Inventory in Hand
      </Text>

      <Text style={styles.textdonut1}>{`${inventoryData.inStore}`}</Text>
      <Text style={{top: -210, fontSize: 18}}> In Store</Text>
      <Text style={{top: -220, fontSize: 18}}>_______________</Text>
      <Text style={styles.textdonut2}>{`${inventoryData.inTransit}`}</Text>
      <Text style={{top: -220, fontSize: 18}}>In Transit</Text>

      <View
        style={{
          width: 16,
          height: 16,
          backgroundColor: '#13AAB3',
          marginRight: 185,
          borderRadius: 8,
          top: -155,
        }}
      />
      <Text
        style={{
          color: 'black',
          fontSize: 16,
          marginRight: 95,
          top: -175,
          fontWeight: 'bold',
        }}>
        In Transit
      </Text>
      <View
        style={{
          width: 16,
          height: 16,
          backgroundColor: '#50B3E4',
          marginLeft: 105,
          borderRadius: 8,
          top: -193,
        }}
      />
      <Text
        style={{
          color: 'black',
          fontSize: 16,
          fontWeight: 'bold',
          marginLeft: 190,
          top: -213,
        }}>
        In Store
      </Text>
      <Text
        style={{
          color: 'black',
          fontSize: 16,

          marginLeft: 215,
          top: -258,
        }}>
        Total Items {`${total}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 25,
  },
  textdonut1: {
    top: -215,
    fontWeight: 'bold',
    fontSize: 18,
  },
  textdonut2: {
    top: -220,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Demo;
