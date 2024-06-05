import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Modal,
  Pressable,
} from 'react-native';
import Iconn from 'react-native-vector-icons/MaterialCommunityIcons';
import PageTitle from '../components/PageHeader.js';
import CycleCount from './CycleCount';
import Header from '../components/Header';
import Footer1 from '../components/Footer1';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import ItemScanner from './ItemScanner.js';
import PoLanding from './PurchaseOrder/PoLanding';
import SideMenu from './SideMenu';
import Dashboard from './Dashboard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import StockCountadhocProducts from './StockCountadhocProducts';
import {Alert} from 'react-native';
import {BearerToken} from '../BearerTokenContext/TokenContext.js';
import {IP} from '../IpAddress/CommonIP';
const StockCountadhoc = () => {
  const navigation = useNavigation();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isReasonSelected, setIsReasonSelected] = useState(false);
  const [reasonError, setReasonError] = useState('');
  const [iscategoryDropdownVisible, setCategoryDropdownVisible] =
    useState(false);
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [category, setCategory] = useState('');
  const [categoryProducts, setCategoryProducts] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [checkedItems, setCheckedItems] = useState([]);

  const store = ['Dashboard', 'StockCheck', 'PO Recieve', 'Stock Count'];
  const {token} = BearerToken();

  const toggleCheckbox = item => {
    setSelectedItems(prevSelected => ({
      ...prevSelected,
      [item.id]: !prevSelected[item.id],
    }));
    if (selectedItems[item.id]) {
      setCheckedItems(prevCheckedItems =>
        prevCheckedItems.filter(checkedItem => checkedItem !== item.id),
      );
    } else {
      setCheckedItems(prevCheckedItems => [...prevCheckedItems, item.id]);
    }
  };
  console.log('Checked  : ' + checkedItems);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
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
  const handlepress = () => {
    if (isMenuOpen) {
      closeMenu();
    }
  };

  const reasonOptions = [
    {label: 'Testing', value: 'Testing'},
    {label: 'Audit', value: 'Audit'},
  ];

  const categoryOptions = [
    {value: '1', label: 'handbags'},
    {value: '2', label: 'Womenwear'},
    {value: '3', label: 'Footwear'},
    {value: '4', label: 'Sportswear'},
  ];

  const selectReasonModal = selectedItem => {
    setSelectedReason(selectedItem.value);
    setDropdownVisible(false);
    setIsReasonSelected(true);
    validateReason();
  };

  const selectCategoryModal = selectedItem => {
    setCategory(selectedItem.label);
    setCategoryDropdownVisible(false);
    setIsCategorySelected(true);
    handleCategoryProducts(selectedItem.value);
  };

  const handleCategoryProducts = categoryid => {
    const store = 'Pacific Dwarka';
    console.log('id: ', categoryid);
    axios
      .get(`${IP}/product/getall/productbycategory/${categoryid}/${store}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        setCategoryProducts(response.data);
        // navigation.navigate('Postvrnc', {countDetails});
        console.log(' category data', response.data);
      })
      .catch(error => {
        console.log('Error fetching count details:', error);
      });
  };
  //console.log('categoryProducts: ', categoryProducts);
  const handleStartCountButton = () => {
    if (category === '' || selectedReason === '') {
      Alert.alert('Please select the reason and category');
    }
    //console.log('data : ', categoryProducts);
    else {
      const data = categoryProducts.filter(item =>
        checkedItems.includes(item.id),
      );
      navigation.navigate('StockCountadhocProducts', {
        products: data,
        reason: selectedReason,
      });
    }
  };
  const validateReason = () => {
    selectedReason === ' '
      ? setReasonError(
          selectedReason.trim() == '' ? '' : 'Please select a Reason',
        )
      : ' ';
  };

  const isFormValid = () => {
    const isReasonValid = selectedReason && selectedReason.trim() !== '';

    setReasonError(isReasonValid ? '' : 'Please select a Reason');

    return isReasonValid;
  };
  // console.log('categoryProducts data : ', categoryProducts);
  //console.log('reason: ', selectedReason);
  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <Header showBackButton={true} />
      <PageTitle title={'Adhoc Count'} />
      <TouchableWithoutFeedback onPress={handlepress}>
        <View style={{flex: 1}}>
          <View style={{top: -80, left: 4}}>
            <TouchableOpacity onPress={toggleMenu}>
              <Icon name="menu" size={35} color="white" />
            </TouchableOpacity>
          </View>

          <View style={{padding: 16}}>
            <View style={styles.card}>
              <View style={styles.inputContainer}>
                <Text style={styles.EODText}>Adhoc Count Reason</Text>
                <View>
                  <TouchableOpacity
                    style={styles.input}
                    // onPress={toggleDropdown}
                    onPress={() => setDropdownVisible(!isDropdownVisible)}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 6,
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.inputtext}>
                        {selectedReason || 'Select Reason'}
                      </Text>
                      <Icon
                        style={{}}
                        name={
                          isDropdownVisible
                            ? 'caret-up-outline'
                            : 'caret-down-outline'
                        }
                        color={isReasonSelected ? 'black' : 'black'}
                        size={20}
                      />
                    </View>
                  </TouchableOpacity>
                  {!isReasonSelected && (
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 14,
                        marginLeft: 235,
                        marginBottom: -20,
                        left: -3,
                        top: -10,
                      }}>
                      '.'
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.EODText}>Category</Text>
              <View>
                <TouchableOpacity
                  style={styles.input}
                  // onPress={toggleDropdown}
                  onPress={() =>
                    setCategoryDropdownVisible(!iscategoryDropdownVisible)
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 6,
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.inputtext}>
                      {category || 'Select Category'}
                    </Text>
                    <Icon
                      style={{}}
                      name={
                        iscategoryDropdownVisible
                          ? 'caret-up-outline'
                          : 'caret-down-outline'
                      }
                      color={isCategorySelected ? 'black' : 'black'}
                      size={20}
                    />
                  </View>
                </TouchableOpacity>
                {!isCategorySelected && (
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 14,
                      marginLeft: 235,
                      marginBottom: -20,
                      left: -3,
                      top: -10,
                    }}>
                    '.'
                  </Text>
                )}
              </View>
            </View>

            {categoryProducts === null ? (
              ''
            ) : (
              <View style={styles.card}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    left: '1%',
                    lineHeight: 24,
                    color: '#4A486F',
                  }}>
                  Location: {categoryProducts[0].product.category.location}
                </Text>
              </View>
            )}

            {categoryProducts === null ? (
              ''
            ) : (
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerText}> </Text>
                  <Text style={styles.headerText}>Item No.</Text>
                  <Text style={[styles.headerText]}>Size</Text>
                  <Text style={[styles.headerText]}>Color</Text>
                  <Text style={[styles.headerText]}>Qty</Text>
                </View>
                <View style={{height: 200, borderWidth: 0.5, width: 380}}>
                  <ScrollView style={[styles.container]}>
                    {categoryProducts.map((item, index) => (
                      <TouchableOpacity key={index}>
                        <View style={styles.tableRow}>
                          <TouchableOpacity
                            onPress={() => toggleCheckbox(item)}
                            style={{
                              alignItems: 'center',
                              flexDirection: 'row',
                              alignContent: 'center',
                            }}>
                            {selectedItems[item.id] ? (
                              <Iconn
                                name="checkbox-outline"
                                size={20}
                                style={{fontWeight: '500', color: 'black'}}
                              />
                            ) : (
                              <Iconn
                                name="checkbox-blank-outline"
                                size={20}
                                style={{fontWeight: '500', color: 'black'}}
                              />
                            )}
                            <Text style={{marginLeft: '2%'}}>{item.value}</Text>
                          </TouchableOpacity>
                          <Text style={[styles.rowText]}>
                            {item.product.itemNumber}
                          </Text>

                          <Text style={[styles.rowText]}>{item.size}</Text>
                          <Text style={[styles.rowText]}>{item.color}</Text>
                          <Text style={[styles.rowText]}>
                            {item.sellableStock}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}

            <Pressable style={styles.button} onPress={handleStartCountButton}>
              <Text style={styles.EODbtn}>Start Count </Text>
            </Pressable>
            {/* Dropdown modal */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={isDropdownVisible}
              onRequestClose={() => {
                setDropdownVisible(false);
              }}>
              <TouchableWithoutFeedback
                onPress={() => setDropdownVisible(false)}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}>
                  <View style={styles.modalContainer}>
                    {reasonOptions.map(item => (
                      <TouchableOpacity
                        key={item.value}
                        style={styles.dropdownItem}
                        onPress={() => selectReasonModal(item)}>
                        <Text style={styles.dropdownItemText}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            <Text style={styles.validationError}>{reasonError}</Text>

            {/* {category dropdown model} */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={iscategoryDropdownVisible}
              onRequestClose={() => {
                setCategoryDropdownVisible(false);
              }}>
              <TouchableWithoutFeedback
                onPress={() => setCategoryDropdownVisible(false)}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}>
                  <View style={styles.modalContainer}>
                    {categoryOptions.map(item => (
                      <TouchableOpacity
                        key={item.label}
                        style={styles.dropdownItem}
                        onPress={() => selectCategoryModal(item)}>
                        <Text style={styles.dropdownItemText}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
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
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  card: {
    borderWidth: 2,
    borderColor: '#f0f8ff',
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    marginBottom: 14,
    padding: 8,
    elevation: 2,
  },
  inputtext: {
    color: 'black',
  },
  inputContainer: {
    marginBottom: -5,
  },
  categoryContainer: {
    marginBottom: -5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 9,
    marginBottom: 10,
    elevation: 3,
  },
  EODText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4A486F',
    fontWeight: '500',
  },
  button: {
    marginTop: -1,
    fontSize: 18,
    //alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 34,
    borderRadius: 20,
    width: 170,
    elevation: 3,
    color: 'white',
    backgroundColor: '#00338D',
  },
  EODbtn: {
    fontFamily: 'PlusJakartaSans-Medium',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: 'white',
  },
  validationError: {
    color: '#ED6B6B',
    fontSize: 14,
    marginTop: -3,
    marginBottom: 2,
    marginLeft: 10,
  },
  modalContainer: {
    backgroundColor: '#DDD',
    marginTop: -95,
    marginHorizontal: 25,
    borderRadius: 10,
    elevation: 3,
  },
  dropdownItem: {
    paddingHorizontal: 110,
    paddingVertical: 15,
    borderWidth: 0.4,
    borderColor: '#ddd',
  },
  dropdownItemText: {
    fontSize: 12,

    color: '#000',
    padding: 1,
    margin: 2,
    left: -100,
  },
  tableContainer: {
    marginTop: 35,
    marginBottom: 10,
    // height: 200,
    // width: 380,
    justifyContent: 'center',
  },

  tableHeader: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    paddingVertical: 5,
    // paddingHorizontal: 1,
    paddingleft: '4%',
    backgroundColor: COLORS.primary,
    marginTop: -38,
  },

  headerText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: 'white',
    paddingHorizontal: 7,
    paddingVertical: 5,
    fontSize: 16,
    textAlign: 'center',
    top: 1,
    flex: 1,
    width: '10%',
    left: '-5%',
  },

  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },

  rowText: {
    color: '#333333',
    justifyContent: 'space-between',
    textAlign: 'left',
    paddingHorizontal: 2,
    width: '11%',
  },
  addButton: {
    position: 'absolute',
    left: 290,
    elevation: 3,
    backgroundColor: COLORS.primary,
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 10,
    marginHorizontal: 23,
    marginVertical: 35,
  },
});

export default StockCountadhoc;
