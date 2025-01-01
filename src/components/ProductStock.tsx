import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useLocale } from '@/providers/LocaleProvider';
import { Tables } from '@/types';
import PlusMinusBtn from './PlusMinusBtn';
import Colors from '@/constants/Colors';
import SelectedItemMark from './SelectedItemMark';
import { useCart } from '@/providers/CartProvider';

// Tech debt
// solution to handle multiple orders for the same stock for multiple users at the same time
// it should be in cart, everytime a user checks cart, all items should be checked for avilability

type ProductStocksType = {
  product: Tables<'products'> & { product_stock: Tables<'product_stock'>[] };
  selectedStock: Tables<'product_stock'> | undefined;
  selectStockItem: (stock: Tables<'product_stock'> | undefined) => void;
  mainQuantity: number;
  setMainQuantity: Dispatch<SetStateAction<number>>;
  updateTotalPrice: (price: number) => void;
};

type productStockType = {
  stockItem: Tables<'product_stock'>;
  bordered: true | false;
};

function ProductStocks({
  product,
  selectedStock,
  selectStockItem,
  mainQuantity,
  setMainQuantity,
  updateTotalPrice,
}: ProductStocksType) {
  const { t, localizedNum } = useLocale();
  const { reservedStock } = useCart();

  const changeItemQuantity: (
    number: number,
    stock: Tables<'product_stock'>
  ) => void = (number, stock) => {
    const newStockPrice = product.price_per_unit * stock.weight * number;
    if (stock.id === selectedStock?.id) {
      setMainQuantity(mainQuantity + number);
      mainQuantity + number === 0 && selectStockItem(undefined);
      updateTotalPrice(newStockPrice);
    } else {
      const oldStockPrice = !!selectedStock
        ? product.price_per_unit * selectedStock.weight * mainQuantity
        : 0;
      updateTotalPrice(newStockPrice - oldStockPrice);
      selectStockItem(stock);
      setMainQuantity(number);
    }
  };

  // If there is only one stock option && it's not reserved in cart,
  // it gets selected automatically
  useEffect(() => {
    if (
      product?.product_stock.length === 1 &&
      product?.product_stock[0].available_units -
        reservedStock[product?.product_stock[0].id] >
        mainQuantity
    ) {
      changeItemQuantity(1, product?.product_stock[0]);
    }
  }, [product?.product_stock]);

  // Size Single Item Component
  function Stock({ stockItem, bordered }: productStockType) {
    const itemPrice =
      (product && product?.price_per_unit * stockItem.weight) || 0;

    const addedToCartCompletely =
      stockItem.available_units - reservedStock[stockItem.id] === 0;
    return (
      <View
        style={[
          styles.itemContainer,
          {
            borderBottomWidth: bordered ? 1 : 0,
          },
        ]}
      >
        <SelectedItemMark display={selectedStock?.id === stockItem.id} />
        <Text>
          {localizedNum(stockItem.weight)} {t('common.kg')}
        </Text>
        <Text style={styles.itemPrice}>
          {`(+${localizedNum(itemPrice)} ${t('common.currency')})`}
        </Text>

        {selectedStock?.id === stockItem.id && mainQuantity > 0 ? (
          <PlusMinusBtn
            content={localizedNum(mainQuantity)}
            onPlus={() => changeItemQuantity(1, stockItem)}
            onMinus={() => changeItemQuantity(-1, stockItem)}
            plusDisabled={
              !reservedStock[stockItem.id]
                ? stockItem.available_units > 0 &&
                  mainQuantity >= stockItem.available_units
                : stockItem.available_units - reservedStock[stockItem.id] <=
                  mainQuantity
            }
          />
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.addAddOnContainer,
              {
                opacity: pressed ? 0.5 : 1,
                backgroundColor: addedToCartCompletely
                  ? 'gainsboro'
                  : Colors.light.tint,
              },
            ]}
            onPress={() => changeItemQuantity(1, stockItem)}
            disabled={addedToCartCompletely}
          >
            <Text style={styles.addAddOnText}>{t('common.select')}</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!!product?.product_stock?.length &&
        product?.product_stock?.map((s, i) => (
          <Stock
            bordered={i !== product?.product_stock?.length - 1 && i % 2 === 0}
            stockItem={s}
            key={s.created_at}
          />
        ))}
    </View>
  );
}

export default ProductStocks;

const styles = StyleSheet.create({
  container: {
    gap: 3,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderColor: 'gainsboro',
  },
  itemPrice: {
    marginStart: 'auto',
    marginEnd: 15,
  },
  addAddOnContainer: {
    borderWidth: 1,
    borderColor: 'gainsboro',
    borderRadius: 10,
    paddingVertical: 4,
  },
  addAddOnText: {
    fontWeight: '500',
    fontSize: 18,
    paddingHorizontal: 23,
    minWidth: 108,
    textAlign: 'center',
    color: 'white',
  },
});
