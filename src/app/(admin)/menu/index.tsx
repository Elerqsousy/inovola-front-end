import { useProductList } from '@/api/products';
import { Text } from '@/components/Themed';
import LoadingScreen from '@/components/LoadingScreen';
import ProductListItem from '@components/ProductListItem';
import { FlatList } from 'react-native';

function MenuScreen() {
  const { error, data: products, isLoading } = useProductList();

  if (isLoading) return <LoadingScreen />;
  if (error) return <Text>Failed to fetch Products.</Text>;

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductListItem product={item} />}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
    />
  );
}

export default MenuScreen;
