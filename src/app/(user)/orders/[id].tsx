import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import OrderItemListItem from '@/components/OrderItemListItem';
import OrderListItem from '@/components/OrderListItem';
import { useOrderDetails, useUpdateOrder } from '@/api/orders';
import { useUpdateOrderListener } from '@/api/orders/subscriptions';
import LoadingScreen from '@/components/LoadingScreen';
import { useEffect, useLayoutEffect } from 'react';
import { useLocale } from '@/providers/LocaleProvider';
import Header from '@/components/Header';
import { useNotification } from '@/providers/notificationProvider';
import OrderActionsSection from '@/components/OrderActionsSection';
import Feather from '@expo/vector-icons/Feather';

const OrderDetailScreen = () => {
  const navigation = useNavigation();
  const { t, localizedNum } = useLocale();
  const { notificationCount, setNotificationCount } = useNotification();
  const { id: idString } = useLocalSearchParams();
  const id =
    (idString &&
      parseFloat(typeof idString === 'string' ? idString : idString[0])) ||
    0;

  const { error, data: order, isLoading } = useOrderDetails(id);
  const { mutate: updateOrder } = useUpdateOrder();

  // Listen to Backend updates
  useUpdateOrderListener(id);

  // Display loading as title until order loads
  useLayoutEffect(() => {
    if (isLoading) {
      navigation.setOptions({ title: t('common.loading') });
    }
  }, [isLoading, navigation]);

  // Check if order has been checked since the latest order status change or not
  // and update order accordingly
  useEffect(() => {
    if (order && order.latest_status_checked === false) {
      updateOrder({ id, updatedFields: { latest_status_checked: true } });
      setNotificationCount(notificationCount - 1);
    }
  }, [order]);

  const cancelOrder = () => {
    updateOrder({ id, updatedFields: { status: 'Canceled' } });
  }

  const CancelOrderSection = () => (
    <Pressable onPress={cancelOrder} style={{padding: 5}}>
      {({ pressed }) => (
        <Feather
          name='trash'
          size={20}
          color='#c0292a'
          style={{ opacity: pressed ? 0.5 : 1 }}
        />
      )}
    </Pressable>
  );

  if (isLoading) return <LoadingScreen />;
  if (error) return <Text>{t('orders.failed_fetch_order')}</Text>;
  if (!order) {
    return <Text>{t('order.order_not_found')}</Text>;
  }

  return (
    <View style={styles.container}>
      <Header
        title={t('orders.order_n') + localizedNum(order.id)}
        headerRight={<CancelOrderSection />}
      />

      <OrderListItem order={order} />
      {order?.status === 'New' && <OrderActionsSection order={order} />}
      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    gap: 20,
  },
});

export default OrderDetailScreen;
