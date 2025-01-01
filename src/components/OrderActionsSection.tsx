import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import { useLocale } from '@/providers/LocaleProvider';
import Colors from '@/constants/Colors';
import { Tables } from '@/types';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OrderActionsSectionType = {
  order: Tables<'orders'>;
};

const OrderActionsSection = ({ order }: OrderActionsSectionType) => {
  const { t } = useLocale();

  const router = useRouter();

  const openPaymetOptionsModal = async () => {
    await AsyncStorage.setItem('invoice-amount', order.total.toString());
    router.push('/payment-options');
  };

  return (
    <View style={styles.container}>
      <Text>{t('orders.payment.not_confirmed')}</Text>
      <Text>
        {t('orders.payment.payment_made')}
        <Text>{t('orders.payment.status_confirmed')}</Text>.
      </Text>
      <Text>
        {t('orders.payment.did_not_pay')}
        <Pressable
          onPress={openPaymetOptionsModal}
          style={styles.paymentContainer}
        >
          <Text style={styles.paymentText}>
            {t('orders.payment.view_payment_option')}
          </Text>
        </Pressable>
      </Text>
    </View>
  );
};

export default OrderActionsSection;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    gap: 10,
  },
  paymentContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  paymentText: {
    textDecorationLine: 'underline',
    color: Colors.light.tint,
    fontWeight: 600,
  },
});
