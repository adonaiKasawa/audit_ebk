import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  useColorScheme,
  Alert,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Button,
  Image,
} from 'react-native';
import {StackNavigationScreenProps} from '../../../components/props/props.navigation';
import colors from '../../../components/style/colors';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {
  NavigateToTheNotification,
  getTokenDiviceForNotification,
  requestUserPermissionNotification,
  requestUserPermissionToSeeNotification,
} from '../../natification/config';
import {selectAuth} from '../../store/auth/auth.slice';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {selectNotification} from '../../store/notification/notification.slice';
import {NotificationItemComponent} from './notification.viewer';
import LoadingGif from '../../../components/loading/loadingGif';
import {
  changeNotificationStatusApi,
  getUserNotificationsApi,
} from '../../api/notification/notif.req';
import {NotificationContent} from '../../config/interface';
import {RefreshControl} from 'react-native-gesture-handler';
import {Notifier, Easing} from 'react-native-notifier';
import Loading from '../../../components/loading';

type step = 'Tout' | 'Non vue' | 'Vue';
const stepNotification: step[] = ['Tout', 'Non vue', 'Vue'];

function NotificationsScreen({navigation}: any) {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };
  const auth = useAppSelector(selectAuth);
  const notificationRedux = useAppSelector(selectNotification);
  const dispatch = useAppDispatch();

  const [notification, setNotification] = useState<NotificationContent[]>([]);
  const [notificationFiltered, setNotificationFiltered] =
    useState<NotificationContent[]>(notification);
  const [notificationNotView, setNotificationNotView] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [clikedIn, setClikedIn] = useState<number>(-1);
  const [refreshing, setrefreshing] = React.useState<boolean>(false);
  const [stepToSeeNotification, setStepToSeeNotification] =
    useState<step>('Tout');

  const handleFindNotification = useCallback(async () => {
    if (auth.isAuthenticated) {
      setLoading(true);
      const find = await getUserNotificationsApi();
      setLoading(false);

      if (find?.status === 200 && find.data.length > 0) {
        setNotification(find.data);
        setNotificationFiltered(find.data);
      }
    }
  }, []);

  const handleFilterNotification = (item: step) => {
    switch (item) {
      case 'Tout':
        setNotificationFiltered(notification);
        break;
      case 'Non vue':
        const filter = notification.filter(item => !item.status);
        if (filter) {
          setNotificationFiltered(filter);
        }
        break;
      case 'Vue':
        const filterView = notification.filter(item => item.status);
        if (filterView) {
          setNotificationFiltered(filterView);
        }
        break;

      default:
        break;
    }
    setStepToSeeNotification(item);
  };

  const onEndReached = (info: {distanceFromEnd: number}) => {
    // if (links.next !== "") {
    //   // handleGetFiles(links.next)
    // }
  };

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      requestUserPermissionNotification();
      getTokenDiviceForNotification(navigation);

      handleFindNotification();
    }
    return () => {
      isMount = false;
    };
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      {notification.length === 0 && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Feather name="bell" size={50} color={colors.gris} />
          <Text
            style={{
              color: isDarkMode ? colors.white : colors.black,
              textAlign: 'center',
              margin: 10,
              fontWeight: 'bold',
            }}>
            Aucune nouvelle notification pour le moment.
          </Text>
          <Text
            style={{
              color: colors.gris,
              textAlign: 'center',
              paddingHorizontal: 10,
            }}>
            Actuellement, vous n'avez aucune notification. Restez informé et
            soyez attentif aux mises à jour qui pourraient concerner votre
            compte.
          </Text>
          <TouchableOpacity
            style={{
              paddingVertical: 5,
              paddingHorizontal: 16,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              handleFindNotification();
            }}>
            <EvilIcons name="refresh" size={50} color={colors.gris} />
            <Text
              style={{
                color: isDarkMode ? colors.white : colors.black,
                fontSize: 16,
                fontWeight: '500',
              }}>
              Recharger
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {notification.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            paddingBottom: 10,
            gap: 10,
          }}>
          {stepNotification.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                paddingVertical: 5,
                paddingHorizontal: 16,
                borderRadius: 10,
                backgroundColor:
                  stepToSeeNotification === item
                    ? isDarkMode
                      ? colors.white
                      : colors.primary
                    : isDarkMode
                    ? colors.secondary
                    : colors.light,
              }}
              onPress={() => {
                handleFilterNotification(item);
              }}>
              <Text
                style={{
                  color:
                    stepToSeeNotification === item
                      ? isDarkMode
                        ? colors.primary
                        : colors.light
                      : isDarkMode
                      ? colors.light
                      : colors.secondary,
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {notification.length > 0 && (
        <FlatList
          data={notificationFiltered}
          renderItem={({item, index}) => (
            <NotificationItemComponent
              notification={item}
              navigation={navigation}
            />
          )}
          keyExtractor={(item, index) => `${index.toString()}`}
          onEndReachedThreshold={0.25}
          onEndReached={onEndReached}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleFindNotification}
            />
          }
        />
      )}
      {loading && <Loading />}
    </View>
  );
}

export default NotificationsScreen;
