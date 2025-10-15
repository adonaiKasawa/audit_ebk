import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {Notifier} from 'react-native-notifier';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppDispatch} from '../../store/hooks';
import {useEffect} from 'react';
import {ComponentNotificationProps} from '../../config/props';
import colors from '../../../components/style/colors';
import {NotificationContent} from '../../config/interface';
import {file_url} from '../../api';
import {changeNotificationStatusApi} from '../../api/notification/notif.req';
import moment from 'moment';

import notifee from '@notifee/react-native';
import {TypeContentEnum} from '../../config/enum';
import {getFileById} from '../../api/library/library';

export const NotificationNotifeeCustomComponent = ({
  notification,
  notificationModule,
}: ComponentNotificationProps) => {
  const dispatch = useAppDispatch();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.secondary : colors.white,
  };

  useEffect(() => {});

  return (
    <View
      style={[
        styles().safeArea,
        {backgroundColor: backgroundStyle.backgroundColor},
      ]}>
      <View
        style={[
          styles().container,
          {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          },
        ]}>
        <View style={{flex: 1}}>
          <Image
            source={{uri: notification?.data?.image}}
            // resizeMode={"contain"}
            style={{
              width: 50,
              height: 50,
              borderRadius: 20,
            }}
          />
        </View>
        <View style={{flex: 2}}>
          <Text style={styles(isDarkMode).title}>
            {notification.notification.title}
          </Text>
          <Text style={styles(isDarkMode).description}>
            {notification.notification.body}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          Notifier.hideNotification();
          if (notificationModule) {
          }
        }}
        style={{
          width: 20,
          height: 20,
          position: 'absolute',
          right: 5,
          top: 5,
        }}>
        <MaterialCommunityIcons name="close" size={20} color={'red'} />
      </TouchableOpacity>
    </View>
  );
};

export const NotificationItemComponent = ({
  notification,
  navigation,
}: {
  notification: NotificationContent;
  navigation: any;
}) => {
  const dispatch = useAppDispatch();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.secondary : colors.light,
  };

  const NavigateToTheNotification = async () => {
    let getFile;
    if (
      notification.type_content !== TypeContentEnum.live &&
      notification.type_content !== TypeContentEnum.programme &&
      notification.type_content !== TypeContentEnum.communiques
    ) {
      getFile = await getFileById(
        notification.id_content.toString(),
        notification.type_content,
      );

      switch (notification.type_content) {
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

  useEffect(() => {});

  return (
    <TouchableOpacity
      onPress={async () => {
        if (!notification.status) {
          await changeNotificationStatusApi(notification.notificationId);
          notifee
            .decrementBadgeCount()
            .then(() => notifee.getBadgeCount())
            .then(count => {});
        }
        await NavigateToTheNotification();
      }}
      style={{borderBottomColor: colors.gris, borderBottomWidth: 0.5}}>
      <View
        style={{
          flex: 1,
          backgroundColor: !notification.status
            ? backgroundStyle.backgroundColor
            : 'transparent',
          padding: 5,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flex: 3, flexDirection: 'row'}}>
            <Image
              source={{uri: `${file_url}${notification.img_eglise}`}}
              resizeMode={'cover'}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
              }}
            />
            <View style={{paddingHorizontal: 20}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: isDarkMode ? colors.white : colors.primary,
                }}>
                {notification.title}
              </Text>
              <Text style={{color: colors.gris}}>{notification.body}</Text>
              <Text style={{color: colors.gris, marginTop: 5}}>
                {moment(notification.createdAt).fromNow()}
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}>
            <Image
              source={{uri: `${file_url}${notification.img_content}`}}
              style={{
                width: 70,
                height: 70,
                borderRadius: 10,
              }}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = (isDarkMode: boolean = false) =>
  StyleSheet.create({
    highlight: {
      fontWeight: '700',
    },
    safeArea: {
      marginTop: 50,
      marginHorizontal: 5,
      borderRadius: 10,
    },
    container: {
      padding: 5,
      flex: 1,
    },
    title: {
      fontWeight: 'bold',
      color: isDarkMode ? colors.white : colors.white,
    },
    description: {color: colors.gris},
  });
