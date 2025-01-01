import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text } from '@/components/Themed';
import { useLocale } from '@/providers/LocaleProvider';
import Colors from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

type ActionCenterType = {
  actionBTNText?: string;
  message: string;
  showNotification: boolean;
  toggleNotificaction: (state: boolean) => void;
  onSpringStart?: () => void;
  onSpringEnd?: () => void;
  action?: () => void;
  time?: number; // in meliseconds
  elevation?: number;
};

const ActionCenter = ({
  actionBTNText,
  message,
  showNotification,
  toggleNotificaction,
  onSpringStart = () => {},
  onSpringEnd = () => {},
  action = () => {},
  time = 300,
  elevation = 1,
}: ActionCenterType) => {
  const springValue = useRef(new Animated.Value(100)).current;

  const { t } = useLocale();

  const _spring = () => {
    onSpringStart();
    Animated.sequence([
      Animated.spring(springValue, {
        toValue: -0.01 * height * elevation,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(springValue, {
        toValue: 300,
        duration: time,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onSpringEnd();
      toggleNotificaction(false);
    });
  };

  useEffect(() => {
    showNotification && _spring();
  }, [showNotification]);

  return (
    <Animated.View
      style={[
        styles.animatedView,
        { transform: [{ translateY: springValue }] },
      ]}
    >
      <Text style={styles.exitTitleText}>{t(message)}</Text>
      {!!actionBTNText && (
        <TouchableOpacity activeOpacity={0.9} onPress={action}>
          <Text style={styles.exitText}>{t(actionBTNText)}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default ActionCenter;

const styles = StyleSheet.create({
  animatedView: {
    width,
    backgroundColor: 'white',
    elevation: 2,
    position: 'absolute',
    bottom: 0,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 1000,
  },
  exitTitleText: {
    textAlign: 'center',
    color: 'black',
    marginRight: 10,
  },
  exitText: {
    color: Colors.light.tint,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
