import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const BackButton = () => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.goBack();
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <Text
      style={{color:'white',left:"-44%",top:"1%"}}>Back</Text>
    </TouchableOpacity>
  );
};
export default BackButton;
