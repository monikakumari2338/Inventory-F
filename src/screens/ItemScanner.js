import {useState, useEffect} from 'react';
import React from 'react';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import Footer1 from '../components/Footer1';
import PageTitle from '../components/PageHeader.js';

import {
  View,
  Text,
  TextInput,
  Button,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import PoLanding from './PurchaseOrder/PoLanding';

import SideMenu from './SideMenu';
import Dashboard from './Dashboard';
import CycleCount from './CycleCount';
import axios from 'axios';
import {storeContext} from '../StoreContext/LoggedStoreContext';
import Scanner from './Scanner';
import {BearerToken} from '../BearerTokenContext/TokenContext';

const ItemScanner = () => {
  const [itemNumber, setItemNumber] = useState('');
  const navigation = useNavigation();
  const [productData, setProductData] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [noDataFound, setNoDataFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const numericRegex = /^[0-9]+$/;
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
    setItemNumber('');
    setSuggestions([]);
    setNoDataFound(false);
  };
  useEffect(() => {
    setItemNumber('');
    setSuggestions([]);
    setNoDataFound(false);
  }, []);
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
  const {value} = storeContext();
  const val = 'Pacific Dwarka';

  const handleIconClick = async () => {
    const numericRegex = /^[0-9]+$/;
    const result = numericRegex.test(inputValue);
    if (result === true) {
      console.log('result', result);
      try {
        const response = await axios.get(
          `http://172.20.10.9:9022/product/getProductByitemNumber/${inputValue}/${val}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const responseData = response.data;
        console.log('responseData val ', responseData);
        if (responseData.length === 0) {
          setProductData([]);
          setNoDataFound(true);
          setErrorMessage('No data Found');
        } else {
          setProductData(responseData);
          setNoDataFound(false);
          navigation.navigate('StockCheck', {productData: responseData});
        }
      } catch (error) {
        console.log(error);
        setNoDataFound(true);
      }
      setItemNumber('');
      setSuggestions([]);
    } else {
      try {
        const response = await axios.get(
          `http://172.20.10.9:9022/product/getProductByitemName/${inputValue}/${val}`,
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
          navigation.navigate('StockCheck', {productData: responseData});
        }
      } catch (error) {
        console.log(error);
        setNoDataFound(true);
      }
      setItemNumber('');
      setSuggestions([]);
    }
  };
  // const handleSearch = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://172.20.10.9:8083/product/getProductByitemName/${inputValue}/${val}`,
  //     );
  //     const responseData = response.data;
  //     if (responseData.length === 0) {
  //       setProductData([]);
  //       setNoDataFound(true);
  //       setErrorMessage('No data Found');
  //     } else {
  //       setProductData(responseData);
  //       setNoDataFound(false);
  //       navigation.navigate('StockCheck', {productData: responseData});
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setNoDataFound(true);
  //   }
  //   setItemNumber('');
  //   setSuggestions([]);
  // };

  const handleSuggestionSelect = async selectedItemNumber => {
    setItemNumber(selectedItemNumber);
    try {
      const response = await axios.get(
        `http://172.20.10.9:9022/product/getProductByitemNumber/${selectedItemNumber}/${val}`,
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
        setInputValue('');
        navigation.navigate('StockCheck', {productData: responseData});
      }
    } catch (error) {
      console.log(error);
      setNoDataFound(true);
    }
    setItemNumber('');
    setSuggestions([]);
    closeMenu();
  };

  const handleInputChange = async input => {
    setInputValue(input);
    const numericRegex = /^[0-9]+$/;
    const result = numericRegex.test(input);

    if (result === true) {
      try {
        const response = await axios.get(
          `http://172.20.10.9:9022/product/getMatched/products/itemnumber/${input}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const data = response.data;
        const filteredSuggestions = data.filter(
          item => item.store.storeName === val,
        );
        console.log('filteredSuggestions bsvxs', filteredSuggestions);

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
    } else {
      try {
        const response = await axios.get(
          `http://172.20.10.9:9022/product/getMatched/products/Itemname/${input}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const data = response.data;
        console.log('data ', data);
        const filteredSuggestions = data.filter(
          item => item.store.storeName === val,
        );
        const uniqueItemNumbers = {};
        filteredSuggestions.forEach(obj => {
          if (!uniqueItemNumbers[obj.product.itemName]) {
            uniqueItemNumbers[obj.product.itemName] = obj;
          }
        });

        const uniqueObjects = Object.values(uniqueItemNumbers);
        //console.log('filteredSuggestions bsvxs', filteredSuggestions);
        setSuggestions(uniqueObjects);
      } catch (error) {
        console.log(error);
      }
      setNoDataFound(input.length > 0 && suggestions.length === 0);
    }
  };

  const handleScan = () => {
    navigation.navigate(Scanner);
  };

  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <Header showBackButton={true} />
      <PageTitle title={'Stock Check'} />
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
              top: 5,
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
              placeholder="Enter Item Number/ Item Name"
              value={inputValue}
              onChangeText={handleInputChange}
            />
            <TouchableOpacity onPress={handleIconClick}>
              <Icon name="search" size={20} color="#333" style={{left: -10}} />
            </TouchableOpacity>
          </View>
          <Text style={styles.orText}>OR</Text>
          <TouchableOpacity onPress={handleScan}>
            <Text style={styles.scan}>Scan Barcode</Text>
          </TouchableOpacity>

          {/* {noDataFound && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderRadius: 7,
                paddingHorizontal: 30,
                marginHorizontal: 80,
                marginTop: 100,
                padding: -35,
                borderColor: '#f0f8ff',
                backgroundColor: 'white',
                elevation: 7,
              }}>
              <Text
                style={{
                  color: 'grey',
                  fontSize: 18,
                  marginTop: 20,
                  top: -10,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                No Data Found
              </Text>
            </View>
          )} */}
          {/* Suggestions */}
          {numericRegex.test(inputValue)
            ? suggestions.length > 0 && (
                <ScrollView
                  style={{
                    maxHeight: 140,
                    backgroundColor: 'white',
                    elevation: 7,
                    position: 'absolute',
                    top: 79,
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
                      key={suggestion.id}
                      style={styles.suggestionItem}
                      onPress={() =>
                        handleSuggestionSelect(suggestion.product.itemNumber)
                      }>
                      <Text>{suggestion.product.itemNumber}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )
            : suggestions.length > 0 && (
                <ScrollView
                  style={{
                    maxHeight: 140,
                    backgroundColor: 'white',
                    elevation: 7,
                    position: 'absolute',
                    top: 79,
                    left: 21,
                    borderRadius: 11,
                    zIndex: 1,
                    width: '90%',
                    paddingHorizontal: 7,
                    paddingVertical: 5,
                    elevation: 4,
                  }}>
                  {suggestions.map(suggestion => (
                    <TouchableOpacity
                      key={suggestion.product.id}
                      style={styles.suggestionItem}
                      onPress={() =>
                        handleSuggestionSelect(suggestion.product.itemNumber)
                      }>
                      <Text>{suggestion.product.itemName}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

          {/* {suggestions.length > 0 && (
            <ScrollView
              style={{
                maxHeight: 140,
                backgroundColor: 'white',
                elevation: 7,
                position: 'absolute',
                top: 124,
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
                  <Text>{suggestion.product.itemName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )} */}

          {noDataFound && suggestions.length === 0 && (
            <ScrollView
              style={{
                maxHeight: 150,
                backgroundColor: 'white',
                elevation: 7,
                position: 'absolute',
                top: 79,
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
  suggestionItem: {
    padding: 10,
  },
  noResultsText: {
    textAlign: 'center',
    padding: 10,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  scan: {
    top: '120%',
    fontSize: 19,
    textAlign: 'center',
    //position: 'relative',
    color: 'white',
    borderWidth: 1,
    left: '23%',
    borderRadius: 15,
    width: '50%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  orText: {
    left: '45%',
    fontSize: 18,
    top: '4%',
  },
});

export default ItemScanner;
