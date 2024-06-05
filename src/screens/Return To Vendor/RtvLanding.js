import {View, Text, Pressable} from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import SearchBar_FS from '../../components/SearchBar_FS';
import {useNavigation} from '@react-navigation/native';
import {CustomBottomSheet} from '../../components/CustomBottomSheet';
// React Native Elements UI Library
import {Icon, ListItem, SearchBar} from '@rneui/themed';
import {StyleSheet, FlatList} from 'react-native';
import {FAB} from '@rneui/themed';
import {useTheme, Overlay, Button} from '@rneui/themed';
import COLORS from '../../../constants/colors';
import {useEffect} from 'react';
import axios from 'axios';
import {useState} from 'react';
import PageTitle from '../../components/PageHeader';
import {ScrollView} from 'react-native';
import Footer1 from '../../components/Footer1';
import Icon2 from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';
import {BottomSheet} from '@rneui/base';
import DateTimePicker from '@react-native-community/datetimepicker';
import {BearerToken} from '../../BearerTokenContext/TokenContext';
import RtvCard from './LandingComp/RtvCard';
import {IP} from '../../IpAddress/CommonIP';

export default function RtvLanding() {
  const [Data, setData] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [dateFilterVisible, setDateFilterVisible] = useState(false);
  const [reasonFilterVisible, setReasonFilterVisible] = useState(false);
  const [statusFilterVisible, setStatusFilterVisible] = useState(false);
  const [searchStr, setSearchStr] = useState('');
  const [sortApplied, setSortApplied] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [noSearchResultsOverlay, SetNoSearchResultsOverlay] = useState(false);
  const {theme} = useTheme();
  const [Prevdata, setPrevData] = useState(Data);
  //const { searchVisible } = useVisibilityContext();
  const navigation = useNavigation();

  const {token} = BearerToken();
  // console.log('token', token);

  const rtvData = async () => {
    try {
      const response = await axios.get(`${IP}/returntovendor/getallrtv`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const responseData = response.data;
      //console.log('CurrentDate data : ', responseData);
      setData(responseData);
      setPrevData(responseData);
      // if (responseData.creationProductsdto !== null) {
      //   navigation.navigate('CycleStart', {data: responseData});
      // }
    } catch (error) {
      console.log('RTV Onload data Error fetching :', error);
    }
  };
  console.log('RTV DATA: ', Data);
  useEffect(() => {
    rtvData();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      rtvData();
    }, []),
  );

  function handleNoSearchResults() {
    setData(Prevdata);
    setSearchStr('');
    SetNoSearchResultsOverlay(false);
  }

  // filter data
  function handleSearch(text) {
    const asnSearchResults = Data.asn.filter(item =>
      item.asnNumber.toString().includes(text),
    );
    const poSearchResults = Data.purchaseOrder.filter(item =>
      item.poNumber.toString().includes(text),
    );
    console.log('asnSearchResults', asnSearchResults);
    if (asnSearchResults == '' && poSearchResults == '') {
      SetNoSearchResultsOverlay(true);
    }
    setData({asn: asnSearchResults, purchaseOrder: poSearchResults});
    console.log(Data);
  }

  const initialFilterParams = {
    reason: [],
    progress: [],
  };

  const [filterParams, setFilterParams] = useState(initialFilterParams);

  // function pushFilterParams(filterType) {
  //   const newFilterParams = {...filterParams};
  //   newFilterParams.push(filterType);
  //   setFilterParams(newFilterParams);
  // }

  function filterData() {
    const filteredData = Data.asn
      .filter(item => {
        if (filterParams.reason.length === 0) {
          return true;
        }
        return filterParams.reason.includes(item.asn.status);
      })
      .filter(item => {
        if (filterParams.progress.length === 0) {
          return true;
        }
        return filterParams.progress.includes(item.asn.supplier);
      });
    const POfilteredData = Data.purchaseOrder
      .filter(item => {
        if (filterParams.reason.length === 0) {
          return true;
        }
        return filterParams.reason.includes(item.asn.status);
      })
      .filter(item => {
        if (filterParams.progress.length === 0) {
          return true;
        }
        return filterParams.progress.includes(item.asn.supplier);
      });
    console.log('filtered data ', filteredData);
    setData({asn: filteredData, purchaseOrder: POfilteredData});
    setFilterApplied(true);
  }

  function resetFilter() {
    setFilterParams(initialFilterParams);
    setFilterApplied(false);
  }

  function handleDeleteSearch() {
    //console.log('deleted');
    setData(Prevdata);
  }

  // ---------------------- Bottom Sheet Options ----------------------

  function SortBottomSheet({sortVisible, setSortVisible}) {
    // States and Vars
    const sortOpts = [
      {
        title: 'Sort by',
        titleStyle: {
          fontFamily: 'Montserrat-Regular',
          fontSize: 25,
        },
        containerStyle: [styles.sortOptContainer, {paddingTop: 0}],
      },
      {
        title: 'Sort by latest',
        icon: {
          name: 'sort-clock-descending-outline',
          type: 'material-community',
          color: 'black',
          size: 35,
        },
        titleStyle: styles.bottomSheetOpt,
        containerStyle: styles.sortOptContainer,
        sortType: 'latest',
      },
      {
        title: 'Sort by oldest',
        icon: {
          name: 'sort-clock-descending-outline',
          type: 'material-community',
          color: 'black',
          size: 35,
          containerStyle: {
            transform: [{scaleY: -1}],
          },
        },
        titleStyle: styles.bottomSheetOpt,
        containerStyle: styles.sortOptContainer,
        sortType: 'oldest',
      },
      {
        title: sortApplied ? 'Reset Sort' : 'Cancel',
        icon: sortApplied
          ? {name: 'refresh', type: 'material', color: 'white'}
          : {name: 'cancel', type: 'material', color: 'white'},
        containerStyle: [styles.sortOptContainer, {backgroundColor: 'darkred'}],
        titleStyle: styles.sortOptCancel,
        sortType: 'reset',
      },
    ];
    const [sortApplied, setSortApplied] = useState(false);

    // Functions
    function sortByDate(sortType) {
      if (sortType === 'reset') {
        resetSort();
        return;
      }
      const sortedData = Data; // Make a copy of initialData
      console.log('sorted data : ', sortedData);
      sortedData.asn.sort((a, b) => {
        const dateA = new Date(a.creationDate);
        const dateB = new Date(b.creationDate);
        return sortType === 'latest' ? dateB - dateA : dateA - dateB;
      });
      sortedData.purchaseOrder.sort((a, b) => {
        const dateA = new Date(a.creationDate);
        const dateB = new Date(b.creationDate);
        return sortType === 'latest' ? dateB - dateA : dateA - dateB;
      });
      setData(sortedData);
      setSortApplied(true);
      console.log('Sorted by: ' + sortType);
    }

    function resetSort() {
      setData(Prevdata);
      setSortApplied(false);
      console.log('Sort reset');
    }

    return (
      <BottomSheet
        isVisible={sortVisible}
        onBackdropPress={() => setSortVisible(false)}>
        {sortOpts.map((opt, i) => (
          <ListItem
            key={i}
            containerStyle={opt.containerStyle}
            onPress={() => {
              sortByDate(opt.sortType);
              setSortVisible(false);
            }}>
            <ListItem.Content>
              <Icon {...opt.icon} />
              <ListItem.Title style={opt.titleStyle}>
                {opt.title}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    );
  }

  function FilterBottomSheet({
    filterVisible,
    setFilterVisible,
    setStatusFilterVisible,
    //setReasonFilterVisible,
    setDateFilterVisible,
  }) {
    // States and Vars
    const filterOpts = [
      {
        title: 'Filter by',
        titleStyle: {
          fontFamily: 'Montserrat-Regular',
          fontSize: 25,
        },
        containerStyle: [styles.sortOptContainer, {paddingTop: 0}],
      },
      {
        title: 'Status',
        icon: {
          name: 'progress-question',
          type: 'material-community',
          color: 'black',
          size: 30,
        },
        titleStyle: styles.bottomSheetOpt,
        containerStyle: styles.sortOptContainer,
      },

      {
        title: 'Date',
        icon: {
          name: 'date-range',
          type: 'material',
          color: 'black',
          size: 30,
        },
        titleStyle: styles.bottomSheetOpt,
        containerStyle: styles.sortOptContainer,
      },
      {
        title: 'Reset Filter',
        icon: {name: 'refresh', type: 'material', color: 'white'},
        containerStyle: [styles.sortOptContainer, {backgroundColor: 'darkred'}],
        titleStyle: styles.sortOptCancel,
        type: 'reset',
      },
    ];

    return (
      <BottomSheet
        isVisible={filterVisible}
        onBackdropPress={() => setFilterVisible(false)}>
        {filterOpts.map((opt, i) => (
          <ListItem
            key={i}
            containerStyle={opt.containerStyle}
            onPress={() => {
              setFilterVisible(false);

              if (opt.title === 'Status') {
                setStatusFilterVisible(true);
              } else if (opt.title === 'Reason') {
                setReasonFilterVisible(true);
              } else if (opt.title === 'Date') {
                setDateFilterVisible(true);
              } else if (opt.title === 'Reset Filter') {
                setData(Prevdata);
              }
            }}>
            <ListItem.Content>
              <Icon {...opt.icon} />
              <ListItem.Title style={opt.titleStyle}>
                {opt.title}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    );
  }

  function StatusFilterBottomSheet({
    statusFilterVisible,
    setStatusFilterVisible,
  }) {
    // States and Vars
    const statusFilterOpts = [
      {
        title: 'Select a status',
        titleStyle: {
          fontFamily: 'Montserrat-Regular',
          fontSize: 25,
        },
        containerStyle: [styles.sortOptContainer, {paddingTop: 0}],
      },
      {
        title: 'In Progress',
        icon: {
          name: 'progress-question',
          type: 'material-community',
          color: 'black',
          size: 30,
        },
        titleStyle: styles.bottomSheetOpt,
        containerStyle: styles.sortOptContainer,
        filterType: 'inProgress',
      },
      {
        title: 'Complete',
        icon: {
          name: 'progress-check',
          type: 'material-community',
          color: 'black',
          size: 30,
        },
        titleStyle: styles.bottomSheetOpt,
        containerStyle: styles.sortOptContainer,
        filterType: 'Complete',
      },
      // reset filter
      {
        title: 'Reset',
        icon: {
          name: 'refresh',
          type: 'material',
          color: 'white',
        },
        containerStyle: [styles.sortOptContainer, {backgroundColor: 'darkred'}],
        titleStyle: styles.sortOptCancel,
        filterType: 'reset',
      },
    ];

    // Functions
    function filterStatus(progress) {
      if (progress === 'reset') {
        setData(Prevdata);
        return;
      }
      const asnfilteredData = Data.asn.filter(item => item.status === progress);
      const pofilteredData = Data.purchaseOrder.filter(
        item => item.status === progress,
      );
      console.log('filterData :', asnfilteredData);
      console.log('pofilteredData :', pofilteredData);
      setData({asn: asnfilteredData, purchaseOrder: pofilteredData});
    }

    return (
      <BottomSheet
        isVisible={statusFilterVisible}
        onBackdropPress={() => setStatusFilterVisible(false)}>
        {statusFilterOpts.map((opt, i) => (
          <ListItem
            key={i}
            containerStyle={opt.containerStyle}
            onPress={() => {
              filterStatus(opt.filterType);
              setStatusFilterVisible(false);
            }}>
            <ListItem.Content>
              <Icon {...opt.icon} />
              <ListItem.Title style={opt.titleStyle}>
                {opt.title}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    );
  }

  // Needs to be developed, later
  function DateFilterBottomSheet({dateFilterVisible, setDateFilterVisible}) {
    return (
      <BottomSheet
        isVisible={dateFilterVisible}
        onBackdropPress={() => setDateFilterVisible(false)}>
        <View style={styles.bottomSheet}>
          <DateRangePicker />
        </View>
      </BottomSheet>
    );
  }

  function DateRangePicker() {
    // States and Vars
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    // Functions
    function onStartChange(event, selectedDate) {
      setShowStartPicker(false);
      if (selectedDate) {
        setStartDate(selectedDate);
      }
    }
    function onEndChange(event, selectedDate) {
      setShowEndPicker(false);
      if (selectedDate) {
        setEndDate(selectedDate);
      }
    }
    function filterDate(startDate, endDate) {
      const asnfilteredData = Data.asn.filter(item => {
        const itemDate = new Date(item.creationDate);
        return itemDate >= startDate && itemDate <= endDate;
      });

      const pofilteredData = Data.purchaseOrder.filter(item => {
        const itemDate = new Date(item.creationDate);
        return itemDate >= startDate && itemDate <= endDate;
      });
      setData({asn: asnfilteredData, purchaseOrder: pofilteredData});
      setDateFilterVisible(false);
      // console.log('asnfilteredData : ', asnfilteredData);
      // console.log('pofilteredData : ', pofilteredData);
    }

    return (
      <View style={{flexDirection: 'row'}}>
        <View style={styles.container}>
          <View style={styles.picker}>
            <Button
              onPress={() => setShowStartPicker(true)}
              title="Select Start Date"
              titleStyle={{fontFamily: 'Montserrat-Bold'}}
            />
            {showStartPicker && (
              <DateTimePicker
                testID="startDateTimePicker"
                value={startDate}
                mode="date"
                display="default"
                onChange={onStartChange}
              />
            )}
            <Text style={styles.dateText}>{startDate.toDateString()}</Text>
          </View>
          <View style={styles.picker}>
            <Button
              onPress={() => setShowEndPicker(true)}
              title="Select End Date"
              titleStyle={{fontFamily: 'Montserrat-Bold'}}
            />
            {showEndPicker && (
              <DateTimePicker
                testID="endDateTimePicker"
                value={endDate}
                mode="date"
                display="default"
                onChange={onEndChange}
              />
            )}

            <Text style={styles.dateText}>{endDate.toDateString()}</Text>
          </View>
        </View>
        <View style={styles.container}>
          <Button
            title="Apply Filter"
            titleStyle={{fontFamily: 'Montserrat-Bold'}}
            buttonStyle={{backgroundColor: 'green'}}
            onPress={() => filterDate(startDate, endDate)}
          />
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    searchBarAndOpts: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    chipButton: {
      marginHorizontal: 5,
    },
    sortOptContainer: {
      paddingVertical: 20,
    },
    bottomSheetOpt: {
      fontFamily: 'Montserrat-Medium',
      fontSize: 16,
    },
    sortOptCancel: {
      fontFamily: 'Montserrat-Medium',
      fontSize: 16,
      color: 'white',
    },

    // Date Picker Styles
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    picker: {
      marginVertical: 10,
      alignItems: 'center',
    },
    dateText: {
      marginTop: 10,
      fontSize: 16,
      fontFamily: 'Montserrat-Medium',
    },

    bottomSheet: {
      backgroundColor: 'white',
      padding: 10,
    },
  });

  return (
    <>
      <Header showBackButton={true} />
      <PageTitle title={'PO/ASN Receive'} />
      <View style={styles.searchBarAndOpts}>
        <SearchBar
          lightTheme={true}
          round={true}
          placeholder="Search here..."
          containerStyle={{
            flex: 1,
            backgroundColor: 'transparent',
            borderBottomColor: 'transparent',
          }}
          inputContainerStyle={{
            height: 40,
          }}
          inputStyle={{fontFamily: 'Montserrat-Medium', fontSize: 16}}
          searchIcon={{size: 20}}
          value={searchStr}
          onChangeText={text => {
            setSearchStr(text), handleSearch(text);
          }}
          onClear={handleDeleteSearch}
        />
        {/* Filter Button */}
        <Pressable
          style={styles.chipButton}
          onPress={() => setFilterVisible(true)}>
          <Icon name="filter" type="antdesign" size={25} />
        </Pressable>

        {/* Sort Button */}
        <Pressable
          style={styles.chipButton}
          color="blue"
          onPress={() => setSortVisible(true)}>
          <Icon name="sort" type="materialcommunity" size={25} />
        </Pressable>
      </View>

      {/* Sort Bottom Sheet */}

      <SortBottomSheet
        sortVisible={sortVisible}
        setSortVisible={setSortVisible}
      />

      {/* Filter Bottom Sheet */}
      {filterVisible && (
        <FilterBottomSheet
          filterVisible={filterVisible}
          setFilterVisible={setFilterVisible}
          // setReasonFilterVisible={setReasonFilterVisible}
          setStatusFilterVisible={setStatusFilterVisible}
          setDateFilterVisible={setDateFilterVisible}
        />
      )}

      {/* Reason Filter Bottom Sheet */}
      {/* {reasonFilterVisible && (
        <ReasonFilterBottomSheet
          reasonFilterVisible={reasonFilterVisible}
          setReasonFilterVisible={setReasonFilterVisible}
        />
      )} */}

      {/* Status Filter Bottom Sheet */}
      {statusFilterVisible && (
        <StatusFilterBottomSheet
          statusFilterVisible={statusFilterVisible}
          setStatusFilterVisible={setStatusFilterVisible}
        />
      )}

      {/* Date Filter Bottom Sheet */}
      {dateFilterVisible && (
        <DateFilterBottomSheet
          dateFilterVisible={dateFilterVisible}
          setDateFilterVisible={setDateFilterVisible}
        />
      )}

      <ScrollView>
        {Data ? Data.map(dataitem => <RtvCard item={dataitem} />) : null}
      </ScrollView>

      {/* No Search Results Overlay */}
      <Overlay
        isVisible={noSearchResultsOverlay}
        //onBackdropPress={proofOverlay}
        overlayStyle={styles.NoSearchResultsModal}>
        <Icon2
          name="info"
          size={45}
          color="black"
          style={{alignSelf: 'center', top: 15}}
        />

        <Text style={{color: 'black', fontWeight: 500, fontSize: 18}}>
          Results not Found, Kindly Click on the Back Button
        </Text>

        <Button
          title="Back"
          buttonStyle={{backgroundColor: COLORS.primary}}
          containerStyle={styles.modalButton}
          titleStyle={{
            fontFamily: 'Montserrat-Medium',
            color: 'white',
            marginHorizontal: 20,
          }}
          onPress={() => handleNoSearchResults()}
        />
      </Overlay>
      <Footer1 />
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontFamily: 'Montserrat-Regular',
    fontSize: 20,
  },
  searchBarAndOpts: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  chipButton: {
    marginHorizontal: 5,
  },
  sortOptContainer: {
    paddingVertical: 20,
  },
  bottomSheetOpt: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
  },
  sortOptCancel: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: 'white',
  },

  // Date Picker Styles
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  picker: {
    marginVertical: 10,
    alignItems: 'center',
  },
  dateText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },

  bottomSheet: {
    backgroundColor: 'white',
    padding: 10,
  },
  NoSearchResultsModal: {
    width: 350,
    height: 280,
    paddingVertical: 20,
    borderRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
