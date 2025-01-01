import { useRouter } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

type BBCPropType = {
  backBtnRoute?: string;
};

const BBC = ({ backBtnRoute }: BBCPropType) => {
  const [isLTR, setLTR] = useState<boolean>(true);
  const router = useRouter();

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
    <Pressable
      onPress={() =>
        !!backBtnRoute ? router.push(backBtnRoute) : router.back()
      }
    >
      {({ pressed }) => (
        <AntDesign
          name={isLTR ? 'arrowleft' : 'arrowright'}
          size={25}
          color={Colors.light.tint}
          style={{ marginEnd: 5, opacity: pressed ? 0.5 : 1 }}
        />
      )}
    </Pressable>
  );
};

export default BBC;
