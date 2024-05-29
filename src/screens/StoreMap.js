import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {useState} from 'react';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import WebView from 'react-native-webview';
import CycleCount from './CycleCount';
import COLORS from './colors';
import Header from '../components/Header';
import ItemScanner from './ItemScanner.js';
import PoLanding from './PurchaseOrder/PoLanding';

import SideMenu from './SideMenu';
import Dashboard from './Dashboard';
import {useNavigation} from '@react-navigation/native';
import Footer1 from '../components/Footer1';
import PageTitle from '../components/PageHeader.js';
import {Polygon} from 'react-native-svg';

const StoreMap = ({route}) => {
  const selectedStore = route.params;
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigation = useNavigation();

  const [markers, setMarkers] = useState([
    {latitude: 37.78825, longitude: -122.4324, title: 'Marker 1'},
  ]);
  const markersScript = `
    var markers = ${JSON.stringify(markers)};
    markers.forEach(marker => {
      var markerOptions = {
        position: { lat: marker.latitude, lng: marker.longitude },
        map: map,
        title: marker.title
      };
      var marker = new google.maps.Marker(markerOptions);
    });
  `;
  const store = ['Dashboard', 'StockCheck', 'PO Recieve', 'Stock Count'];
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

  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <Header showBackButton={true} />
      <PageTitle title={'Buddy Store Location'} />
      <TouchableWithoutFeedback onPress={handlepress}>
        <View style={{flex: 1}}>
          <View style={{top: -80, left: 4}}>
            <TouchableOpacity onPress={toggleMenu}>
              <Icon name="menu" size={35} color="white" />
            </TouchableOpacity>
          </View>
          <Text
            style={{fontSize: 16, fontWeight: 500, left: '1.4%', top: '-3%'}}>
            StoreName:
          </Text>
          <Text
            style={{fontSize: 16, fontWeight: 500, left: '22%', top: '-6%'}}>
            {selectedStore.selectedStore[0].storeName}
          </Text>

          <Text
            style={{fontSize: 16, fontWeight: 500, left: '1.4%', top: '-6%'}}>
            storeId:
          </Text>
          <Text
            style={{fontSize: 16, fontWeight: 500, left: '16%', top: '-9%'}}>
            {selectedStore.selectedStore[0].storeId}
          </Text>
          <View style={{height: '70%', width: '100%', top: '-9%'}}>
            <WebView
              scalesPageToFit={true}
              bounces={false}
              javaScriptEnabled
              //   style={{ height: 300, width: 300 }}
              source={{
                html: `<iframe src="https://maps.google.com/maps?q=35.856737, 10.606619&z=15&output=embed" width="100%" height="90%" frameborder="0" style="border:0"></iframe>`,
              }}
              automaticallyAdjustContentInsets={false}
              // injectedJavaScript={markersScript}
            />
          </View>

          <Text
            style={{fontSize: 16, fontWeight: 500, left: '1.4%', top: '-15%'}}>
            Store Address:
          </Text>
          <Text
            style={{fontSize: 16, fontWeight: 500, left: '30%', top: '-18%'}}>
            {selectedStore.selectedStore[0].storeAddress}
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                top: '-290%',
                fontSize: 15,
                textAlign: 'center',
                color: 'white',
                borderWidth: 1,
                left: '1%',
                borderRadius: 15,
                width: '28%',
                paddingHorizontal: 2,
                paddingVertical: 10,
                borderWidth: 1,
                backgroundColor: COLORS.primary,
                borderColor: COLORS.primary,
              }}>
              Contact Us
            </Text>
          </TouchableOpacity>

          <Footer1 />
        </View>
      </TouchableWithoutFeedback>
      <SideMenu
        isOpen={isMenuOpen}
        closeMenu={closeMenu}
        items={store}
        onItemClick={handleMenuItemClick}
      />
    </SafeAreaView>
  );
};

export default StoreMap;
