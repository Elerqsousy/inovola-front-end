import { StatusBar } from 'expo-status-bar';
import { Platform, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import Button from '@/components/Button';
import { useLocale } from '@/providers/LocaleProvider';
import LoadingScreen from '@/components/LoadingScreen';
import { View } from '@/components/Themed';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from 'date-fns';
import { enUS, arEG } from 'date-fns/locale';
import SectionWIthPageBreaker from '@/components/SectionWithPageBreaker';
import { useCart } from '@/providers/CartProvider';
import AddressList from '@/components/AddressList';

const now = new Date();
const nextDay = new Date(now);
nextDay.setDate(now.getDate() + 1);
nextDay.setHours(18, 0, 0, 0);

const CartScreen = () => {
  const [selectedAddress, setAddress] = useState<number | null>(null);
  const [date, setDate] = useState(nextDay);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const { t, i18n, localizedNum } = useLocale();
  const { cartTotal, checkout, cartLoading } = useCart();

  const allowedStartHour = 14;
  const allowedEndHour = 22;
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  const onDateTimeChange = (event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || date;

      if (mode === 'date') {
        setDate(currentDate);
      } else if (mode === 'time') {
        const hours = currentDate.getHours();
        if (hours < allowedStartHour || hours >= allowedEndHour) {
          // time frame from past 2PM and before 10PM
          Alert.alert(
            'Invalid Time',
            `Please select a time between ${allowedStartHour - 12}:00 PM and ${
              allowedEndHour - 12
            }:00 PM.`
          );
        } else {
          setDate(currentDate);
        }
      }
    }
    setShow(false);
  };

  const showMode = (currentMode: string) => {
    setShow(true);
    setMode(currentMode);
  };

  const showPicker = (mode: string) => {
    showMode(mode);
  };

  if (cartLoading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.container}>
      <SectionWIthPageBreaker style={styles.section}>
        <Text style={styles.title}>{t('checkout.delivery_address')}</Text>
        <AddressList
          selectedAddress={selectedAddress}
          setAddress={setAddress}
        />
      </SectionWIthPageBreaker>
      <SectionWIthPageBreaker style={styles.section} last>
        <Text style={styles.title}>{t('checkout.delivery_date_time')}</Text>

        <View style={styles.dateTimePickerContainer}>
          <Text
            onPress={() => showPicker('time')}
            style={[styles.time, styles.dateTime]}
          >
            {localizedNum(
              formatDate(date, 'p', {
                locale: i18n?.locale === 'ar' ? arEG : enUS,
              })
            )}
          </Text>
          <Text
            onPress={() => showPicker('date')}
            style={[styles.date, styles.dateTime]}
          >
            {localizedNum(
              formatDate(date, 'PPPP', {
                locale: i18n?.locale === 'ar' ? arEG : enUS,
              })
            )}
          </Text>
        </View>
      </SectionWIthPageBreaker>

      {show && (
        <DateTimePicker
          testID='dateTimePicker'
          value={date}
          mode={mode}
          is24Hour={false}
          onChange={onDateTimeChange}
          timeZoneName={'EEST'}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}

      <Button
        style={{ marginTop: 'auto', marginHorizontal: 10 }}
        text={t('cart.checkout')}
        onPress={() =>
          selectedAddress && checkout(selectedAddress, date.toISOString())
        }
        extraText={localizedNum(cartTotal) + ' ' + t('common.currency')}
        disabled={!selectedAddress || !date || !cartTotal}
      />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  section: {
    flex: 0,
    paddingHorizontal: 0,
    paddingBottom: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
    margin: 10,
    marginBottom: 5,
  },
  dateTimePickerContainer: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
  dateTime: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#c7c9d3',
    textAlign: 'center',
    borderRadius: 10,
    fontSize: 15,
    alignItems: 'center',
    fontWeight: '600',
  },
  date: {
    flex: 5,
  },
  time: {
    flex: 2,
  },
});
