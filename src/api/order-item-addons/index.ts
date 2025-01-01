import { supabase } from '@/lib/supabase';
import { useMutation } from '@tanstack/react-query';
import { InsertTables } from '@/types';

export const useInsertOrderItemAddons = () => {
  return useMutation({
    async mutationFn(items: InsertTables<'order_item_addons'>[]) {
      const { error, data: newOrderItemAddons } = await supabase
        .from('order_item_addons')
        .insert(items)
        .select();

      if (error) throw new Error(error.message);
      return newOrderItemAddons;
    },
  });
};
