import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useLayoutEffect, useState } from 'react';

import { useColorScheme } from '@components/useColorScheme';
import CartProvider from '@/providers/CartProvider';
import AuthProvider from '@/providers/AuthProvider';
import QueryProvider from '@/providers/QueryProvider';
import LocalProvider from '@/providers/LocaleProvider';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationProvider from '@/providers/notificationProvider';
import BBC from '@/components/BBC';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [isLTR, setLTR] = useState<boolean>(true);
  const colorScheme = useColorScheme();

  const checkLTR = async () => {
    const localizedLang =
      (await AsyncStorage.getItem('lang')) ||
      getLocales()[0].languageCode ||
      'en';
    if (localizedLang) setLTR(localizedLang === 'en');
  };

  useLayoutEffect(() => {
    checkLTR();
  }, []);

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <ThemeProvider value={DefaultTheme}>
      <LocalProvider>
        <AuthProvider>
          <QueryProvider>
            <NotificationProvider>
              <CartProvider>
                <Stack>
                  <Stack.Screen
                    name='(admin)'
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name='(user)'
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name='(auth)'
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name='index' options={{ headerShown: false }} />
                  <Stack.Screen
                    name='cart'
                    options={{
                      // presentation: 'modal',
                      title: isLTR ? 'Cart' : 'سلة المشتريات',
                      headerBackVisible: false,
                      headerTitleAlign: 'center',
                      headerLeft: () => (isLTR ? <BBC /> : <></>),
                      headerRight: () => (isLTR ? <></> : <BBC />),
                    }}
                  />
                  <Stack.Screen
                    name='pre-checkout'
                    options={{
                      // presentation: 'modal',
                      title: isLTR ? 'Checkout' : 'تنفيذ الطلب',
                      headerBackVisible: false,
                      headerTitleAlign: 'center',
                      headerLeft: () => (isLTR ? <BBC /> : <></>),
                      headerRight: () => (isLTR ? <></> : <BBC />),
                    }}
                  />
                  <Stack.Screen
                    name='add-address'
                    options={{
                      presentation: 'modal',
                      title: isLTR ? 'Add New Address' : 'إضافة عنوان جديد',
                      headerBackVisible: false,
                      headerTitleAlign: 'center',
                      headerLeft: () => (isLTR ? <BBC /> : <></>),
                      headerRight: () => (isLTR ? <></> : <BBC />),
                    }}
                  />
                  <Stack.Screen
                    name='welcome-screen'
                    options={{
                      presentation: 'modal',
                      title: isLTR
                        ? 'Welcome to Nar Hadia'
                        : 'أهلا بكم في نار هادية',
                      headerBackVisible: false,
                      headerTitleAlign: 'center',
                    }}
                  />
                  <Stack.Screen
                    name='order-confirmation'
                    options={{
                      presentation: 'modal',
                      title: isLTR
                        ? 'Order Placed'
                        : 'تم تقديم الطلب',
                      headerBackVisible: false,
                      headerTitleAlign: 'center'
                    }}
                  />
                  <Stack.Screen
                    name='payment-options'
                    options={{
                      presentation: 'modal',
                      title: isLTR
                        ? 'Payment Options'
                        : 'طرق الدفع',
                      headerBackVisible: false,
                      headerTitleAlign: 'center'
                    }}
                  />
                </Stack>
              </CartProvider>
            </NotificationProvider>
          </QueryProvider>
        </AuthProvider>
      </LocalProvider>
    </ThemeProvider>
  );
}
