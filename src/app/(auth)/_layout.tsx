import { useAuth } from '@/providers/AuthProvider';
import { Redirect, Stack } from 'expo-router';

function AuthLayout() {
  const { userSession } = useAuth();

  if (userSession) return <Redirect href={'/'} />;

  return <Stack />;
}
export default AuthLayout;
