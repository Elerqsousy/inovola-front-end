import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Tables } from '@/types';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { Link, useSegments } from 'expo-router';
import { useLocale } from '@/providers/LocaleProvider';
import { useEffect, useRef } from 'react';
import Colors from '@/constants/Colors';

dayjs.extend(relativeTime);

type OrderListItemProps = {
  order: Tables<'orders'>;
};

const OrderListItem = ({ order }: OrderListItemProps) => {
  const fadeAnim = useRef(new Animated.Value(.4)).current;
  const segments = useSegments();
  const { t, localizedNum } = useLocale();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: .4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <Link href={`/${segments[0]}/orders/${order.id}`} asChild>
      <Pressable style={styles.container}>
        <View>
          <Text style={styles.title}>
            {t('orders.order_n') + localizedNum(order.id)}
            {'  '}
            <Text>
              ({localizedNum(order?.total)} {t('common.currency')})
            </Text>
          </Text>
          <Text style={styles.time}>
            {localizedNum(dayjs(order.delivery_dt).format('hA - ddd - DD MMM'))}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          {order.latest_status_checked ? (
            <Text style={styles.title}>
              {t(`orders.status.${order.status.toLowerCase()}`)}
            </Text>
          ) : (
            <Animated.Text
              style={[
                styles.title,
                {
                  opacity: fadeAnim,
                  color: Colors.light.tint,
                },
              ]}
            >
              {t(`orders.status.${order.status.toLowerCase()}`)}
            </Animated.Text>
          )}
          <Text style={styles.time}>
            {localizedNum(dayjs(order.created_at).fromNow())}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 5,
  },
  time: {
    color: 'gray',
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

export default OrderListItem;
