import { ComponentProps } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useAuth } from '@/providers/AuthProvider';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

function TabLayout() {
  const { isAdmin, userSession } = useAuth();

  if (!isAdmin || !userSession) {
    return <Redirect href={'/'} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveBackgroundColor: 'gainsboro',
        tabBarStyle: {
          backgroundColor: Colors.light.tint,
        },
      }}
    >
      <Tabs.Screen name='index' options={{ href: null, headerShown: false }} />
      <Tabs.Screen
        name='menu'
        options={{
          title: 'Menu',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name='cutlery' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='orders'
        options={{
          title: 'Orders',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name='list' color={color} />,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name='user' color={color} />,
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
