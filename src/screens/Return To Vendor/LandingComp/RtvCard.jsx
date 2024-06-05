import {StyleSheet, View, Text, Pressable} from 'react-native';
import {Card, Chip, Icon} from '@rneui/themed';
import {CardDivider} from '@rneui/base/dist/Card/Card.Divider';
import {useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
export default function RtvCard({item}) {
  const navigation = useNavigation();
  function dateString(date) {
    // Convert date string to the format "1 May 2024"
    return format(date, 'dd/MM/yy');
  }
  //console.log('item: ', item);
  return (
    <Card
      containerStyle={{
        borderRadius: 15,
        marginVertical: 10,
        backgroundColor: 'white',
        elevation: 5,
      }}>
      <View>
        <Text style={styles.cardId}>Rtv Id: {item.rtvID}</Text>
        <View style={styles.cardHeader}>
          <ProgressChip progress={item.status} />
        </View>
      </View>

      {/* <CardDivider /> */}

      <Pressable
        onPress={
          // () => console.log(item.asnNumber,item.status)

          item.status === 'Complete'
            ? () => {
                navigation.navigate('PoSummary', {
                  item: item,
                  type: item.asnNumber == null ? 'PO' : 'ASN',
                });
              }
            : () => {
                navigation.navigate('PoDetailPage', {
                  itemID:
                    item.asnNumber == null ? item.poNumber : item.asnNumber,
                  status: item.status,
                  type: item.asnNumber == null ? 'PO' : 'ASN',
                });
              }
        }
        style={styles.cardContentContainer}>
        <View>
          <View style={styles.cardContent}>
            <Text style={styles.cardData}>
              Creation Date: {dateString(item.createdDate)}
            </Text>
          </View>
        </View>

        <View style={{alignItems: 'center', top: -55, left: 35}}>
          <Text style={styles.cardTitle}>Total SKU</Text>
          <Text
            style={[
              styles.cardData,
              {fontFamily: 'Montserrat-Bold', fontSize: 20},
            ]}>
            {item.totalSkuv}
          </Text>
        </View>

        <View style={{top: -30, left: 3}}>
          <Icon
            name="arrow-forward-ios"
            type="material"
            size={25}
            color="black"
          />
        </View>
      </Pressable>
    </Card>
  );
}

//Chip component to display progress
function ProgressChip({progress}) {
  const chipData = {
    Completed: {
      title: 'Complete',
      color: '#1a8a01',
      titleColor: 'white',
    },
    InProgress: {
      title: 'In Progress',
      color: '#FDED47',
      titleColor: 'black',
    },
    pending: {
      title: 'pending',
      color: '#ff0000',
      titleColor: 'white',
    },
    PartialReceive: {
      title: 'Partial Receive',
      color: '#f59339',
      titleColor: 'white',
    },
  };

  return (
    <Chip
      title={chipData[progress].title}
      type="solid"
      color={chipData[progress].color}
      titleStyle={[
        {
          color: chipData[progress].titleColor,
        },
        styles.chipTitle,
      ]}
      radius="xl"
      buttonStyle={{
        // Decrease padding for chip
        paddingLeft: 30,
        paddingRight: 30,
      }}
    />
  );
}

const styles = StyleSheet.create({
  cardId: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    color: 'black',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //marginBottom: 1,
    top: 6,
    // paddingLeft: 4,
  },
  cardContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    margin: 4,
  },
  cardTitle: {
    color: 'black',
    fontFamily: 'Montserrat-Medium',
  },
  cardData: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Montserrat-Regular',
  },
  chipTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
  },
});
