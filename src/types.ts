import { Database } from './database.types';

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

export const OrderStatusList: OrderStatus[] = [
  'New',
  'Cooking',
  'Delivering',
  'Delivered',
  'Confirmed',
  'Canceled',
];
export type OrderStatus =
  | 'New'
  | 'Cooking'
  | 'Delivering'
  | 'Delivered'
  | 'Confirmed'
  | 'Canceled';
