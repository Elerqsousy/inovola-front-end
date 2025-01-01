import { ComponentProps, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@components/useColorScheme';
import { useClientOnlyValue } from '@components/useClientOnlyValue';
import { useAuth } from '@/providers/AuthProvider';
import { useLocale } from '@/providers/LocaleProvider';
import { useNotification } from '@/providers/notificationProvider';
import { Text, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';
import { useMyOrderCount } from '@/api/orders';
import LoadingScreen from '@/components/LoadingScreen';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

function TabLayout() {
  const { t } = useLocale();
  const colorScheme = useColorScheme();
  const { userSession } = useAuth();
  const { notificationCount, setNotificationCount } = useNotification();

  if (!userSession) return <Redirect href={'/'} />;

  const { data: ordersCount, isLoading } = useMyOrderCount()

  useEffect(() => {
    !!ordersCount && setNotificationCount(ordersCount)
  },[ordersCount])

  if (isLoading) return <LoadingScreen />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen name='index' options={{ href: null, headerShown: false }} />
      <Tabs.Screen
        name='menu'
        options={{
          title: t('common.menu'),
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name='cutlery' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='orders'
        options={{
          title: t('common.orders'),
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View style={styles.orderContainer}>
              <TabBarIcon name='list' color={color} />
              {!!notificationCount && (
                <View style={styles.notificationCount}>
                  <Text style={styles.notificationCountText}>{notificationCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: t('common.settings'),
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name='gear' color={color} />,
        }}
      />
    </Tabs>
  );
}

export default TabLayout;

const styles = StyleSheet.create({
  orderContainer: {
    position: 'relative',
  },
  notificationCount: {
    borderRadius: 10,
    aspectRatio: 1,
    backgroundColor: Colors.light.tint,
    width: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    right: -5
  },
  notificationCountText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 13,
  },
});
