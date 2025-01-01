import CustomeInput from '@/components/CustomeInput';
import { View } from '@/components/Themed';
import { useLocale } from '@/providers/LocaleProvider';
import { useForm, Controller } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useUpdateProfile } from '@/api/profile';
import LoadingScreen from './LoadingScreen';

type DefaultDataType = {
  full_name: string;
  email: string | undefined;
  contact_number: string;
} | null;

const EditProfile = () => {
  const [defaultValues, setDefaultValues] = useState<DefaultDataType>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { userSession, profile, fetchUserSession } = useAuth();
  const { mutate: updateProfile } = useUpdateProfile();
  const { t } = useLocale();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const setFormValues = (values: DefaultDataType) => {
    setDefaultValues(values);
    setValue('full_name', values?.full_name);
    setValue('email', values?.email);
    setValue('contact_number', values?.contact_number);
  };

  useEffect(() => {
    const loadDefaultValues = async () => {
      setLoading(true);
      const values = profile &&
        userSession && {
          full_name: profile?.full_name,
          email: userSession?.user.email,
          contact_number: profile?.contact_number,
        };
      setFormValues(values);
      setLoading(false);
    };

    loadDefaultValues();
  }, [setValue, userSession, profile]);

  const onSubmit = (data: any) => {
    setLoading(true);
    const id = userSession?.user.id || '';
    const updatedData = {
      full_name: data.full_name || '',
      contact_number: data.contact_number || '',
    };
    updateProfile(
      {
        id,
        updatedData,
      },
      {
        onSuccess: () => {
          fetchUserSession();
          setLoading(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setFormValues(defaultValues);
  };

  // Watch the form data
  // Compare current data with default values
  const formData = watch();
  const isChanged = defaultValues
    ? formData.full_name !== defaultValues?.full_name ||
      formData.contact_number !== defaultValues?.contact_number
    : false;

  return (
    <View style={styles.mainContainer}>
      {loading && (
        <View style={styles.loadingScreen}>
          <LoadingScreen />
        </View>
      )}
      <Controller
        control={control}
        render={({ field }) => (
          <CustomeInput
            label={t('settings.profile.email')}
            required
            disabled
            style={styles.input}
            {...field}
          />
        )}
        name='email'
      />
      <Controller
        control={control}
        render={({ field }) => (
          <CustomeInput
            label={t('settings.profile.name')}
            error={
              !!errors.full_name && typeof errors.full_name.message === 'string'
                ? errors.full_name.message
                : ''
            }
            required
            placeHolder={t('settings.profile.name_ph')}
            style={styles.input}
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
            style={styles.input}
            {...field}
          />
        )}
        name='contact_number'
        rules={{
          required: t('common.field_required'),
        }}
      />
      <View style={styles.actionContainer}>
        <Button
          text={t('settings.profile.reset')}
          onPress={handleCancel}
          disabled={!isChanged}
          textStyle={{ color: isChanged ? Colors.light.tint : 'white' }}
          style={{
            backgroundColor: isChanged ? 'white' : 'gray',
            opacity: isChanged ? 1 : 0.6,
            borderColor: isChanged ? Colors.light.tint : 'gray',
            paddingVertical: 5,
            borderRadius: 5,
            borderWidth: 1,
            flex: 1,
          }}
        />
        <Button
          text={t('settings.profile.edit')}
          onPress={handleSubmit(onSubmit)}
          style={{ paddingVertical: 5, borderRadius: 5, flex: 1 }}
          disabled={!isChanged}
        />
      </View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 5,
    flexGrow: 1,
    position: 'relative',
  },
  input: {
    marginBottom: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 5
  },
  loadingScreen: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    width: '100%',
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
});
