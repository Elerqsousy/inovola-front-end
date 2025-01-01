import { View, Text, StyleSheet, Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import RemoteImage from './RemoteImage';
import SmallPlusMinus from './smallPlusMinus';
import { useLocale } from '@/providers/LocaleProvider';
import { Fragment } from 'react';
import { CartItemType, useCart } from '@/providers/CartProvider';

type CartListItemProps = {
  cartItem: CartItemType;
};

type FourCollumSectionProps = {
  q: number;
  onPlus: () => void;
  onMinus: () => void;
  info: string;
  price: string | number;
  totalPrice?: string | number;
  disablePlus?: boolean;
};

const Breaker = ({ marginVertical = 4 }: { marginVertical?: number }) => (
  <View style={[styles.breaker, { marginVertical: marginVertical }]}></View>
);

const CartListItem = ({ cartItem }: CartListItemProps) => {
  const { t, i18n, localizedNum } = useLocale();

    const {editCartItemMain, deleteCartItemMain, editCartItemAddons, reservedStock} = useCart()
    const { id, product, selectedStock, addons, totalPrice, stockPrice, quantity } = cartItem;

  const FourCollumSection = ({
    q,
    onPlus,
    onMinus,
    info,
    price,
    totalPrice = 0,
    disablePlus = false
  }: FourCollumSectionProps) => (
    <View style={[styles.section, styles.breakDownContainer]}>
      <SmallPlusMinus
        content={localizedNum(q)}
        onMinus={onMinus}
        onPlus={onPlus}
        removeOnly={price === 0}
        plusDisabled={disablePlus}
      />
      <Text>
        {info}{' '}
        <Text style={styles.price}>
          (
          {price == 0
            ? t('addons.free')
            : localizedNum(price) + ' ' + t('common.currency')}
          )
        </Text>
      </Text>

      <Text style={styles.totalPrice}>
        {price === 0
          ? 'ـــ ـــ'
          : localizedNum(totalPrice) + ' ' + t('common.currency')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, styles.section]}>
        <RemoteImage
          path={product.image}
          style={styles.image}
          resizeMode='contain'
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {i18n?.locale === 'ar' ? product.name_ar : product.name}
          </Text>
          <Text style={styles.cartSize}>
            {t('cart.size') +
              ' ' +
              localizedNum(selectedStock.weight) +
              ' ' +
              t('common.kg')}
          </Text>
        </View>
      </View>

      <FourCollumSection
        q={quantity}
        onPlus={() => editCartItemMain(id, 1)}
        onMinus={() =>
          quantity > 1 ? editCartItemMain(id, -1) : deleteCartItemMain(id)
        }
        info={''}
        price={stockPrice}
        totalPrice={stockPrice * quantity}
        disablePlus={cartItem.selectedStock.available_units - reservedStock[cartItem.selectedStock.id] === 0
          }
          
      />
      
      <Breaker />

      {!!addons && !!Object.keys(addons).length && (
        <>
          <Text style={styles.extrasTitle}>{t('addons.exstras')}</Text>
          {Object.entries(addons).map(([key, value], index) => (
            <Fragment key={key + index}>
              <FourCollumSection
                q={value.quantity}
                onPlus={() => editCartItemAddons(id, Number(key), 1)}
                onMinus={() => editCartItemAddons(id, Number(key), -1)}
                info={
                  i18n?.locale === 'ar'
                    ? value.item.name_ar +
                      (value.item.min !== 0
                        ? ' ' +
                          localizedNum(value.item.min) +
                          ' ' +
                          value.item.unit_ar
                        : '')
                    : value.item.name +
                      (value.item.unit !== 'none'
                        ? ' ' + value.item.min + value.item.unit
                        : '')
                }
                price={value.item.unit_price * value.item.min}
                totalPrice={value.item.unit_price * value.item.min * value.quantity}
              />
              <Breaker />
            </Fragment>
          ))}
        </>
      )}
      <Text style={styles.totalContainer}>
        {t('cart.total')}{' '}
        <Text style={styles.totalPrice}>
          {localizedNum(totalPrice) + ' ' + t('common.currency')}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    flex: 1,
    alignItems: 'flex-start',
  },
  section: {
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  image: {
    width: 60,
    aspectRatio: 1,
    height: 'auto',
    alignSelf: 'center',
    marginEnd: 10,
  },
  titleContainer: {
    gap: 3,
    paddingBottom: 3,
  },
  title: {
    fontWeight: '600',
    fontSize: 20,
  },
  extrasTitle: {
    fontSize: 15,
    padding: 8,
  },
  cartSize: {
    fontWeight: '600',
    color: 'gray',
  },
  total: {
    color: Colors.light.tint,
    fontSize: 16,
  },
  breakDownContainer: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  totalContainer: {
    marginLeft: 'auto',
    padding: 7,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'right',
    marginVertical: 5,
  },
  totalPrice: {
    color: Colors.light.tint,
    fontWeight: 'bold',
    marginStart: 'auto',
  },
  price: {
    fontSize: 13,
  },

  breaker: {
    width: '100%',
    borderBottomWidth: 2,
    borderColor: '#f6f6f6',
  },
});

export default CartListItem;
