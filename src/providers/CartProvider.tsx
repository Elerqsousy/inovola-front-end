import { useInsertOrderItemAddons } from '@/api/order-item-addons';
import { useInsertOrderItems } from '@/api/order-items';
import { useInsertOrder } from '@/api/orders';
import { useUpdateStockUnits } from '@/api/product_stock';
import { InsertTables, Tables } from '@/types';
import { useRouter } from 'expo-router';
import { PropsWithChildren, createContext, useContext, useState } from 'react';

export type CartItemType = {
  id: string;
  product: Tables<'products'> & { product_stock: Tables<'product_stock'>[] };
  selectedStock: Tables<'product_stock'>;
  addons: {
    [key: number]: { item: Tables<'add_ons'>; quantity: number };
  };
  totalPrice: number;
  quantity: number;
  stockPrice: number;
  //   add notes on product dsplay page and in API and cart
};

type CartType = {
  items: CartItemType[];
  cartTotal: number;
  cartSize: number;
  reservedStock: { [id: number]: number };
  cartLoading: boolean;
  confirmedOrderId: number | undefined;
  addCartItem: (item: CartItemType) => void;
  editCartItemMain: (
    itemId: string,
    quantity: number,
    destroy?: boolean
  ) => void;
  deleteCartItemMain: (id: string) => void;
  editCartItemAddons: (
    itemId: string,
    addonId: number,
    quantity: 1 | -1
  ) => void;
  checkout: (addressId: number, date: string) => void;
  resetOrderId: () => void;
};

const CartContext = createContext<CartType>({
  items: [],
  cartTotal: 0,
  cartSize: 0,
  reservedStock: {},
  cartLoading: false,
  confirmedOrderId: undefined,
  addCartItem: () => {},
  editCartItemMain: () => {},
  deleteCartItemMain: () => {},
  editCartItemAddons: () => {},
  checkout: () => {},
  resetOrderId: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [cartLoading, setCartLoading] = useState<boolean>(false);
  const [items, setItems] = useState<CartItemType[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [cartSize, setCartSize] = useState<number>(0);
  const [confirmedOrderId, setConfirmedOrderId] = useState<number | undefined>(
    undefined
  );
  const [reservedStock, setReservedStock] = useState<{ [id: number]: number }>(
    {}
  );

  const router = useRouter();
  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();
  const { mutate: updateStockUnits } = useUpdateStockUnits();
  const { mutate: insertOrderItemAddons } = useInsertOrderItemAddons();

  const resetOrderId = () => {
    setConfirmedOrderId(undefined);
    setCartTotal(0);
  };

  const updateReservedStock = (id: number, quantity: number) => {
    const newStock = { ...reservedStock };

    if (newStock[id] && newStock[id] + quantity === 0) {
      delete newStock[id];
    } else if (newStock[id]) {
      newStock[id] += quantity;
    } else {
      newStock[id] = quantity;
    }

    setReservedStock(newStock);
  };

  const updateCartState = (
    itemId: number,
    priceToAdd: number,
    quantityToAdd: number = 0
  ) => {
    priceToAdd && setCartTotal(cartTotal + priceToAdd);
    quantityToAdd !== 0 && setCartSize(cartSize + quantityToAdd);
    quantityToAdd !== 0 && updateReservedStock(itemId, quantityToAdd);
  };

  const addCartItem = (item: CartItemType) => {
    const newCartItems = [...items, item];
    setItems(newCartItems);
    updateCartState(item.selectedStock.id, item.totalPrice, item.quantity);
  };

  const editCartItemMain = (
    itemId: string,
    quantity: number,
    destroy: boolean = false
  ) => {
    const newItems: CartItemType[] = [];
    items.map((item) => {
      if (item.id === itemId) {
        if (destroy || item.quantity + quantity === 0) {
          updateCartState(
            item.selectedStock.id,
            -item.totalPrice,
            -item.quantity
          );
        } else {
          newItems.push({
            ...item,
            quantity: item.quantity + quantity,
            totalPrice: item.totalPrice + item.stockPrice * quantity,
          });
          updateCartState(
            item.selectedStock.id,
            item.stockPrice * quantity,
            quantity
          );
        }
      } else {
        newItems.push(item);
      }
      // return item;
    });
    setItems(newItems);
  };

  const deleteCartItemMain = (itemId: string) => {
    editCartItemMain(itemId, 0, true);
  };

  const editCartItemAddons = (
    itemId: string,
    addonId: number,
    quantity: 1 | -1
  ) => {
    let addonPrice = 0;
    const newItems = items.map((item) => {
      if (item.id === itemId) {
        let addons = { ...item.addons };
        addonPrice = addons[addonId].item.min * addons[addonId].item.unit_price;
        if (addons[addonId].quantity + quantity === 0) {
          delete addons[addonId];
        } else {
          addons[addonId].quantity += quantity;
        }
        const newItem = {
          ...item,
          totalPrice: item.totalPrice + addonPrice * quantity,
          addons,
        };
        return newItem;
      } else return item;
    });
    setItems(newItems);
    setCartTotal(cartTotal + addonPrice * quantity);
  };

  const clearCart = () => {
    setItems([]);
    setCartSize(0);
    setReservedStock({});
    setCartLoading(false);
  };

  const updateStock = (order_id: number) => {
    let stockObj: { [id: number]: number } = {};
    items.map(({ selectedStock, quantity }) => {
      if (stockObj[selectedStock.id]) {
        stockObj[selectedStock.id] = stockObj[selectedStock.id] - quantity;
      } else {
        stockObj[selectedStock.id] = selectedStock.available_units - quantity;
      }
    });

    const stockToUpdate = Object.entries(stockObj).map(([key, value]) => ({
      id: Number(key),
      updatedFields: {
        available_units: value,
      },
    }));

    updateStockUnits(stockToUpdate, {
      onSuccess: () => {
        router.push('/order-confirmation');
        setConfirmedOrderId(order_id);
        clearCart();
      },
    });
  };

  const saveOrderItemsAddons = (
    orderItems: Tables<'order_items'>[],
    order_id: number
  ) => {
    const addons: InsertTables<'order_item_addons'>[] = [];
    orderItems.map(({ id, add_ons }) => {
      if (add_ons && add_ons.length !== 0) {
        add_ons.map((item) => {
          const parsedItem = item !== null && JSON.parse(JSON.stringify(item));
          addons.push({
            ...parsedItem,
            order_item_id: id,
          });
        });
      }
    });
    insertOrderItemAddons(addons, { onSuccess: () => updateStock(order_id) });
  };

  const saveOrderItems = (order: Tables<'orders'>) => {
    const orderItems = items.map((item) => {
      const add_ons = Object.entries(item.addons || {}).map(([key, value]) => ({
        add_on_id: Number(key),
        quantity: value.quantity,
        order_item_id: 0,
      }));
      const orderItem: InsertTables<'order_items'> = {
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        product_stock_id: item.selectedStock.id,
        add_ons,
      };
      return orderItem;
    });
    insertOrderItems(orderItems, {
      onSuccess: (order_items) => saveOrderItemsAddons(order_items, order.id),
    });
  };

  const checkout = (addressId: number, date: string) => {
    setCartLoading(true);
    const orderData: InsertTables<'orders'> = {
      user_id: '',
      address_id: addressId,
      delivery_dt: date,
      total: cartTotal,
    };

    insertOrder(orderData, {
      onSuccess: saveOrderItems,
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartTotal,
        cartSize,
        reservedStock,
        cartLoading,
        confirmedOrderId,
        addCartItem,
        editCartItemMain,
        deleteCartItemMain,
        editCartItemAddons,
        checkout,
        resetOrderId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
