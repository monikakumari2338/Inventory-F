import {Text, FlatList, StyleSheet, View, Alert, Modal} from 'react-native';
import SummaryCard from './SummaryComp/SummaryCard';
import DiscrepancySummaryCard from './SummaryComp/DiscrepancySummaryCard';
import {Button} from '@rneui/themed';
import {useState} from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import PageTitle from '../../components/PageHeader';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import COLORS from '../../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
export default function PoDiscrepancySummary({route}) {
  const {discrepancyData, item, type} = route.params;
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [downloadfile, setdownloadfile] = useState('');
  const [showModal, setshowmodal] = useState(false);
  const [shareModal, setsharemodal] = useState(false);

  console.log('dis : ', item);
  const openModal = () => {
    setshowmodal(true);
    downloadPDF();
  };
  const openshareModal = () => {
    setsharemodal(true);
    sharePDF();
  };
  const closeshareModal = () => {
    setsharemodal(false);
  };

  const closeModal = () => {
    setshowmodal(false);
  };

  const sharePDF = async () => {
    const selectedKeys = ['itemNumber', 'poNumber', 'damageQty', 'sku'];
    try {
      // Prepare HTML content
      let htmlContent = `
        <html>
        <head>
        
        <style>
                   table {
                     border-collapse: collapse;
                     width: 100%;
                   }
                   th, td {
                     border: 1px solid black;
                     padding: 8px;
                     text-align: left;
                   }
                   th {
                     background-color: #f2f2f2;
                   }
                   .card {
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    padding: 10px;
                    margin-bottom:10 px
                  }
        </style>
        </head>
        <body>
        <h3>Discrepancy Details</h3>
        <div class="card">
        
        <ul>
           `;
      // Add list items based on the additional card data object
      Object.keys(item).forEach(key => {
        htmlContent += `<li>${key}: ${item[key]}</li>`;
      });
      htmlContent += `
        </ul>
        </div>
        <table>
        <thead>
        <tr>
           `;

      // Table headers

      selectedKeys.forEach(key => {
        htmlContent += `<th>${key}</th>`;
      });
      htmlContent += '</tr></thead><tbody>';
      // Table rows
      discrepancyData.forEach(row => {
        htmlContent += '<tr>';
        selectedKeys.forEach(key => {
          htmlContent += `<td>${row[key]}</td>`;
        });
        htmlContent += '</tr>';
      });
      htmlContent += '</tbody></table></body></html>';

      // Create PDF file
      const {filePath: localFilePath} = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: 'PoDiscrepancy',
        base64: true,
      });

      // Create FormData
      const formData = new FormData();
      formData.append('attachment', {
        uri: `file://${localFilePath}`,
        type: 'application/pdf',
        name: 'PO.pdf',
      });

      // Send the FormData in the POST request
      const apiUrl =
        'http://172.20.10.9:9022/purchaseOrder/send/Po_Discrepancy/Email'; // Replace with your actual API endpoint
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

      //setsharemodal(true);

      console.log('PDF sent successfully via email.');
    } catch (error) {
      Alert.alert('Success', 'PDF could not sent via email.');
    }
  };
  const downloadPDF = async () => {
    console.log('download');
    const selectedKeys = ['itemNumber', 'poNumber', 'damageQty', 'sku'];
    try {
      // Prepare HTML content
      let htmlContent = `
<html>
<head>

<style>
           table {
             border-collapse: collapse;
             width: 100%;
           }
           th, td {
             border: 1px solid black;
             padding: 8px;
             text-align: left;
           }
           th {
             background-color: #f2f2f2;
           }
           .card {
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            margin-bottom:10 px
          }
</style>
</head>
<body>
<h3>Discrepancy Details</h3>
<div class="card">

<ul>
   `;
      // Add list items based on the additional card data object
      Object.keys(item).forEach(key => {
        htmlContent += `<li>${key}: ${item[key]}</li>`;
      });
      htmlContent += `
</ul>
</div>
<table>
<thead>
<tr>
   `;

      // Table headers

      selectedKeys.forEach(key => {
        htmlContent += `<th>${key}</th>`;
      });
      htmlContent += '</tr></thead><tbody>';
      // Table rows
      discrepancyData.forEach(row => {
        htmlContent += '<tr>';
        selectedKeys.forEach(key => {
          htmlContent += `<td>${row[key]}</td>`;
        });
        htmlContent += '</tr>';
      });
      htmlContent += '</tbody></table></body></html>';

      const filename = item.asnNumber == null ? item.poNumber : item.asnNumber;
      // Create PDF file
      const {filePath: localFilePath} = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: `${filename}POdiscrepancyData`,
        base64: true,
      });

      // Define the Downloads folder path on your computer
      const downloadsFolderPath = '/storage/emulated/0/Download';

      // Move the file to the Downloads folder
      const targetFilePath = `${downloadsFolderPath}/${filename}POdiscrepancyData.pdf`;

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
      //setshowmodal(true);
    } catch (error) {
      console.log('Error generating PDF:', error);
      // Alert user about the error
      Alert.alert(
        'Download Error',
        'An error occurred while generating the PDF.',
      );
    }
  };
  return (
    <View>
      <Header />
      <PageTitle title={'Purchase Order'} />
      {type == 'ASN' ? (
        <ASNSummaryDetails item={item} />
      ) : (
        <POSummaryDetails item={item} />
      )}

      <TouchableOpacity
        style={styles.EmailButton}
        onPress={() => openshareModal()}>
        <Text style={styles.EmailButtonText}>Email</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.PrintButton} onPress={() => openModal()}>
        <Text style={styles.PrintButtonText}>Print</Text>
      </TouchableOpacity>

      {discrepancyData.map(item => (
        <DiscrepancySummaryCard item={item} type={type} />
      ))}

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
            <Text style={styles.text1}>Po Report Downloaded</Text>
            <View style={styles.buttonContainer1}>
              <TouchableOpacity style={styles.buttonsave} onPress={closeModal}>
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
              Po discrepancy sent via email successfully
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
  );
}

function ASNSummaryDetails({item}) {
  const info = [
    {
      title: 'ASN Number',
      text: item.asnNumber,
    },
    {
      title: 'Total SKU',
      text: item.totalSKU,
    },
    {
      title: 'Supplier',
      text: item.supplier,
    },
    {
      title: 'Date',
      text: item.creationDate,
    },
  ];

  return (
    <View style={styles.detailsContainer}>
      {info.map((item, index) => (
        <View key={index} style={styles.infoContainer}>
          <Text style={styles.detailTitle}>{item.title}</Text>
          <Text style={styles.detailText}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}

function POSummaryDetails({item}) {
  const info = [
    {
      title: 'PO Number',
      text: item.poNumber,
    },
    {
      title: 'Total SKU',
      text: item.totalSKU,
    },
    {
      title: 'Supplier',
      text: item.supplierId,
    },
    {
      title: 'Date',
      text: item.creationDate,
    },
  ];

  return (
    <View style={styles.detailsContainer}>
      {info.map((item, index) => (
        <View key={index} style={styles.infoContainer}>
          <Text style={styles.detailTitle}>{item.title}</Text>
          <Text style={styles.detailText}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}
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
const styles = StyleSheet.create({
  EmailButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    backgroundColor: 'dodgerblue',
    marginLeft: '10%',
    marginRight: '56%',
    top: '2%',
    borderRadius: 5,
  },
  EmailButtonText: {
    color: 'white',
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
  },
  PrintButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    backgroundColor: 'dodgerblue',
    marginLeft: '56%',
    marginRight: '10%',
    top: '-9%',
    borderRadius: 5,
    marginBottom: -25,
  },
  PrintButtonText: {
    color: 'white',
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
  },
  detailsContainer: {
    margin: 15,
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'silver',
    marginTop: 10,
    marginHorizontal: 10,
    padding: 10,
    elevation: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  detailTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  detailText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.8)',
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '-25%',
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
});
