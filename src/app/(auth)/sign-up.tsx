import { StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useLayoutEffect, useState } from 'react';
import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { Link, useNavigation } from 'expo-router';
import CustomeInput from '@/components/CustomeInput';
import { supabase } from '@/lib/supabase';
import { useLocale } from '@/providers/LocaleProvider';
import { Text, View, ViewRow } from '@/components/Themed';
import Header from '@/components/Header';
import ChangeLanguage from '@/components/ChangeLanguage';
import { Controller, useForm } from 'react-hook-form';
import { useUpdateProfile } from '@/api/profile';
import { useAuth } from '@/providers/AuthProvider';

const SignUpScreen = () => {
  const [loading, setLoading] = useState(false);

  const { t } = useLocale();
  const { mutate: updateProfile } = useUpdateProfile();
  const { fetchUserSession } = useAuth();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const signUpWithEmail = async (data: any) => {
    setLoading(true);
    const { data: response, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (!!response.session) {
      updateProfile(
        {
          id: response.session.user.id,
          updatedData: {
            contact_number: data.contact_number,
            full_name: data.full_name,
          },
        },
        {
          onSuccess: () => {
            fetchUserSession();
            setLoading(false);
          },
        }
      );
    }

    // Display loading as title until order loads
    useLayoutEffect(() => {
      if (loading) {
        navigation.setOptions({ title: t('common.loading') });
      }
    }, [loading, navigation]);

    if (error) {
      Alert.alert('', t(`auth.error.${error.code}`), [
        { text: t('auth.error.confirm') },
      ]);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header backBtn={false} title={t('auth.sign_up')} />
      <ChangeLanguage />
      <SafeAreaView>
        <ScrollView>
          <Controller
            control={control}
            render={({ field }) => (
              <CustomeInput
                label={t('settings.profile.name')}
                error={
                  !!errors.full_name &&
                  typeof errors.full_name.message === 'string'
                    ? errors.full_name.message
                    : ''
                }
                required
                placeHolder={t('settings.profile.name_ph')}
                {...field}
              />
            )}
            name='full_name'
            rules={{
              required: t('common.field_required'),
            }}
          />
          <Controller
            control={control}
            render={({ field }) => (
              <CustomeInput
                label={t('settings.profile.contact')}
                error={
                  !!errors.contact_number &&
                  typeof errors.contact_number.message === 'string'
                    ? errors.contact_number.message
                    : ''
                }
                required
                placeHolder={t('settings.profile.contact_ph')}
                {...field}
              />
            )}
            name='contact_number'
            rules={{
              required: t('common.field_required'),
            }}
          />
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
            onPress={handleSubmit(signUpWithEmail)}
            text={
              loading ? t('auth.creating_account') : t('auth.create_account')
            }
            disabled={
              !!errors.password ||
              !!errors.email ||
              !!errors.full_name ||
              !!errors.number ||
              loading
            }
          />
          <ViewRow style={styles.alternativeNavigatorContainer}>
            <Text>
              {t('auth.have_acc')}
              {'  '}
            </Text>
            <Link href='/sign-in' style={styles.textButton}>
              {t('auth.sign_in_instd')}
            </Link>
          </ViewRow>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexGrow: 1,
    padding: 20,
    textAlign: 'left',
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

export default SignUpScreen;
