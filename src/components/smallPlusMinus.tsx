import Colors from '@/constants/Colors';
import { useLocale } from '@/providers/LocaleProvider';
import { FontAwesome } from '@expo/vector-icons';
import { View, Text, StyleSheet, StyleProp, ViewStyle, Pressable } from 'react-native';

type PlusMinusBtnType = {
  onPlus: () => void;
  onMinus: () => void;
  content: number | string;
  removeOnly?: boolean;
  plusDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SmallPlusMinus = ({
  onPlus,
  onMinus,
  content,
  style,
  removeOnly = false,
  plusDisabled = false,
}: PlusMinusBtnType) => {
  const { t, i18n } = useLocale()

  if (removeOnly) return (
    <Pressable
      style={({ pressed }) => [
        styles.addAddOnContainer,
        {
          opacity: pressed ? 0.5 : 1,
        },
      ]}
      onPress={onMinus}
    >
      <Text style={styles.addAddOnText}>
        {t('common.remove')}
      </Text>
    </Pressable>
  )
  return (
    <View style={[styles.quantitySelector, style]}>
      <FontAwesome
        onPress={onMinus}
        size={10}
        name='minus'
        color={Colors.light.tint}
        style={[
          styles.plusMinus,
          {
            borderLeftWidth: i18n?.locale === 'ar' ? 1 : 0,
            borderRightWidth: i18n?.locale === 'ar' ? 0 : 1,
          },
        ]}
      />
      <Text style={styles.quantity}>{content}</Text>
      <FontAwesome
        onPress={() => !plusDisabled && onPlus()}
        size={10}
        name='plus'
        color={plusDisabled ? 'gray' : Colors.light.tint}

        style={[
          styles.plusMinus,
          {
            borderLeftWidth: i18n?.locale === 'ar' ? 0 : 1,
            borderRightWidth: i18n?.locale === 'ar' ? 1 : 0,
          },
        ]}
      />
    </View>
  );
};

export default SmallPlusMinus;

const styles = StyleSheet.create({
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gainsboro',
    borderRadius: 10,
    justifyContent: 'center',
  },
  plusMinus: {
    borderColor: 'gainsboro',
    paddingVertical: 6,
    paddingHorizontal: 7,
  },
  quantity: {
    fontWeight: '500',
    fontSize: 14,
    paddingHorizontal: 10,
    textAlign: 'center',
  },

  addAddOnContainer: {
    borderWidth: 1,
    borderColor: 'gainsboro',
    borderRadius: 10,
    paddingVertical: 2,
    backgroundColor: 'none',
  },
  addAddOnText: {
    fontWeight: '500',
    fontSize: 13,
    paddingHorizontal: 14,
    textAlign: 'center',
    color: 'black',
  },
});
