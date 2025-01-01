export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      add_ons: {
        Row: {
          created_at: string
          id: number
          min: number
          name: string
          name_ar: string
          unit: string
          unit_ar: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: number
          min?: number
          name: string
          name_ar: string
          unit?: string
          unit_ar?: string
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: number
          min?: number
          name?: string
          name_ar?: string
          unit?: string
          unit_ar?: string
          unit_price?: number
        }
        Relationships: []
      }
      addresses: {
        Row: {
          address: string
          address_label: string | null
          apt_number: string
          area: string
          building_name: string | null
          created_at: string
          default: boolean
          floor: string | null
          governorate: string
          id: number
          land_mark: string | null
          phone: string
          user_id: string
          user_name: string
        }
        Insert: {
          address: string
          address_label?: string | null
          apt_number: string
          area: string
          building_name?: string | null
          created_at?: string
          default?: boolean
          floor?: string | null
          governorate: string
          id?: number
          land_mark?: string | null
          phone: string
          user_id: string
          user_name: string
        }
        Update: {
          address?: string
          address_label?: string | null
          apt_number?: string
          area?: string
          building_name?: string | null
          created_at?: string
          default?: boolean
          floor?: string | null
          governorate?: string
          id?: number
          land_mark?: string | null
          phone?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      governorates: {
        Row: {
          created_at: string
          id: number
          Name: string
          serviced: boolean
        }
        Insert: {
          created_at?: string
          id?: number
          Name: string
          serviced?: boolean
        }
        Update: {
          created_at?: string
          id?: number
          Name?: string
          serviced?: boolean
        }
        Relationships: []
      }
      order_item_addons: {
        Row: {
          add_on_id: number | null
          created_at: string
          id: number
          order_item_id: number | null
          quantity: number | null
        }
        Insert: {
          add_on_id?: number | null
          created_at?: string
          id?: number
          order_item_id?: number | null
          quantity?: number | null
        }
        Update: {
          add_on_id?: number | null
          created_at?: string
          id?: number
          order_item_id?: number | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_addons_add_on_id_fkey"
            columns: ["add_on_id"]
            isOneToOne: false
            referencedRelation: "add_ons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_addons_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          add_ons: Json[] | null
          created_at: string
          id: number
          order_id: number
          product_id: number
          product_stock_id: number
          quantity: number
        }
        Insert: {
          add_ons?: Json[] | null
          created_at?: string
          id?: number
          order_id: number
          product_id: number
          product_stock_id: number
          quantity?: number
        }
        Update: {
          add_ons?: Json[] | null
          created_at?: string
          id?: number
          order_id?: number
          product_id?: number
          product_stock_id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_product_stock_id_fkey"
            columns: ["product_stock_id"]
            isOneToOne: false
            referencedRelation: "product_stock"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: number
          created_at: string
          delivery_dt: string
          id: number
          latest_status_checked: boolean
          note: string | null
          status: string
          total: number
          user_id: string
        }
        Insert: {
          address_id: number
          created_at?: string
          delivery_dt: string
          id?: number
          latest_status_checked?: boolean
          note?: string | null
          status?: string
          total: number
          user_id: string
        }
        Update: {
          address_id?: number
          created_at?: string
          delivery_dt?: string
          id?: number
          latest_status_checked?: boolean
          note?: string | null
          status?: string
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_addons: {
        Row: {
          add_on_id: number
          created_at: string
          id: number
          product_id: number
        }
        Insert: {
          add_on_id: number
          created_at?: string
          id?: number
          product_id: number
        }
        Update: {
          add_on_id?: number
          created_at?: string
          id?: number
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_addons_add_on_id_fkey"
            columns: ["add_on_id"]
            isOneToOne: true
            referencedRelation: "add_ons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_addons_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_stock: {
        Row: {
          available_units: number
          created_at: string
          id: number
          product_id: number
          weight: number
        }
        Insert: {
          available_units?: number
          created_at?: string
          id?: number
          product_id: number
          weight: number
        }
        Update: {
          available_units?: number
          created_at?: string
          id?: number
          product_id?: number
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_stock_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          description_ar: string | null
          group: string
          group_ar: string
          id: number
          image: string | null
          name: string
          name_ar: string
          prep_notes: string | null
          prep_notes_ar: string | null
          prep_time: number
          price_per_unit: number
          show: boolean
          unit: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          group: string
          group_ar: string
          id?: number
          image?: string | null
          name: string
          name_ar: string
          prep_notes?: string | null
          prep_notes_ar?: string | null
          prep_time?: number
          price_per_unit: number
          show?: boolean
          unit: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          group?: string
          group_ar?: string
          id?: number
          image?: string | null
          name?: string
          name_ar?: string
          prep_notes?: string | null
          prep_notes_ar?: string | null
          prep_time?: number
          price_per_unit?: number
          show?: boolean
          unit?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          contact_number: string | null
          expo_push_token: string | null
          full_name: string | null
          group: string
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          contact_number?: string | null
          expo_push_token?: string | null
          full_name?: string | null
          group?: string
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          contact_number?: string | null
          expo_push_token?: string | null
          full_name?: string | null
          group?: string
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
