import { FlatList, StyleSheet } from 'react-native';
import OrderListItem from '@/components/OrderListItem';
import { useMynOrderList } from '@/api/orders';
import { Text, View } from '@/components/Themed';
import LoadingScreen from '@/components/LoadingScreen';
import { useLocale } from '@/providers/LocaleProvider';
import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

const OrdersScreen = () => {
  const { t } = useLocale();

  const router = useRouter();

  const { data: orders, isLoading, error } = useMynOrderList();

  if (isLoading) return <LoadingScreen />;
  if (error) return <Text>{t('orders.failed_fetch_orders')}</Text>;

  if (orders?.length === 0)
    return (
      <View style={styles.emptyOrdersContainer}>
        <Text style={styles.isEmpty}>{t('orders.empty_orders')}</Text>
        <Button
          text={t('common.continue_browsing')}
          onPress={router.back}
          style={styles.backBtn}
          textStyle={styles.backBtnText}
        />
      </View>
    );

  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderListItem order={item} />}
      contentContainerStyle={{ gap: 10, padding: 10 }}
    />
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  emptyOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  isEmpty: {
    fontSize: 16,
    textAlign: 'center',
  },
  backBtnText: {
    fontWeight: '400',
    color: Colors.light.tint,
    textDecorationColor: Colors.light.tint,
    textDecorationLine: 'underline',
  },
  backBtn: {
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 12,
    fontWeight: '400',
    backgroundColor: 'transparent',
    color: Colors.light.tint,
  },
});
