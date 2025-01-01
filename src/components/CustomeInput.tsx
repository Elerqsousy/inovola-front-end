import { useLocale } from '@/providers/LocaleProvider';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
} from 'react-native';
import { Text, View } from './Themed';

type CustomeInputTypes = {
  label: string | null;
  placeHolder?: string | null;
  numric?: true | false;
  value: string;
  required?: boolean;
  error?: string | null | undefined;
  onChange: (value: string) => void;
  style?: StyleProp<TextStyle>;
  disabled?: boolean;
  [x: string]: any;
};

const CustomeInput = (props: CustomeInputTypes) => {
  const {
    label,
    placeHolder = '',
    numric = false,
    value,
    error,
    required = false,
    onChange,
    style,
    disabled = false,
    ...rest
  } = props;
  const { i18n } = useLocale();

  return (
    <View style={[styles.container, style]}>
      {!!label && (
        <Text style={styles.label}>
          {label}
          {!!required && '*'}
        </Text>
      )}
      <TextInput
        placeholder={placeHolder ? placeHolder : ''}
        keyboardType={numric ? 'numeric' : 'default'}
        style={[
          styles.input,
          {
            textAlign: i18n?.locale === 'en' ? 'left' : 'right',
            backgroundColor: disabled ? '#f1f1f1' : 'white',
          },
        ]}
        value={value}
        onChangeText={onChange}
        editable={!disabled}
        {...rest}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginHorizontal: 5,
  },
  label: {
    color: 'gray',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#f1f1f1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginVertical: 5,
  },
  error: {
    color: '#FF474C',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default CustomeInput;
