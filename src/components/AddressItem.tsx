import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Tables } from '@/types';
import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

type AddressItemType = {
  add: Tables<'addresses'>;
  selected?: boolean;
  onPress: () => void;
};

const selectedStyle = {
  elevation: 4,
  borderColor: Colors.light.tint,
};

const AddressItem = ({ add, selected = false, onPress }: AddressItemType) => {
  const {
    address_label,
    building_name,
    area,
    address,
    floor,
    apt_number,
    land_mark,
    phone,
  } = add;
  return (
    <Pressable
      style={[styles.container, selected && selectedStyle]}
      onPress={onPress}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.titleLine}>
          {address_label}: {building_name}{' '}
        </Text>
        <Text numberOfLines={1} style={styles.title}>({area})</Text>
        <MaterialIcons name='location-on' size={15} color='black' />
      </View>
      <Text style={styles.text}>
        {address}
        {floor && `, floor: ${floor}`}
        {apt_number && `, appartment n#: ${apt_number}`}
        {land_mark && `, ${land_mark}`}
      </Text>
      <Text style={styles.text}>Mobile number: {phone}</Text>
    </Pressable>
  );
};

export default AddressItem;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 20,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    gap: 3,
    borderWidth: 1,
    borderColor: '#c7c9d3',
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  titleLine: {
    fontWeight: '600',
    fontSize: 18,
    color: Colors.light.text,
  },
  title: {
    fontSize: 16,
    color: 'gray',
    marginRight: 'auto',
    flex: 1,
  },
  text: {
    color: 'gray',
    fontSize: 15,
    textAlign: 'left'
  },
});
