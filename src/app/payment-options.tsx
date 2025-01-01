import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocale } from '@/providers/LocaleProvider';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import PaymentOptions from '@/components/PaymentOptions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLayoutEffect, useState } from 'react';

const PaymentOptionsModal = () => {
  const [amount, setAmount] = useState('');
  const { t } = useLocale();
  const router = useRouter();

  const getAmount = async () => {
    const invoice_amount = (await AsyncStorage.getItem('invoice-amount')) || '';
    setAmount(invoice_amount);
  };

  useLayoutEffect(() => {
    getAmount();
  }, []);

  return (
    <View style={styles.container}>
      <PaymentOptions amount={amount} />

      <Pressable onPress={() => router.back()} style={styles.paymentContainer}>
        <Text style={styles.paymentText}>
          {t('order_confirm.actions.back')}
        </Text>
      </Pressable>
    </View>
  );
};

export default PaymentOptionsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
