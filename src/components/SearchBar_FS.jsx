import React, {useState} from 'react';

// React Native Imports
import {View, Pressable} from 'react-native';
import {StyleSheet} from 'react-native';

// React Native Elements UI Library
import {Icon, SearchBar} from '@rneui/themed';

// Custom Components
import {CustomBottomSheet} from './CustomBottomSheet';
//import FilterBottomSheet from './CustomBottomSheet';
//import {useAdjustmentDetail} from '../context/DataContext';

export default function SearchBar_FS({data}) {
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [searchStr, setSearchStr] = useState('');
  const [sortApplied, setSortApplied] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [Data, setData] = useState(data);
  console.log('searchfs data : ', data);
  const adjustmentInfo = {
    progress: ['complete', 'inProgress'],
    reasons: ['damaged', 'theft', 'stockIn', 'stockOut', 'multiple'],
  };
  const initialFilterParams = {
    reason: [],
    progress: [],
  };

  console.log('data : ', data);
  const [filterParams, setFilterParams] = useState(initialFilterParams);
  function handleSearch(text) {
    console.log('Searching for ID: ', text);
    // find all the adjustments that contain the text in their id
    const searchResults = data.asn.filter(item =>
      item.asnNumber.toString().includes(text),
    );
    //console.log('searchResults', searchResults);
    setData(searchResults);
  }

  function handleDeleteSearch() {
    console.log('deleted');
    // setData(data);
  }

  function sortByDate(sortType) {
    if (sortType === 'reset') {
      resetSort();
      return;
    }
    const sortedData = [...data]; // Make a copy of initialData
    sortedData.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortType === 'latest' ? dateB - dateA : dateA - dateB;
    });
    setData(sortedData);
    setSortApplied(true);
    console.log('Sorted by: ' + sortType);
  }

  function resetSort() {
    setData(data);
    setSortApplied(false);
    console.log('Sort reset');
  }

  // function pushFilterParams(filterType) {
  //   const newFilterParams = {...filterParams};
  //   newFilterParams.push(filterType);
  //   setFilterParams(newFilterParams);
  // }

  function filterData() {
    const filteredData = [...data]
      .filter(item => {
        if (filterParams.reason.length === 0) {
          return true;
        }
        return filterParams.reason.includes(item.reason);
      })
      .filter(item => {
        if (filterParams.progress.length === 0) {
          return true;
        }
        return filterParams.progress.includes(item.progress);
      });
    setData(filteredData);
    setFilterApplied(true);
  }

  function resetFilter() {
    setFilterParams(initialFilterParams);
    setFilterApplied(false);
  }

  // ---------------------- Bottom Sheet Options ----------------------

  const sortOpts = [
    {
      title: 'Sort by latest',
      icon: {
        name: 'sort-clock-descending-outline',
        type: 'material-community',
        color: 'black',
        size: 35,
      },
      titleStyle: styles.sortOpt,
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
      titleStyle: styles.sortOpt,
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

  const filterOpts = [
    {
      title: 'Status',
      icon: {
        name: 'progress-question',
        type: 'material-community',
        color: 'black',
        size: 30,
      },
      titleStyle: styles.sortOpt,
      containerStyle: styles.sortOptContainer,
      onPress: () => {
        // navigate to status filter
      },
    },
    {
      title: 'Date',
      icon: {
        name: 'date-range',
        type: 'material',
        color: 'black',
        size: 30,
      },
      titleStyle: styles.sortOpt,
      containerStyle: styles.sortOptContainer,
    },
    {
      title: 'Reason Code',
      icon: {
        name: 'report-problem',
        type: 'material',
        color: 'black',
        size: 30,
      },
      titleStyle: styles.sortOpt,
      containerStyle: styles.sortOptContainer,
    },
    {
      title: filterApplied ? 'Cancel' : 'Reset',
      icon: filterApplied
        ? {name: 'cancel', type: 'material', color: 'white'}
        : {name: 'refresh', type: 'material', color: 'white'},
      containerStyle: [
        styles.sortOptContainer,
        filterApplied
          ? {backgroundColor: 'darkred'}
          : {backgroundColor: 'black'},
      ],
      titleStyle: styles.sortOptCancel,
      onPress: () => resetFilter(),
    },
  ];

  const statusFilterOpts = [
    {
      title: 'In Progress',
      icon: {
        name: 'progress-question',
        type: 'material-community',
        color: 'black',
        size: 30,
      },
      titleStyle: styles.sortOpt,
      containerStyle: styles.sortOptContainer,
      filterType: 'inProgress',
    },
    {
      title: 'Completed',
      icon: {
        name: 'progress-check',
        type: 'material-community',
        color: 'black',
        size: 30,
      },
      titleStyle: styles.sortOpt,
      containerStyle: styles.sortOptContainer,
      filterType: 'complete',
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
    },
  ];

  const reasonFilterOpts = [
    {
      title: 'Damaged',
      icon: {
        name: 'image-broken-variant',
        type: 'material-community',
        color: 'black',
        size: 30,
      },
      titleStyle: styles.sortOpt,
      containerStyle: styles.sortOptContainer,
      onPress: () => {
        const newFilterParams = filterParams;
        newFilterParams.reason.push('Damaged');
        setFilterParams(newFilterParams);
      },
    },
    {
      title: 'Stock In',
      icon: {
        name: 'download',
        type: 'font-awesome',
        color: 'black',
        size: 30,
      },
      titleStyle: styles.sortOpt,
      containerStyle: styles.sortOptContainer,
      onPress: () => {
        const newFilterParams = filterParams;
        newFilterParams.reason.push('stockIn');
        setFilterParams(newFilterParams);
      },
    },
    {
      title: 'Stock Out',
      icon: {
        name: 'upload',
        type: 'font-awesome',
        color: 'black',
        size: 30,
      },
      titleStyle: styles.sortOpt,
      containerStyle: styles.sortOptContainer,
      onPress: () => {
        const newFilterParams = filterParams;
        newFilterParams.reason.push('stockOut');
        setFilterParams(newFilterParams);
      },
    },
    {
      title: 'Theft',
      icon: {
        name: 'shield-lock-open',
        type: 'material-community',
        color: 'black',
        size: 30,
      },
      titleStyle: styles.sortOpt,
      containerStyle: styles.sortOptContainer,
      onPress: () => {
        const newFilterParams = filterParams;
        newFilterParams.reason.push('theft');
        setFilterParams(newFilterParams);
      },
    },
  ];

  return (
    <>
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
          <Icon name="sort" type="materialcommunity" size={28} />
        </Pressable>
      </View>

      {/* Sort Bottom Sheet */}
      {sortVisible && (
        <CustomBottomSheet
          isVisible={sortVisible}
          setIsVisible={setSortVisible}
          opts={sortOpts}
          func={sortByDate}
        />
      )}

      {/* Filter Bottom Sheet */}
      {filterVisible && (
        <CustomBottomSheet
          isVisible={filterVisible}
          setIsVisible={setFilterVisible}
          opts={filterOpts}
          func={filterData}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  searchBarAndOpts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  },
  chipButton: {
    marginHorizontal: 5,
  },
});
