import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from './colors';

const SideMenu = ({isOpen, closeMenu, items, onItemClick}) => {
  const [pressedItem, setPressedItem] = useState(null);

  const menuIcons = {
    Dashboard: 'grid-outline',
    StockCheck: 'barcode-outline',
    'PO Recieve': 'cart-outline',
    'Transfer Recieve': 'archive-outline',
    'DSD Recieve': 'bus-outline',
    'Return to Vendor': 'swap-vertical-outline',
    'View DSD': 'enter-outline',
    'View Vendor Return': 'today-outline',
    'Inventory Adjustment': 'build-outline',
    'Stock Count': 'file-tray-stacked-outline',
    'View Inventory Adjusment': 'layers-outline',
  };

  const menuAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.timing(menuAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false, // Make sure to set useNativeDriver to false for translateY
      }).start();
    } else {
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [isOpen]);

  const menuTranslateX = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-250, 0],
  });

  return (
    <Animated.View
      style={[styles.sideMenu, {transform: [{translateX: menuTranslateX}]}]}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={styles.scrollcontent}
        indicatorStyle="blue">
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Store Inventory Management</Text>
        </View>
        <View style={styles.menuItems}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                {
                  backgroundColor: index === pressedItem ? '#e0e0e0' : 'white',
                  borderColor: 'white',

                  elevation: index === pressedItem ? 5 : 1,
                },
              ]}
              onPress={() => onItemClick(item)}
              onPressIn={() => setPressedItem(index)}
              onPressOut={() => setPressedItem(null)}>
              <Ionicons
                name={menuIcons[item]}
                size={24}
                color={index === pressedItem ? 'grey' : 'black'}
              />
              <Text style={styles.menuItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  scrollcontent: {
    flexGrow: 1,
  },
  sideMenu: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: 250,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
  },
  menuHeader: {
    backgroundColor: COLORS.primary,
    padding: 30,
    marginTop:14,
    alignItems: 'center',
  },
  menuTitle: {
    color: 'white',
    fontSize: 18,
    paddingTop:14
  },
  menuItems: {
    marginTop: 5,
  },
  menuItem: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default SideMenu;
