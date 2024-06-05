import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import CycleCount from './CycleCount';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import Footer1 from '../components/Footer1';
import Header from '../components/Header';
import COLORS from './colors';
import {TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import ItemScanner from './ItemScanner.js';
import PoLanding from './PurchaseOrder/PoLanding';
import SideMenu from './SideMenu';
import Dashboard from './Dashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Polygon} from 'react-native-svg';
import {BearerToken} from '../BearerTokenContext/TokenContext';
import {IP} from '../IpAddress/CommonIP';
const SaveCycle = ({route}) => {
  const {data} = route.params;
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [showModal, setshowmodal] = useState(false);
  const navigation = useNavigation();
  const [formErrors, setFormErrors] = useState(
    Array(data?.creationProductsdto.length).fill(''),
  );
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

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

  const [countedqtys, setCountedqtys] = useState(
    Array(data?.creationProductsdto.length).fill(0),
  );

  const openModal = () => {
    setPopupVisible(false);
    setshowmodal(true);
    handlesaveddata();
  };

  const closeModal = () => {
    setshowmodal(false);
    navigation.goBack();
  };
  const [isPopupVisiblesave, setPopupVisiblesave] = useState(false);
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
    saveDataLocally();

    setPopupVisiblesave(true);
  };
  const closePopupsave = () => {
    setPopupVisiblesave(false);
  };
  const handleNoClicksave = () => {
    closePopupsave();
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const handleYesClick = () => {
    closePopup();
  };

  const handleNoClick = () => {
    closePopup();
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

  const saveDataLocally = async () => {
    try {
      const existingSavedData = await AsyncStorage.getItem('savedData');
      const savedData = existingSavedData ? JSON.parse(existingSavedData) : [];
      const countId = data.creationdto.countId;
      const countDescription = data.creationdto.countDescription;

      // Calculate totalBookQty and countedQty
      const totalBookQty = data.creationProductsdto.reduce(
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

          //     totalBookQty >= countedQty
          //       ? Math.abs(totalBookQty - countedQty)
          //       : totalBookQty - countedQty,
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
            countedQty: parseFloat(countedqtys[index]),
            varianceQty: Math.abs(
              parseFloat(parseFloat(product.bookQty) - countedqtys[index]),
            ),
          }),
        ),
      };
      savedData.push(newData);

      await AsyncStorage.setItem('savedData', JSON.stringify(savedData));

      console.log('Data Saved Locally:', newData);
    } catch (error) {
      console.log('Error saving data locally:', error);
    }
  };

  const handlesaveddata = () => {
    const countId = data.creationdto.countId;
    const countDescription = data.creationdto.countDescription;

    // Calculate totalBookQty and countedQty
    const totalBookQty = data.creationProductsdto.reduce(
      (sum, product) => sum + product.bookQty,
      0,
    );

    const countedQty = countedqtys.reduce(
      (sum, countedQty) => sum + parseFloat(countedQty),
      0,
    );

    const varianceQty = totalBookQty - countedQty;
    // Get current date and time for startedAt and completedAt
    const currentDateAndTime = moment().format('DD-MM-YYYY HH:mm:ss');

    const startedAt = currentDateAndTime;
    const completedAt = currentDateAndTime; // Set completedAt to the same as startedAt
    const status = varianceQty !== 0 ? 'processing' : 'complete';
    const reCount = varianceQty !== 0 ? 'processing' : 'complete';
    const reCountQty = 0;
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
        recountVarianceQty: 0,
        reCount,
        reCountQty,

        //     totalBookQty >= countedQty
        //       ? Math.abs(totalBookQty - countedQty)
        //       : totalBookQty - countedQty,
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
          countedQty: parseFloat(countedqtys[index]),
          varianceQty: Math.abs(
            parseFloat(parseFloat(product.bookQty) - countedqtys[index]),
          ),
          recountVarianceQty: 0,
        }),
      ),
    };
    console.log('countedQty', countedQty);
    console.log('total', totalBookQty);

    console.log('data:', savearr);

    axios({
      method: 'post',
      url: IP + '/savestockcount/save',
      data: savearr,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('Data Saved', data);
        //   navigation.navigate('CycleCount', {savearr});
        closePopup();
      })
      .catch(error => {
        console.log('Error ', error);
        // console.log('Error Res:', error.response);
      });
  };

  const renderProductCards = () =>
    data?.creationProductsdto?.map((product, index) => (
      <Pressable
        key={`${product.itemNumber}-${product.countId}-${index}`}
        onPress={closeMenu}>
        <View style={styles.productCard}>
          <Image
            style={styles.productImage}
            source={{uri: product.imageData}}
          />

          <View style={styles.productInfo}>
            <Text style={{color: 'black'}}>
              Item Number: {product.itemNumber}
            </Text>
            <Text
              style={
                styles.productDetails
              }>{`${product.itemName} | ${product.color}`}</Text>

            <Text style={styles.productDetails}>
              Price:{product.price} | Size: {product.size}
            </Text>
            {/* <Text style={styles.productDetails}>Size: {product.size}</Text> */}
            <Text style={styles.productDetails}>Store: {product.store}</Text>
            <Text style={styles.productDetails}>
              Book Quantity: {product.bookQty}
            </Text>
            <View style={styles.quantityContainer}>
              <TextInput
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
              />
              <Text style={styles.errorText}>{formErrors[index]}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    ));

  return (
    <View style={{flex: 1}}>
      <Header showBackButton={true} />
      <TouchableWithoutFeedback onPress={handlepress}>
        <View style={{flex: 1}}>
          <View style={{top: 1, marginBottom: -75}}>
            <TouchableOpacity onPress={toggleMenu}>
              <Icon name="menu" size={45} color="black" />
            </TouchableOpacity>
            <Text
              style={{top: -45, left: 50, fontSize: 30, color: COLORS.black}}>
              Today's Cycle Count
            </Text>
            <TouchableOpacity
              style={styles.addQuantitysave}
              onPress={openPopupsave}>
              <Text style={styles.addQuantityButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addQuantity} onPress={openPopup}>
              <Text style={styles.addQuantityButtonText}>Save Confirm</Text>
            </TouchableOpacity>
          </View>

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
                <Text style={styles.text1}>Saved Succesfully!</Text>
                <View style={styles.buttonContainer1}>
                  <TouchableOpacity
                    style={styles.buttonsave}
                    onPress={closeModal}>
                    <Text style={styles.buttonText1}>ok</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={true}>
            {/* {data && data.creationProductsdto ?renderProductCards() :null} */}
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
    top: -110,
    marginLeft: 220,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: -90,
  },
  quantityInput: {
    borderWidth: 1,
    height: 15,
    width: 55,

    padding: 12,

    borderRadius: 22,

    marginBottom: 55,
  },
  inputfield: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
  },
  container: {
    padding: 16,
    top: 15,
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
    top: -55,
  },
  addQuantitysave: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: -20,
    borderRadius: 10,
    marginHorizontal: 160,
    left: 50,
    top: -46,
  },
  addQuantityButtonText: {
    color: 'white',
    textAlign: 'center',
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
    marginTop: 19,
  },
});

export default SaveCycle;
