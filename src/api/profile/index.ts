import { supabase } from '@/lib/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
      async mutationFn(data: any) {
        const { error, data: updatedProfile } = await supabase
          .from('profiles')
          .update({ ...data.updatedData })
          .eq('id', data.id)
          .single();
  
        if (error) throw new Error(error.message);
        return updatedProfile;
      },
      async onSuccess(_, { id }) {
        await queryClient.invalidateQueries(['profiles']);
        await queryClient.invalidateQueries(['profiles', id]);
      },
    });
  };
