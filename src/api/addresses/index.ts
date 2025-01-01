import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InsertTables } from '@/types';

export const useUserAddressList = () => {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data: addresses, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', profile.id);
      if (error) throw new Error(error.message);
      return addresses;
    },
  });
};

export const useInsertAddress = () => {
  const queryClient = useQueryClient();
  const { userSession } = useAuth();
  const userId = userSession?.user.id || '';
  return useMutation({
    async mutationFn(data: InsertTables <'addresses'>) {
      const { error, data: newAddress } = await supabase
        .from('addresses')
        .insert({ ...data, user_id: userId?.toString() })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return newAddress;
    },
    async onSuccess() {
      await queryClient.invalidateQueries(['addresses']);
    },
  });
};
