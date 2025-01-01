import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import { randomUUID } from 'expo-crypto';
import * as FileSystem from 'expo-file-system';

const uploadImage = async (image: string | undefined | null) => {
  if (!image?.startsWith('file://')) {
    return;
  }

  const base64 = await FileSystem.readAsStringAsync(image, {
    encoding: 'base64',
  });
  const filePath = `${randomUUID()}.png`;
  const contentType = 'image/png';
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, decode(base64), { contentType });

  if (data) {
    return data.path;
  }
};

export default uploadImage;
