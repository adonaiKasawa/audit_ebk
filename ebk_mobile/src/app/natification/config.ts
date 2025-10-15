import messaging from '@react-native-firebase/messaging';
import {Alert, Easing, PermissionsAndroid, Platform, View} from 'react-native';
import {store} from '../store';
import {SendTokenApi} from '../api/auth';
import {setToken} from '../store/token/token.slice';
import {
  addNotification,
  updateNotification,
} from '../store/notification/notification.slice';
import {TypeContentEnum} from '../config/enum';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import NotificationSounds from 'react-native-notification-sounds';
import {Notifier} from 'react-native-notifier';
import {NotificationNotifeeCustomComponent} from '../screen/notification/notification.viewer';
import {getFileById} from '../api/library/library';

export async function requestUserPermissionNotification() {
  if (Platform.OS === 'ios') {
    requestUserPermissionToSeeNotification();
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    // if (enabled) {
    //   ('Authorization status:', authStatus);

    // }
  } else if (Platform.OS === 'android') {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }
}

export async function requestUserPermissionToSeeNotification() {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    // ('Permission settings:', settings);
  } else {
    // ('User declined permissions');
  }
}

export const getTokenDiviceForNotification = async (navigation: any) => {
  const state = store.getState();
  const dispatch = store.dispatch;
  const {token} = state;
  const {auth} = state;
  if (auth.isAuthenticated) {
    await messaging().registerDeviceForRemoteMessages();
    const DiviceToken = await messaging().getToken();
    if (DiviceToken) {
      if (token.token !== DiviceToken) {
        const sendToken = await SendTokenApi(DiviceToken);
        if (sendToken?.status === 201) {
          dispatch(setToken({token: DiviceToken}));
        }
      } else {
      }
    }
  } else {
    Alert.alert(
      'Connexion requise',
      'Connectez-vous pour recevoir des notifications plus pertinentes en fonction de vos préférences.',
      [
        {
          text: 'SE CONNECTER',
          onPress: () => {
            navigation.navigate('Account', {
              screen: 'signIn',
            });
          },
          style: 'cancel',
        },
        {
          text: 'ANNULER',
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
    );
  }
};

export const ListenNotification = (navigation: any) => {
  messaging().onMessage(async (remoteMessage: any) => {
    onDisplayNotification(remoteMessage, navigation);
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
    // error('Message handled in the background!', remoteMessage.data);
    onDisplayNotification(remoteMessage, navigation);
  });

  messaging().onNotificationOpenedApp(async (message: any) => {
    NavigateToTheNotification(message, navigation);
  });
};

export async function onDisplayNotification(
  remoteMessage: any,
  navigation: any,
) {
  // requestUserPermissionToSeeNotification()
  const soundsList = await NotificationSounds.getNotifications('notification');

  notifee.onBackgroundEvent(async e => {});
  notifee
    .incrementBadgeCount()
    .then(() => notifee.getBadgeCount())
    .then(count => {});

  Notifier.showNotification({
    title: remoteMessage?.notification?.title,
    description: remoteMessage?.notification?.body,
    duration: 0,
    showAnimationDuration: 800,
    showEasing: Easing.bounce,
    swipeEasing: Easing.bounce,
    swipeAnimationDuration: 800,
    swipePixelsToClose: 10,
    onHidden: () => {},
    onPress: () => {
      NavigateToTheNotification(remoteMessage, navigation);
      Notifier.hideNotification();
    },
    hideOnPress: false,
    Component: NotificationNotifeeCustomComponent,
    componentProps: {
      notification: remoteMessage,
      notificationModule: false,
    },
    // Component:
    // componentProps: {
    //   imageSource: { uri: remoteMessage?.data?.image },
    // },
  });

  // setTimeout(() => {
  //   Notifier.hideNotification();
  // }, 10000)

  // Display a notification
  if (Platform.OS === 'ios') {
    await notifee.displayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,
      ios: {
        attachments: [
          {
            url: remoteMessage?.data.iconApp,
          },
        ],
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
    });
  } else {
    const channelId = await notifee.createChannel({
      id: remoteMessage?.messageId,
      name: remoteMessage?.collapseKey,
      sound: soundsList[1].url,
      vibration: true,
      vibrationPattern: [300, 500],
    });

    await notifee.displayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        // pressAction: {
        //   id: '0.236558',
        // },
        sound: soundsList[1].url,
        fullScreenAction: {
          id: remoteMessage?.data.id,
        },
      },
    });
  }
}

export const NavigateToTheNotification = async (
  remoteMessage: any,
  navigation: any,
) => {
  let getFile;
  if (
    remoteMessage?.data?.typeFile !== TypeContentEnum.live &&
    remoteMessage?.data?.typeFile !== 'Programme' &&
    remoteMessage?.data?.typeFile !== TypeContentEnum.communiques
  ) {
    getFile = await getFileById(
      remoteMessage?.data?.id,
      remoteMessage?.data?.typeFile,
    );

    switch (remoteMessage?.data?.typeFile) {
      case TypeContentEnum.videos:
        navigation.navigate('VideosPlayer', {
          video: getFile?.data,
        });
        break;
      case TypeContentEnum.audios:
        navigation.navigate('AudiosPlayer', {
          audios: getFile?.data,
        });
        break;
      case TypeContentEnum.livres:
        navigation.navigate('BooksPlayer', {
          book: getFile?.data,
        });
        break;
      case TypeContentEnum.images:
        navigation.navigate('ImagesViewer', {
          images: getFile?.data,
        });
        break;

      default:
        break;
    }
  }
};
