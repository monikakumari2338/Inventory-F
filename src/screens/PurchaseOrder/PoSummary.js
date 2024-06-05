import {Text, FlatList, StyleSheet, View} from 'react-native';
import SummaryCard from './SummaryComp/SummaryCard';
import {Button, Icon} from '@rneui/themed';
import {useState} from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import PageTitle from '../../components/PageHeader';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {IP} from '../IpAddress/CommonIP';

export default function PoSummary({route}) {
  const {item, type} = route.params;
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [discrepancyData, setdiscrepancyData] = useState([]);

  // console.log('item  ', item);
  // console.log('type  ', type);
  const handleViewDiscrepancy = () => {
    navigation.navigate('PoDiscrepancySummary', {
      discrepancyData: discrepancyData,
      item: item,
      type: type,
    });
  };
  const poSummary = async () => {
    if (type == 'ASN') {
      try {
        const response = await axios.get(
          `${IP}/purchaseOrder/completed/asnList/${item.asnNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const responseData = response.data;
        //console.log('CurrentDate data : ', responseData);
        setData(responseData);
        if (responseData != null) {
          const discrepancyData = responseData.filter(
            product => product.damageQty > 0,
          );
          setdiscrepancyData(discrepancyData);
          console.log('discrepancyData : ', discrepancyData);
        }
      } catch (error) {
        console.log('Po summary data Error fetching :', error);
      }
    } else {
      try {
        const response = await axios.get(
          `${IP}/purchaseOrder/getPoSummary/${item.poNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const responseData = response.data;
        console.log(response.data);
        setData(responseData);
        if (responseData != null) {
          const discrepancyData = responseData.filter(
            product => product.damageQty > 0,
          );
          setdiscrepancyData(discrepancyData);
          console.log('discrepancyData : ', discrepancyData);
        }
      } catch (error) {
        console.log('Po summary data Error fetching :', error);
      }
    }
  };

  useEffect(() => {
    poSummary();
  }, []);
  console.log('Current data summary : ', data);

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
        style={styles.discrepancyButton}
        onPress={() => handleViewDiscrepancy()}>
        <Text style={styles.discrepancyButtonText}>View Discrepancy</Text>
      </TouchableOpacity>

      {data.map(item => (
        <SummaryCard item={item} />
      ))}
    </View>
  );
}

function ASNSummaryDetails({item}) {
  const info = [
    {
      title: 'Asn Number',
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
      title: 'SupplierID',
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
function SummaryPageButtons() {
  const buttonList = [
    {
      title: 'Email',
      icon: 'email',
      iconType: 'material',
    },
    {
      title: 'Print',
      icon: 'print',
      iconType: 'material',
    },
  ];

  return (
    <>
      <View style={styles.buttonContainer}>
        {buttonList.map((button, index) => (
          <Button
            key={index}
            size="sm"
            icon={
              <Icon name={button.icon} type={button.iconType} color="white" />
            }
            title={button.title}
            titleStyle={{
              fontFamily: 'Montserrat-Medium',
              marginHorizontal: 5,
            }}
            buttonStyle={{
              backgroundColor: 'dodgerblue',
            }}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  discrepancyButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    backgroundColor: 'dodgerblue',
    marginHorizontal: '26%',
  },
  discrepancyButtonText: {
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
});
