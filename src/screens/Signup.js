

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



const Signup = ({navigation}) => {
  const [inputs, setInputs] = React.useState({
    email: '',
    fullname: '',
    phone: '',
    password: '',
    cnfmpassword:'',
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

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

    if (!inputs.fullname) {
      handleError('Please input fullname', 'fullname');
      isValid = false;
    }

    // if (!inputs.phone) {
    //   handleError('Please input phone number', 'phone');
    //   isValid = false;
    // }

    if (!inputs.password) {
      handleError('Please input password', 'password');
      isValid = false;
    } else if (inputs.password.length < 5) {
      handleError('Min password length of 5', 'password');
      isValid = false;
    }
    if (!inputs.cnfmpassword) {
      handleError('cnfm password', 'cnfmpassword');
      isValid = false;
    }else if (inputs.password !==  inputs.cnfmpassword ) {
      handleError('Password and confirm password should be same', 'password');
    }

    if (isValid) {
      navigation.navigate('SignupRetail');
    }
  };

  // const register = () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     try {
  //       setLoading(false);
  //       AsyncStorage.setItem('userData', JSON.stringify(inputs));
  //       navigation.navigate('LoginScreen');
  //     } catch (error) {
  //       Alert.alert('Error', 'Something went wrong');
  //     }
  //   }, 3000);
  // };


  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };
  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      {/* <Loader visible={loading} /> */}
      <Header />
      <ScrollView
      contentContainerStyle={{paddingTop: 30, paddingHorizontal: 20}}>

            <View style={{ marginVertical: 1}}>
                    <Text style={{
                        fontSize: 23,
                        fontWeight: 'bold',
                       marginTop:1,
                        textAlign:"center",
                        color: COLORS.black,
                        top:1  }}>
                         Mobile Store Inventory Management System
                    </Text>
                </View>
                <View style={{ marginVertical: 10}}>
                    <Text style={{
                        fontSize: 26,
                        marginVertical: 45,
                        marginHorizontal:90,
                        marginLeft:145,
                        marginTop:10,
                        marginBottom:1,
                        color: COLORS.black,
                    }}>
                          Sign-Up
                    </Text>
                </View>
                

        <View style={{marginVertical: 20}}>
          

          <Input
            onChangeText={text => handleOnchange(text, 'fullname')}
            onFocus={() => handleError(null, 'fullname')}
            
            label="Full Name"
            placeholder="Enter your full name"
            error={errors.fullname}
          />

            <Input
            onChangeText={text => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
           
            label="Email"
            placeholder="Enter your email address"
            error={errors.email}
            verify
          />

          {/* <Input
            keyboardType="numeric"
            onChangeText={text => handleOnchange(text, 'phone')}
            onFocus={() => handleError(null, 'phone')}
            label="Phone Number"
            placeholder="Enter your phone no"
            error={errors.phone}
           verify
          /> */}
          <Input
            onChangeText={text => handleOnchange(text, 'password')}
            onFocus={() => handleError(null, 'password')}
            
            label="Password"
            placeholder="Enter your password"
            error={errors.password}
            password
          />
           <Input
            onChangeText={text => handleOnchange(text, 'cnfmpassword')}
            onFocus={() => handleError(null, 'cnfmpassword')}
            label="confirm password"
            placeholder="Passwoad and confirm password should be same"
            error={errors.cnfmpassword}
            password
          />
          <Checkbox />
                 <Button1 title="Register"  onPress={validate} />
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

export default Signup;

