import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import React, {useContext} from 'react';
import COLORS from '../../../constants/colors';
import Header from '../../components/Header';
import {useState} from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import DetailCard from './PoDetailComp/DetailCard';
import {StyleSheet} from 'react-native';
import PageTitle from '../../components/PageHeader';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Card, useTheme, Overlay, Button} from '@rneui/themed';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon4 from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import {useNavigation} from '@react-navigation/native';
import {useCardContext} from './Context/CardContext';
import {FAB} from '@rneui/themed';
import {BearerToken} from '../../BearerTokenContext/TokenContext';
import {IP} from '../../IpAddress/CommonIP';
const PoDetailPage = ({route}) => {
  const navigation = useNavigation();
  const {itemID, type, status} = route.params; //300001;
  const {theme} = useTheme();
  //console.log('itemID: ', itemID);
  const [data, setData] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [wrongItem, SetwrongItem] = useState(false);
  const [proofOverlay, SetProofOverlay] = useState(false);
  const [proofAttachmentOverlay, SetProofAttachmentOverlay] = useState(false);
  const [saveOverlay, SetSaveOverlay] = useState(false);
  const [saveConfirmationOverlay, SetSaveConfirmationOverlay] = useState(false);
  const [itemNumberInput, setItemNumberInput] = useState('');
  const [category, setCategory] = useState('');
  const [receivedQty, setReceivedQty] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadImage, setUploadImage] = useState('');
  const [proofImage, setProofImage] = useState(null);
  const [wrongItemdata, setWrongItemdata] = useState(null);
  const [noDataFound, setNoDataFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedvalue, setSelectedvalue] = useState([]);
  const [SizeArray, setsizeArray] = useState([]);
  const [ColorArray, setColorArray] = useState([]);

  const numericRegex = /^[0-9]+$/;
  const {cardData, setCardData} = useCardContext();
  const {token} = BearerToken();

  function handleWrongItem() {
    SetwrongItem(true);
  }
  function closeWrongItemModal() {
    SetwrongItem(false);
  }

  function handleSaveModal() {
    SetSaveOverlay(true);
  }
  function handleProofModal() {
    console.log('yes clicked ');
    SetProofOverlay(false);
  }
  function closeSaveModal() {
    SetSaveOverlay(false);
    SetProofOverlay(false);
  }
  function handleSaveConfirmationModal() {
    handlesaveddata();
    SetSaveConfirmationOverlay(true);
  }
  function closeSaveConfirmationModal() {
    SetSaveConfirmationOverlay(false);
    SetProofAttachmentOverlay(false);
    SetSaveOverlay(false);
    SetProofOverlay(false);
    navigation.navigate('PoLanding');
  }

  function handleProofImageOverlay() {
    SetProofAttachmentOverlay(true);
  }

  function closeProofImageOverlay() {
    SetProofAttachmentOverlay(false);
  }
  function handleDeleteMenu() {
    navigation.navigate('PoLanding');
  }
  function handleSaveDraft() {
    const savearr = cardData.map((product, index) => ({
      itemNumber: product.itemNumber,
      itemName: product.itemName,
      expectedQty: product.expectedQty,
      receivedQty: product.newReceivedVal,
      remainingQty: product.remainingQty,
      damageQty: product.newdamageQty,
      damageImage: product.damageImage,
      damageImageBase64: product.damageImageBase64,
      category: product.category,
      color: product.color,
      price: product.price,
      size: product.size,
      imageData: product.imageData,
      upc: product.upc,
      sku: product.sku,
      taxPercentage: product.taxPercentage,
      taxCode: product.taxCode,
      asnNumber: type == 'ASN' ? itemID : 0,
      poNumber: type == 'ASN' ? product.poNumber : itemID,
    }));

    axios({
      method: 'post',
      url: IP + '/purchaseOrder/save/draft/po',
      data: savearr,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('response.data : ', response.data);
        //console.log('Data Saved', data);
        navigation.navigate('PoLanding');
        // closePopup();
      })
      .catch(error => {
        console.log('Error ', error);
      });

    console.log('savearr : ', savearr);
  }
  const handlesaveddata = () => {
    const savearr = {
      attachedImage: uploadImage == '' ? '' : uploadImage[0].name,
      purchaseOrderItemsdto: cardData.map((product, index) => ({
        itemNumber: product.itemNumber,
        itemName: product.itemName,
        expectedQty: product.expectedQty,
        receivedQty: product.newReceivedVal,
        remainingQty: product.remainingQty,
        damageQty:
          product.newdamageQty == 0 ? product.damageQty : product.newdamageQty,
        damageImage: product.damageImage,
        damageImage: product.damageImageBase64,
        category: product.category,
        color: product.color,
        price: product.price,
        size: product.size,
        imageData: product.imageData,
        upc: product.upc,
        sku: product.sku,
        taxPercentage: product.taxPercentage,
        taxCode: product.taxCode,
        poNumber: type == 'ASN' ? product.poNumber : itemID,
        asnNumber: type == 'ASN' ? itemID : 0,
      })),
    };
    console.log('savearr : ', savearr);
    const store = 'Pacific Dwarka';
    axios({
      method: 'post',
      url: `${IP}/purchaseOrder/save/po_receive/${store}`,
      data: savearr,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log(response.data);
        // navigation.navigate('CycleCount', {savearr});
        // closePopup();
      })
      .catch(error => {
        console.log('Error ', error);
      });
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res);
      setSelectedImage(res);
      // Handle the picked file (e.g., upload it)
      console.log(
        'URI : ' + res[0].uri,
        'Type : ' + res.type, // mime type
        'File Name : ' + res.name,
        'File Size : ' + res.size,
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('User cancelled the picker');
      } else {
        // Error occurred
        console.log('Error occurred:', err);
      }
    }
  };

  const uploadFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res);
      setUploadImage(res);
      // Handle the picked file (e.g., upload it)
      console.log(
        'URI : ' + res[0].uri,
        'Type : ' + res.type, // mime type
        'File Name : ' + res.name,
        'File Size : ' + res.size,
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('User cancelled the picker');
      } else {
        // Error occurred
        console.log('Error occurred:', err);
      }
    }
  };
  function handleProofOverlay() {
    SetProofOverlay(true);
  }
  const poItems = async () => {
    if (type == 'ASN' && status != 'InProgress') {
      try {
        const response = await axios.get(
          `${IP}/purchaseOrder/getitemsby/asnnumber/${itemID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const responseData = response.data;
        const res = responseData.map(item => {
          return {
            ...item,
            damageQty: 0,
            newReceivedVal: null,
            damageImage: null,
            damageImageBase64: null,
          };
        });
        setCardData(res);
      } catch (error) {
        console.log('Po detail data Error fetching :', error);
      }
    }
    if (type == 'PO' && status != 'InProgress') {
      try {
        const response = await axios.get(
          `${IP}/purchaseOrder/findbyPO/${itemID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const responseData = response.data;
        const res = responseData.map(item => {
          return {
            ...item,
            newReceivedVal: 0,
          };
        });
        setCardData(res);
      } catch (error) {
        console.log('Po detail data Error fetching :', error);
      }
    }

    if (status == 'InProgress') {
      try {
        const response = await axios.get(
          `${IP}/purchaseOrder/get/draft/items/${itemID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const responseData = response.data;
        const res = responseData.map(item => {
          return {
            ...item,
            newdamageQty: item.damageQty == 0 ? 0 : item.damageQty,
            damageImage: item.damageImage == null ? null : item.damageImage,
            newReceivedVal: item.receivedQty == null ? 0 : item.receivedQty,
          };
        });
        setCardData(res);
      } catch (error) {
        console.log('Po detail data Error fetching :', error);
      }
    }
  };
  useEffect(() => {
    poItems();
  }, []);

  const handleWrongProduct = async () => {
    let sku = [];
    try {
      const response = await axios.get(
        `${IP}/product/getsku/${itemNumberInput}/${selectedColor}/${selectedSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const responseData = response.data;
      // console.log('responseData ', responseData);

      const filteredItem = responseData.filter(
        item => item.store.storeName === val,
      );
      // console.log('filteredItem :', filteredItem);

      sku = filteredItem.map(item => item.sku);

      console.log('sku[0] :', sku[0]);
    } catch (error) {
      console.log('Wrong Product data Error fetching :', error);
    }

    const item = {
      category: category,
      color: selectedColor,
      damageQty: 0,
      expectedQty: 0,
      imageData: 'null',
      itemName: itemNumberInput,
      itemNumber: itemNumberInput,
      poNumber: 0,
      price: 0,
      receivedDate: null,
      remainingQty: 0,
      newReceivedVal: receivedQty,
      size: selectedSize,
      sku: sku[0],
      taxCode: null,
      taxPercentage: null,
      upc: null,
    };
    setCardData([...cardData, item]);
    //<DetailCard item={item} />;
    console.log('item data : ', item);
    setWrongItemdata(item);
    SetwrongItem(false);
    if (wrongItem) {
      setItemNumberInput('');
    }
  };
  const val = 'Pacific Dwarka';

  const [selectedColor, setSelectedColor] = useState('Select Color');
  const [selectedSize, setSelectedSize] = useState('Select Size');
  const [showPicker, setShowPicker] = useState(false);

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };
  const handleColorSelect = itemValue => {
    setSelectedColor(itemValue);
    //togglePicker();
  };

  const handleSizeSelect = itemValue => {
    setSelectedSize(itemValue);
    //togglePicker();
  };

  // console.log('ColorArray : ', ColorArray);

  const handleSuggestionSelect = async selectedItemNumber => {
    setItemNumberInput(selectedItemNumber);
    const numericRegex = /^[0-9]+$/;
    const result = numericRegex.test(selectedItemNumber);
    console.log('selectedItemNumber ', selectedItemNumber);
    console.log('result ', result);
    if (result === true) {
      try {
        const response = await axios.get(
          `${IP}/product/getProductByitemNumber/${selectedItemNumber}/${val}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const responseData = response.data;
        setCategory(responseData.categoryName);
        console.log('responseData select ', responseData);

        const colorsSet = new Set(
          responseData.productDetailsdto.map(item => item.color),
        );
        const colors = [...colorsSet];
        setColorArray(colors);

        // console.log('SizeArray select ', ColorArray);
        const sizeSet = new Set(
          responseData.productDetailsdto.map(item => item.size),
        );
        setsizeArray([...sizeSet]);
      } catch (error) {
        console.log(error);
        setNoDataFound(true);
      }
      // setItemNumber('');
      setSuggestions([]);
    } else {
      try {
        const response = await axios.get(
          `${IP}/product/getProductByitemName/${selectedItemNumber}/${val}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const responseData = response.data;
        setCategory(responseData.categoryName);
        console.log('responseData select ', responseData);

        const colorsSet = new Set(
          responseData.productDetailsdto.map(item => item.color),
        );
        const colors = [...colorsSet];
        setColorArray(colors);

        // console.log('SizeArray select ', ColorArray);
        const sizeSet = new Set(
          responseData.productDetailsdto.map(item => item.size),
        );
        setsizeArray([...sizeSet]);
      } catch (error) {
        console.log(error);
        setNoDataFound(true);
      }
      setSuggestions([]);
    }
  };

  const handleInputChange = async input => {
    setItemNumberInput(input);
    const numericRegex = /^[0-9]+$/;
    const result = numericRegex.test(input);

    if (result === true) {
      console.log('input ', input);
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
        //console.log('data bsvxs', data);
        const filteredSuggestions = data.filter(
          item => item.store.storeName === val,
        );
        //console.log('filteredSuggestions bsvxs', filteredSuggestions);

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
          `${IP}/product/getMatched/products/Itemname/${input}`,
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

  console.log('Current data from Po detail : ', cardData);
  return (
    <View style={{flex: 1}}>
      <Header />
      <PageTitle title={'Purchase Order'} />
      <TouchableOpacity onPress={toggleMenu}>
        <Icon
          name="ellipsis-v"
          size={22}
          color="black"
          style={{top: 20, alignSelf: 'flex-end', left: -8}}
        />
      </TouchableOpacity>
      {menuVisible && (
        <View
          style={{
            position: 'absolute',
            top: 182,
            right: 10,
            width: '50%',
            backgroundColor: 'white',
            borderRadius: 5,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            zIndex: 1,
          }}>
          <TouchableOpacity
            style={{borderWidth: 1, padding: 10, borderRadius: 1}}
            onPress={handleSaveDraft}>
            <Text>Save as Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderWidth: 1, padding: 10, borderRadius: 1}}
            onPress={handleProofOverlay}>
            <Text>Save and Complete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderWidth: 1, padding: 10, borderRadius: 1}}
            onPress={handleDeleteMenu}>
            <Text>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{borderWidth: 1, padding: 10, borderRadius: 1}}
            onPress={handleWrongItem}>
            <Text>Add Wrong Item</Text>
          </TouchableOpacity>
        </View>
      )}
      {type == 'ASN' ? (
        <Text style={styles.text}>ASN Number : {itemID}</Text>
      ) : (
        <Text style={styles.text}>PO Number : {itemID}</Text>
      )}

      {cardData.map(item => (
        <DetailCard item={item} type={type} itemID={itemID} status={status} />
      ))}

      {/* FAB: Add a new adjustment */}
      <FAB
        color={theme.colors.primary}
        style={styles.fab}
        icon={{
          name: 'plus-thick',
          type: 'material-community',
          color: 'white',
        }}
        onPress={() => {
          navigation.navigate('PoDetailScan');
        }}
      />
      {/* {wrongItemdata && <DetailCard item={wrongItemdata} />} */}

      {/* Add Wrong Product Modal */}
      <Overlay
        isVisible={wrongItem}
        onBackdropPress={closeWrongItemModal}
        overlayStyle={styles.wrongModal}>
        <Text style={{color: 'black', fontWeight: 500, fontSize: 18}}>
          Add Wrong Product
        </Text>

        <View style={{flexDirection: 'row', alignItems: 'center', top: 0}}>
          <Text style={{color: 'black', left: -6, fontSize: 16}}>
            ItemNumber/Name
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              height: 30,
              padding: 8,
              width: '40%',
              borderRadius: 7,
              textAlign: 'left',
            }}
            placeholder="Enter"
            onChangeText={handleInputChange}
            value={itemNumberInput}
          />
        </View>

        {/* Suggestions */}
        {numericRegex.test(itemNumberInput)
          ? suggestions.length > 0 && (
              <ScrollView
                style={{
                  maxHeight: 80,
                  backgroundColor: 'white',
                  elevation: 1,
                  position: 'absolute',
                  top: 92,
                  left: 188,
                  borderRadius: 4,
                  color: 'green',
                  zIndex: 1,
                  width: '40%',
                  paddingHorizontal: 2,
                  paddingVertical: 2,
                  elevation: 4,
                  borderWidth: 1,
                  borderColor: 'pink',
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
                  maxHeight: 80,
                  backgroundColor: 'white',
                  elevation: 1,
                  position: 'absolute',
                  top: 92,
                  left: 188,
                  borderRadius: 4,
                  color: 'green',
                  zIndex: 1,
                  width: '40%',
                  paddingHorizontal: 2,
                  paddingVertical: 2,
                  elevation: 4,
                  borderWidth: 1,
                  borderColor: 'black',
                }}>
                {suggestions.map(suggestion => (
                  <TouchableOpacity
                    key={suggestion.product.id}
                    style={styles.suggestionItem}
                    onPress={() =>
                      handleSuggestionSelect(suggestion.product.itemName)
                    }>
                    <Text>{suggestion.product.itemName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              color: 'black',
              left: -44,
              fontSize: 16,
              paddingHorizontal: 31,
            }}>
            Category
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              height: 30,
              padding: 8,
              width: '40%',
              borderRadius: 7,
              textAlign: 'left',
            }}
            placeholder="Enter Category"
            // onChangeText={setCategory}
            value={category}
          />
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              color: 'black',
              left: -56,
              fontSize: 16,
              paddingHorizontal: 42,
            }}>
            Color {''}
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: 'black',
              height: 30,
              width: 141,
              borderRadius: 7,
              backgroundColor: 'white',
              paddingHorizontal: -4,
            }}>
            <TouchableWithoutFeedback>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}></View>
            </TouchableWithoutFeedback>
            {/* {showPicker && ( */}
            <Picker
              selectedValue={selectedColor}
              onValueChange={handleColorSelect}
              style={{flex: 1, top: -12, textAlign: 'left', left: -8}}>
              {ColorArray.map((color, index) => (
                <Picker.Item key={index} label={color} value={color} />
              ))}
            </Picker>
            {/* )} */}
          </View>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              color: 'black',
              left: -58,
              fontSize: 16,
              paddingHorizontal: 46,
            }}>
            Size{' '}
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: 'black',
              height: 30,
              width: 141,
              borderRadius: 7,
              backgroundColor: 'white',
              paddingHorizontal: -1,
            }}>
            <TouchableWithoutFeedback>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}></View>
            </TouchableWithoutFeedback>
            {/* {showPicker && ( */}
            <Picker
              selectedValue={selectedSize}
              onValueChange={handleSizeSelect}
              style={{flex: 1, top: -12, textAlign: 'left', left: -8}}>
              {SizeArray.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))}
            </Picker>
            {/* )} */}
          </View>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: 'black', left: -3, fontSize: 16}}>
            PO Quantity {'             '}
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              height: 30,
              padding: 8,
              width: '40%',
              borderRadius: 7,
              textAlign: 'left',
            }}
            placeholder="Enter PO Qty"
            //onChangeText={setTextInput}
            value="0"
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: 'black', left: -2, fontSize: 16}}>
            Received Quantity {'  '}
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              height: 30,
              padding: 8,
              width: '40%',
              borderRadius: 7,
              textAlign: 'left',
            }}
            placeholder="Enter Received Qty"
            onChangeText={setReceivedQty}
            value={receivedQty}
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: 'black', left: -90, fontSize: 16}}>
            Add Proof
          </Text>
          <TouchableOpacity onPress={pickFile}>
            <Icon2 name="upload" size={25} color="black" style={{left: -64}} />
          </TouchableOpacity>
        </View>

        <Text style={{color: 'red', fontWeight: 400, left: -30, top: -6}}>
          {selectedImage && selectedImage[0].name}
        </Text>
        <Button
          title="ADD"
          buttonStyle={{backgroundColor: COLORS.primary}}
          containerStyle={styles.modalButton}
          titleStyle={{
            fontFamily: 'Montserrat-Medium',
            color: 'white',
            marginHorizontal: 20,
          }}
          onPress={() => handleWrongProduct()}
        />
      </Overlay>

      {/* Add Proofs Modal */}
      <Overlay
        isVisible={proofOverlay}
        onBackdropPress={proofOverlay}
        overlayStyle={styles.proofModal}>
        <Icon2
          name="info"
          size={45}
          color="black"
          style={{alignSelf: 'center', top: 15}}
        />

        <Text style={{color: 'black', fontWeight: 500, fontSize: 18}}>
          Do you want to add proofs for PO Receive?
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Button
            title="Yes"
            buttonStyle={{backgroundColor: COLORS.primary}}
            containerStyle={styles.modalButton}
            titleStyle={{
              fontFamily: 'Montserrat-Medium',
              color: 'white',
              marginHorizontal: 20,
            }}
            onPress={() => handleProofImageOverlay()}
          />
          <Button
            title="No"
            buttonStyle={{backgroundColor: COLORS.primary}}
            containerStyle={styles.modalButton}
            titleStyle={{
              fontFamily: 'Montserrat-Medium',
              color: 'white',
              marginHorizontal: 20,
            }}
            onPress={() => handleSaveModal()}
          />
        </View>
      </Overlay>

      {/* Add Proof photo Modal */}
      <Overlay
        isVisible={proofAttachmentOverlay}
        onBackdropPress={closeProofImageOverlay}
        overlayStyle={styles.proofModal}>
        <Icon2
          name="info"
          size={45}
          color="black"
          style={{alignSelf: 'center', top: 15}}
        />

        <View style={{flexDirection: 'row', alignItems: 'center', top: 23}}>
          <Text style={{color: 'black', left: -10, fontSize: 16}}>
            Upload From Device
          </Text>
          <TouchableOpacity onPress={uploadFile}>
            <Icon2 name="upload" size={25} color="black" style={{left: -1}} />
          </TouchableOpacity>
        </View>

        <Text style={{color: 'red', fontWeight: 400, left: 20, top: 1}}>
          {uploadImage && uploadImage[0].name}
        </Text>

        <Button
          title="Next"
          buttonStyle={{backgroundColor: COLORS.primary}}
          containerStyle={styles.modalButton}
          titleStyle={{
            fontFamily: 'Montserrat-Medium',
            color: 'white',
            marginHorizontal: 20,
          }}
          onPress={() => handleSaveModal()}
        />
      </Overlay>

      {/* Save Po Modal */}
      <Overlay
        isVisible={saveOverlay}
        onBackdropPress={closeSaveModal}
        overlayStyle={styles.proofModal}>
        <Icon3
          name="content-save"
          size={45}
          color="black"
          style={{alignSelf: 'center', top: 15}}
        />

        <Text style={{color: 'black', fontWeight: 500, fontSize: 18}}>
          Do you want to save this PO Receiving?
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Button
            title="Yes"
            buttonStyle={{backgroundColor: COLORS.primary}}
            containerStyle={styles.modalButton}
            titleStyle={{
              fontFamily: 'Montserrat-Medium',
              color: 'white',
              marginHorizontal: 20,
            }}
            onPress={() => handleSaveConfirmationModal()}
          />
          <Button
            title="No"
            buttonStyle={{backgroundColor: COLORS.primary}}
            containerStyle={styles.modalButton}
            titleStyle={{
              fontFamily: 'Montserrat-Medium',
              color: 'white',
              marginHorizontal: 20,
            }}
            onPress={() => closeSaveModal()}
          />
        </View>
      </Overlay>
      {/* Saved Po confirmation Modal */}
      <Overlay
        isVisible={saveConfirmationOverlay}
        // onBackdropPress={closeSaveModal}
        overlayStyle={styles.proofModal}>
        <Icon4
          name="cloud-done"
          size={45}
          color="black"
          style={{alignSelf: 'center', top: 15}}
        />

        <Text style={{color: 'black', fontWeight: 500, fontSize: 18}}>
          Saved Successfully
        </Text>

        <Button
          title="OK"
          buttonStyle={{backgroundColor: COLORS.primary}}
          containerStyle={styles.modalButton}
          titleStyle={{
            fontFamily: 'Montserrat-Medium',
            color: 'white',
            marginHorizontal: 20,
          }}
          onPress={() => closeSaveConfirmationModal()}
        />
      </Overlay>
    </View>
  );
};

export default PoDetailPage;
const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontFamily: 'Montserrat-Regular',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
    marginTop: -1,
  },
  fab: {
    // alignSelf: 'flex-end',
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 10,
  },
  wrongModal: {
    width: 380,
    height: 500,
    paddingVertical: 20,
    borderRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  proofModal: {
    width: 350,
    height: 280,
    paddingVertical: 20,
    borderRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalButton: {
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 15,
    top: -22,
  },
  suggestionItem: {
    padding: 10,
  },
});
