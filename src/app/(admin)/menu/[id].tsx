import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Fragment } from 'react';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useProduct } from '@/api/products';
import RemoteImage from '@/components/RemoteImage';
import LoadingScreen from '@/components/LoadingScreen';

const sizes: string[] = ['S', 'M', 'L', 'XL'];

function ProductDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);

  const { error, data: product, isLoading } = useProduct(id);

  const router = useRouter();

  if (isLoading) return <LoadingScreen />;
  if (error) return <Text>Failed to fetch Products.</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Stack.Screen
          options={{
            title: product?.name,
            headerRight: () => (
              <Link href={`/(admin)/menu/create?id=${id}`} asChild>
                <Pressable>
                  {({ pressed }) => (
                    <Fragment>
                      <FontAwesome
                        name='pencil'
                        size={25}
                        color={Colors.light.tint}
                        style={{ marginEnd: 5, opacity: pressed ? 0.5 : 1 }}
                      />
                    </Fragment>
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />

        <RemoteImage path={product?.image} style={styles.image} />

        <View style={styles.sizes}>
          {sizes?.map((size, i) => (
            <Text key={size + i} style={[styles.sizeText, { color: 'black' }]}>{size}</Text>
          ))}
        </View>

        <Text style={styles.price}>${product?.price}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    height:'auto',
    aspectRatio: 1,
  },
  price: {
    marginTop: 'auto',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  size: {
    width: 45,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: {
    fontSize: 20,
    fontWeight: '500',
  },
});

export default ProductDetailsScreen;
