import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import COLORS from '../../constants/colors';
const Button1 = ({title, onPress = () => {}}) => {
  return (
    <TouchableOpacity
       onPress={onPress}
      activeOpacity={0.7}
      style={{
        paddingBottom:13,
        paddingVertical: 7,
       marginTop:25,
        borderWidth: 2,
        left:45,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        backgroundColor:COLORS.primary,
      }}>
      <Text style={{ color: COLORS.white, fontSize: 23,}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button1;
