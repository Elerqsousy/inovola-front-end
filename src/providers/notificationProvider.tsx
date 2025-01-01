import { registerForPushNotificationsAsync } from '@/lib/notifications';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as Notifications from 'expo-notifications';
import { useAuth } from './AuthProvider';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

type NotificationDataType = {
  remoteNotification: Notifications.Notification | undefined;
  expoPushToken: string | undefined;
  notificationCount: number;
  setNotificationCount: (count: number) => void;
};

const NotificationContext = createContext<NotificationDataType>({
  remoteNotification: undefined,
  expoPushToken: undefined,
  notificationCount: 0,
  setNotificationCount: () => {},
});

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [remoteNotification, setRemoteNotification] =
    useState<Notifications.Notification>();
  const [notificationCount, setNotificationCount] = useState<number>(0);

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const savePushToken = async (newToken: string | undefined) => {
    setExpoPushToken(newToken);
  };

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => savePushToken(token))
      .catch((error) => console.log(error));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setRemoteNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        remoteNotification,
        expoPushToken,
        notificationCount,
        setNotificationCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

export const useNotification = () => useContext(NotificationContext);
