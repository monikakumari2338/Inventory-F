import React from 'react';
import {
  FontSize,
  Color,
  FontFamily,
  Border,
} from '../components/GlobalStyles.js';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import Header from '../components/Header.js';
import Footer1 from '../components/Footer1.js';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors.js';
import {useNavigation} from '@react-navigation/native';
import ItemScanner from './ItemScanner.js';
import PoLanding from './PurchaseOrder/PoLanding';

import SideMenu from './SideMenu';
import Dashboard from './Dashboard';
import CycleCount from './CycleCount.js';
import {useState} from 'react';
import {storeContext} from '../StoreContext/LoggedStoreContext';
import axios from 'axios';
import {useEffect} from 'react';
import PageTitle from '../components/PageHeader.js';
import {BearerToken} from '../BearerTokenContext/TokenContext.js';
import {IP} from '../IpAddress/CommonIP';

const BuddyStoreDetails = ({route}) => {
  const {storedata, itemName, itemNumber, category, storeName} = route.params;

  const {value} = storeContext();
  const navigation = useNavigation();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [itemnumber, setItemNumber] = useState('');
  const [noDataFound, setNoDataFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [productData, setProductData] = useState(null);
  const [responsedata, setResponsedata] = useState([]);

  const store = ['Dashboard', 'StockCheck', 'PO Recieve', 'Stock Count'];
  const {token} = BearerToken();

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };
  const handlepress = () => {
    if (isMenuOpen) {
      closeMenu();
    }
  };

  const handleMenuItemClick = item => {
    // Handle the click on menu item here

    setSelectedMenuItem(item);
    if (item == 'Dashboard') {
      navigation.navigate(Dashboard);
    } else if (item == 'StockCheck') {
      navigation.navigate(ItemScanner);
    } else if (item == 'PO Recieve') {
      navigation.navigate(PoLanding);
    } else if (item == 'Stock Count') {
      navigation.navigate(CycleCount);
    }

    closeMenu();
  };

  const fetchBuddyStoreData = async () => {
    try {
      const response = await axios.get(
        `${IP}/product/getProductByitemNumber/${itemNumber}/${storeName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const responseData = response.data;
      //console.log('responseData ', responseData);
      setResponsedata(responseData);
    } catch (error) {
      console.log(' Error ', error);
    }
  };

  useEffect(() => {
    fetchBuddyStoreData();
  }, []);

  const handleInputChange = async input => {
    setItemNumber(input);
    try {
      const response = await axios.get(
        `${IP}/product/getMatched/products/itemnumber/${input}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const data = response.data;

      const filteredSuggestions = data.filter(
        item => item.store.storeName === storeName,
      );
      const uniqueItemNumbers = {};
      filteredSuggestions.forEach(obj => {
        if (!uniqueItemNumbers[obj.product.itemNumber]) {
          uniqueItemNumbers[obj.product.itemNumber] = obj;
        }
      });

      const uniqueObjects = Object.values(uniqueItemNumbers);
      setSuggestions(uniqueObjects);
    } catch (error) {
      console.log(error);
    }
    setNoDataFound(input.length > 0 && suggestions.length === 0);
  };

  const handleSuggestionSelect = async selectedItemNumber => {
    setItemNumber(selectedItemNumber);
    try {
      const response = await axios.get(
        `${IP}/product/getProductByitemNumber/${selectedItemNumber}/${storeName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const responseData = response.data;
      if (responseData.length === 0) {
        setProductData([]);
        setNoDataFound(true);
        setErrorMessage('No data Found');
      } else {
        setProductData(responseData);
        setNoDataFound(false);
        navigation.navigate('BuddyStoreSearchedItem', {
          productData: responseData,
          storeName: storeName,
        });
      }
    } catch (error) {
      console.log(error);
      setNoDataFound(true);
    }
    setItemNumber('');
    setSuggestions([]);
    closeMenu();
  };

  const [selectedColor, setSelectedColor] = useState(storedata.color);

  const [selectedSize, setSelectedSize] = useState(storedata.size);

  const colors = [
    ...new Set(responsedata.productDetailsdto?.map(product => product.color)),
  ];

  const sizes = [
    ...new Set(responsedata.productDetailsdto?.map(product => product.size)),
  ];

  const selectedProduct = responsedata.productDetailsdto?.find(
    product => product.color === selectedColor && product.size === selectedSize,
  );

  // console.log('selectedProduct', selectedProduct);

  // console.log('color1', colors);
  // console.log('sizes', sizes);
  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <Header showBackButton={true} />
      <PageTitle
        title={'Buddy Store                                 ' + storeName}
      />
      <TouchableWithoutFeedback onPress={handlepress}>
        <View style={{flex: 1}}>
          <View style={{top: -80, left: 4}}>
            <TouchableOpacity onPress={toggleMenu}>
              <Icon name="menu" size={35} color="white" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderRadius: 12,
              top: 8,
              paddingHorizontal: 10,
              marginHorizontal: 20,
              marginTop: -15,
              padding: 5,
              borderColor: '#C1C0B9',
              borderWidth: 1,
              borderColor: '#f0f8ff',
              backgroundColor: '#f0f8ff',
              elevation: 7,
            }}>
            <TextInput
              style={{
                flex: 1,
                height: 40,
                fontSize: 16,
                color: '#333',
                paddingLeft: 10,
              }}
              placeholder="Enter Item Number"
              value={itemnumber}
              onChangeText={handleInputChange}
            />
            <TouchableOpacity

            //onPress={handleSearch}
            >
              <Icon name="search" size={20} color="#333" style={{left: -10}} />
            </TouchableOpacity>
          </View>

          {suggestions.length > 0 && (
            <ScrollView
              style={{
                maxHeight: 140,
                backgroundColor: 'white',
                elevation: 7,
                position: 'absolute',
                top: 81,
                left: 21,
                borderRadius: 11,
                zIndex: 1,
                width: '90%',
                paddingHorizontal: 27,
                paddingVertical: 5,
                elevation: 4,
              }}>
              {suggestions.map(suggestion => (
                <TouchableOpacity
                  key={suggestion.product.itemNumber}
                  style={styles.suggestionItem}
                  onPress={() =>
                    handleSuggestionSelect(suggestion.product.itemNumber)
                  }>
                  <Text>{suggestion.product.itemNumber}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {noDataFound && suggestions.length === 0 && (
            <ScrollView
              style={{
                maxHeight: 150,
                backgroundColor: 'white',
                elevation: 7,
                position: 'absolute',
                top: 81,
                left: 21,
                borderRadius: 11,
                zIndex: 1,
                width: '90%',
                paddingHorizontal: 27,
                paddingVertical: 5,
                elevation: 4,
              }}>
              <Text style={styles.noResultsText}>No Results Found</Text>
            </ScrollView>
          )}

          <ScrollView>
            <View style={[styles.iphone14ProMax1]}>
              <View>
                <View
                  style={[styles.iphone14ProMax1Child, styles.childBorder1]}>
                  <View style={styles.textContainer}>
                    <Text style={styles.verticalText}>Price</Text>

                    <Text style={styles.verticalText}>Size</Text>

                    <Text style={[styles.verticalText, {left: 7}]}>Color</Text>
                  </View>
                  <View style={styles.textContainer1}>
                    <Text style={styles.verticalText1}>
                      {'\u20B9'}
                      {selectedProduct?.price}
                    </Text>

                    <Text style={styles.verticalText2}>
                      {selectedProduct?.size}
                    </Text>

                    <Text style={styles.verticalText3}>
                      {selectedProduct?.color}
                    </Text>
                  </View>
                </View>

                <Image
                  style={styles.productImage}
                  source={{uri: selectedProduct?.imageData}}
                  resizeMode="contain"
                />

                <Text
                  style={[
                    styles.iphone13Pink,
                    styles.iphone13FlexBox,
                    {fontSize: 22},
                  ]}>
                  {itemName}
                </Text>

                <Text
                  style={[
                    styles.category,
                    styles.iphone13FlexBox,
                    {fontSize: 18},
                  ]}>
                  {category}
                </Text>
                <Text
                  style={[
                    styles.itemnumbber,
                    styles.iphone13FlexBox,
                    {fontSize: 18},
                  ]}>
                  Item number :{itemNumber}
                </Text>

                <Text
                  style={[
                    styles.inStock10,
                    styles.iphone13FlexBox,
                    {fontSize: 18},
                  ]}>
                  In Stock
                </Text>
                <Text
                  style={[
                    styles.inStock1,
                    styles.iphone13FlexBox,
                    {fontSize: 18},
                  ]}>
                  Current Stock: {selectedProduct?.sellableStock}
                </Text>
              </View>

              <View style={styles.viewContainer}>
                <Picker
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 2,
                    borderColor: 'red',
                    borderWidth: 2,
                    marginTop: 10,
                    zIndex: 1,
                    top: -10,
                    elevation: 5,
                  }}
                  selectedValue={selectedColor}
                  onValueChange={itemValue => setSelectedColor(itemValue)}>
                  {colors.map(color => (
                    <Picker.Item key={color} label={color} value={color} />
                  ))}
                </Picker>

                <Picker
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                    marginLeft: 10,
                    borderRadius: 9,
                    borderColor: 'red',
                    borderWidth: 2,
                    marginTop: 10,
                    zIndex: 1,
                    top: -10,
                    elevation: 5,
                  }}
                  selectedValue={selectedSize}
                  onValueChange={itemValue => setSelectedSize(itemValue)}>
                  {sizes.map(size => (
                    <Picker.Item key={size} label={size} value={size} />
                  ))}
                </Picker>
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
      <SideMenu
        isOpen={isMenuOpen}
        closeMenu={closeMenu}
        items={store}
        onItemClick={handleMenuItemClick}
      />
      <Footer1 />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  viewContainer: {
    bottom: -420,
    marginLeft: 20,
    flexDirection: 'row',
    width: '90%',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '10%',
    paddingBottom: '20%',
  },

  textContainer: {
    flexDirection: 'row',
    top: 65,
    justifyContent: 'space-evenly',
  },

  verticalText: {
    marginVertical: 35,
    top: -80,

    fontSize: 20,
    color: COLORS.gray,
  },
  textContainer1: {
    top: 10,
  },

  verticalText1: {
    marginVertical: 40,
    top: -90,
    right: -55,
    fontSize: 20,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  verticalText2: {
    marginVertical: 40,
    top: -196,
    right: -178,
    fontSize: 20,
    color: COLORS.black,
    fontWeight: 'bold',
  },

  verticalText3: {
    marginVertical: 40,
    top: -303,
    right: -278,
    fontSize: 20,
    color: COLORS.black,
    fontWeight: 'bold',
  },

  childBorder1: {
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderStyle: 'solid',
    position: 'absolute',
    borderRadius: 12,
    elevation: 2,
  },
  iphone13FlexBox: {
    marginTop: 20,
    height: 40,
    width: 170,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    fontSize: FontSize.size_xl,
    textAlign: 'center',
    position: 'absolute',
  },
  iphone14ProMax1Child: {
    top: 300,
    left: 16,
    width: 378,
    height: 103,
    backgroundColor: Color.white,
  },

  productImage: {
    top: -7,
    left: '32%',
    width: 150,
    height: 150,
    position: 'absolute',
  },
  iphone13Pink: {
    top: 145,
    left: 124,
    fontFamily: FontFamily.openSansSemiBold,
    color: Color.black,
    fontWeight: 'bold',
  },
  itemnumbber: {
    top: 180,
    left: 124,
    fontFamily: FontFamily.openSansSemiBold,

    color: Color.black,
  },
  category: {
    top: 210,
    left: 124,
    fontFamily: FontFamily.openSansSemiBold,

    color: Color.black,
  },
  itemnumbber1: {
    top: -245,
    left: 124,
    fontFamily: FontFamily.openSansSemiBold,

    color: Color.black,
  },
  inStock10: {
    top: 250,
    left: -30,
    color: '#34a853',
    fontFamily: FontFamily.openSansRegular,
  },
  inStock1: {
    top: 245,
    left: 225,
    color: '#34a853',
    fontFamily: FontFamily.openSansRegular,
  },
  text: {
    left: 47,
    width: 42,
  },
  viewAvailableStock: {
    top: 565,
    fontSize: 19,
    width: 250,
    textAlign: 'center',
    position: 'absolute',
    color: 'white',
    borderWidth: 1,
    alignItems: 'center',
    left: 58,
    borderRadius: 15,
    width: 300,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },

  iphone14ProMax1: {
    flex: 1,
    marginTop: '5%',
    height: 680,
    width: '100%',
    paddingTop: '-3%',
    backgroundColor: Color.white,
  },
  suggestionItem: {
    padding: 10,
  },
  noResultsText: {
    textAlign: 'center',
    padding: 10,
    fontStyle: 'italic',
    fontWeight: '500',
  },
});

export default BuddyStoreDetails;
