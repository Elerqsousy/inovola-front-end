import { PropsWithChildren, ReactNode } from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';

type SectionWIthPageBreakerType = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  last?: true | false;
};

const SectionWIthPageBreaker = ({
  children,
  style,
  last = false,
}: SectionWIthPageBreakerType) => {
  return (
    <View
      style={[
        {
          borderBottomWidth: last ? 0 : 6,
          flex: 1,
          borderColor: 'gainsboro',
          marginBottom: 20,
          paddingBottom: last ? 0 : 20,
          paddingHorizontal: 10,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default SectionWIthPageBreaker;
