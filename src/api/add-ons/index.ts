import { supabase } from '@/lib/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useProductAddOnList = (idList: number[]) => {
  return useQuery({
    queryKey: ['add_ons'],
    queryFn: async () => {
      const { data: add_ons, error } = await supabase
        .from('add_ons')
        .select('*')
        .in('id', idList);
      if (error) throw new Error(error.message);
      return add_ons;
    },
  });
};

export const useAddOnList = () => {
  return useQuery({
    queryKey: ['add_ons'],
    queryFn: async () => {
      const { data: add_ons, error } = await supabase
        .from('add_ons')
        .select('*')
      if (error) throw new Error(error.message);
      return add_ons;
    },
  });
};
