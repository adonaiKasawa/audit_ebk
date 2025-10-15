import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Linking,
  RefreshControl,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {View} from 'react-native';
import colors from '../../../components/style/colors';
import Loading from '../../../components/loading';
import {
  ItemAnnonces,
  ManagementEvent,
  PayloadUserInterface,
} from '../../config/interface';
import moment from 'moment';
import {findEventAllApi} from '../../api/event/event.req';
import {jwtDecode} from 'jwt-decode';
import {selectAuth} from '../../store/auth/auth.slice';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
type route = 'all' | 'intime' | 'outTime' | 'isCancel' | 'isStoped';
function EventScreen({navigation}: any) {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };
  const [step, setStep] = useState<'all' | 'subscribe'>('all');
  const [events, setEvents] = useState<ManagementEvent[]>([]);
  const [eventsFilter, setEventsFilter] = useState<ManagementEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setrefreshing] = React.useState<boolean>(false);
  const [stateEvent, setStateEvent] = useState<route>('intime');

  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const userDecode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const eglise = userDecode?.eglise;

  const handleFindEventByEgliseId = async () => {
    setLoading(true);
    const find = await findEventAllApi(auth.isAuthenticated);
    setLoading(false);
    if (find?.status === 200) {
      setEvents(find.data);
      const intime = find.data.filter((item: ManagementEvent) =>
        moment(item.dateEvent.toString()).isAfter(moment()),
      );
      setEventsFilter(intime);
    }
  };

  const handleGotoPlayer = (annonce: ItemAnnonces) => {
    navigation.navigate('AnnonceEventScreen', {
      annonce: annonce,
    });
  };

  const handleChangeStateEvent = (state: 'all' | 'subscribe') => {
    switch (state) {
      case 'all':
        const intime = events.filter(item =>
          moment(item.dateEvent.toString()).isAfter(moment()),
        );
        setEventsFilter(intime);
        break;
      case 'subscribe':
        const subscribe = events.filter(item => item.isSubscribe);
        setEventsFilter(subscribe);
        break;
      default:
        break;
    }
    setStep(state);
  };

  const handlePress = React.useCallback(async (url: string) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, []);

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      handleFindEventByEgliseId();
    }
    return () => {
      isMount = false;
    };
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => handleChangeStateEvent('all')}
          style={{
            margin: 10,
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderRadius: 20,
            backgroundColor: isDarkMode
              ? step === 'all'
                ? undefined
                : colors.secondary
              : step === 'all'
              ? undefined
              : colors.blackrgba1,
            borderWidth: step === 'all' ? 0.5 : undefined,
            borderColor: isDarkMode ? colors.red7 : colors.light2,
          }}>
          <Text
            style={{
              color:
                step === 'all'
                  ? isDarkMode
                    ? colors.white
                    : colors.black
                  : colors.gris,
              fontSize: 15,
            }}>
            Tous
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleChangeStateEvent('subscribe')}
          style={{
            margin: 10,
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderRadius: 20,
            backgroundColor: isDarkMode
              ? step === 'subscribe'
                ? undefined
                : colors.secondary
              : step === 'subscribe'
              ? undefined
              : colors.blackrgba1,
            borderWidth: step === 'subscribe' ? 0.5 : undefined,
            borderColor: isDarkMode ? colors.red7 : colors.light2,
          }}>
          <Text
            style={{
              color:
                step === 'subscribe'
                  ? isDarkMode
                    ? colors.white
                    : colors.black
                  : colors.gris,
              fontSize: 15,
            }}>
            Réservation
          </Text>
        </TouchableOpacity>
      </View>
      {step === 'all' ? (
        <FlatList
          data={eventsFilter}
          key={step}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{
                marginVertical: 5,
                borderRadius: 15,
                backgroundColor: isDarkMode ? colors.secondary : colors.light,
                padding: 10,
              }}
              onPress={() => {
                handleGotoPlayer({
                  createdAt: item.createdAt,
                  contente: item.annonces[0],
                  updatedAt: item.updatedAt,
                  deletedAt: item.deletedAt,
                  id: item.id,
                  sharecode: '',
                  event: item,
                });
              }}>
              {/* {item.annonces.length > 0 &&
            <Image source={{ uri: `${file_url}${item.annonces[0]}` }}
              style={{
                width: 25, height: 25, resizeMode: "cover", padding: 0, backgroundColor: "black",
                borderRadius: 25
              }} />
          } */}
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '400',
                  color: isDarkMode ? colors.white : colors.black,
                }}>
                {item.name.trim()}
              </Text>
              <Text style={{fontSize: 12, color: colors.gris}}>
                {item.description.trim()}
              </Text>
              {item.dateEvent && (
                <TouchableOpacity
                  style={{flexDirection: 'row', gap: 4}}
                  onPress={() => {
                    handlePress(item.adressMap);
                  }}>
                  <Text style={{color: colors.blue}}>{item.adressMap}</Text>
                </TouchableOpacity>
              )}
              <Text style={{color: colors.gris}}>
                Le {moment(item.dateEvent).format('DD/MM/YYYY')}
              </Text>
              {item.isCancel && (
                <Text style={{color: colors.red65}}>
                  Date de l'annulation{' '}
                  {moment(item.isCancel.toString()).format('DD/MM/YYYY')}
                </Text>
              )}
              {item.isSubscribe && (
                <Text style={{color: colors.gris}}>
                  Date de la réservation{' '}
                  {moment(item.imsubscribe?.createdAt).format('DD/MM/YYYY')}
                </Text>
              )}
            </TouchableOpacity>
          )}
          contentContainerStyle={{paddingBottom: 10, paddingHorizontal: 5}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleFindEventByEgliseId}
            />
          }
        />
      ) : (
        <FlatList
          data={eventsFilter}
          key={step}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{
                marginVertical: 5,
                borderRadius: 15,
                backgroundColor: isDarkMode ? colors.secondary : colors.light,
                padding: 10,
              }}
              onPress={() => {
                handleGotoPlayer({
                  createdAt: item.createdAt,
                  contente: item.annonces[0],
                  updatedAt: item.updatedAt,
                  deletedAt: item.deletedAt,
                  id: item.id,
                  sharecode: '',
                  event: item,
                });
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '400',
                  color: isDarkMode ? colors.white : colors.black,
                }}>
                {item.name.trim()}
              </Text>
              <Text style={{fontSize: 12, color: colors.gris}}>
                {item.description.trim()}
              </Text>
              {item.dateEvent && (
                <TouchableOpacity
                  style={{flexDirection: 'row', gap: 4}}
                  onPress={() => {
                    handlePress(item.adressMap);
                  }}>
                  <Text style={{color: colors.blue}}>{item.adressMap}</Text>
                </TouchableOpacity>
              )}
              <Text style={{color: colors.gris}}>
                Le {moment(item.dateEvent).format('DD/MM/YYYY')}
              </Text>
              {item.isCancel && (
                <Text style={{color: colors.red65}}>
                  Date de l'annulation{' '}
                  {moment(item.isCancel.toString()).format('DD/MM/YYYY')}
                </Text>
              )}
              {item.isSubscribe && (
                <Text style={{color: colors.gris}}>
                  Date de la réservation{' '}
                  {moment(item.imsubscribe?.createdAt).format('DD/MM/YYYY')}
                </Text>
              )}
            </TouchableOpacity>
          )}
          contentContainerStyle={{paddingBottom: 10, paddingHorizontal: 5}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleFindEventByEgliseId}
            />
          }
        />
      )}
      {loading && <Loading />}
    </View>
  );
}

export default EventScreen;
