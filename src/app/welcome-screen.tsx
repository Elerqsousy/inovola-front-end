import Button from '@/components/Button';
import { Text, View } from '@/components/Themed';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useLocale } from '@/providers/LocaleProvider';
import { useNotification } from '@/providers/notificationProvider';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

const WelcomeScreen = () => {
  const { t } = useLocale();
  const router = useRouter();
  const { profile, loading, fetchUserSession } = useAuth();
  const { expoPushToken } = useNotification();

  const savePushTokenToDP = async () => {
    await supabase
      .from('profiles')
      .update({ expo_push_token: expoPushToken })
      .eq('id', profile?.id || '');

      fetchUserSession();
  };
  useEffect(() => {
    !loading && savePushTokenToDP();
  }, [expoPushToken, profile]);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{t('welcome_screen.message')}</Text>
      <Text style={styles.message}>{t('welcome_screen.message2')}</Text>
      <Text style={styles.cta}>{t('welcome_screen.cta')}</Text>
      <Button
        text={t('welcome_screen.menu')}
        textStyle={styles.btn}
        style={styles.btnContainer}
        onPress={() => router.push('/')}
      />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    gap: 20,
    flex: 1,
  },
  message: {
    textAlign: 'justify',
    fontSize: 17,
    lineHeight: 28,
  },
  cta: {
    fontSize: 17,
    fontWeight: 600,
  },
  btnContainer: {
    marginTop: 'auto',
  },
  btn: {
    fontSize: 17,
  },
});
