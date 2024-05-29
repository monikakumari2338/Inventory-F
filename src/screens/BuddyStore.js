import {Pressable, TouchableOpacity, Image} from 'react-native';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';

import {
  FontSize,
  Color,
  FontFamily,
  Border,
} from '../components/GlobalStyles.js';
import Header from '../components/Header.js';
import Footer1 from '../components/Footer1.js';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors.js';

import Button1 from '../components/Button1';

const BuddyStore = ({navigation}) => {
  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <Header showBackButton={true} />
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 90,
          marginTop: -90,
          paddingBottom: 20,
        }}>
        <View style={[styles.iphone14ProMax1]}>
          <View style={{top: 1}}>
            <Icon name="menu" size={45} color="black" />
            <Text
              style={{
                top: -45,
                left: 50,
                fontSize: 30,
                color: COLORS.black,
                FontFamily: FontFamily.openSansRegular,
              }}>
              Buddy Store Stock
            </Text>
          </View>

          <Text style={styles.productname}>IPhone 13 - HIP646353</Text>
        </View>
      </ScrollView>

      <Footer1 />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  productname: {
    top: -18,
    left: 102,
    width: 220,
    height: 35,
    fontSize: 20,
    textAlign: 'center',
    color: COLORS.black,
  },
  iphone14ProMax1: {
    flex: 1,
    height: 700,
    width: '100%',
    backgroundColor: Color.white,
  },
});

export default BuddyStore;
