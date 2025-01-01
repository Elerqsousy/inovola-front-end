import { FlatList } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import Accordian from '@/components/Accordion';
import SettingsList from '@/utils/Settings';
import { useLocale } from '@/providers/LocaleProvider';
import Header from '@/components/Header';

const ProfileScreen = () => {
  const { isAdmin } = useAuth();
  const { t } = useLocale()

  if (isAdmin) {
    return <Redirect href={'/(admin)/profile'} />;
  }

  return (
    <>
      <Header backBtn={false} title={t('common.settings')} />
      <FlatList
        data={SettingsList}
        renderItem={({ item }) => <Accordian sections={item} />}
        contentContainerStyle={{
          marginVertical: 10,
          paddingBottom: 20,
          gap: 10,
        }}
      />
    </>
  );
};

export default ProfileScreen;
