import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {useState} from 'react';
import Scanner from './Scanner';
import Header from '../components/Header';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {BearerToken} from '../BearerTokenContext/TokenContext';
import {IP} from '../IpAddress/CommonIP';

const AdhocRecountScan = ({route}) => {
  const {products, reason} = route.params;
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState('');

  const {token} = BearerToken();
  const handleScan = () => {
    console.log('scan');
  };

  const storeVal = 'Ambience Mall';
  const handleIconClick = async () => {
    try {
      const response = await axios.get(
        `${IP}/product/findbysku/${inputValue}/${storeVal}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const responseData = response.data;
      //console.log('responseData ', responseData.sku);
      // console.log('products ', products);
      const data = products.map(item => {
        if (item.sku === responseData.sku) {
          const countitem = item.count ? item.count : 0;
          return {
            ...item,
            count: countitem + 1,
          };
        }
        return item;
      });

      const newData = {
        creationProductsdto: data,
        creationdto: products.creationdto,
      };
      console.log('data from scan ', data);
      //setProductData(responseData);
      navigation.navigate('AdhocRecount', {
        data: data,
      });
    } catch (error) {
      console.log(error);
    }
  };
  //console.log(inputValue);
  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <Header showBackButton={true} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderRadius: 12,
          top: '8%',
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
          placeholder="Enter SKU Number"
          value={inputValue}
          onChangeText={text => {
            setInputValue(text);
          }}
        />
        <TouchableOpacity onPress={handleIconClick}>
          <Icon name="search" size={20} color="#333" style={{left: -10}} />
        </TouchableOpacity>
      </View>
      <View style={{marginTop: '35%'}}>
        <Scanner onScan={handleScan} />
      </View>
    </SafeAreaView>
  );
};

export default AdhocRecountScan;
