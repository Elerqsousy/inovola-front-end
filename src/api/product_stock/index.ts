import { supabase } from '@/lib/supabase';
import { useMutation } from '@tanstack/react-query';
import {  UpdateTables } from '@/types';


export const useUpdateStockUnits = () => {
  return useMutation({
    async mutationFn(items: { id: number; updatedFields: UpdateTables<'product_stock'> }[]) {
      const updates = items.map(({ id, updatedFields }) => {
        return supabase
          .from('product_stock')
          .update(updatedFields)
          .eq('id', id);
      });

      // Execute all updates in parallel
      const results = await Promise.all(updates);

      // Check for any errors
      const errors = results.filter(({ error }) => error !== null);
      if (errors.length > 0) {
        throw new Error(errors.map(({ error }) => error && error.message).join(', '));
      }

      // Return all updated items
      return results.map(({ data }) => data);
    },
  });
};
