import {Text, TouchableHighlight, StyleSheet, Vibration} from 'react-native';
import React, {useState} from 'react';
import COLORS from '../../constants/colors';
import {red100} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import {View} from 'react-native';

const Button3 = props => {
  const filledBgColor = props.color || COLORS.primary;
  const outlinedColor = COLORS.white;
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const bgColor = isPressed
    ? '#ADD8E6'
    : props.filled
    ? filledBgColor
    : outlinedColor;
  const textColor = isPressed
    ? props.filled
      ? COLORS.primary
      : COLORS.white
    : props.filled
    ? COLORS.white
    : COLORS.primary;
  const borderColor = isPressed
    ? props.filled
      ? COLORS.primary
      : COLORS.red
    : COLORS.primary;

  return (
    <TouchableHighlight
      style={{
        ...styles.button,
        ...{backgroundColor: bgColor, borderColor: borderColor},
        ...props.style,
      }}
      onPress={props.onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      underlayColor="#B6CBFF" // Set the color when the button is pressed
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: '500',
          textAlign: 'center',
          top: 6,
          color: textColor,
        }}>
        {props.title}
      </Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingBottom: 16,
    paddingVertical: -5,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 12,
    left: 100,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: 170,
  },
});

export default Button3;
