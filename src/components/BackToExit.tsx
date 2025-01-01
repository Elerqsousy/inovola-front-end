import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { usePathname } from 'expo-router';
import ActionCenter from './ActionCenter';

const BackToExit = () => {
  const [backClickCount, setBackClickCount] = useState(0);
  const [show, toggleShow] = useState<boolean>(false);
  const pathName = usePathname();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (pathName === '/menu') {
          handleBackButton();
          return true;
        }
        return false;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, [backClickCount, pathName]);

  const handleBackButton = () => {
    if (backClickCount === 1) {
      BackHandler.exitApp();
    } else {
      toggleShow(true);
    }
    return true;
  };

  return (
    <ActionCenter
      message='action_center.double_back_msg'
      showNotification={show}
      toggleNotificaction={toggleShow}
      onSpringStart={() => setBackClickCount(1)}
      onSpringEnd={() => setBackClickCount(0)}
    />
  );
};

export default BackToExit;
