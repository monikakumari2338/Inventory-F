import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { BrowserRouter as Router,Route,Link } from 'react-router-dom';
import {phoneverify} from '../screens/Phoneverify';

const Input = ({
  label,
  iconName,
  error,
  password,
  verify,
  onFocus = () => {},
  ...props
}) => {
  const [hidePassword, setHidePassword] = React.useState(password);
  const [isFocused, setIsFocused] = React.useState(false);

  
  return (
    <View style={{marginBottom: 20}}>
      <Text style={style.label}>{label}</Text>
      <View
        style={[
          style.inputContainer,
          {
            borderColor: error
            
              ? COLORS.red
              : isFocused
              ? COLORS.black
              : COLORS.white,
            alignItems: 'center',
            borderBlockEndColor:COLORS.black
          },
        ]}>
        <Icon
          name={iconName}
          style={{color: COLORS.darkBlue, fontSize: 22, marginRight: 10}}
        />
        <TextInput
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          style={{color: COLORS.black, flex: 1}}
          {...props}
        />
        {password && (
          <Icon
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? 'eye' : 'eye-off'}
            style={{color: COLORS.darkBlue, fontSize: 22}}
          />
          
          
        )}
        



      </View>
      {error && (
        <Text style={{marginTop: 7, color: COLORS.red, fontSize: 12}}>
          {error}
        </Text>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  label: {
    marginVertical: 2,
    
    fontSize: 14,
    marginBottom:1,
    color: COLORS.black,
  },
  inputContainer: {
    height: 50,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    paddingHorizontal:1,
    borderWidth: 0.5,
    
    
    
  },
});

export default Input;
