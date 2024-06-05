import React, {useState, useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';
import PageTitle from '../components/PageHeader.js';
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
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';
import CycleCount from './CycleCount';
import Header from '../components/Header';
import Footer1 from '../components/Footer1';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import ItemScanner from './ItemScanner.js';
import PoLanding from './PurchaseOrder/PoLanding';
import SideMenu from './SideMenu';
import Dashboard from './Dashboard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import SyncStorage from 'sync-storage';
import {BearerToken} from '../BearerTokenContext/TokenContext.js';
import {IP} from '../IpAddress/CommonIP';
const StockCountadhocProducts = ({route}) => {
  const {products, reason, sku} = route.params;
  //console.log('products: ', products);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isPopupVisiblesave, setPopupVisiblesave] = useState(false);
  const [showModal, setshowmodal] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const [showModalsave, setshowmodalsave] = useState(false);
  const navigation = useNavigation();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [error, setError] = useState(null);
  const [colorsval, setcolors] = useState([]);
  const [qtyVal, setqty] = useState([]);
  const [itemNumberVal, setitemNumber] = useState([]);
  const [countedqtys, setCountedqtys] = useState(
    Array(products?.length).fill(0),
  );
  const [formErrors, setFormErrors] = useState(
    Array(products?.length).fill(''),
  );
  const store = ['Dashboard', 'StockCheck', 'PO Recieve', 'Stock Count'];

  const {token} = BearerToken();

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

  // const data = products.map(product => ({...product, count: 0}));
  //console.log('new data', data);

  // useEffect(() => {
  //   SyncStorage.set('localStorageData', data);
  // }, [data]);

  // const result = SyncStorage.get('localStorageData');
  // console.log('result ', result);

  const openPopup = () => {
    // Validate quantities
    const newErrors = countedqtys.map(qty => {
      if (qty === 0 || qty === '' || isNaN(qty)) {
        return 'Invalid Input';
      }
      return '';
    });

    setFormErrors(newErrors);

    if (newErrors.some(error => error !== '')) {
      return;
    }

    setPopupVisible(true);
  };
  const qty = [];
  const itemNumber = [];
  const colors = [];

  const handleSaveModal = () => {
    products.map(item => {
      if (item.count) {
        qty.push(item.count);
        itemNumber.push(item.product.itemNumber);
        colors.push(item.color);
        console.log('map', item.count);
      } else {
        qty.push(0);
        itemNumber.push(item.product.itemNumber);
        colors.push(item.color);
      }
    });
    setcolors(colors);
    setqty(qty);
    setitemNumber(itemNumber);
    // console.log('itemnumber', itemNumber);
    // console.log('qty', qty);
    // console.log('color', colors);
    // console.log('count', count);
    // console.log('products size', products.length);
    setSaveModal(true);
  };

  const openModal = () => {
    setPopupVisible(false);
    setshowmodal(true);
    handlesaveddata();
  };

  const closeModal = () => {
    setshowmodal(false);
    navigation.goBack();
  };
  const closeSaveModalPopup = () => {
    setSaveModal(false);
  };
  const closePopup = () => {
    setPopupVisible(false);
  };
  const closePopupsave = () => {
    setPopupVisiblesave(false);
  };
  const handleNoClick = () => {
    closePopup();
  };
  const handleOkClicksave = () => {
    closePopupsave();
  };
  const handlecountedqtychange = (index, value) => {
    const isNumeric = /^[0-9]*$/.test(value);
    const newCountedqtys = [...countedqtys];
    newCountedqtys[index] = isNumeric
      ? parseFloat(value) >= 0
        ? parseFloat(value)
        : 0
      : 0;
    setCountedqtys(newCountedqtys);
    console.log('updated countedqty:', newCountedqtys);
  };

  const handlesaveddata = () => {
    // Calculate totalBookQty and countedQty
    const BookQty = products.reduce((sum, product) => sum + product.bookQty, 0);

    const countedQty = countedqtys.reduce(
      (sum, countedQty) => sum + parseFloat(countedQty),
      0,
    );

    const varianceQty = BookQty - countedQty;
    const savearr = products.map((item, index) => ({
      // adhocId: uniqueId,
      bookQty: item.sellableStock,
      firstcountedQty: item.count ? item.count : 0,
      firstvarianceQty: item.sellableStock - (item.count ? item.count : 0),
      reCountQty: 0,
      recountVarianceQty: 0,
      reCountStatus: 'pending',
      itemNumber: item.product.itemNumber,
      itemName: item.product.itemName,
      category: 'Sportswear',
      color: item.color,
      price: item.price,
      size: item.size,
      imageData: item.imageData,
      sku: item.sku,
      store: item.store.storeName,
      reason: reason,
    }));

    axios({
      method: 'post',
      url: IP + '/savestockcount/adhoc/count/creation',
      data: savearr,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('save array response ', response.data);
        closePopup();
        navigation.navigate('CycleCount');
      })
      .catch(error => {
        console.log('Error ', error);
      });
  };

  // console.log('products stock ', products);
  const renderProductCards = () =>
    products?.map((Item, index) => (
      <Pressable
        key={`${Item.product.itemNumber}-${index}`}
        onPress={closeMenu}>
        <View style={styles.productCard}>
          <Image
            style={styles.productImage}
            source={{uri: Item.imageData}}
            resizeMode="contain"
          />

          <View style={styles.productInfo}>
            <Text style={{color: 'black'}}>
              Item Number: {Item.product.itemNumber}
            </Text>
            <Text
              style={
                styles.productDetails
              }>{`${Item.product.itemName} | ${Item.color}`}</Text>

            <Text style={styles.productDetails}>
              Price:{Item.price} | Size: {Item.size} | Stock:
              {Item.sellableStock}
            </Text>

            {/* {Item.stockcount && ( */}
            <View style={styles.quantityContainer}>
              <Text
                style={{
                  backgroundColor: COLORS.primary,
                  color: 'white',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  marginHorizontal: 10,
                  left: '10%',
                  top: '10%',
                  borderRadius: 40,
                }}>
                {Item.count ? Item.count : 0}
              </Text>
              {/* <TextInput
                style={{
                  backgroundColor: '#e1ebf5',
                  height: 35,

                  width: 55,
                  borderRadius: 15,
                  marginBottom: 55,
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  borderColor: '#e1ebf5',
                  elevation: 9,
                  paddingHorizontal: -33,
                  paddingVertical: 8,
                  textAlign: 'center',
                }}
                value={countedqtys[index].toString()}
                onChangeText={value => {
                  handlecountedqtychange(index, value);
                  setFormErrors(prevError => {
                    const newErrors = [...prevError];
                    newErrors[index] = '';
                    return newErrors;
                  });
                }}
                keyboardType="numeric"
                placeholder="Qty"
                underlineColor="transparent"
              /> */}
              {/* <Text style={styles.errorText}>{formErrors[index]}</Text> */}
            </View>
            {/* } */}
          </View>
        </View>
      </Pressable>
    ));

  // function generateUniqueId() {
  //   return 'yxxxxyx'.replace(/[xy]/g, function (c) {
  //     var r = (Math.random() * 16) | 0,
  //       v = c == 'x' ? r : (r & 0x3) | 0x8;
  //     return v.toString(16);
  //   });
  // }
  // const uniqueId = generateUniqueId();

  const handlescan = () => {
    setError(null);
    navigation.navigate('StockCountScan', {products: products, reason: reason});
  };
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

          <View
            style={{
              justifyContent: 'flex-end',
              flexDirection: 'row',
              //alignItems: 'center',
              paddingHorizontal: 10,
              top: -18,
            }}>
            <TouchableOpacity
              style={styles.addQuantitysave}
              onPress={handlescan}>
              <Text style={styles.addQuantityButtonText}>Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.save} onPress={handleSaveModal}>
              <Text style={styles.addQuantityButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          {error == null ? (
            ''
          ) : (
            <Text
              style={{color: 'red', left: '63%', fontWeight: 500, top: '-4%'}}>
              {error}
            </Text>
          )}
          <ScrollView contentContainerStyle={styles.container}>
            {renderProductCards()}
          </ScrollView>
          <View style={{left: 15, top: 20}}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isPopupVisible}
              onRequestClose={closePopup}>
              <View style={styles.modalContainer1}>
                <View style={styles.modalsaveContent1}>
                  <Icon
                    style={{textAlign: 'center', marginBottom: 15}}
                    name="save-outline"
                    size={55}
                    color="#699BF7"
                  />
                  <Text style={styles.text1}>
                    Do you want to save this Cycle Count?
                  </Text>
                  <View style={styles.buttonContainer1}>
                    <TouchableOpacity
                      style={styles.button1}
                      onPress={openModal}>
                      <Text style={styles.buttonText1}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button1}
                      onPress={handleNoClick}>
                      <Text style={styles.buttonText1}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isPopupVisiblesave}
            onRequestClose={closePopupsave}>
            <View style={styles.modalContainer1}>
              <View style={styles.modalContent1}>
                <Icon
                  style={{textAlign: 'center', marginBottom: 15}}
                  name="checkmark-circle-outline"
                  size={60}
                  color="#34A853"
                />
                <Text style={styles.text1}>Count Saved</Text>
                <View style={styles.buttonContainer1}>
                  <TouchableOpacity
                    style={styles.buttonsave}
                    onPress={handleOkClicksave}>
                    <Text style={styles.buttonText1}>Ok</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={closePopup}>
            <View style={styles.modalContainer1}>
              <View style={styles.modalContent1}>
                <Icon
                  style={{textAlign: 'center', marginBottom: 15}}
                  name="checkmark-circle-outline"
                  size={60}
                  color="#34A853"
                />
                <Text style={styles.text1}>Saved Successfully!</Text>
                <View style={styles.buttonContainer1}>
                  <TouchableOpacity
                    style={styles.buttonsave}
                    onPress={closeModal}>
                    <Text style={styles.buttonText1}>Ok</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={saveModal}
            onRequestClose={closeSaveModalPopup}>
            <View style={styles.modalContainer1}>
              <View style={styles.modalsaveContent1}>
                <Text style={styles.text1}>
                  Do you want to Save this count ?
                </Text>
                {/* <View style={{textAlign: 'center'}}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 16,
                      padding: 5,
                      marginLeft: 20,
                      fontWeight: '600',
                    }}>
                    ItemNumber {'   '} Color{'        '} Qty
                  </Text>
                  {itemNumberVal?.map((item, index) => {
                    return (
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 16,
                          padding: 5,
                          marginLeft: 40,
                        }}>
                        {item}
                        {'              '}
                        {colorsval[index]}
                      </Text>
                    );
                  })}
                </View>
                {qtyVal?.map(item => {
                  return (
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 16,
                        padding: 5,
                        marginLeft: 210,
                        top: '-38%',
                      }}>
                      {item}
                    </Text>
                  );
                })} */}
                <View style={styles.buttonContainer1}>
                  <TouchableOpacity
                    style={styles.button1}
                    onPress={handlesaveddata}>
                    <Text style={styles.buttonText1}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button1}
                    onPress={closeSaveModalPopup}>
                    <Text style={styles.buttonText1}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
  quantityContainer: {
    top: '-60%',
    marginLeft: 200,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: -90,
  },
  container: {
    padding: 16,
    marginTop: -20,

    // top: '-8%',
    paddingTop: 25,
    //flexGrow: 1,
    paddingBottom: 170,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    paddingHorizontal: 7,
    margin: 2,
    marginHorizontal: -5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  },
  productImage: {
    width: 65,
    height: 90,
    marginRight: 26,
  },
  productInfo: {
    flex: 2,
    top: '-9%',
  },
  productDetails: {
    fontSize: 16,
    color: 'grey',
    marginTop: 8,
  },
  addQuantity: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: -20,
    borderRadius: 10,
    marginHorizontal: 160,
    left: 150,
    marginTop: -30,
    top: 15,
  },
  save: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 1,
    // left: '35%',
    // flexDirection:'row'
  },
  addQuantitysave: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    //left: '10%',
  },
  addQuantityButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  text1: {
    top: '-2%',
    fontSize: 18,
    color: '#484848',
    textAlign: 'center',
    fontWeight: '500',
  },
  button1: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 20,
    marginHorizontal: 30,
    marginBottom: 20,
  },
  buttonsave: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 38,
    borderRadius: 20,
    marginHorizontal: 30,
  },
  addQuantityButton1: {
    backgroundColor: COLORS.primary,
    padding: 10,
    paddingHorizontal: 17,
    marginTop: -5,
    top: 10,

    borderRadius: 18,
  },
  buttonText1: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: -45,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent1: {
    paddingVertical: 15,
    paddingHorizontal: 68,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  modalsaveContent1: {
    paddingVertical: 40,
    paddingHorizontal: 28,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: '10%',
  },
});

export default StockCountadhocProducts;
