import ChangeLanguage from '@/components/ChangeLanguage';
import SignOut from '@/components/SignOut';
import Colors from '@/constants/Colors';
import { EvilIcons, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import EditProfile from '@/components/EditProfile';
import { useLocale } from '@/providers/LocaleProvider';
import AddressList from '@/components/AddressList';

const LocalizedLogOutIcon = ({ isActive }: { isActive: boolean }) => {
  const { i18n } = useLocale();

  return (
    <SimpleLineIcons
      size={18}
      name='logout'
      style={{
        marginTop: 1,
        transform: i18n?.locale === 'ar' ? 'rotate(180deg)' : 'none',
      }}
      color={isActive ? Colors.light.tint : '#c0292a'}
    />
  );
};

const SETTINGS_LIST = [
  [
    {
      title: 'settings.profile.title',
      titleIcon: (isActive: boolean) => (
        <EvilIcons
          size={24}
          name='user'
          style={{ marginBottom: 3 }}
          color={isActive ? Colors.light.tint : 'gray'}
        />
      ),
      content: <EditProfile />,
    },
    {
      title: 'settings.address.title',
      titleIcon: (isActive: boolean) => (
        <EvilIcons
          size={22}
          name='location'
          style={{ marginBottom: 3 }}
          color={isActive ? Colors.light.tint : 'gray'}
        />
      ),
      content: <AddressList selectOnlyAddress={false} />,
    },
  ],
  [
    {
      title: 'settings.language.title',
      titleIcon: (isActive: boolean) => (
        <Ionicons
          size={19}
          name='language-outline'
          style={{ marginTop: 1 }}
          color={isActive ? Colors.light.tint : 'gray'}
        />
      ),
      content: <ChangeLanguage fixed={false} />,
    },
  ],
  [
    {
      title: 'settings.signout.title',
      titleIcon: (isActive: boolean) => (
        <LocalizedLogOutIcon isActive={isActive} />
      ),
      content: <SignOut />,
    },
  ],
];

export default SETTINGS_LIST;
