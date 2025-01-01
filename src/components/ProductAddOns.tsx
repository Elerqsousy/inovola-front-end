import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Dispatch, SetStateAction } from 'react';
import { useLocale } from '@/providers/LocaleProvider';
import { Tables } from '@/types';
import PlusMinusBtn from './PlusMinusBtn';
import Colors from '@/constants/Colors';
import SelectedItemMark from './SelectedItemMark';

type productAddOnItemType = {
  add_on_id: number;
  add_ons: Tables<'add_ons'> | null;
  created_at: string;
  id: number;
  product_id: number;
};

type productAddOnsType = {
  selectedAddons: {
    [key: number]: { item: Tables<'add_ons'>; quantity: number };
  };
  setSelectedAddons: Dispatch<
    SetStateAction<{
      [key: number]: { item: Tables<'add_ons'>; quantity: number };
    }>
  >;
  addons: productAddOnItemType[];
  updateTotalPrice: (price: number) => void
};

type productAddOnType = {
  addOn: Tables<'add_ons'>;
  bordered: true | false;
};

const ProductAddOns = ({
  selectedAddons,
  setSelectedAddons,
  addons,
  updateTotalPrice
}: productAddOnsType) => {
  const { t, i18n, localizedNum } = useLocale();

  // Addon Single Item Component
  function AddOn({ addOn, bordered }: productAddOnType) {
    const { id, name, name_ar, unit_price, unit, unit_ar, min } = addOn;
    const localizedUnit = i18n?.locale === 'ar' ? unit_ar : unit;

    const addItemQuantity: (number: number) => void = (number) => {
      if (selectedAddons[id]?.quantity + number === 0) {
        const newQuantity = { ...selectedAddons };
        delete newQuantity[id];
        setSelectedAddons(newQuantity);
      } else {
        setSelectedAddons({
          ...selectedAddons,
          [id]: selectedAddons[id]
            ? {
                item: selectedAddons[id].item,
                quantity: selectedAddons[id].quantity + number,
              }
            : { item: addOn, quantity: number },
        });
      }
      updateTotalPrice(unit_price * number * min)
    };

    return (
      <View
        style={[
          styles.itemContainer,
          {
            borderBottomWidth: bordered ? 1 : 0,
          },
        ]}
      >
        <SelectedItemMark display={!!id && !!selectedAddons[id]} />
        <Text>
          {i18n?.locale === 'ar' ? name_ar : name}{' '}
          {unit_price !== 0 && !!min && localizedNum(min) + localizedUnit}
        </Text>

        <Text style={styles.itemPrice}>
          {unit_price === 0
            ? t('addons.free')
            : `(+${
                localizedNum(Number(unit_price * min)) +
                ' ' +
                t('common.currency')
              })`}
        </Text>

        {id && selectedAddons[id] ? (
          unit_price === 0 ? (
            <Pressable
              style={({ pressed }) => [
                styles.addAddOnContainer,
                {
                  opacity: pressed ? 0.5 : 1,
                  backgroundColor: 'none',
                  borderColor: Colors.light.tint,
                },
              ]}
              onPress={() => addItemQuantity(-1)}
            >
              <Text style={[styles.addAddOnText, { color: Colors.light.tint }]}>
                {t('common.remove')}
              </Text>
            </Pressable>
          ) : (
            <PlusMinusBtn
              content={localizedNum(selectedAddons[id].quantity)}
              onPlus={() => addItemQuantity(1)}
              onMinus={() => addItemQuantity(-1)}
            />
          )
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.addAddOnContainer,
              { opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={() => addItemQuantity(1)}
          >
            <Text style={styles.addAddOnText}>{t('common.add')}</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {addons?.map((item, i) => {
        if (item.add_ons)
          return (
            <AddOn
              key={item.id + item?.product_id}
              addOn={item.add_ons}
              bordered={i + 1 !== addons.length || i % 2 !== 0}
            />
          );
        return <></>;
      })}
    </View>
  );
};

export default ProductAddOns;

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
    backgroundColor: Colors.light.tint,
  },
  addAddOnText: {
    fontWeight: '500',
    fontSize: 18,
    paddingHorizontal: 21,
    minWidth: 108,
    textAlign: 'center',
    color: 'white',
  },
});
