import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Button3 from '../components/Button3';
import Header from '../components/Header';
import Dashboard from './Dashboard';
import {useFocusEffect} from '@react-navigation/native';
import {BearerToken} from '../BearerTokenContext/TokenContext';
import {storeContext} from '../StoreContext/LoggedStoreContext';
import {IP} from '../IpAddress/CommonIP';
const Login = ({navigation}) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStore] = useState('');
  const [loginError, setLoginError] = useState('');
  const [storedata, setStoreData] = useState(['']);
  const [isStoreSelected, setIsStoreSelected] = useState(false);
  const [isStoreDropdownVisible, setStoreDropdownVisible] = useState(false);

  const {value, setValue} = storeContext();
  const {setToken, token} = BearerToken();
  const isEmailValid = text => {
    return text.includes('@');
  };

  const isPwdValid = text => {
    return text.length >= 6;
  };

  const loginData = async () => {
    try {
      const userData = {email, password, storeName};
      const response = await axios.post(IP + '/api/auth/login', userData);
      console.log(response);
      setToken(response.data.acessToken);
      console.log('Login successful');
      setLoginError(''); // Reset login error if login is successful
      navigation.navigate('Dashboard', {storename: 'value'});
    } catch (error) {
      console.log('Error login user:', error.response.data.message);
      setLoginError(error.response.data.message);
    }
  };
  // const url1 = `${IP}/store/getallstores`;
  // const url2 = IP + '/store/getallstores';
  // console.log('Urls:', url1, url2);
  const fetchStoreData = async () => {
    try {
      const response = await axios.get(IP + '/store/getallstores');
      const responseData = response.data;
      setStoreData(responseData);
    } catch (error) {
      console.log('Store Fetching Error :', error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchStoreData();
    }, []),
  );
  // useEffect(() => {
  //   fetchStoreData();

  //   return () => {};
  // }, []);

  const clearerror = () => {
    setLoginError('');
  };
  const selectStoreModal = selectedItem => {
    setValue(selectedItem.storeName);
    setStore(selectedItem.storeName);
    setStoreDropdownVisible(false);
    setIsStoreSelected(true);
    //handleCategoryProducts(selectedItem.value);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <Header showBackButton={false} />
      <View style={{flex: 1, marginHorizontal: 22}}>
        <View style={{marginVertical: '10%'}}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              marginTop: '5%',
              textAlign: 'center',
              color: COLORS.black,
            }}>
            Store Inventory Management System
          </Text>
        </View>

        <View
          style={{
            marginTop: '1%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 25,
              top: '1%',
              marginBottom: 8,
              color: COLORS.primary,
              position: 'relative',
              lineHeight: 24,
              fontWeight: '500',
            }}>
            Login Here
          </Text>
        </View>
        <ScrollView style={{maxHeight: 800}}>
          <View style={{marginTop: '-12%'}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginVertical: 8,
                marginTop: 78,
                marginBottom: 7,
                lineHeight: 24,
                color: COLORS.primary,
                fontWeight: '500',
              }}>
              Store
            </Text>

            <TouchableOpacity
              onPress={() => setStoreDropdownVisible(!isStoreDropdownVisible)}>
              <View
                style={{
                  width: '100%',
                  height: 48,
                  borderColor: COLORS.black,
                  borderWidth: 1,
                  borderRadius: 8,
                  marginTop: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: 22,
                }}>
                <Text
                  style={{
                    fontWeight: '500',
                    left: '-39%',
                    top: '18%',
                  }}>
                  {storeName || 'Select Store'}
                </Text>
                <Icon
                  style={{left: '44%', top: '-20%'}}
                  name={
                    isStoreDropdownVisible
                      ? 'caret-up-outline'
                      : 'caret-down-outline'
                  }
                  color={isStoreSelected ? 'black' : 'black'}
                  size={20}
                />
              </View>
            </TouchableOpacity>
            {!isStoreSelected && (
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

          <View style={{marginTop: '2%'}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginVertical: 5,
                marginTop: 8,
                marginBottom: 7,
                lineHeight: 24,
                color: COLORS.primary,
                fontWeight: '500',
              }}>
              Email address
            </Text>

            <View
              style={{
                width: '100%',
                height: 48,
                borderColor: COLORS.black,
                borderWidth: 1,
                borderRadius: 8,
                marginTop: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 22,
              }}>
              <TextInput
                placeholder="Enter your email address"
                placeholderTextColor={COLORS.black}
                keyboardType="email-address"
                style={{
                  width: '100%',
                }}
                onChangeText={text => {
                  setEmail(text);
                  clearerror();
                }}
              />
            </View>
            {!isEmailValid(email) && email.length > 0 && (
              <Text style={{color: 'red', top: 9, left: 15}}>
                Invalid Email
              </Text>
            )}
          </View>

          <View style={{marginBottom: 12}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginVertical: 8,
                lineHeight: 24,
                color: COLORS.primary,
                fontWeight: '500',
              }}>
              Password
            </Text>

            <View
              style={{
                width: '100%',
                height: 48,
                borderColor: COLORS.black,
                borderWidth: 1,
                borderRadius: 8,
                marginTop: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 22,
              }}>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor={COLORS.black}
                secureTextEntry={!isPasswordShown}
                style={{
                  width: '100%',
                }}
                onChangeText={text => {
                  setPassword(text);
                  clearerror();
                }}
              />

              <TouchableOpacity
                onPress={() => setIsPasswordShown(!isPasswordShown)}
                style={{
                  position: 'absolute',
                  right: 12,
                }}>
                {isPasswordShown == true ? (
                  <Icon name="eye" size={24} color={COLORS.black} />
                ) : (
                  <Icon name="eye-off" size={24} color={COLORS.black} />
                )}
              </TouchableOpacity>
            </View>

            {!isPwdValid(password) && password.length > 0 && (
              <Text style={{color: 'red', top: 9, left: 15}}>
                Password must be at least 6 characters
              </Text>
            )}
          </View>

          <Button3
            title="Login"
            filled
            style={{
              marginTop: 42,
              marginBottom: 5,
            }}
            onPress={loginData}
          />
          {loginError !== '' && (
            <Text
              style={{
                color: 'red',
                textAlign: 'left',
                marginTop: '-25%',
                marginLeft: '2%',
              }}>
              {loginError}
            </Text>
          )}
        </ScrollView>
      </View>

      {/* {store dropdown model} */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isStoreDropdownVisible}
        onRequestClose={() => {
          setStoreDropdownVisible(false);
        }}>
        <TouchableWithoutFeedback
          onPress={() => setStoreDropdownVisible(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View style={styles.modalContainer}>
              {storedata.map(item => (
                <TouchableOpacity
                  key={item.storeId}
                  style={styles.dropdownItem}
                  onPress={() => selectStoreModal(item)}>
                  <Text style={styles.dropdownItemText}>{item.storeName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default Login;
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
    marginBottom: 20,
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
    margin: 40,
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
