// import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Alert,
  Touchable,
  TouchableOpacity,
} from 'react-native';

import COLORS from '../../constants/colors';
import Input from '../components/Input';
import Header from '../components/Header';
import Checkbox from '../components/Checkbox';
import Button1 from '../components/Button1';
import {SimpleMenu} from '.';
import Button from '../components/Button12';

const SignupRetail = ({navigation}) => {
  const [inputs, setInputs] = React.useState({
    email: '',
    storename: '',
    phone: '',
    location: '',
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const handleVerifyClick = () => {
    navigation.navigate('Phoneverify');
  };
  const handleVerifyEmail = () => {
    navigation.navigate('EmailVerify');
  };

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.email) {
      handleError('Please input email', 'email');
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError('Please input a valid email', 'email');
      isValid = false;
    }

    if (!inputs.storename) {
      handleError('Please input storename', 'storename');
      isValid = false;
    }

    if (!inputs.phone) {
      handleError('Please input phone number', 'phone');
      isValid = false;
    }

    if (!inputs.location) {
      handleError('Please enter Store location', 'location');
      isValid = false;
    }

    if (isValid) {
      navigation.navigate('LoginScreen');
    }
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };
  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
     <Header showBackButton={true} />
      <ScrollView
        contentContainerStyle={{paddingTop: 30, paddingHorizontal: 20}}>
        <View style={{marginVertical: 1}}>
          <Text
            style={{
              fontSize: 23,
              fontWeight: 'bold',
              marginTop: 1,
              textAlign: 'center',
              color: COLORS.black,
              top: 1,
            }}>
            Mobile Store Inventory Management System
          </Text>
        </View>
        <View style={{marginVertical: 10}}>
          <Text
            style={{
              fontSize: 26,
              marginVertical: 45,
              marginHorizontal: 9,
              marginLeft: 100,
              marginTop: 10,
              marginBottom: 1,
              color: COLORS.black,
            }}>
            Retailer Details
          </Text>
        </View>

        <View style={{marginVertical: 20}}>
          <Input
            onChangeText={text => handleOnchange(text, 'storename')}
            onFocus={() => handleError(null, 'storename')}
            label="Store Name"
            placeholder="Enter Store name"
            error={errors.storename}
          />
          <View>
            <Input
              onChangeText={text => handleOnchange(text, 'email')}
              onFocus={() => handleError(null, 'email')}
              label="Email"
              placeholder="Enter email address"
              error={errors.email}
            />
            <TouchableOpacity onPress={handleVerifyEmail}>
              <Text
                style={{
                  color: COLORS.secondary,
                  bottom: 65,
                  left: 320,
                  fontSize: 13,
                }}>
                verify
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <Input
              keyboardType="numeric"
              onChangeText={text => handleOnchange(text, 'phone')}
              onFocus={() => handleError(null, 'phone')}
              label="Phone Number"
              placeholder="Enter your phone no"
              error={errors.phone}
            />
            <TouchableOpacity onPress={handleVerifyClick}>
              <Text
                style={{
                  color: COLORS.secondary,
                  bottom: 55,
                  left: 320,
                  fontSize: 13,
                }}>
                verify
              </Text>
            </TouchableOpacity>
          </View>
          <Input
            onChangeText={text => handleOnchange(text, 'location')}
            onFocus={() => handleError(null, 'location')}
            label="Store Location"
            placeholder="Enter your location"
            error={errors.location}
          />

          <Button1 title="Submit" onPress={validate} />
          {/* <Text
            onPress={() => navigation.navigate('LoginScreen')}
            style={{
              color: COLORS.black,
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 16,
            }}>
            Already have account ?Login
          </Text> */}

          {/* <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 1
                }}>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Already have an account?</Text>
                    <Pressable
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.primary,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Login</Text>
                    </Pressable>
                </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupRetail;
