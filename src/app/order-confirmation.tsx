import { useEffect, useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { useCart } from '@/providers/CartProvider';
import { Text, View } from '@/components/Themed';
import { useLocale } from '@/providers/LocaleProvider';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import LoadingScreen from '@/components/LoadingScreen';
import PaymentOptions from '@/components/PaymentOptions';

type dataType =
  | {
      total: number;
      id: number | undefined;
    }
  | undefined;

const OrderConfirmationScreen = () => {
  const [data, setData] = useState<dataType>();
  const [showPaymentOptions, togglePaymentOptions] = useState<boolean>(false);

  const { confirmedOrderId, cartTotal, resetOrderId } = useCart();
  const { t, localizedNum } = useLocale();
  const router = useRouter();

  useEffect(() => {
    setData({ total: cartTotal, id: confirmedOrderId });
    resetOrderId();

    return () => {
      router.push(`/(user)/orders`);
    };
  }, []);

  if (!data) return <LoadingScreen />;

  const Success = () => (
    <>
      <View style={styles.successContainer}>
        <FontAwesome name='check-circle' size={120} color={Colors.light.tint} />
        <Text style={styles.successText}>{t('order_confirm.success')}</Text>
      </View>
      <View style={styles.orderDetailsContainer}>
        <Text style={styles.detailsText}>
          {t('order_confirm.order')}
          <Text style={styles.detailsHighlight}>
            {!!data?.id && ' #' + localizedNum(data.id)}
          </Text>
          {t('order_confirm.placed_successfully')}
        </Text>
        <Text>{t('order_confirm.agent_contact')}</Text>
        <Text style={styles.detailsText}>
          {t('order_confirm.pay')}
          <Text style={styles.detailsHighlight}>
            {localizedNum(data?.total) + ' ' + t('common.currency') + ' '}
          </Text>
          {t('order_confirm.to_confirm_order')}
        </Text>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {!!showPaymentOptions ? (
        <PaymentOptions amount={data.total} />
      ) : (
        <Success />
      )}

      <Pressable
        onPress={() => togglePaymentOptions(!showPaymentOptions)}
        style={styles.paymentContainer}
      >
        <Text style={styles.paymentText}>
          {!showPaymentOptions
            ? t('order_confirm.actions.show_payment_options')
            : t('order_confirm.actions.back')}
        </Text>
      </Pressable>
    </View>
  );
};

export default OrderConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    margin: 30,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  successText: {
    fontSize: 24,
    fontWeight: 600,
    color: Colors.light.tint,
  },
  orderDetailsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    gap: 5,
  },
  detailsText: {
    fontSize: 16,
    textAlign: 'center',
  },
  detailsHighlight: {
    textAlign: 'center',
    fontWeight: 600,
  },
  paymentContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  paymentText: {
    textDecorationLine: 'underline',
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: 600,
  },
});
