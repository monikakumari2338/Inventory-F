import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
export default function Footer1() {
  const navigation = useNavigation();

  const navigateToScreen = SizeMatrix => {
    navigation.navigate(SizeMatrix);
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.mainFooter}>
        <TouchableOpacity
          style={styles.touchIcons}
          onPress={() => navigateToScreen('TRsearch')}>
          <Icon
            name="drive-file-move-outline"
            size={30}
            color="black"
            style={styles.icon}
          />
          <View>
            <Text style={styles.description}>Transfer</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchIcons}
          onPress={() => navigateToScreen('ItemScanner')}>
          <Icon1
            name="file-search-outline"
            size={30}
            color="black"
            style={styles.icon}
          />
          <View>
            <Text style={styles.description}>Item</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchIcons}
          onPress={() => navigateToScreen('Dashboard')}>
          <Icon name="dashboard" size={30} color="black" style={styles.icon} />
          <View>
            <Text style={styles.description}>Dashboard</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchIcons}
          onPress={() => navigateToScreen('PoLanding')}>
          <Icon
            name="add-shopping-cart"
            size={30}
            color="black"
            style={styles.icon}
          />
          <View>
            <Text style={styles.description}>PO</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchIcons}
          onPress={() => navigateToScreen('DsdSearch')}>
          <Icon name="store" size={30} color="black" style={styles.icon} />
          <View>
            <Text style={styles.description}>DSD</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'space-between',
    bottom: 0,
    left: 0,
    right: 0,
  },
  mainFooter: {
    flex: 1,
    justifyContent: 'space-between',
    //alignItems: 'center',
    
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#00338e',
  },

  icon: {
    width: 30,
    height: 30,
    color: 'white',
  },
  touchIcons: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  description: {
    color: 'white',
  },
});
