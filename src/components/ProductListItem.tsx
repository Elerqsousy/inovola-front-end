import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from '@components/Themed';
import Colors from '@/constants/Colors';
import { Link, useSegments } from 'expo-router';
import { Tables } from '@/types';
import RemoteImage from './RemoteImage';
import { useLocale } from '@/providers/LocaleProvider';
import { useCart } from '@/providers/CartProvider';

type ProductListItemProps = {
  product: Tables<'products'>;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
  const { t, i18n, localizedNum } = useLocale();
  const segments = useSegments();
  const { items } = useCart();

  const itemsOnCart = items.filter((i) => i.product.id === product.id);

  return (
    <Link
      href={`/${segments[0]}/menu/${product?.id.toString()}`}
      style={{ flexDirection: i18n.locale === 'ar' ? 'row-reverse' : 'row' }}
      asChild
    >
      <Pressable style={styles.container}>
        {!!itemsOnCart.length && <View style={styles.selectedItem}></View>}
        <RemoteImage
          path={product.image}
          style={styles.productImage}
          resizeMode='contain'
        />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            {i18n?.locale === 'ar' ? product.name_ar : product.name}
          </Text>
          <Text style={styles.price}>
            {localizedNum(product.price_per_unit)} {t('common.currency')} /{' '}
            {t('common.kg')}
          </Text>

          {!!itemsOnCart.length && (
            <View style={styles.ordersContainer}>
              {itemsOnCart.map(({ id, selectedStock, quantity, addons }) => (
                <View key={id} style={styles.order}>
                  <Text style={styles.orderDetails}>
                    {quantity > 1 && localizedNum(quantity) + ' '}(
                    {localizedNum(selectedStock.weight)} {t('common.kg')})
                    {!!addons && !!Object?.keys(addons).length && '*'}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 10
  },
  productImage: {
    width: '35%',
    height: 'auto',
    maxHeight: 110,
    aspectRatio: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 3,
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold',
    flex: 1,
  },
  ordersContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  order: {
    padding: 5,
    backgroundColor: Colors.light.tint,
    borderRadius: 15,
  },
  orderDetails: {
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  selectedItem: {
    height: '100%',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    width: 5,
    backgroundColor: Colors.light.tint,
    position: 'absolute',
    left: -10,
    marginVertical: 10,
  },
});

export default ProductListItem;
