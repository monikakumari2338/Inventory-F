import React, {useState, useEffect} from 'react';
import COLORS from './colors';
import PageTitle from '../components/PageHeader.js';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Alert,
  Modal,
} from 'react-native';
import CycleCount from './CycleCount';
import Header from '../components/Header';
import Footer1 from '../components/Footer1';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Share} from 'react-native';

import ItemScanner from './ItemScanner.js';
import PoLanding from './PurchaseOrder/PoLanding';
import SideMenu from './SideMenu';
import Dashboard from './Dashboard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

import RNFS from 'react-native-fs';
import {json} from 'react-router-dom';
import {BearerToken} from '../../BearerTokenContext/TokenContext';

const AdhocPostVrnc = ({route}) => {
  const {countDetails} = route.params || {};
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showModal, setshowmodal] = useState(false);

  const [shareModal, setsharemodal] = useState(false);
  const navigation = useNavigation();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [downloadfile, setdownloadfile] = useState('');
  console.log(countDetails);
  const store = ['Dashboard', 'StockCheck', 'PO Recieve', 'Stock Count'];

  const {token} = BearerToken();
  const openModal = () => {
    downloadPDF();
  };
  const openshareModal = () => {
    sharePDF();
  };
  const closeshareModal = () => {
    setsharemodal(false);
  };

  const closeModal = () => {
    setshowmodal(false);
  };
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };
  const closePopup = () => {
    setshowmodal(false);
  };
  const closesharePopup = () => {
    setsharemodal(false);
  };

  const handleMenuItemClick = item => {
    setSelectedMenuItem(item);
    if (item == 'Dashboard') {
      navigation.navigate(Dashboard);
    } else if (item == 'StockCheck') {
      navigation.navigate(ItemScanner);
    } else if (item == 'PO Recieve') {
      navigation.navigate(PoLanding);
    } else if (item == 'Transfer Recieve') {
      navigation.navigate(TRsearch);
    } else if (item == 'DSD Recieve') {
      //navigation.navigate(DsdSearch);
    } else if (item == 'Return to Vendor') {
      //navigation.navigate(Rtvsearch);
    } else if (item == 'Inventory Adjustment') {
      //navigation.navigate(InvAdj);
    } else if (item == 'Stock Count') {
      navigation.navigate(CycleCount);
    }

    closeMenu();
  };

  const handlepress = () => {
    if (isMenuOpen) {
      closeMenu();
    }
  };

  const downloadPDF = async () => {
    try {
      // Prepare HTML content
      const htmlContent = `
        <html>
          <head>
            <style>
              ${stylesToInline(styles)}
            </style>
          </head>
          <body>
            <h1>Count Details</h1>
            ${countDetails
              .map(
                (item, index) => `
              <div style="margin-bottom: 10px;">
                <p><strong>Item No:</strong> ${item.itemNumber}</p>
                <p><strong>Name:</strong> ${item.itemName}</p>
                <p><strong>Size:</strong> ${item.size}</p>
                <p><strong>Color:</strong> ${item.color}</p>
                <p><strong>Booked:</strong> ${item.bookQty}</p>
                <p><strong>firstcountedQty:</strong> ${item.firstcountedQty}</p>
                <p><strong>firstvarianceQty:</strong> ${item.firstvarianceQty}</p>
                <p><strong>reCountQty:</strong> ${item.reCountQty}</p>
                <p><strong>recountVarianceQty:</strong> ${item.recountVarianceQty}</p>
              </div>
            `,
              )
              .join('')}
          </body>
        </html>
      `;

      // Create PDF file
      const {filePath: localFilePath} = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: 'CountDetails',
        base64: true,
      });

      // Define the Downloads folder path on your computer
      const downloadsFolderPath = '/storage/emulated/0/Download';

      // Move the file to the Downloads folder
      const targetFilePath = `${downloadsFolderPath}/CountDetails.pdf`;

      await RNFS.moveFile(localFilePath, targetFilePath);

      setdownloadfile(targetFilePath);

      // Alert user about successful download
      // Alert.alert(
      //   'Download Success',
      //   `The PDF file has been downloaded successfully to: ${targetFilePath}`,
      // );
      console.log(
        `The PDF file has been downloaded successfully to: ${targetFilePath}`,
      );
      setshowmodal(true);
    } catch (error) {
      console.log('Error generating PDF:', error);
      // Alert user about the error
      Alert.alert(
        'Download Error',
        'An error occurred while generating the PDF.',
      );
    }
  };
  const sharePDF = async () => {
    try {
      // Prepare HTML content
      const htmlContent = `
        <html>
          <head>
            <style>
              ${stylesToInline(styles)}
            </style>
          </head>
          <body>
            <h1>Count Details</h1>
            ${countDetails
              .map(
                (item, index) => `
              <div style="margin-bottom: 10px;">
                <p><strong>Item No:</strong> ${item.itemNumber}</p>
                <p><strong>Name:</strong> ${item.itemName}</p>
                <p><strong>Size:</strong> ${item.size}</p>
                <p><strong>Color:</strong> ${item.color}</p>
                <p><strong>Booked:</strong> ${item.bookQty}</p>
                <p><strong>Counted:</strong> ${item.countedQty}</p>
                <p><strong>Variance:</strong> ${item.varianceQty}</p>
                <p><strong>ReCount Qty:</strong> ${item.reCountQty}</p>
                <p><strong>ReCount Variance:</strong> ${item.recountVarianceQty}</p>
              </div>
            `,
              )
              .join('')}
          </body>
        </html>
      `;

      // Create PDF file
      const {filePath: localFilePath} = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: 'CountDetails',
        base64: true,
      });

      // Create FormData
      const formData = new FormData();
      formData.append('recipient', 'monasingh2775@gmail.com');
      formData.append('msgBody', 'Variance reports');
      formData.append('subject', 'Todays report');
      formData.append('attachment', {
        uri: `file://${localFilePath}`,
        type: 'application/pdf',
        name: 'CountDetails.pdf',
      });

      // Send the FormData in the POST request
      const apiUrl = 'http://172.20.10.9:9022/savestockcount/mail'; // Replace with your actual API endpoint
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Handle the API response as needed
      // const responseData = await response.json();
      // console.log('API Response:', responseData);

      // Alert user about successful API request
      setsharemodal(true);

      console.log('PDF sent successfully via email.');
    } catch (error) {
      Alert.alert('Success', 'PDF sent successfully via email.');
    }
  };
  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <Header showBackButton={true} />
      <PageTitle title={'Post Variance'} />
      <TouchableWithoutFeedback onPress={handlepress}>
        <View style={{flex: 1}}>
          <View style={{top: -80, left: 4}}>
            <TouchableOpacity onPress={toggleMenu}>
              <Icon name="menu" size={35} color="white" />
            </TouchableOpacity>
          </View>
          <View style={{height: 550}}>
            <ScrollView horizontal>
              <ScrollView style={styles.container}>
                <View style={styles.tableContainer}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.headerText}>Item No</Text>
                    <Text style={styles.headerText}>Name</Text>
                    <Text style={[styles.headerText]}>Size</Text>
                    <Text style={[styles.headerText]}>Color</Text>
                    <Text style={[styles.headerText]}>Booked</Text>
                    <Text style={[styles.headerText]}>Primary Count</Text>
                    <Text style={[styles.headerText]}>Primary Variance</Text>
                    <Text style={[styles.headerText]}>ReCount Qty</Text>
                    <Text style={[styles.headerText]}>Recount Variance</Text>
                  </View>
                  <View style={{height: 600}}>
                    <ScrollView style={styles.container}>
                      {countDetails.map((item, index) => (
                        <TouchableOpacity key={index}>
                          <View style={styles.tableRow}>
                            <Text style={[styles.rowText]}>
                              {item.itemNumber}
                            </Text>
                            <Text style={[styles.rowText]}>
                              {item.itemName}
                            </Text>
                            <Text style={[styles.rowText]}>{item.size}</Text>
                            <Text style={[styles.rowText]}>{item.color}</Text>
                            <Text style={[styles.rowText]}>{item.bookQty}</Text>
                            <Text style={[styles.rowText]}>
                              {item.firstcountedQty}
                            </Text>
                            <Text style={[styles.rowText]}>
                              {item.firstvarianceQty}
                            </Text>
                            <Text style={[styles.rowText]}>
                              {item.reCountQty}
                            </Text>
                            <Text style={[styles.rowText]}>
                              {item.recountVarianceQty}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </ScrollView>
            </ScrollView>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={openModal} style={styles.downloadButton}>
              <Text style={styles.buttonText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emailButton} onPress={sharePDF}>
              <Text style={styles.buttonText}>Receive as Email</Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={closeModal}>
            <View style={styles.modalContainer1}>
              <View style={styles.modalContent1}>
                <Icon
                  style={{textAlign: 'center', marginBottom: 15}}
                  name="checkmark-circle-outline"
                  size={60}
                  color="#34A853"
                />
                <Text style={styles.text1}>Count Details Downloaded</Text>
                <View style={styles.buttonContainer1}>
                  <TouchableOpacity
                    style={styles.buttonsave}
                    onPress={closeModal}>
                    <Text style={styles.buttonText1}>Ok</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={shareModal}
            onRequestClose={closeshareModal}>
            <View style={styles.modalContainer1}>
              <View style={styles.modalContent1}>
                <Icon
                  style={{textAlign: 'center', marginBottom: 15}}
                  name="checkmark-circle-outline"
                  size={60}
                  color="#34A853"
                />
                <Text style={styles.text1}>
                  Variance sent via email successfully
                </Text>
                <View style={styles.buttonContainer1}>
                  <TouchableOpacity
                    style={styles.buttonsave}
                    onPress={closeshareModal}>
                    <Text style={styles.buttonText1}>Ok</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
      <SideMenu
        isOpen={isMenuOpen}
        closeMenu={closeMenu}
        items={store}
        onItemClick={handleMenuItemClick}
      />
      <Footer1 />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
  },
  tableContainer: {
    marginTop: 54,
    marginBottom: 10,
  },

  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    marginTop: -38,
  },

  headerText: {
    color: 'white',
    paddingHorizontal: 10,
    fontSize: 16,
    paddingVertical: 1,
    textAlign: 'center',
    top: 1,
    flex: 1,
    width: 90,
  },

  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },

  rowText: {
    color: '#333333',
    textAlign: 'center',
    flex: 1,
    marginStart: -5,
    width: 70,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '5%',
  },
  downloadButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  buttonsave: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 38,
    borderRadius: 20,
    marginHorizontal: 30,
  },
  buttonText1: {
    color: 'white',
    fontSize: 16,
  },
  text1: {
    fontSize: 18,
    color: '#484848',
    textAlign: 'center',
  },
  emailButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 19,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent1: {
    paddingVertical: 15,
    paddingHorizontal: 68,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

const stylesToInline = styleObj =>
  Object.keys(styleObj)
    .map(selector => {
      const rules = styleObj[selector];
      const cssText = Object.keys(rules)
        .map(
          prop =>
            `${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${rules[prop]};`,
        )
        .join(' ');
      return `${selector} { ${cssText} }`;
    })
    .join(' ');

export default AdhocPostVrnc;
