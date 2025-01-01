import {
  StyleSheet,
  Alert,
  AppState,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useLayoutEffect, useState } from 'react';
import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { Link, useNavigation } from 'expo-router';
import CustomeInput from '@/components/CustomeInput';
import { supabase } from '@/lib/supabase';
import { useLocale } from '@/providers/LocaleProvider';
import Header from '@/components/Header';
import { Text, ViewRow, View } from '@/components/Themed';
import ChangeLanguage from '@/components/ChangeLanguage';
import { Controller, useForm } from 'react-hook-form';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const SignInScreen = () => {
  const [loading, setLoading] = useState(false);

  const { t } = useLocale();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const signInWithEmail = async (data: any) => {
    setLoading(true);
    await supabase.auth.signInWithPassword(data).catch((error) => {
      Alert.alert('', t(`auth.error.invalid_login_cred`), [
        { text: t('auth.error.confirm') },
      ]);
    });

    setLoading(false);
  };

  // Display loading as title until order loads
  useLayoutEffect(() => {
    if (loading) {
      navigation.setOptions({ title: t('common.loading') });
    }
  }, [loading, navigation]);

  return (
    <View style={styles.container}>
      <Header backBtn={false} title={t('auth.sign_in')} />
      <ChangeLanguage />
      <SafeAreaView>
        <ScrollView>
          <Controller
            control={control}
            render={({ field }) => (
              <CustomeInput
                label={t('auth.email')}
                placeHolder={t('auth.email_example')}
                error={
                  !!errors.email && typeof errors.email.message === 'string'
                    ? errors.email.message
                    : ''
                }
                required
                {...field}
              />
            )}
            name='email'
            rules={{
              required: t('common.field_required'),
            }}
          />
          <Controller
            control={control}
            render={({ field }) => (
              <CustomeInput
                label={t('auth.password')}
                placeHolder={t('auth.password_restrictions')}
                error={
                  !!errors.password &&
                  typeof errors.password.message === 'string'
                    ? errors.password.message
                    : ''
                }
                required
                secureTextEntry
                {...field}
              />
            )}
            name='password'
            rules={{
              required: t('common.field_required'),
              minLength: {
                value: 6,
                message: t('auth.password_restrictions'),
              },
            }}
          />
          <Button
            onPress={handleSubmit(signInWithEmail)}
            text={loading ? t('auth.signing_in') : t('auth.sign_in')}
            disabled={!!errors.password || !!errors.email || loading}
          />
          <ViewRow style={styles.alternativeNavigatorContainer}>
            <Text>
              {t('auth.dont_hv_acc')}
              {'   '}
            </Text>
            <Link href='/sign-up' style={styles.textButton}>
              {t('auth.creat_an_acc')}
            </Link>
          </ViewRow>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
    marginVertical: 'auto',
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
  alternativeNavigatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
  },
});
