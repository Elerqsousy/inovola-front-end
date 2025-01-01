import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Tables } from '@/types';
import RemoteImage from './RemoteImage';
import { useLocale } from '@/providers/LocaleProvider';
import { add } from 'date-fns';
import { Text, View, ViewRow } from './Themed';

type AddOns = Tables<'order_item_addons'> & {
  add_ons: Tables<'add_ons'> | null;
};

type OrderItemListItemProps = {
  item: Tables<'order_items'> & { products: Tables<'products'> | null } & {
    product_stock: Tables<'product_stock'> | null;
  } & { order_item_addons: AddOns[] };
};

const OrderItemListItem = ({ item }: OrderItemListItemProps) => {
  const { t, i18n, localizedNum } = useLocale();
  const en = i18n.locale === 'en'
  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <RemoteImage
          path={item.products?.image}
          style={styles.image}
          resizeMode='contain'
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{en ? item.products?.name : item.products?.name_ar}</Text>
          <ViewRow style={styles.subtitleContainer}>
            <Text style={styles.price}>
              {t('common.currency')}
              {item.product_stock && item.products
                ? localizedNum(item.products?.price_per_unit * item.product_stock?.weight)
                : localizedNum(0)}
            </Text>
            <Text>
              {t('cart.size')} {localizedNum(item?.product_stock?.weight ?? 0)} {t('common.kg')}
            </Text>
          </ViewRow>
        </View>
        <View style={styles.quantitySelector}>
          <Text style={styles.quantity}>{localizedNum(item.quantity)}</Text>
        </View>
      </View>

      {!!item.order_item_addons.length && (
        <View style={styles.addOnContainer}>
          <Text style={styles.addOnTitle}>{t('addons.exstras')}</Text>
          <View>
            <View>
              {!!item?.order_item_addons &&
                item.order_item_addons?.map((item, i) => {
                  const { add_ons, quantity } = item;
                  const { min, unit_price } = JSON.parse(
                    JSON.stringify(add_ons)
                  );
                  return (
                    <ViewRow key={item.id + i} style={[styles.section, styles.breakDownContainer]}>
                      <Text>{localizedNum(quantity ?? '')}</Text>
                      <Text>
                        {!en
                          ? add_ons?.name_ar +
                            (add_ons?.min !== 0
                              ? ' ' + localizedNum(min) + ' ' + add_ons?.unit_ar
                              : '')
                          : add_ons?.name +
                            (add_ons?.unit !== 'none'
                              ? ' ' + add_ons?.min + add_ons?.unit
                              : '')}{' '}
                        <Text style={styles.addonPrice}>
                          (
                          {unit_price * min == 0
                            ? t('addons.free')
                            : localizedNum(unit_price * min) +
                              ' ' +
                              t('common.currency')}
                          )
                        </Text>
                      </Text>
                      <Text style={styles.totalPrice}>
                        {!quantity || unit_price * min === 0
                          ? 'ـــ ـــ'
                          : localizedNum(unit_price * min * quantity) +
                            ' ' +
                            t('common.currency')}
                      </Text>
                    </ViewRow>
                  );
                })}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: '20%',
    height: 'auto',
    aspectRatio: 1,
    alignSelf: 'center',
    marginEnd: 10,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 5,
  },
  subtitleContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  quantitySelector: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  quantity: {
    fontWeight: '500',
    fontSize: 18,
    marginEnd: 10,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  },

  addOnContainer: {
    paddingHorizontal: 5,
    flex: 1,
  },
  addOnTitle: {
    fontWeight: '600',
    marginBottom: 5,
  },
  section: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    flex: 1,
  },
  breakDownContainer: {
    alignItems: 'center',
    gap: 6,
  },
  // totalContainer: {
  //   marginLeft: 'auto',
  //   padding: 7,
  //   fontWeight: '600',
  //   fontSize: 16,
  //   textAlign: 'right',
  //   marginVertical: 5,
  // },
  totalPrice: {
    color: Colors.light.tint,
    fontWeight: 'bold',
    marginStart: 'auto',
  },
  addonPrice: {
    fontSize: 13,
  },
});

export default OrderItemListItem;
