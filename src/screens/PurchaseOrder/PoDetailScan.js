import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {Alert} from 'react-native';
import COLORS from '../../../constants/colors';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {useState} from 'react';
import Scanner from '../Scanner';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/Header';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {useEffect} from 'react';
import {useCardContext} from './Context/CardContext';

const PoDetailScan = () => {
  // const {item, type} = route.params;
  const navigation = useNavigation();
  const [result, setResult] = useState();
  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;
  const [data, setData] = useState();

  const {cardData, setCardData} = useCardContext();

  const poData = async upc => {
    console.log('upc', upc);
    try {
      //const upc = '10000012';
      const store = 'Ambience Mall';
      const response = await axios.get(
        `http://172.20.10.9:8083/product/upcs/${upc}/${store}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const responseData = response.data;
      console.log('responseData : ', responseData);
      if (responseData != undefined) {
        const cardNew = cardData.map(cardItem => {
          if (cardItem.sku === responseData.sku) {
            return {
              ...cardItem,
              newReceivedVal: Number(cardItem.newReceivedVal) + 1,
            };
          }
          return cardItem;
        });
        setCardData(cardNew);

        console.log('updatedData cardData : ', cardData);
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Incorrect barcode');
    }
  };

  // useEffect(() => {
  //   poData();
  // }, []);
  const onSuccess = e => {
    setResult(e.data);
    const upc = '10000012';
    poData(upc);

    // console.log('e.data', e.data);
  };

  // console.log('products scan', item);

  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <Header showBackButton={true} />

      <View style={{flex: 1, flexDirection: 'row'}}>
        <QRCodeScanner
          //onRead={onSuccess}
          topContent={<Text style={styles.centerText}>Scan Bar code</Text>}
          // bottomContent={

          // }
        />
        <View>
          <View
            style={{
              justifyContent: 'flex-end',
              height: height * 0.525,
              alignSelf: 'center',
              width: width,
            }}>
            <TouchableOpacity onPress={onSuccess}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 28,
    padding: 32,
    color: 'black',
    fontWeight: '500',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    top: '120%',
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    borderWidth: '1%',
    left: '20%',
    borderRadius: 15,
    width: '58%',
    paddingHorizontal: '11%',
    paddingVertical: '5%',
    borderWidth: 1,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    position: 'relative',
    alignSelf: 'flex-start',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default PoDetailScan;
