import Colors from '@/constants/Colors';
import { useCart } from '@/providers/CartProvider';
import { useLocale } from '@/providers/LocaleProvider';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Fragment } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function CartBtn() {
  const { i18n, localizedNum } = useLocale();
  const { cartSize } = useCart();

  return (
    <Link href='/cart' asChild>
      <Pressable>
        {({ pressed }) => (
          <Fragment>
            <FontAwesome
              name='shopping-cart'
              size={25}
              color='black'
              style={{
                opacity: pressed ? 0.5 : 1,
              }}
            />
            {cartSize > 0 && (
              <View style={[styles.cartSize, { right: i18n?.locale === 'ar' ? 6 : 2 }]}>
                <Text style={styles.cartSizeText}>
                  {localizedNum(cartSize)}
                </Text>
              </View>
            )}
          </Fragment>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  cartSize: {
    borderRadius: 10,
    aspectRatio: 1,
    backgroundColor: Colors.light.tint,
    width: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
  },
  cartSizeText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 13,
  },
});

export default CartBtn;
