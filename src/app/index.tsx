import { Redirect } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import LoadingScreen from '@/components/LoadingScreen';

const index = () => {
  const { userSession, loading, profile, isAdmin } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!userSession) {
    return <Redirect href={'/sign-in'} />;
  }
  
  if (!profile?.expo_push_token) {
    return <Redirect href={'/welcome-screen'} />;
  }

  if (!isAdmin) {
    return <Redirect href={'/(user)'} />;
  }

  return <Redirect href={'/(admin)/profile'} />;
};

export default index;
