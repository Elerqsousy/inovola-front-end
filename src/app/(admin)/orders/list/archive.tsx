import { FlatList } from 'react-native';
import OrderListItem from '@/components/OrderListItem';
import { useAdminOrderList } from '@/api/orders';
import { Text } from '@/components/Themed';
import LoadingScreen from '@/components/LoadingScreen';

const OrdersScreen = () => {
  const {
    data: orders,
    isLoading,
    error,
  } = useAdminOrderList({ archived: true });

  if (isLoading) return <LoadingScreen />;
  if (error) return <Text>Failed to fetch Products.</Text>;

  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderListItem order={item} />}
      contentContainerStyle={{ gap: 10, padding: 10 }}
    />
  );
};

export default OrdersScreen;
