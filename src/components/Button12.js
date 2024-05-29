import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import COLORS from '../../constants/colors';

const Button12 = ({title, onPress = () => {}}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        paddingBottom: 13,
        paddingVertical: 9,
        paddingLeft: 2,
        marginTop: 360,
        borderWidth: 1,
        borderRadius: 28,
        alignItems: 'center',
        width: 80,
        backgroundColor: COLORS.primary,
      }}>
      <Text style={{color: COLORS.white, fontSize: 20}}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button12;
