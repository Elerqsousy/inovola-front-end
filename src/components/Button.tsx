import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Colors from '@/constants/Colors';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

type ButtonProps = {
  text: string;
  disabled?: true | false;
  color?: string | null;
  extraText?: string | number | null;
  textStyle?: StyleProp<TextStyle>
} & ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  (
    {
      text,
      disabled = false,
      color = null,
      extraText = null,
      textStyle = {},
      ...pressableProps
    },
    ref
  ) => {
    return (
      <Pressable
        ref={ref}
        {...pressableProps}
        style={({ pressed }) => [
          styles.container,
          {
            opacity: pressed ? 0.5 : 1,
            backgroundColor: disabled ? 'gray' : color || Colors.light.tint,
            justifyContent: extraText ? 'space-between' : 'center',
          },
          pressableProps.style as StyleProp<ViewStyle>,
        ]}
        disabled={disabled}
      >
        <Text style={[styles.text, textStyle as StyleProp<TextStyle> ]}>{text}</Text>
        {extraText && <Text style={styles.text}>{extraText}</Text>}
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderRadius: 20,
    marginVertical: 10,
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default Button;
