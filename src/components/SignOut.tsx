import { Pressable } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from '@/components/Themed';
import { supabase } from '@/lib/supabase';
import { useLocale } from '@/providers/LocaleProvider';

const SignOut = () => {
  const { t } = useLocale()
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
  return (
    <View style={styles.mainContainer}>
      <Text>{t("settings.signout.confirm_signout")}</Text>
      <Pressable onPress={handleSignOut}>
        {({ pressed }) => (
          <View
            style={[
              styles.signOutContainer,
              { backgroundColor: pressed ? '#c0292a' : 'white' },
            ]}
          >
            <Text
              style={[styles.signOut, { color: pressed ? 'white' : '#c0292a' }]}
            >
              {t("settings.signout.sign_out")}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default SignOut;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  signOutContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#c0292a',
  },
  signOut: {
    fontWeight: 'bold',
  },
});
