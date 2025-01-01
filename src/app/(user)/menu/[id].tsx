import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useLayoutEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import Button from '@/components/Button';
import { useCart } from '@/providers/CartProvider';
import { useProduct } from '@/api/products';
import RemoteImage from '@/components/RemoteImage';
import LoadingScreen from '@/components/LoadingScreen';
import { useLocale } from '@/providers/LocaleProvider';
import Header from '@/components/Header';
import CartBtn from '@/components/CartBtn';
import ProductAddOns from '@/components/ProductAddOns';
import SectionWIthPageBreaker from '@/components/SectionWithPageBreaker';
import { Tables } from '@/types';
import { Text, View } from '@/components/Themed';
import ProductStocks from '@/components/ProductStock';
import { randomUUID } from 'expo-crypto';

// tech debt
// add form annd form validation

function ProductDetailsScreen() {
  const [selectedAddons, setSelectedAddons] = useState<{
    [key: number]: { item: Tables<'add_ons'>; quantity: number };
  }>({});
  const [mainQuantity, setMainQuantity] = useState<number>(0);
  const [selectedStock, setSelectedStock] = useState<
    Tables<'product_stock'> | undefined
  >(undefined);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const router = useRouter();
  const navigation = useNavigation();
  const { t, i18n, localizedNum } = useLocale();
  const { addCartItem } = useCart();
  const { id: idString } = useLocalSearchParams();
  const id =
    (idString &&
      parseFloat(typeof idString === 'string' ? idString : idString[0])) ||
    0;

  const { error, data: product, isLoading } = useProduct(id);

  const updateTotalPrice = (price: number) => {
    setTotalPrice(totalPrice + price);
  };

  const addItemToCart = () => {
    const cartItem = !!product &&
      !!selectedStock && {
        id: randomUUID(),
        product: product,
        selectedStock: selectedStock,
        addons: selectedAddons,
        totalPrice: totalPrice,
        quantity: mainQuantity,
        stockPrice: product.price_per_unit * selectedStock.weight,
      };
    if (!!cartItem) {
      addCartItem(cartItem);
      router.back();
    }
  };

  // Display loading as title until order loads
  useLayoutEffect(() => {
    if (isLoading) {
      navigation.setOptions({ title: t('common.loading') });
    }
  }, [isLoading, navigation]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <Text>{t('menu.failed_fetch_product')}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={i18n?.locale === 'ar' ? product?.name_ar : product?.name}
        headerRight={<CartBtn />}
      />
      <ScrollView>
        <RemoteImage path={product?.image} style={styles.image} />

        <SectionWIthPageBreaker
          last={!product?.product_addons && !product?.product_stock}
        >
          <Text>
            {i18n?.locale === 'ar'
              ? product?.description_ar
              : product?.description}
          </Text>

          {!!product?.prep_time && (
            <View>
              <Text style={styles.prepNotes}>{t('menu.prep_notes')}</Text>
              <Text>
                {`(${t('menu.preparation_time')} ${localizedNum(
                  product?.prep_time
                )} ${t('common.hrs')})`}
              </Text>
              <Text>
                {i18n?.locale === 'ar'
                  ? product?.prep_notes_ar
                  : product?.prep_notes}
              </Text>
            </View>
          )}
        </SectionWIthPageBreaker>

        {!!product?.product_stock.length && (
          <SectionWIthPageBreaker last={!product?.product_addons}>
            <Text style={styles.subTitles}>{t('menu.select_size')}</Text>
            <ProductStocks
              product={product}
              selectedStock={selectedStock}
              mainQuantity={mainQuantity}
              selectStockItem={setSelectedStock}
              setMainQuantity={setMainQuantity}
              updateTotalPrice={updateTotalPrice}
            />
          </SectionWIthPageBreaker>
        )}

        {!!product?.product_addons.length && (
          <SectionWIthPageBreaker last>
            <Text style={styles.subTitles}>{t('addons.exstras')}</Text>
            <ProductAddOns
              selectedAddons={selectedAddons}
              setSelectedAddons={setSelectedAddons}
              addons={product.product_addons}
              updateTotalPrice={updateTotalPrice}
            />
          </SectionWIthPageBreaker>
        )}
      </ScrollView>

      <Button
        style={styles.addBtn}
        text={t('menu.add_to_card')}
        extraText={
          totalPrice
            ? localizedNum(totalPrice) + ' ' + t('common.currency')
            : null
        }
        onPress={addItemToCart}
        disabled={!selectedStock}
      />
    </SafeAreaView>
  );
}

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    maxHeight: 200,
    height: 'auto',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  prepNotes: {
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  subTitles: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  addBtn: {
    marginHorizontal: 10,
  },
});
