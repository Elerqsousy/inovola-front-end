import Colors from '@/constants/Colors';
import { useLocale } from '@/providers/LocaleProvider';
import { AntDesign } from '@expo/vector-icons';
import { StackRouterOptions } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { ReactElement } from 'react';
import { Pressable } from 'react-native';

type HeaderPropTypes = {
  title: string | undefined;
  headerRight?: ReactElement;
  headerShown?: true | false;
  options?: StackRouterOptions;
  backBtn?: true | false;
};

const Header = ({
  title,
  headerRight = <></>,
  backBtn = true,
  headerShown = true,
  options,
}: HeaderPropTypes) => {
  const { i18n } = useLocale()
  const LTR = i18n?.locale === 'en';
  const router = useRouter();

  const BBC = () => (
    <>
      {backBtn ? (
        <Pressable onPress={() => router.back()}>
          {({ pressed }) => (
            <AntDesign
              name={LTR ? 'arrowleft' : 'arrowright'}
              size={25}
              color={Colors.light.tint}
              style={{ marginEnd: 5, opacity: pressed ? 0.5 : 1 }}
            />
          )}
        </Pressable>
      ) : (
        <></>
      )}
    </>
  );

  return (
    <Stack.Screen
      options={{
        title,
        headerBackVisible: false,
        headerTitleAlign: 'center',
        headerShown,
        headerLeft: () => (LTR ? <BBC /> : headerRight),
        headerRight: () => (LTR ? headerRight : <BBC />),
        ...options,
      }}
    />
  );
};

export default Header;
