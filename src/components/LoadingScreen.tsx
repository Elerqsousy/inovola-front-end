import Colors from '@/constants/Colors';
import { View, ActivityIndicator } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size='large' color={Colors.light.tint} />
    </View>
  );
};

export default LoadingScreen;
