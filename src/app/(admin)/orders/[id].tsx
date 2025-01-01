import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import OrderItemListItem from '@/components/OrderItemListItem';
import OrderListItem from '@/components/OrderListItem';
import { OrderStatusList } from '@/types';
import Colors from '@/constants/Colors';
import { useOrderDetails, useUpdateOrder } from '@/api/orders';
import LoadingScreen from '@/components/LoadingScreen';
import { notifyUserAboutOrderUpdate } from '@/lib/notifications';

const OrderDetailScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id =
    (idString &&
      parseFloat(typeof idString === 'string' ? idString : idString[0])) ||
    0;

  const { error, data: order, isLoading } = useOrderDetails(id);
  const { mutate: updateOrder } = useUpdateOrder();

  const updateStatus = async (status: string) => {
    updateOrder({ id, updatedFields: { status, latest_status_checked: false } });

    if (!order) return;

    notifyUserAboutOrderUpdate({ ...order, status });
  };

  if (isLoading) return <LoadingScreen />;
  if (error) return <Text>Failed to fetch Products.</Text>;

  if (!order) {
    return <Text>Order not found!</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${order.id}` }} />
      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListHeaderComponent={() => <OrderListItem order={order} />}
        ListFooterComponent={() => (
          <>
            <Text style={{ fontWeight: 'bold' }}>Status</Text>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              {OrderStatusList.map((status, i) => (
                <Pressable
                  key={status + i}
                  onPress={() => updateStatus(status)}
                  style={{
                    borderColor: Colors.light.tint,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,
                    backgroundColor:
                      order.status === status
                        ? Colors.light.tint
                        : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      color:
                        order.status === status ? 'white' : Colors.light.tint,
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
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
