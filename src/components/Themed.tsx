/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView, I18nManager, Platform } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import { useLocale } from '@/providers/LocaleProvider';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { i18n } = useLocale();
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const RTL = Platform.OS === 'ios' && i18n?.locale === 'ar' 

  return (
    <DefaultText
      style={[
        { color, 
          textAlign: RTL ? 'right' : 'left' 
        },
        style,
      ]}
      {...otherProps}
    />
  );
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function ViewRow(props: ViewProps) {
  const { i18n } = useLocale();

  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  const RTL = Platform.OS === 'ios' && i18n?.locale === 'ar' 

  return (
    <DefaultView
      style={[
        {
          backgroundColor,
          flexDirection: RTL ? 'row-reverse' : 'row',
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
