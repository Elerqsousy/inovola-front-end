import { View, StyleSheet, Text, Alert } from 'react-native';
import Button from '@/components/Button';
import CustomeInput from '@/components/CustomeInput';
import Colors from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from '@/api/products';
import uploadImage from '@/components/ImageUpload';
import RemoteImage from '@/components/RemoteImage';

/* Technical Debt */
/*
Form Handeling
Error Handeling
*/

const CreateScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    typeof idString === 'string' ? idString : idString?.[0]
  );
  const router = useRouter();
  const isUpdating = !!id;

  const [image, setImage] = useState<string | null>(null);
  const [submited, setSubmitted] = useState(false);
  const [data, setData] = useState({
    name: '',
    price: '',
  });
  const [errors, setErrors] = useState({
    name: 'Name is a required Field.',
    price: 'Price is a required Field.',
  });

  const { data: productDetails } = useProduct(id);
  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  useEffect(() => {
    if (productDetails) {
      setData({
        name: productDetails.name,
        price: productDetails.price.toString(),
      });
      setImage(productDetails.image);
    }
  }, [productDetails]);

  const resetFields = () => {
    setData({
      name: '',
      price: '',
    });
  };

  const resetErrors = () => {
    setErrors({
      name: 'Name is a required Field.',
      price: 'Price is a required Field.',
    });
  };
  const resetForm = () => {
    resetFields();
    resetErrors();
    setSubmitted(false);
  };

  const parseObjectError = (key: string, error: string) => {
    setErrors({ ...errors, [key]: error });
  };

  const checkErrors = (fieldName: string, value: string) => {
    if (fieldName === 'name') {
      !value || !value.length
        ? parseObjectError(fieldName, 'Name is a required Field.')
        : parseObjectError(fieldName, '');
    } else if (fieldName === 'price') {
      if (!value || !value.length) {
        parseObjectError(fieldName, 'Price is a required Field.');
        return;
      } else if (isNaN(parseFloat(value))) {
        parseObjectError(fieldName, 'Price Should be numric.');
        return;
      } else {
        parseObjectError(fieldName, '');
      }
    }
  };

  const onInputChange = (fieldName: string, value: string) => {
    setData({ ...data, [fieldName]: value });
    checkErrors(fieldName, value);
  };

  const onSubmit = async () => {
    setSubmitted(true);

    if (errors.name || errors.price) return;

    const imagePath = await uploadImage(image);

    const formData = {
      name: data.name,
      price: parseFloat(data.price),
      image: imagePath,
    };

    if (isUpdating) {
      // Updating
      updateProduct(
        { id, ...formData },
        {
          onSuccess: () => {
            router.back();
            resetForm();
          },
        }
      );
    } else {
      // Creating
      insertProduct(formData, {
        onSuccess: () => {
          router.back();
          resetForm();
        },
      });
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDelete = () => {
    deleteProduct(id, {
      onSuccess: () => {
        resetFields();
        router.replace('/(admin)');
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this product?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: handleDelete },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? 'Update Product' : 'Create Product' }}
      />

      <RemoteImage
          path={image }
          style={styles.image}
          resizeMode='contain'
        />

      <Text onPress={pickImage} style={styles.textBtn}>
        Select Image
      </Text>
      <CustomeInput
        label='Name'
        placeHolder='Recipe Name'
        value={data.name}
        error={submited ? errors.name : ''}
        onChange={(v) => onInputChange('name', v)}
      />

      <CustomeInput
        label='Price ($)'
        placeHolder='9.99'
        numric
        value={data.price}
        error={submited ? errors.price : ''}
        onChange={(v) => onInputChange('price', v)}
      />

      <Button text={isUpdating ? 'Update' : 'Create'} onPress={onSubmit} />
      {isUpdating && (
        <Text
          onPress={confirmDelete}
          style={[styles.textBtn, { color: 'red' }]}
        >
          Delete
        </Text>
      )}
    </View>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: '100%',
    height:'auto',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  textBtn: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
  label: {
    color: 'gray',
    fontSize: 16,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
});
