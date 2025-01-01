import { useLocale } from '@/providers/LocaleProvider';
import { Stack } from 'expo-router';

function MenuStack() {
  const { t } = useLocale();

  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{ title: t('orders.title'), headerTitleAlign: 'center' }}
      />
    </Stack>
  );
}

export default MenuStack;
