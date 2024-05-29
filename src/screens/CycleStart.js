import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import PageTitle from '../components/PageHeader.js';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import SideMenu from './SideMenu';
import Header from '../components/Header';
import Footer1 from '../components/Footer1';
import COLORS from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dashboard from './Dashboard';
import ItemScanner from './ItemScanner.js';
import PoLanding from './PurchaseOrder/PoLanding';
import {BearerToken} from '../BearerTokenContext/TokenContext.js';

const CycleStart = ({route}) => {
  const {data} = route.params;
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isPopupVisiblesave, setPopupVisiblesave] = useState(false);
  const [showModal, setshowmodal] = useState(false);
  const [showModalsave, setshowmodalsave] = useState(false);

  const navigation = useNavigation();
  const [formErrors, setFormErrors] = useState(Array(data?.length).fill(''));
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [error, setError] = useState(null);
  const [saveModal, setSaveModal] = useState(false);
  const [colorsval, setcolors] = useState([]);
  const [qtyVal, setqty] = useState([]);
  const [itemNumberVal, setitemNumber] = useState([]);

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

  const [countedqtys, setCountedqtys] = useState(Array(data?.length).fill(0));

  const openModal = () => {
    setPopupVisible(false);
    setshowmodal(true);
    handlesaveddata();
  };

  const closeModal = () => {
    setshowmodal(false);
    navigation.goBack();
  };
  const closeModalsave = () => {
    setshowmodalsave(false);
  };

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
  const openPopupsave = () => {
    // Validate quantities
    // const newErrors = countedqtys.map(qty => {
    //   if (qty === 0 || qty === '' || isNaN(qty)) {
    //     return 'Invalid Input';
    //   }
    //   return '';
    // });

    // setFormErrors(newErrors);

    // if (newErrors.some(error => error !== '')) {
    //   return;
    // }
    //saveDataLocally();
    if (data.creationProductsdto[0].count > 0) {
      setPopupVisiblesave(true);
      handlesaveddata();
    } else {
      setError('Scan product to Save');
      console.log('Scan product to Save');
    }
  };
  console.log('data', data);
  const qty = [];
  const itemNumber = [];
  const colors = [];
  const handleSaveModal = () => {
    data.creationProductsdto.map(item => {
      if (item.count) {
        qty.push(item.count);
        itemNumber.push(item.itemNumber);
        colors.push(item.color);
        console.log('map', item.count);
      } else {
        qty.push(0);
        itemNumber.push(item.itemNumber);
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
  const handleNoClicksave = () => {
    closePopupsave();
  };

  const handlescan = () => {
    setError(null);
    navigation.navigate('ScheduledStockCountScan', {products: data});
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
    const countId = data.creationdto?.countId || '';
    const countDescription = data.creationdto?.countDescription || '';

    // Calculate totalBookQty and countedQty
    const totalBookQty = data.creationdto?.totalBookQty;

    let countedQty = 0;
    data.creationProductsdto.map(item => {
      countedQty = countedQty + (item.count ? item.count : 0);
    });

    const varianceQty = totalBookQty - countedQty;
    // Get current date and time for startedAt and completedAt
    const currentDate = new Date();
    const startedAt = currentDate.toISOString();
    const completedAt = startedAt; // Set completedAt to the same as startedAt
    const status = varianceQty !== 0 ? 'processing' : 'complete';
    const reCount = varianceQty !== 0 ? 'processing' : 'complete';

    const savearr = {
      saveStockCountInfo: {
        countId,
        countDescription,
        startedAt,
        completedAt,
        status,
        totalBookQty,
        countedQty,
        varianceQty: Math.abs(totalBookQty - countedQty),
        reCount,
      },
      saveStockCountProducts: data.creationProductsdto.map(
        (product, index) => ({
          itemNumber: product.itemNumber,
          itemName: product.itemName,
          category: product.category,
          color: product.color,
          price: product.price,
          size: product.size,
          imageData: product.imageData,
          store: product.store,
          bookQty: product.bookQty,
          countedQty: product.count ? product.count : 0,
          varianceQty: Math.abs(
            parseFloat(product.bookQty) - (product.count ? product.count : 0),
          ),
          sku: product.sku,
        }),
      ),
    };

    axios({
      method: 'post',
      url: 'http://172.20.10.9:9022/savestockcount/save',
      data: savearr,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log(response.data);
        console.log('Data Saved', data);
        navigation.navigate('CycleCount', {savearr});
        closePopup();
      })
      .catch(error => {
        console.log('Error ', error);
      });
  };
  //console.log('data', data);

  const saveDataLocally = async () => {
    try {
      const existingSavedData = await AsyncStorage.getItem('savedData');
      const savedData = existingSavedData ? JSON.parse(existingSavedData) : [];
      const countId = data[0]?.stockcount?.countId || '';
      const countDescription = data[0]?.stockcount?.countDescription || '';

      // Calculate totalBookQty and countedQty
      const totalBookQty = data.reduce(
        (sum, product) => sum + product.bookQty,
        0,
      );

      const countedQty = countedqtys.reduce(
        (sum, countedQty) => sum + parseFloat(countedQty),
        0,
      );

      const varianceQty = totalBookQty - countedQty;
      // Get current date and time for startedAt and completedAt
      const currentDate = new Date();
      const startedAt = currentDate.toISOString();
      const completedAt = startedAt; // Set completedAt to the same as startedAt
      const status = varianceQty !== 0 ? 'processing' : 'complete';
      const reCount = varianceQty !== 0 ? 'processing' : 'complete';

      const newData = {
        saveStockCountInfo: {
          countId,
          countDescription,
          startedAt,
          completedAt,
          status,
          totalBookQty,
          countedQty,
          varianceQty: Math.abs(totalBookQty - countedQty),
          reCount,
        },
        saveStockCountProducts: data.map((product, index) => ({
          itemNumber: product.itemNumber,
          itemName: product.itemName,
          category: product.category,
          color: product.color,
          price: product.price,
          size: product.size,
          imageData: product.imageData,
          store: product.store,
          bookQty: product.bookQty,
          countedQty: parseFloat(countedqtys[index]),
          varianceQty: Math.abs(
            parseFloat(product.bookQty) - countedqtys[index],
          ),
        })),
      };
      savedData.push(newData);

      await AsyncStorage.setItem('savedData', JSON.stringify(savedData));

      console.log('Data Saved Locally:', newData);
    } catch (error) {
      console.error('Error saving data locally:', error);
    }
  };

  const renderProductCards = () =>
    data.creationProductsdto?.map((product, index) => (
      <Pressable key={`${product.itemNumber}-${index}`} onPress={closeMenu}>
        <View style={styles.productCard}>
          <Image
            style={styles.productImage}
            source={{uri: product.imageData}}
            resizeMode="contain"
          />

          <View style={styles.productInfo}>
            <Text style={{color: 'black', top: '-20%'}}>
              Item Number: {product.itemNumber}
            </Text>
            <Text
              style={
                styles.productDetails
              }>{`${product.itemName} | ${product.color}`}</Text>

            <Text style={styles.productDetails}>
              Price:{product.price} | Size: {product.size}
            </Text>
            <Text style={styles.productDetails}>Store: {product.store}</Text>
            <Text style={styles.productDetails}>
              Book Quantity: {product.bookQty}
            </Text>
            <Text style={styles.productDetails}>
              Location: {product.categoryLocation}
            </Text>

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
                {product.count ? product.count : 0}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    ));

  return (
    <View style={{flex: 1, flexGrow: 1}}>
      <Header showBackButton={true} />
      <PageTitle title={'Stock Count'} />

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
              justifyContent: 'flex-end',
              top: -14,
            }}>
            <TouchableOpacity style={styles.save} onPress={handleSaveModal}>
              <Text style={styles.addQuantityButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addQuantitysave}
              onPress={handlescan}>
              <Text style={styles.addQuantityButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>
          {error == null ? (
            ''
          ) : (
            <Text
              style={{color: 'red', left: '63%', fontWeight: 500, top: '1%'}}>
              {error}
            </Text>
          )}

          <View style={{left: 158, top: 24}}>
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
                    onPress={handleNoClicksave}>
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
                </View> */}
                {/* {qtyVal?.map(item => {
                  return (
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 16,
                        padding: 5,
                        marginLeft: 210,
                        top: '-41%',
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
          <ScrollView contentContainerStyle={styles.container}>
            {renderProductCards()}
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
    </View>
  );
};

const styles = StyleSheet.create({
  quantityContainer: {
    top: '-120%',
    marginLeft: 200,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: -90,
    position: 'relative',
  },

  container: {
    padding: 16,
    top: -18,
    paddingTop: 25,
    flexGrow: 1,
    paddingBottom: 170,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    padding: '8%',
    borderRadius: 5,
    paddingHorizontal: 7,
    margin: 5,
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
  },
  productDetails: {
    top: '-21%',
    fontSize: 16,
    color: 'grey',
    marginTop: 6,
  },
  addQuantity: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: -20,
    borderRadius: 10,
    marginHorizontal: 160,
    left: 150,
    marginTop: -30,
    top: -25,
  },
  addQuantitysave: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  addQuantityButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  save: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 1,
  },
  text1: {
    fontSize: 18,
    color: '#484848',
    textAlign: 'center',
  },
  button1: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 20,
    marginHorizontal: 30,
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
    padding: 20,
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

export default CycleStart;
