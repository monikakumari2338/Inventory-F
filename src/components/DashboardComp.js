import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {
  Card,
  Button,
  Title,
  Paragraph,
  Divider,
  Text,
} from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DashboardComp = () => {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [pendingPO, setPendingPO] = useState([]);
  const [pendingASN, setPendingASN] = useState([]);

  // useEffect(() => {
  //   // Fetch pending PO data
  //   const response = fetch(
  //     'http://172.20.10.9:8083/purchaseOrder/findPO/pending',
  //   )
  //     .then(response => response.json())
  //     .then(data => setPendingPO(data))
  //     .catch(error => console.log('Error fetching pending PO:', error));
  //   console.log('dashboard comp ', response.data);
  //   // Fetch pending ASN data
  //   fetch('http://172.20.10.9:8083/purchaseOrder/findASN/pending')
  //     .then(response => response.json())
  //     .then(data => setPendingASN(data))
  //     .catch(error => console.log('Error fetching pending ASN:', error));
  // }, []);

  //const totalpendingtransactions = pendingASN.length + pendingPO.length;
  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{
        flexGrow: 1,
      }}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={{top: -18}}>
            <Title style={styles.totaltitle}>Pending Transactions{'  '}</Title>
            {/* <Text style={styles.totalcontainer}>
              {`${totalpendingtransactions}`}
            </Text> */}
          </View>

          {/* <Divider style={styles.divider} /> */}

          {/* <ScrollView style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => setIsOpen1(!isOpen1)}
              style={styles.buttonContainer}>
              <View style={styles.buttonContent}>
                <Ionicons
                  name={
                    isOpen1 ? 'chevron-down-sharp' : 'chevron-forward-sharp'
                  }
                  size={23}
                  color="black"
                />
                <Text style={styles.buttonText}>ASN</Text>
              </View>
            </TouchableOpacity>

            <Collapsible collapsed={!isOpen1}>
              <ScrollView>
                {pendingASN.map((asn, index) => (
                  <Card key={asn.asnId} style={styles.subCard}>
                    <Card.Content>
                      <Paragraph style={{fontSize: 16, textAlign: 'center'}}>
                        <Text style={styles.boldLabel}>ASN:</Text>{' '}
                        {asn.asnNumber}
                      </Paragraph>
                      <Paragraph style={{fontSize: 16, textAlign: 'center'}}>
                        <Text style={styles.boldLabel}>Status:</Text>{' '}
                        {asn.status}
                      </Paragraph>
                      <Paragraph style={{fontSize: 16, textAlign: 'center'}}>
                        <Text style={styles.boldLabel}>Quantity:</Text>{' '}
                        {asn.quantity}
                      </Paragraph>
                      <Paragraph style={{fontSize: 16, textAlign: 'center'}}>
                        <Text style={styles.boldLabel}>Date:</Text> {asn.date}
                      </Paragraph>
                    </Card.Content>
                  </Card>
                ))}
              </ScrollView>
            </Collapsible>
          </ScrollView> */}
          {/* <Divider style={styles.divider} /> */}

          {/* <ScrollView style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => setIsOpen2(!isOpen2)}
              style={styles.buttonContainer}>
              <View style={styles.buttonContent}>
                <Ionicons
                  name={
                    isOpen2 ? 'chevron-down-sharp' : 'chevron-forward-sharp'
                  }
                  size={23}
                  color="black"
                />
                <Text style={styles.buttonText}>PO</Text>
              </View>
            </TouchableOpacity>

            <Collapsible collapsed={!isOpen2}>
              {pendingPO.map((po, index) => (
                <Card key={po.poNumber} style={styles.subCard}>
                  <ScrollView contentContainerStyle={{flex: 1, flexGrow: 1}}>
                    <Card.Content>
                      <Paragraph style={{fontSize: 16, textAlign: 'center'}}>
                        <Text style={styles.boldLabel}>PO Number:</Text>{' '}
                        {po.poNumber}
                      </Paragraph>
                      <Paragraph style={{fontSize: 16, textAlign: 'center'}}>
                        <Text style={styles.boldLabel}>Status: </Text>{' '}
                        {po.status}
                      </Paragraph>
                      <Paragraph style={{fontSize: 16, textAlign: 'center'}}>
                        <Text style={styles.boldLabel}>ASN:</Text>{' '}
                        {po.asnNumber}
                      </Paragraph>
                      <Paragraph style={{fontSize: 16, textAlign: 'center'}}>
                        <Text style={styles.boldLabel}>Expected Qty:</Text>{' '}
                        {po.expected_qty}
                      </Paragraph>
                      <Paragraph style={{fontSize: 16, textAlign: 'center'}}>
                        <Text style={styles.boldLabel}>Received Quantity:</Text>{' '}
                        {po.received_qty}
                      </Paragraph>
                    </Card.Content>
                  </ScrollView>
                </Card>
              ))}
            </Collapsible>
          </ScrollView> */}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    top: -15,
    paddingVertical: 25,
    // backgroundColor: 'white',
  },

  subCard: {
    marginVertical: 2,
    backgroundColor: 'white',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 8,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#B9B9B9',
    paddingVertical: 8,
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 9,
  },

  buttonText: {
    marginLeft: 3,
    fontSize: 16,
    fontWeight: 'bold',
  },

  button: {
    marginBottom: 1,
    borderRadius: 13,
  },
  boldLabel: {
    fontWeight: 'bold',
  },

  totalcontainer: {
    marginBottom: -25,
    backgroundColor: '#197D77',
    padding: 12,
    borderRadius: 50,
    bottom: 30,
    width: 30,
    height: 30,
    left: 200,
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  totaltitle: {color: 'black'},
});

export default DashboardComp;
