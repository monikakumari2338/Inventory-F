import React, {useState} from 'react';

import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PurchaseMenu = () => {
  const navigation = useNavigation();

  const navigateToScreen = SizeMatrix => {
    navigation.navigate(SizeMatrix);
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu}>
        <Ionicons name="ellipsis-vertical" size={28} color="black" />
      </TouchableOpacity>
      <View>
        <Modal
          visible={isMenuOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={closeMenu}>
          <TouchableOpacity style={styles.modalBackground} onPress={closeMenu}>
            <View style={styles.menu}>
              <TouchableOpacity onPress={() => navigateToScreen('PoSave')}>
                <Text style={styles.menuItem}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigateToScreen('PoConfirm')}>
                <Text style={styles.menuItem}>Receive and Confirm</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: -65,
    left: 390,

    margin: -10,
  },

  modalBackground: {
    flex: 1,

    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
  },

  menu: {
    backgroundColor: 'white',
    left: 90,
    top: 110,
    padding: 10,

    borderRadius: 5,
  },

  menuItem: {
    fontSize: 18,

    paddingVertical: 10,
  },
});

export default PurchaseMenu;
