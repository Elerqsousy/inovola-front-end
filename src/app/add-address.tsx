import { useInsertAddress } from '@/api/addresses';
import CustomeInput from '@/components/CustomeInput';
import { View } from '@/components/Themed';
import { useLocale } from '@/providers/LocaleProvider';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Button from '@/components/Button';
import { useState } from 'react';

const AddNewAddress = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useLocale();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const { mutate: insertAddress } = useInsertAddress();

  const onSubmit = (data: any) => {
    setLoading(true);
    insertAddress(data, {
      onSuccess: () => {
        setLoading(false);
        router.back();
      },
    });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Controller
            control={control}
            render={({ field }) => (
              <CustomeInput
                label={t('address.form.name')}
                error={
                  !!errors.user_name &&
                  typeof errors.user_name.message === 'string'
                    ? errors.user_name.message
                    : ''
                }
                required
                {...field}
              />
            )}
            name='user_name'
            rules={{
              required: t('common.field_required'),
            }}
          />
          <Controller
            control={control}
            render={({ field }) => (
              <CustomeInput
                label={t('address.form.phone')}
                placeHolder={t('address.form.phone_ph')}
                error={
                  !!errors.phone && typeof errors.phone.message === 'string'
                    ? errors.phone.message
                    : ''
                }
                required
                {...field}
              />
            )}
            name='phone'
            rules={{
              required: t('common.field_required'),
            }}
          />
          <Controller
            control={control}
            render={({ field }) => (
              <CustomeInput
                label={t('address.form.address_label')}
                placeHolder={t('address.form.address_label_ph')}
                {...field}
              />
            )}
            name='address_label'
          />
          <Controller
            control={control}
            render={({ field }) => (
              <CustomeInput
                label={t('address.form.address')}
                placeHolder={t('address.form.address_ph')}
                error={
                  !!errors.address && typeof errors.address.message === 'string'
                    ? errors.address.message
                    : ''
                }
                required
                {...field}
              />
            )}
            name='address'
            rules={{
              required: t('common.field_required'),
            }}
          />

          <View style={styles.multiItemContainer}>
            <Controller
              control={control}
              render={({ field }) => (
                <CustomeInput
                  label={t('address.form.area')}
                  placeHolder={t('address.form.area_ph')}
                  error={
                    !!errors.area && typeof errors.area.message === 'string'
                      ? errors.area.message
                      : ''
                  }
                  required
                  style={{ flex: 1 }}
                  {...field}
                />
              )}
              name='area'
              rules={{
                required: t('common.field_required'),
              }}
            />
            <Controller
              control={control}
              render={({ field }) => (
                <CustomeInput
                  label={t('address.form.governorate')}
                  placeHolder={t('address.form.governorate_ph')}
                  error={
                    !!errors.governorate &&
                    typeof errors.governorate.message === 'string'
                      ? errors.governorate.message
                      : ''
                  }
                  style={{ flex: 1 }}
                  required
                  {...field}
                />
              )}
              name='governorate'
              rules={{
                required: t('common.field_required'),
              }}
            />
          </View>
          <View style={styles.multiItemContainer}>
            <Controller
              control={control}
              render={({ field }) => (
                <CustomeInput
                  label={t('address.form.apt_n')}
                  placeHolder={t('address.form.apt_n_ph')}
                  error={
                    !!errors.apt_number &&
                    typeof errors.apt_number.message === 'string'
                      ? errors.apt_number.message
                      : ''
                  }
                  required
                  style={{ flex: 1 }}
                  {...field}
                />
              )}
              name='apt_number'
              rules={{
                required: t('common.field_required'),
              }}
            />

            <Controller
              control={control}
              render={({ field }) => (
                <CustomeInput
                  label={t('address.form.floor_n')}
                  placeHolder={t('address.form.floor_n_ph')}
                  error={
                    !!errors.floor && typeof errors.floor.message === 'string'
                      ? errors.floor.message
                      : ''
                  }
                  required
                  style={{ flex: 1 }}
                  {...field}
                />
              )}
              name='floor'
              rules={{
                required: t('common.field_required'),
              }}
            />
          </View>

          <Controller
            control={control}
            render={({ field }) => (
              <CustomeInput
                label={t('address.form.building_name')}
                placeHolder={t('address.form.building_name_ph')}
                {...field}
              />
            )}
            name='building_name'
          />

          <Controller
            control={control}
            render={({ field }) => (
              <CustomeInput
                label={t('address.form.land_mark')}
                placeHolder={t('address.form.land_mark_ph')}
                {...field}
              />
            )}
            name='land_mark'
          />
          <Button text='Submit' onPress={handleSubmit(onSubmit)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  multiItemContainer: {
    flexDirection: 'row',
    gap: 5,
  },
});

export default AddNewAddress;
