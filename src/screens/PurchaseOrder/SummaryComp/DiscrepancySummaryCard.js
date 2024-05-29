import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
// import {useAdjustmentDetail} from '../../../context/DataContext';

export default function DiscrepancySummaryCard({item, type}) {
  console.log('type: ', type);
  const info = [
    {
      title: 'Name',
      text: item.itemName,
    },
    {
      title: 'SKU',
      text: item.sku,
    },
    {
      title: 'PO Number',
      text: String(item.poNumber),
    },

    {
      title: 'Discrepancy Quantity',
      text: item.damageQty,
    },
    {
      title: 'Proof',
      text: item.damageImage,
    },
  ];

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        {/* <Text style={styles.serialNumber}>{serialNumber}</Text> */}
        <Text style={styles.cardHeaderTitle}>{item.id}</Text>
      </View>

      {info.map((item, index) => (
        <View key={index} style={styles.cardContent}>
          {item.title === 'PO Number' && type === 'PO' ? null : (
            <>
              <Text style={styles.cardContentTitle}>{item.title}</Text>
              <Text style={styles.cardContentText}>{item.text}</Text>
            </>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'silver',
    marginTop: 10,
    marginHorizontal: 10,
    padding: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -30,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
  },
  serialNumber: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: 'dodgerblue',
  },
  cardContent: {
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContentTitle: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
  },
  cardContentText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
  },
});
