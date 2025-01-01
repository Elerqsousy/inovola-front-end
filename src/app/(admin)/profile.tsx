import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { supabase } from '@/lib/supabase';
import { StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import Button from '@/components/Button';
import ChangeLanguage from '@/components/ChangeLanguage';

const ProfileScreen = () => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <ChangeLanguage />
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={handleSignOut}>
              {({ pressed }) => (
                <View
                  style={[
                    styles.signOutContainer,
                    { backgroundColor: pressed ? '#c0292a' : 'white' },
                  ]}
                >
                  <Text
                    style={[
                      styles.signOut,
                      { color: pressed ? 'white' : '#c0292a' },
                    ]}
                  >
                    Sign Out
                  </Text>
                </View>
              )}
            </Pressable>
          ),
        }}
      />

      <View style={styles.navigationContainer}>
        <Link href={'/(user)'} asChild>
          <Button text='User' />
        </Link>
        <Link href={'/(admin)'} asChild>
          <Button text='Admin' />
        </Link>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  navigationContainer: {
    marginTop: 'auto',
  },
  signOutContainer: {
    marginEnd: 15,
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
