import { Tables } from '@/database.types';
import { supabase } from '@/lib/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useProductList = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw new Error(error.message);
      // Group items together according to their category (main dish, sides, etc...)
      return data.reduce(
        (
          acc: { [key: string]: Tables<'products'>[] },
          value: Tables<'products'>
        ) => {
          if (!acc[value?.group]) {
            acc[value?.group] = [];
          }
          acc[value?.group].push(value);
          return acc;
        },
        {}
      );
    },
  });
};

// .select('*, order_items(*, products(*)), addresses(*)')

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      // First query to get the main product and its addons
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*, product_addons(*, add_ons(*))')
        .eq('id', id)
        .single();

      if (productError) throw new Error(productError.message);

      // Second query to get the filtered product_stock items
      // Should not be compined tother as we should only get "available" itemsn only
      // and there is no way to do it on supabase oon the main request
      const { data: stockData, error: stockError } = await supabase
        .from('product_stock')
        .select('*')
        .eq('product_id', id)
        .gt('available_units', 0);

      if (stockError) throw new Error(stockError.message);

      // Combine the results manually
      const combinedData = {
        ...productData,
        product_stock: stockData
      };

      return combinedData;
    },
  });
};

export const useInsertProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(data: any) {
      const { error, data: newProduct } = await supabase
        .from('products')
        .insert({
          name: data.name,
          price: data.price,
          image: data.image,
        })
        .single();

      if (error) throw new Error(error.message);
      return newProduct;
    },
    async onSuccess() {
      await queryClient.invalidateQueries(['products']);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(data: any) {
      const { error, data: updatedProduct } = await supabase
        .from('products')
        .update({ ...data })
        .eq('id', data.id)
        .single();

      if (error) throw new Error(error.message);
      return updatedProduct;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries(['products']);
      await queryClient.invalidateQueries(['products', id]);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(id: number) {
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) throw new Error(error.message);
    },
    async onSuccess() {
      await queryClient.invalidateQueries(['products']);
    },
  });
};
