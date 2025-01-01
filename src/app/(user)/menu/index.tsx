import React, { useLayoutEffect } from 'react';
import { useProductList } from '@/api/products';
import { Text, View } from '@/components/Themed';
import LoadingScreen from '@/components/LoadingScreen';
import ProductListItem from '@components/ProductListItem';
import { FlatList, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import { useLocale } from '@/providers/LocaleProvider';
import CartBtn from '@/components/CartBtn';
import BackToExit from '@/components/BackToExit';
import { useNavigation } from 'expo-router';

function MenuScreen() {
  const { t } = useLocale();
  const { error, data: products, isLoading } = useProductList();
  const navigation = useNavigation();

  // Display loading as title until order loads
  useLayoutEffect(() => {
    if (isLoading) {
      navigation.setOptions({ title: t('common.loading') });
    }
  }, [isLoading, navigation]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <Text>{t('menu.failed_fetch_product')}</Text>;

  return (
    <>
      <Header
        backBtn={false}
        title={t('menu.title')}
        headerRight={<CartBtn />}
      />
      <BackToExit />
      {products && (
        <FlatList
          data={Object.keys(products)}
          renderItem={({ item }) => (
            <View>
              <Text style={styles.ItemHeader}>{t(`menu.${item}`)}</Text>
              <FlatList
                data={products[item]}
                contentContainerStyle={{ gap: 10, padding: 10 }}
                renderItem={({ item }) => <ProductListItem product={item} />}
                keyExtractor={(_, index) => index.toString()}
              />
            </View>
          )}
          keyExtractor={(item) => item}
        />
      )}
    </>
  );
}

export default MenuScreen;

const styles = StyleSheet.create({
  ItemHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    marginVertical: 10,
    backgroundColor: 'white',
  },
});
