import { FlatList, Pressable, StyleSheet } from 'react-native';
import { View, Text } from '@/components/Themed';
import AddressItem from '@/components/AddressItem';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useUserAddressList } from '@/api/addresses';
import { useLocale } from '@/providers/LocaleProvider';
import LoadingScreen from './LoadingScreen';
import Colors from '@/constants/Colors';

type AddressListType = {
  selectedAddress?: number | null;
  setAddress?: (id: number) => void;
  selectOnlyAddress?: boolean;
};
const AddressList = ({
  selectedAddress = null,
  setAddress = () => {},
  selectOnlyAddress = true,
}: AddressListType) => {
  const { t } = useLocale();
  const router = useRouter();
  const { error, data: userAddresses, isLoading } = useUserAddressList();

  useEffect(() => {
    const selectOnlyUserAddress = () => {
      userAddresses?.length === 1 && setAddress(userAddresses?.[0].id);
    };
    selectOnlyAddress && selectOnlyUserAddress();
  }, [userAddresses]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <Text>{t('address.failed_fetch_addresses')}</Text>;

  return (
    <View>
      {!!userAddresses?.length ? (
        <FlatList
          data={userAddresses}
          contentContainerStyle={{ marginBottom: 10 }}
          renderItem={({ item }) => (
            <AddressItem
              add={item}
              onPress={() => setAddress(item.id)}
              selected={item.id === selectedAddress}
            />
          )}
        />
      ) : (
        <Text style={styles.noAd}>{t('checkout.no_available_addresses')}</Text>
      )}
      <Pressable
        onPress={() => router.push('/add-address')}
        style={styles.mewAddress}
      >
        <Text style={styles.newAddressText}>{t('checkout.add_address')}</Text>
      </Pressable>
    </View>
  );
};

export default AddressList;

const styles = StyleSheet.create({
  title: {
    fontWeight: '600',
    fontSize: 18,
    margin: 10,
    marginBottom: 5,
  },
  mewAddress: {
    alignItems: 'center',
    marginVertical: 5,
  },
  newAddressText: {
    textDecorationLine: 'underline',
    color: Colors.light.tint,
  },
  noAd: {
    textAlign: 'center',
    marginTop: 15,
    color: '#c0292a',
    fontWeight: '600',
    opacity: 0.7,
  },
});
