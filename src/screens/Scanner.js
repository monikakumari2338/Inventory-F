import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {React} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {useState} from 'react';
import {Await} from 'react-router-dom';
import axios from 'axios';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import COLORS from './colors';
import {BearerToken} from '../BearerTokenContext/TokenContext';
import {IP} from '../IpAddress/CommonIP';
const Scanner = ({onScan}) => {
  const [result, setResult] = useState();
  const [productData, setProductData] = useState(null);
  const navigation = useNavigation();
  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;

  const {token} = BearerToken();
  const onSuccess = e => {
    setResult(e.data);
    const code = e.data;
    //setScan(false);

    try {
      const response = axios.get(`${IP}/product/upc/${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;
      console.log('data', data);
      navigation.navigate('StockCheck', {productData: data});
    } catch (error) {
      console.log(error);
      Alert.alert('Incorrect barcode');
    }
    console.log('e.data', e.data);
  };

  // const handleScan = async () => {
  //   const inputValue = 2424;
  //   const val = 'Ambience Mall';
  //   try {
  //     const response = await axios.get(
  //       `http://172.20.10.9:8083/product/getProductByitemNumber/${inputValue}/${val}`,
  //     );
  //     const responseData = response.data;
  //     //console.log('responseData val ', responseData);
  //     setProductData(responseData);
  //     navigation.navigate('StockCheck', {productData: responseData});
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleScanButton = () => {
  //   onScan();
  // };
  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <QRCodeScanner
        onRead={onSuccess}
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
          {/* <TouchableOpacity onPress={handleScanButton}>
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
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

export default Scanner;
