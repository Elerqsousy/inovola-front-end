import Colors from '@/constants/Colors';
import { useLocale } from '@/providers/LocaleProvider';
import { FontAwesome } from '@expo/vector-icons';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

type PlusMinusBtnType = {
  onPlus: () => void;
  onMinus: () => void;
  content: number | string;
  plusDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const PlusMinusBtn = ({
  onPlus,
  onMinus,
  content,
  style,
  plusDisabled = false,
}: PlusMinusBtnType) => {
  const { i18n } = useLocale();
  return (
    <View style={[styles.quantitySelector, style]}>
      <FontAwesome
        onPress={onMinus}
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

export default PlusMinusBtn;

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
    paddingHorizontal: 8,
    paddingVertical: 9,
  },
  quantity: {
    fontWeight: '500',
    fontSize: 18,
    paddingHorizontal: 15,
    minWidth: 55,
    textAlign: 'center',
  },
});
