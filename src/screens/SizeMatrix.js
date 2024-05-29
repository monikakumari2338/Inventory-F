import React from 'react';

import {
  FontSize,
  Color,
  FontFamily,
  Border,
} from '../components/GlobalStyles.js';
import {StyleSheet, View, SafeAreaView, ScrollView, Text} from 'react-native';
import COLORS from '../../constants/colors';
import PressableGrid from './Grid';
import Header from '../components/Header';
import Footer1 from '../components/Footer1.js';
import TextRow from '../components/TextRow.js';
import MatrixRow from '../components/MatrixRow.js';
import Heading from '../components/Heading.js';

const SizeMatrix = () => {
  const texts = ['Midnight black', 'Pink', 'Red'];
  const coltexts = ['128', '256', '512'];
  const Head = ['Size Color Matrix'];
  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <Header showBackButton={true} />
      <ScrollView
        contentContainerStyle={{paddingVertical: 130, marginTop: -100}}>
        <Text style={styles.productname}>Doir</Text>
        <View style={styles.appContainer}>
          <PressableGrid />
          <TextRow texts={texts} />
          <MatrixRow coltexts={coltexts} />
          <Heading Head={Head} />
        </View>
      </ScrollView>
      <Footer1 />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',
  },
  productname: {
    top: 15,
    left: 102,
    width: 220,
    height: 35,
    fontSize: 18,
    textAlign: 'center',
    color: COLORS.black,
    FontFamily: FontFamily.openSansRegular,
  },
});

export default SizeMatrix;
