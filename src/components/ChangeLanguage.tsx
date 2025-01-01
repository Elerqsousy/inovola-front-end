import { Text, Pressable, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { useLocale } from '@/providers/LocaleProvider';
import Colors from '@/constants/Colors';
import { View } from './Themed';
import Ionicons from '@expo/vector-icons/Ionicons';

type LanguageRowType = {
  language: { name: string; code: string };
};

const ChangeLanguage = ({
  containerStyle = {},
  textStyles = {},
  fixed = true,
}) => {
  const { i18n, changeLocale } = useLocale();
  const oppositeLocale = i18n?.locale === 'ar' ? 'English' : 'العربية';

  const LANGUAGES = [
    { name: 'English', code: 'en' },
    { name: 'العربية', code: 'ar' },
  ];

  const LanguageRow = ({ language }: LanguageRowType) => {
    const selected = i18n?.locale === language.code;
    return (
      <Pressable
      onPress={changeLocale}
      disabled={selected}
        style={({ pressed }) => [
          styles.languageRowContainer,
          {
            borderColor: selected ? 'transparent' : '#c7c9d3',
            elevation: selected ? 0 : 4,
            backgroundColor: pressed ? 'gray' : selected ? Colors.light.tint : 'white',
            opacity: selected ? .75 : 1,
          }]}
      >
        <Text

          style={{
            color: selected ? 'white' : 'black',
          }}
        >
          {language.name}
        </Text>
        {!!selected && (
          <Ionicons
            name='checkmark'
            size={17}
            color='white'
          />
        )}
      </Pressable>
    );
  };

  if (!fixed) {
    return (
      <FlatList
        data={LANGUAGES}
        renderItem={({ item }) => <LanguageRow language={item} />}
        keyExtractor={(_, index) => index.toString()}
      />
    );
  }
  return (
    <Pressable
      onPress={changeLocale}
      style={[
        styles.fixedContainer,
        {
          ...containerStyle,
        },
      ]}
    >
      <Text style={[styles.fixedText, { ...textStyles }]}>
        {oppositeLocale}
      </Text>
    </Pressable>
  );
};

export default ChangeLanguage;

const styles = StyleSheet.create({
  fixedContainer: {
    bottom: 15,
    position: 'absolute',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 16,
    right: 40,
  },
  fixedText: {
    textAlign: 'left',
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
  languageRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 10,
  },
});
