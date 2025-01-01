import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InsertTables, UpdateTables } from '@/types';

export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived ? ['Delivered'] : ['New', 'Cooking', 'Delivering'];
  return useQuery({
    queryKey: ['orders', { archived }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', statuses)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useMynOrderList = () => {
  const { userSession } = useAuth();
  const id = userSession?.user.id;

  return useQuery({
    queryKey: ['orders', { userId: id }],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(
          '*, order_items(*, products(*), product_stock(*), order_item_addons(*, add_ons(*))), addresses(*)'
        )
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching order details:', error.message);
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { userSession } = useAuth();
  const userId = userSession?.user.id || '';
  return useMutation({
    async mutationFn(data: InsertTables<'orders'>) {
      const { error, data: newOrder } = await supabase
        .from('orders')
        .insert({ ...data, user_id: userId?.toString() })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return newOrder;
    },
    async onSuccess() {
      await queryClient.invalidateQueries(['orders']);
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn({
      id,
      updatedFields,
    }: {
      id: number;
      updatedFields: UpdateTables<'orders'>;
    }) {
      const { error, data: updatedOrder } = await supabase
        .from('orders')
        .update(updatedFields)
        .eq('id', id)
        .single();

      if (error) throw new Error(error.message);
      return updatedOrder;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries(['orders']);
      await queryClient.invalidateQueries(['orders', id]);
    },
  });
};

export const useMyOrderCount = () => {
  const { userSession } = useAuth();
  const id = userSession?.user.id;

  return useQuery({
    queryKey: ['orderCount', { userId: id }],
    queryFn: async () => {
      if (!id) return null;

      const { count, error } = await supabase
        .from('orders')
        .select('id', { count: 'exact' }) // Use the 'id' column to count
        .eq('user_id', id)
        .eq('latest_status_checked', false); // Filter by latest_status_checked
      if (error) throw new Error(error.message);
      return count; // Return the count of orders
    },
  });
};
