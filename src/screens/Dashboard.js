import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import SideMenu from './SideMenu.js';
import {Text, StyleSheet, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Color} from '../components/GlobalStyles.js';
import Header from '../components/Header.js';
import Footer1 from '../components/Footer1.js';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors.js';
import SelectDropdown from 'react-native-select-dropdown';
import {Dimensions} from 'react-native';
const {width} = Dimensions.get('window');
import Swiper from 'react-native-swiper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SalesCard from './Salescard.js';
import DashboardComp from '../components/DashboardComp.js';
import {Provider as PaperProvider} from 'react-native-paper';
import {Card, Paragraph} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import CycleCount from './CycleCount.js';
import ItemScanner from './ItemScanner.js';
import RtvLanding from './Return To Vendor/RtvLanding.js';
import PieChartCard from '../components/PieChartCard.js';
import DoughnutChartCard from '../components/DoughnutChartCard.js';
import Demo from './Demo.js';
import Pie from 'react-native-pie';
import {storeContext} from '../StoreContext/LoggedStoreContext';
import PageTitle from '../components/PageHeader.js';
import PoLanding from './PurchaseOrder/PoLanding.js';
function Dashboard() {
  const store1 = ['delhi101'];
  const salesData = [10, 20, 15, 30, 25, 20, 30];
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const {value} = storeContext();

  const store = ['Dashboard', 'StockCheck', 'PO Recieve', 'Stock Count'];

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };
  const navigation = useNavigation();
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

  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  const data = [
    {id: '1', name: 'StockCheck', screen: 'ItemScanner'},
    {id: '2', name: 'Po Receive', screen: 'PoLanding'},
    {id: '3', name: 'Direct Store Delivery', screen: 'ItemScanner'},
    {id: '4', name: 'Transfer Receive', screen: 'ItemScanner'},
    {id: '5', name: 'Return to Vendor', screen: 'RtvLanding'},
    {id: '6', name: 'Inventory Adjustment', screen: 'ItemScanner'},
    {id: '7', name: 'Stock Count', screen: 'CycleCount'},
    {id: '8', name: 'Login', screen: 'ItemScanner'},
    {id: '9', name: 'Dashboard', screen: 'Dashboard'},
    // Add more data objects as needed
  ];
  const SquareCard = ({name, screen}) => {
    const navigation = useNavigation();
    const handlePress = () => {
      navigation.navigate(screen);
    };
    return (
      <TouchableWithoutFeedback onPress={handlePress}>
        <Card style={[styles.card1, {backgroundColor: '#dfdede'}]}>
          <Card.Content>
            <Paragraph
              style={{
                fontSize: 15,
                fontWeight: 500,
                textAlign: 'center',
                top: 20,
              }}>
              {name}
            </Paragraph>
          </Card.Content>
        </Card>
      </TouchableWithoutFeedback>
    );
  };

  useEffect(() => {
    // Set up automatic sliding every 5 seconds
    const interval = setInterval(() => {
      // Switch to the next chart
      setCurrentChartIndex(prevIndex => (prevIndex === 0 ? 1 : 0));
    }, 5000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);
  return (
    <SafeAreaView style={{backgroundColor: COLORS.black, flex: 1}}>
      <Header showBackButton={false} />
      <PageTitle title={'Dashboard'} />
      {/* <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 200,
        }}> */}
      <View style={styles.mainContainer}>
        <View style={[styles.iphone14ProMax1]}>
          <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={{top: 1, flex: 1}}>
              <View style={{top: -80, left: 4}}>
                <TouchableOpacity onPress={toggleMenu}>
                  <Icon name="menu" size={35} color="white" />
                </TouchableOpacity>
              </View>

              {/* New Temp code................ */}

              <View style={styles.container2}>
                {data.map(item => (
                  <SquareCard
                    key={item.id}
                    name={item.name}
                    screen={item.screen}
                  />
                ))}
              </View>

              {/* Prev code.................... */}

              {/* <View style={styles.viewContainer}>
                  <SelectDropdown
                    data={store1}
                    defaultValueByIndex={1}
                    // defaultValue={'Egypt'}
                    onSelect={(selectedItem, index) => {
                      console.log(selectedItem, index);
                    }}
                    defaultButtonText={'Color'}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                    buttonStyle={styles.dropdown1BtnStyle}
                    buttonTextStyle={styles.dropdown1BtnTxtStyle}
                    renderDropdownIcon={isOpened => {
                      return (
                        <FontAwesome
                          name={isOpened ? 'chevron-up' : 'chevron-down'}
                          color={'#444'}
                          size={18}
                        />
                      );
                    }}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown1DropdownStyle}
                    rowStyle={styles.dropdown1RowStyle}
                    rowTextStyle={styles.dropdown1RowTxtStyle}
                  />
                </View> */}
              {/* <View style={styles.iconContainer}>
                {[0, 1].map(index => (
                  <View
                    key={index}
                    style={[
                      styles.icon,
                      {
                        backgroundColor:
                          currentChartIndex === index ? 'black' : 'gray',
                        borderColor: 'black',
                      },
                    ]}
                  />
                ))}
              </View> */}
              {/* <View style={styles.container}>
                <Swiper
                  loop={false}
                  showsPagination={false}
                  horizontal={true}
                  index={currentChartIndex}
                  autoplay={false}> */}

              {/* Card with Pie Chart */}
              {/* <View style={styles.chartCard}>
                    {currentChartIndex === 0 ? <PieChartCard /> : <Demo />}
                  </View> */}

              {/* Card with Doughnut Chart */}
              {/* <View style={styles.chartCard}>
                    {currentChartIndex === 1 ? <Demo /> : <PieChartCard />}
                  </View>
                </Swiper>
              </View> */}

              {/* <PaperProvider>
                <DashboardComp />
              </PaperProvider> */}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      {/* </ScrollView> */}

      <SideMenu
        isOpen={isMenuOpen}
        closeMenu={closeMenu}
        items={store}
        onItemClick={handleMenuItemClick}
      />
      <Footer1 />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: -10,
    alignItems: 'center',
    marginTop: -25,
  },
  iphone14ProMax1: {
    flex: 1,
    height: 700,
    width: '100%',
    backgroundColor: Color.white,
  },
  viewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    bottom: 86,
    left: 110,
    marginBottom: -55,
  },

  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '20%',
    paddingBottom: '20%',
  },

  dropdown1BtnStyle: {
    width: '40%',
    height: 50,
    backgroundColor: '#FFF',
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#FFF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: 'white'},
  dropdown1RowTxtStyle: {
    color: 'black',
    textAlign: 'center',
    fontWeight: '300',
  },
  container1: {
    flex: 1,
    alignItems: 'center',

    top: -30,
  },
  cardContainer: {
    width: '90%',
  },
  card: {
    borderRadius: 15,
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    top: 290,
  },
  icon: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  chartCard: {
    flex: 1,
    alignItems: 'center',
    top: -20,
  },

  mainContainer: {
    flex: 1,
  },
  dashboardCompScrollView: {
    flex: 1,
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingLeft: 12,
    marginTop: 60,
  },
  card1: {
    width: 117, // Adjust width as needed
    height: 110, // Same as width to make it square
    margin: 6,
    borderRadius: 10, // Optional: Adds rounded corners
  },
});

export default Dashboard;
