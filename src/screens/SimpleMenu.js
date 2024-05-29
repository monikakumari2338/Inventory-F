import React, {useState} from 'react';

import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import {FontSize} from './GlobalStyles';
import {Navigate} from 'react-router-dom';

const SimpleMenu = n => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);

  const options = ['Buddy Store', 'Item Details', 'Inventory Bucket'];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = option => {
    setSelectedOption(option);

    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={toggleDropdown}>
        <Icon name="ellipsis-vertical" style={styles.icopos}>
          {selectedOption}
        </Icon>
      </TouchableWithoutFeedback>

      <Modal visible={isOpen} transparent={true} animationType="fade">
        {options.map((option, index) => (
          <TouchableWithoutFeedback key={index} onPress={setIsOpen}>
            <View style={styles.optionItem}>
              <Text style={{color: 'black', fontSize: 15}}>{option}</Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  icopos: {
    color: COLORS.black,
    fontSize: 32,
  },
  container: {
    flex: 1,
    width: 160,
    top: -75,
    left: 370,
    height: 120,
  },
  iconborder: {
    top: 199,
    left: 165,
  },
  dropdownButton: {
    borderWidth: 1,

    borderColor: COLORS.greylight,

    padding: 17,
    paddingVertical: 10,
    left: 35,

    borderRadius: 4,
  },

  modalContainer: {
    top: 400,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  optionItem: {
    color: COLORS.black,
    borderColor: 'grey',
    width: 150,
    padding: 10,
    textAlign: 'center',
    borderRadius: 1,

    borderColor: 'black',
    top: 130,
    left: 250,
    marginVertical: -1,

    backgroundColor: '#F2F2F2',
  },
});

export default SimpleMenu;
