import { Tables } from '@/database.types';
import { supabase } from '@/lib/supabase';
import { AuthError, Session } from '@supabase/supabase-js';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';

type AuthDataType = {
  userSession: Session | null;
  authError: AuthError | null;
  loading: true | false;
  profile: Tables<'profiles'> | null;
  isAdmin: boolean;
  fetchUserSession: () => void
};

const AuthContext = createContext<AuthDataType>({
  userSession: null,
  authError: null,
  loading: true,
  profile: null,
  isAdmin: false,
  fetchUserSession: () => {}
});

function AuthProvider({ children }: PropsWithChildren) {
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [loading, setLoading] = useState<true | false>(true);
  const [isAdmin, setAdmin] = useState<true | false>(false);

  const getUserProfile = async (session: Session | null) => {
    setLoading(true);
    if (session) {
      // fetch profile
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      setAdmin(data?.group === 'ADMIN');
      setProfile(data || null);
    }
    setLoading(false);
  };

  const fetchUserSession = async () => {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    setUserSession(session);
    setAuthError(error);
    getUserProfile(session);
  };

  useLayoutEffect(() => {
    fetchUserSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session);
      getUserProfile(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ userSession, authError, loading, profile, isAdmin, fetchUserSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
