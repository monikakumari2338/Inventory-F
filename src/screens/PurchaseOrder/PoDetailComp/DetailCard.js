import React, {useState} from 'react';
import COLORS from '../../../../constants/colors';
import {Card, Icon, Overlay, Button} from '@rneui/themed';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import {useTheme} from '@rneui/themed';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/Feather';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import {useNavigation} from '@react-navigation/native';
import {useCardContext} from '../Context/CardContext';

export default function DetailCard({item, type, itemID, status}) {
  const navigation = useNavigation();
  const [items, setItems] = useState(item);
  const [textInput, setTextInput] = useState(
    status == 'InProgress' ? String(item.damageQty) : 0,
  );
  const [damageQty, setDamageQty] = useState('');
  const {theme} = useTheme();
  const [deleteOverlay, setDeleteOverlay] = useState(false);
  const [infoOverlay, setInfoOverlay] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Select Status');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const {cardData, setCardData} = useCardContext();
  const options = ['Damaged'];

  // console.log(' Detail card Item : ', item);
  // console.log(' status : ', status);
  function toggleOverlay() {
    setDeleteOverlay(!deleteOverlay);
  }
  function handleDelete(itemId) {
    toggleOverlay();
    deleteItem(itemId, parentItemId);
  }
  function InfoOverlay() {
    setInfoOverlay(!infoOverlay);
  }
  function handleInfoOverlay() {
    InfoOverlay();
  }

  // function handleScan() {
  //   navigation.navigate('PoDetailScan', {item: item, type: type});
  // }

  const handleSelect = option => {
    setSelectedOption(option);
    setIsVisible(false);
  };

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res);
      setSelectedImage(res);

      if (res != null) {
       
        // Read the selected image file content

        const imageData = await RNFS.readFile(res[0].uri, 'base64');
        // Convert image data to base64 string

        if (!imageData) {
          console.log('imagedata is null');
        }
        const base64String = `data:${res[0].type};base64,${imageData}`;

        console.log('base64String ', base64String);
        handleDamageImageUpload(res[0].name,base64String);
        // console.log('img ', selectedImage);
      }
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

  const receivedQTY = `${
    type == 'ASN'
      ? (item.newReceivedVal == null ? 0 : +item.newReceivedVal) +
        (item.newdamageQty == null ? 0 : +item.newdamageQty)
      : status == 'InProgress'
      ? (item.newReceivedVal == null ? 0 : +item.newReceivedVal) +
        (item.newdamageQty == null ? 0 : +item.newdamageQty)
      : (item.newReceivedVal == null
          ? +item.receivedQty
          : +item.newReceivedVal +
            +(item.receivedQty == null ? 0 : item.receivedQty)) +
        (item.newdamageQty == null
          ? +item.damageQty
          : +item.newdamageQty + +item.damageQty)
  }/${item.expectedQty}`;

  const handleValueChange = (text, card) => {
    const cardNew = card.map(cardItem => {
      if (cardItem.sku === item.sku) {
        return {
          ...cardItem,
          receivedQty: +item.receivedQty,
          newReceivedVal: text,
        };
      }
      return cardItem;
    });
    setCardData(cardNew);
  };

  const handleDamageValueChange = text => {
    setTextInput(text);
    if (text < item.expectedQty) {
      const cardNew = cardData.map(cardItem => {
        if (cardItem.sku === item.sku) {
          return {
            ...cardItem,
            newdamageQty: text,
            //damageImage: selectedImage[0].name,
          };
        }
        return cardItem;
      });
      setCardData(cardNew);
      console.log('new data ', cardData);
    } else {
      Alert.alert("Damage Qty can't be greater than expected Qty");
    }
  };
  const handleDamageImageUpload = (text,base64String) => {
    const cardNew = cardData.map(cardItem => {
      if (cardItem.sku === item.sku) {
        return {
          ...cardItem,
          damageImage: text,
          damageImageBase64:base64String
        };
      }
      return cardItem;
    });
    setCardData(cardNew);
    console.log('new data ', cardData);
  };

  return (
    <>
      <Card containerStyle={styles.card}>
        <View style={styles.cardTitleContainer}>
          {type == 'ASN' ? (
            <Text style={styles.poTitleText}>PO Number : {item.poNumber}</Text>
          ) : (
            <Text style={styles.poTitleText}>PO Number : {itemID}</Text>
          )}
        </View>

        <View style={styles.itemInfoContainer1}>
          <Text style={styles.itemInfo}>{item.itemName}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}></View>
        </View>
        <View style={{flexDirection: 'row', alignSelf: 'flex-start', top: 17}}>
          <Text style={styles.scannedShipmentText}>Scanned Quantity </Text>

          <TextInput
            style={{
              borderWidth: 1,
              height: 30,
              padding: 8,
              width: '28%',
              borderRadius: 7,
              textAlign: 'left',
              marginHorizontal: 133,
              top: -65,
            }}
            //placeholder="Enter Qty"
            onChangeText={text => {
              handleValueChange(text, cardData);
            }}
            // onChangeText={text => onChangeReceivedQty(cardData, text)}
            // onChange={text => onChangeReceivedQty(text)}

            value={
              // newReceivedVal
              item.newReceivedVal == null ? '' : String(item.newReceivedVal)
            }
          />
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', top: -41}}>
          <Text style={{color: 'black'}}>Received Quantity </Text>
          <TextInput
            style={{
              borderWidth: 1,
              height: 30,
              padding: 8,
              width: '28%',
              borderRadius: 7,
              color: 'black',
              fontSize: 14,
              marginHorizontal: 140,
            }}
            editable={false}
            // onChangeText={text => onchangependingQty('damagedQty', text)}
            //onChange={onchangependingQty}
            value={receivedQTY}
          />
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', top: -35}}>
          <Text style={{color: 'black'}}>Damaged Quantity </Text>
          <TextInput
            style={{
              borderWidth: 1,
              height: 30,
              padding: 8,
              width: '28%',
              borderRadius: 7,
              textAlign: 'left',
              marginHorizontal: 137,
            }}
            placeholder="Enter Qty"
            onChangeText={text => {
              //setTextInput(text);
              handleDamageValueChange(text);
            }}
            //onChange={onchangependingQty}
            value={textInput}
          />
          <Text
            style={{
              color: 'red',
              fontSize: 10,
              left: -291,
              top: 26,
            }}>
            {/* {selectedImage && selectedImage[0].name} */}
            {item.damageImage == null
              ? selectedImage && selectedImage[0].name
              : String(item.damageImage)}
          </Text>
        </View>

        <View style={styles.itemInfoContainer3}>
          <TouchableOpacity onPress={pickFile}>
            <Icon3 name="upload" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </Card>
    </>
  );
  {
    /* info Damaged Product Modal */
  }
  // <Overlay
  //   isVisible={infoOverlay}
  //   onBackdropPress={InfoOverlay}
  //   overlayStyle={styles.wrongModal}>
  //   <Text style={{color: 'red', fontWeight: 400, fontSize: 18}}>
  //     ! Report Damaged Product
  //   </Text>

  //   <TouchableOpacity onPress={() => setIsVisible(true)}>
  //     <Text
  //       style={{
  //         borderWidth: 1,
  //         padding: 10,
  //         width: 300,
  //       }}>
  //       {selectedOption}
  //     </Text>
  //     <Icon2
  //       name="arrow-drop-down"
  //       size={35}
  //       color="black"
  //       style={{alignSelf: 'flex-end', top: -38}}
  //     />
  //   </TouchableOpacity>

  //   <Modal visible={isVisible} animationType="none" transparent>
  //     <View
  //       style={{
  //         backgroundColor: '#E5E4E3',
  //         padding: 10,
  //         borderWidth: 1,
  //         borderColor: 'black',
  //         color: 'green',
  //         height: '6%',
  //         width: '73.2%',
  //         alignItems: 'left',
  //         top: '43.61%',
  //         left: '13.6%',
  //       }}>
  //       <FlatList
  //         data={options}
  //         renderItem={({item}) => (
  //           <TouchableOpacity onPress={() => handleSelect(item)}>
  //             <Text style={{color: 'black'}}>{item}</Text>
  //           </TouchableOpacity>
  //         )}
  //         keyExtractor={item => item.toString()}
  //       />
  //       {/* </View> */}
  //     </View>
  //   </Modal>

  //   <View style={{flexDirection: 'row', alignItems: 'center', top: -30}}>
  //     <Text style={{color: 'black'}}>Damaged Quantity {'   '}</Text>
  //     <TextInput
  //       style={{
  //         borderWidth: 1,
  //         height: 30,
  //         padding: 8,
  //         width: '40%',
  //         borderRadius: 7,
  //         textAlign: 'left',
  //       }}
  //       placeholder="Enter Qty"
  //       onChangeText={setTextInput}
  //       value={textInput}
  //     />
  //     <TouchableOpacity onPress={pickFile}>
  //       <Icon2 name="attach-file" size={30} color="black" />
  //     </TouchableOpacity>
  //   </View>
  //   <Text style={{color: 'red', fontWeight: 400, left: 40, top: -30}}>
  //     {selectedImage && selectedImage[0].name}
  //   </Text>
  //   <Button
  //     title="Save"
  //     buttonStyle={{backgroundColor: COLORS.primary}}
  //     containerStyle={styles.modalButton}
  //     titleStyle={{
  //       fontFamily: 'Montserrat-Medium',
  //       color: 'white',
  //       marginHorizontal: 20,
  //     }}
  //     onPress={() => handleDamageValueChange()}
  //   />
  // </Overlay>
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    paddingVertical: 20,
    backgroundColor: 'white',
    elevation: 5,
  },
  cardTitleContainer: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    top: -24,
  },
  cardTitleText: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    color: 'darkblue',
  },
  poTitleText: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    color: 'black',
    top: 14,
  },
  itemInfoContainer1: {
    flexDirection: 'row',
    marginTop: 8,
    paddingBottom: 20,
    // backgroundColor:"red"
  },
  itemInfoContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemInfoContainer3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: -60,
    alignSelf: 'flex-end',
    marginBottom: -50,
    right: 103,
  },
  itemInfo: {
    fontSize: 15,
    marginRight: '-0.4%',
    fontFamily: 'Montserrat-Medium',
    top: -24,
    color: 'black',
  },

  scannedShipmentText: {
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
    color: 'black',
    alignSelf: 'flex-end',
    top: -70,
  },
  qtyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyNumContainer: {
    marginHorizontal: 10,
  },
  qtyNum: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
    borderColor: 'grey',
  },
  buttonTitle: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 14,
    marginHorizontal: 5,
  },

  // Delete Confirmation Modal
  deleteModal: {
    width: '90%',
    height: '35%',
    paddingVertical: 20,
    borderRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrongModal: {
    width: 380,
    height: 300,
    paddingVertical: 20,
    borderRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textPrimary: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
  },
  textSecondary: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    textAlign: 'center',
  },
  modalButton: {
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 15,
    top: -30,
  },
  ScanButton: {
    marginHorizontal: 124,
    marginVertical: 7,
    borderRadius: 7,
    top: -65,
    left: 125,
  },
  modalButtonTitle: {
    fontFamily: 'Montserrat-Medium',
    marginHorizontal: 20,
  },
});
