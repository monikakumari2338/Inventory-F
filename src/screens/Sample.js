import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  View,
  Text,
  TextInput,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Footer1 from '../components/Footer1.js';
import {
  FontSize,
  Color,
  FontFamily,
  Border,
} from '../components/GlobalStyles.js';
import COLORS from './colors';

import Header from '../components/Header';
import StockCheck from './StockCheck';

import {useNavigation} from '@react-navigation/native';
import SimpleMenu from './SimpleMenu';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';
import Button12 from '../components/Button12.js';
const Sample = ({route}) => {
  const {itemDetails} = route.params;

  const navigation = useNavigation();
  const navigateToScreen = SizeMatrix => {
    navigation.navigate(SizeMatrix);
  };
  return (
    <SafeAreaView style={{backgroundColor: COLORS.black, flex: 1}}>
      <Header showBackButton={true} />
      <ScrollView contentContainerStyle={{paddingTop: 1, paddingHorizontal: 1}}>
        <View style={[styles.iphone14ProMax1]}>
          <View style={{top: 1}}>
            <Icon name="menu" size={45} color="black" />
            <Text
              style={{
                top: -45,
                left: 50,
                fontSize: 30,
                color: COLORS.black,
              }}>
              Stock Check
            </Text>
          </View>

          {itemDetails && (
            <View>
              <View style={[styles.iphone14ProMax1Child, styles.childBorder1]}>
                <View style={styles.textContainer}>
                  <Text style={styles.verticalText}>Price</Text>
                  <Text style={styles.verticalText}>Size</Text>
                  <Text style={styles.verticalText}>Color</Text>
                </View>
                <View style={styles.textContainer1}>
                  <Text style={styles.verticalText1}>
                    {itemDetails.productDetailsdto[0].price}
                  </Text>
                  <Text style={styles.verticalText1}>
                    {itemDetails.productDetailsdto[0].size}
                  </Text>
                  <Text style={styles.verticalText1}>
                    {itemDetails.productDetailsdto[0].color}
                  </Text>
                </View>
              </View>
              <Image
                style={styles.productImage}
                contentFit="cover"
                source={{uri: itemDetails.productDetailsdto[0].imageData}}
              />
              <Text style={[styles.iphone13Pink, styles.iphone13FlexBox]}>
                {itemDetails.itemName}
              </Text>
              <Text style={[styles.inStock10, styles.iphone13FlexBox]}>
                In Store Stock {itemDetails.productDetailsdto[0].stock}
              </Text>
              <Text>{itemDetails.productDetailsdto[0].color}</Text>
            </View>
          )}
          {itemDetails && (
            <View style={styles.viewContainer}>
              <SelectDropdown
                data={itemDetails.productDetailsdto[0].color}
                // defaultValueByIndex={1}
                // defaultValue={'Egypt'}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                }}
                defaultButtonText={'Color'}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={styles.dropdown1BtnStyle}
                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                  return (
                    <FontAwesome
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={'#444'}
                      size={18}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown1DropdownStyle}
                rowStyle={styles.dropdown1RowStyle}
                rowTextStyle={styles.dropdown1RowTxtStyle}
              />

              <SelectDropdown
                data={itemDetails.productDetailsdto[0].size}
                // defaultValueByIndex={1}
                // defaultValue={'Egypt'}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                }}
                defaultButtonText={'Size'}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={styles.dropdown1BtnStyle}
                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                  return (
                    <FontAwesome
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={'#444'}
                      size={18}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown1DropdownStyle}
                rowStyle={styles.dropdown1RowStyle}
                rowTextStyle={styles.dropdown1RowTxtStyle}
              />
            </View>
          )}
          <Text
            style={[styles.viewAvailableStock, styles.iphone13Typo]}
            onPress={() => navigateToScreen('StoreData')}>
            View Buddy Store Stock
          </Text>

          {/* <Button12
            style={[styles.scan]}
            title="Scan"
            onPress={() => navigation.navigate('ItemScanner')}
          /> */}
        </View>
      </ScrollView>
      <Footer1 />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scan: {
    borderColor: 'black',
  },
  viewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    bottom: -260,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '10%',
    paddingBottom: '20%',
  },
  dropdown1BtnStyle: {
    width: '40%',
    height: 50,
    backgroundColor: '#FFF',
    borderBottomWidth: 1.5,
    borderColor: COLORS.grey,
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#FFF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  container12: {
    flexDirection: 'column',

    bottom: 300,
  },
  textContainer: {
    flexDirection: 'row',
    top: 50,
    justifyContent: 'space-evenly',
  },

  verticalText: {
    writingDirection: 'ltr', // This makes text vertical

    transform: [{rotate: '360deg'}], // This rotates the text 90 degrees

    marginVertical: 45,
    top: -80,

    fontSize: 20,
    color: COLORS.gray,
  },
  textContainer1: {
    flexDirection: 'row',
    top: 5,

    left: -20,

    justifyContent: 'space-evenly',
  },

  verticalText1: {
    writingDirection: 'ltr', // This makes text vertical

    transform: [{rotate: '360deg'}], // This rotates the text 90 degrees

    marginVertical: 40,
    top: -100,
    right: -15,

    fontSize: 20,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  childBorder1: {
    borderTopWidth: 1,
    borderBottomColor: '#808080',
    borderTopColor: '#808080',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    position: 'absolute',
  },
  iphone13FlexBox: {
    marginTop: -44,
    height: 30,
    width: 170,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    fontSize: FontSize.size_xl,
    textAlign: 'center',
    position: 'absolute',
  },
  iphone13Typo: {
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: '600',
  },
  iphone14ProMax1Child: {
    marginTop: 310,
    left: 21,
    width: 368,
    height: 114,
    backgroundColor: Color.white,
  },

  productImage: {
    marginTop: 10,
    marginLeft: 132,
    width: 150,
    height: 170,
  },
  iphone13Pink: {
    top: 265,
    left: 124,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: '600',
    color: Color.black,
  },
  inStock10: {
    top: 305,
    left: 126,
    color: '#34a853',
    fontFamily: FontFamily.openSansRegular,
  },

  price: {
    left: 48,
    width: 42,
    top: 395,
    fontSize: FontSize.size_mini,
  },

  viewAvailableStock: {
    top: 660,
    left: 80,
    fontSize: 19,
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    textAlign: 'center',
    position: 'absolute',
    color: COLORS.bluelight,
    borderColor: COLORS.bluelight,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
  },

  iphone14ProMax1: {
    flex: 1,

    height: 850,
    width: '100%',
    backgroundColor: Color.white,
  },
});

export default Sample;
