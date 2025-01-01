import { View } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

const SelectedItemMark = ({display}: {display: boolean}) => {
  return (<>{display && <View style={styles.selectedItem}></View>}</>);
};

export default SelectedItemMark;

const styles = StyleSheet.create({
  selectedItem: {
    height: 18,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    width: 6,
    backgroundColor: Colors.light.tint,
    position: 'absolute',
    left: -10,
  },
});
