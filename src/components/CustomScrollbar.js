import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';

const CustomScrollbar = ({contentHeight, scrollViewRef}) => {
  const [scrollbarHeight, setScrollbarHeight] = useState(0);
  const [scrollbarPosition, setScrollbarPosition] = useState(0);
  const scrollView = useRef(null);

  useEffect(() => {
    if (scrollView.current) {
      scrollView.current.scrollTo({y: scrollbarPosition, animated: false});
    }
  }, [scrollbarPosition]);

  const handleScroll = event => {
    const {y} = event.nativeEvent.contentOffset;
    const contentOffset = (y / contentHeight) * scrollbarHeight;
    setScrollbarPosition(contentOffset);
  };

  return (
    <View style={styles.scrollbarContainer}>
      <ScrollView
        ref={scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        {/* Content goes here */}
      </ScrollView>
      <View
        style={styles.scrollbar}
        onLayout={event => setScrollbarHeight(event.nativeEvent.layout.height)}
      />
    </View>
  );
};
