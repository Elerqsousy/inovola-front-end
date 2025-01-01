import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropsWithChildren, createContext, useContext } from 'react';
import { I18n } from 'i18n-js';
import EnglishTranslation from '@/translation/English.json';
import ArabicTranslation from '@/translation/Arabic.json';
import { getLocales } from 'expo-localization';
import { I18nManager, Platform } from 'react-native';
import * as Updates from 'expo-updates';
import { useRouter } from 'expo-router';
import dayjs from 'dayjs';
require('dayjs/locale/ar')
// technical debt
// sdk51 has a bug for RTL and foorce RTL
// should revisit once solved

const ConvertToArabicNumbers = (num: string) => {
  const arabicNumbers =
    '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
  return new String(num).replace(/[0123456789]/g, (d: any) => {
    return arabicNumbers[d];
  });
};

type LocaleDataType = {
  changeLocale: () => void;
  t: (wordKey: string) => string;
  i18n: I18n;
  localizedNum: (num: string | number) => string;
};

const LocaleContext = createContext<LocaleDataType>({
  changeLocale: () => {},
  t: () => '',
  i18n: new I18n(),
  localizedNum: () => '',
});

function LocaleProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const i18n = new I18n({
    en: EnglishTranslation,
    ar: ArabicTranslation,
  });

  i18n.enableFallback = true;

  const setupLocale = async () => {
    const localizedLang =
      (await AsyncStorage.getItem('lang')) ||
      getLocales()[0].languageCode ||
      'en';
    i18n.locale = localizedLang;
    dayjs.locale(localizedLang)
    Platform.OS === 'ios' && router.push('/');
  };

  setupLocale();

  const changeLocale = async () => {
    const lang = i18n.locale === 'ar' ? 'en' : 'ar';
    try {
      await AsyncStorage.setItem('lang', lang);

      const shouldBeRTL = lang === 'ar';

      if (Platform.OS !== 'web') {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
        await Updates.reloadAsync();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const t = (wordKey: string) => {
    return i18n.t(wordKey);
  };

  const localizedNum = (num: string | number) => {
    const stringNum = num.toString();
    return i18n?.locale === 'ar'
      ? ConvertToArabicNumbers(stringNum)
      : stringNum;
  };

  return (
    <LocaleContext.Provider value={{ localizedNum, i18n, t, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export default LocaleProvider;

export const useLocale = () => useContext(LocaleContext);
