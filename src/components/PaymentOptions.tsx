import { Image, Linking, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Text, View } from './Themed';
import Accordian from './Accordion';
import * as Clipboard from 'expo-clipboard';
import ActionCenter from './ActionCenter';
import { useLocale } from '@/providers/LocaleProvider';
import Button from './Button';

const PaymentOptions = ({ amount }: { amount: number | string }) => {
  const [showCopyText, togglecopyText] = useState<boolean>(false);

  const { t, localizedNum } = useLocale();

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync('01113381081');
      togglecopyText(true);
    } catch (err) {
      console.log(err);
    }
  };

  const openInstaPay = async () => {
    const url = 'https://ipn.eg/S/mrizksbm/instapay/2yERj6';
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log('the error is ', error);
    }
  };

  const Wallet = () => (
    <View style={styles.sectionContainer}>
      <Text>{t('payment_options.use_wallet')}</Text>
      <Text>{t('payment_options.click_mobile')}</Text>
      <Text>
        {t('payment_options.insert_amount')}
        <Text style={styles.detailsHighlight}>
          {localizedNum(amount) + ' ' + t('common.currency')}
        </Text>
        {t('payment_options.set_to_go')}
      </Text>

      <Button
        text={t('payment_options.action_center_btn')}
        onPress={copyToClipboard}
        style={styles.actionBtn}
      />
    </View>
  );

  const InstaPay = () => (
    <View style={styles.sectionContainer}>
      <Text>{t('payment_options.fill_insta_auto')}</Text>
      <Text>
        {t('payment_options.insert_amount')}
        <Text style={styles.detailsHighlight}>
          {localizedNum(amount) + ' ' + t('common.currency')}
        </Text>
        {t('payment_options.set_to_go')}
      </Text>

      <Button
        text={t('payment_options.open_insta')}
        onPress={openInstaPay}
        style={styles.actionBtn}
      />
    </View>
  );

  const list = [
    {
      title: 'payment_options.insta',
      titleIcon: () => (
        <Image
          source={require('../../assets/images/instapay.png')}
          style={{
            width: 36,
            height: 36,
            alignSelf: 'center',
            resizeMode: 'contain',
            marginLeft: -4,
          }}
        />
      ),
      content: <InstaPay />,
    },
    {
      title: 'payment_options.wallet',
      titleIcon: () => (
        <Image
          source={require('../../assets/images/wallet.png')}
          style={{
            width: 28,
            height: 28,
            alignSelf: 'center',
            marginBottom: 3,
            marginRight: 3,
          }}
        />
      ),
      content: <Wallet />,
    },
  ];

  return (
    <View style={styles.container}>
      <ActionCenter
        message='payment_options.action_center_msg'
        showNotification={showCopyText}
        toggleNotificaction={togglecopyText}
        actionBTNText='payment_options.action_center_btn'
        elevation={12}
        time={1000}
      />
      <Accordian sections={list} />
    </View>
  );
};

export default PaymentOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
  },
  sectionContainer: {
    gap: 10,
  },
  actionBtn: {
    paddingVertical: 10,
  },
  detailsHighlight: {
    textAlign: 'center',
    fontWeight: 600,
  },
});
