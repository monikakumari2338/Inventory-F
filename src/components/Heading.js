import React from 'react';

import {View, Text, StyleSheet} from 'react-native';

import {
  FontSize,
  Color,
  FontFamily,
  Border,
} from '../components/GlobalStyles.js';
import COLORS from '../../constants/colors.js';
import Icon from 'react-native-vector-icons/Ionicons';

const Heading = ({Head}) => {
  return (
    <View style={styles.row1}>
      <Icon name="menu" size={45} color="black" />
      {Head.map((text, index) => (
        <Text key={index} style={styles.text}>
          {text}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row1: {
    bottom: 675,
    right: 95,
    marginTop: 10,
  },

  text: {
    top: -45,
    left: 50,
    fontSize: 30,
    color: COLORS.black,
    FontFamily: FontFamily.openSansRegular,
  },
});

export default Heading;
