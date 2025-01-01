import { StatusBar } from 'expo-status-bar';
import {
  Platform,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useCart } from '@/providers/CartProvider';

import CartListItem from '@/components/CartListItem';
import Button from '@/components/Button';
import { useLocale } from '@/providers/LocaleProvider';
import { View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

const CartScreen = () => {
  const { t, localizedNum } = useLocale();
  const { items, cartSize, cartTotal } = useCart();
  const router = useRouter();

  if (cartSize === 0)
    return (
      <View style={styles.emptyCartContainer}>
        <Text style={styles.isEmpty}>{t('cart.empty_cart')}</Text>
        <Button
          text={t('common.continue_browsing')}
          onPress={router.back}
          style={styles.backBtn}
          textStyle={styles.backBtnText}
        />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        keyExtractor={item => item.id}
      />

      <Button
        style={{ marginTop: 'auto', marginHorizontal: 10 }}
        text={t('cart.proceed_checkout')}
        onPress={() => router.push('/pre-checkout')}
        extraText={localizedNum(cartTotal) + ' ' + t('common.currency')}
      />

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  isEmpty: {
    fontSize: 16,
    textAlign: 'center',
  },
  backBtnText: {
    fontWeight: '400',
    color: Colors.light.tint,
    textDecorationColor: Colors.light.tint,
    textDecorationLine: 'underline',
  },
  backBtn: {
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 12,
    fontWeight: '400',
    backgroundColor: 'transparent',
    color: Colors.light.tint,
  },
  container: {
    flex: 1,
  },

  totalPrice: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 15,
  },
});
