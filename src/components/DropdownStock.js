import React, { useState } from 'react';
import { View, StyleSheet, Alert ,Text} from 'react-native';
import { Button, Menu, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import { FontSize, Color, FontFamily, Border } from "../components/GlobalStyles.js";

const DropdownStock = () => {
    const [visible, setVisible] = useState(false);

    const closeMenu = () => setVisible(false);
    const openMenu = (v) => setVisible(true);
    return (
        <Provider>
        <View style={styles.container}>
            <Menu
        
            visible={visible}
            onDismiss={closeMenu}
            anchor={
                
                <Icon name="ellipsis-vertical" onPress={openMenu} mode="outlined"
          style={styles.icopos}
          />
                
            }>
            <Menu.Item
        style={{
          backgroundColor:COLORS.white
        }}
                onPress={() => {
                Alert.alert('Action : ', 'Print');
                }}
                title="Buddy Store"
            />
            <Menu.Item
         style={{
          backgroundColor:COLORS.white
        }}
                onPress={() => {
                Alert.alert('Action : ', 'Forward');
                }}
                title="Item Details"
            />
            <Menu.Item
         style={{
          backgroundColor:COLORS.white
        }}
                onPress={() => {
                Alert.alert('Action : ', 'Backward');
                }}
                title="Inventory Bucket"
            />
            
            </Menu>
        </View>
        </Provider>
    );
    };
    
    export default DropdownStock;
    
    const styles = StyleSheet.create({
    container: {
        padding:20,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 220,
      left:50,
      top:100,
      marginRight:10
      
    },
    icopos:{
      color: COLORS.black, 
      fontSize: 32,
    
    
    }
    });
    