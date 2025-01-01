import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { Fragment } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function MenuStack() {
  // const { cartSize } = useCart();

  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Menu',
          headerRight: () => (
            <Link href='/(admin)/menu/create' asChild>
              <Pressable>
                {({ pressed }) => (
                  <Fragment>
                    <FontAwesome
                      name='plus-square-o'
                      size={25}
                      color={Colors.light.tint}
                      style={{ marginEnd: 5, opacity: pressed ? 0.5 : 1 }}
                    />
                    {/* {cartSize > 0 && ( */}
                    {true && (
                      <View style={styles.cartSize}>
                        <Text style={styles.cartSizeText}>{cartSize}</Text>
                      </View>
                    )}
                  </Fragment>
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  cartSize: {
    borderRadius: 10,
    aspectRatio: 1,
    backgroundColor: Colors.light.tint,
    width: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 6,
    top: -5,
  },
  cartSizeText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 13,
  },
});

export default MenuStack;
