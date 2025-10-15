import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  Image,
  FlatList,
  Linking,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {jwtDecode} from 'jwt-decode';
import {useAppDispatch, useAppSelector} from '../../../../store/hooks';
import {selectAuth} from '../../../../store/auth/auth.slice';
import colors from '../../../../../components/style/colors';
import {findEventByEgliseIdApi} from '../../../../api/event/event.req';
import {
  ManagementEvent,
  PayloadUserInterface,
} from '../../../../config/interface';
import moment from 'moment';
import {file_url} from '../../../../api';
import Loading from '../../../../../components/loading';
type route = 'all' | 'intime' | 'outTime' | 'isCancel' | 'isStoped';
type TypeStateEvent = {
  text: string;
  route: route;
};
function AdminEventListScreen({navigation, route}: any) {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const userDecode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const eglise = userDecode?.eglise;
  const isDarkMode = useColorScheme() === 'dark';
  const [events, setEvents] = useState<ManagementEvent[]>([]);
  const [eventsFilter, setEventsFilter] = useState<ManagementEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setrefreshing] = React.useState<boolean>(false);
  const [stateEvent, setStateEvent] = useState<route>('intime');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const typeStateEvent: TypeStateEvent[] = [
    {text: 'Tout', route: 'all'},
    {text: 'En cours', route: 'intime'},
    {text: 'Passée', route: 'outTime'},
    {text: 'stoper', route: 'isStoped'},
    {text: 'Annuler', route: 'isCancel'},
  ];

  const handlePress = React.useCallback(async (url: string) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, []);

  const handleFindEventByEgliseId = async () => {
    if (eglise) {
      setLoading(true);
      const find = await findEventByEgliseIdApi(eglise.id_eglise);
      setLoading(false);
      if (find?.status === 200) {
        setEvents(find.data);
        handleChangeStateEvent('intime');
      }
    }
  };

  const handleChangeStateEvent = (state: route) => {
    setStateEvent(state);
    switch (state) {
      case 'all':
        setEventsFilter(events);
        break;
      case 'intime':
        const intime = events.filter(item =>
          moment(item.dateEvent.toString()).isAfter(moment()),
        );
        setEventsFilter(intime);
        break;
      case 'outTime':
        const outTime = events.filter(item =>
          moment(item.dateEvent.toString()).isBefore(moment()),
        );
        setEventsFilter(outTime);
        break;
      case 'isCancel':
        const isCancel = events.filter(item => item.isCancel);
        setEventsFilter(isCancel);
        break;
      case 'isStoped':
        const isStoped = events.filter(item => item.isBlocked);
        setEventsFilter(isStoped);
        break;
      default:
        break;
    }
  };

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
          paddingHorizontal: 10,
          marginVertical: 10,
          borderBottomColor: colors.gris,
          borderBottomWidth: 1,
          paddingBottom: 10,
        }}>
        <Text
          style={{
            fontSize: 15,
            color: isDarkMode ? colors.white : colors.primary,
          }}>
          Évenement: {events.length}
        </Text>
        <ScrollView
          style={{marginTop: 10}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {typeStateEvent.map((item, i) => (
            <TouchableOpacity
              key={item.route}
              style={{
                paddingVertical: 5,
                paddingHorizontal: 16,
                borderRadius: 10,
                backgroundColor:
                  stateEvent === item.route
                    ? isDarkMode
                      ? colors.white
                      : colors.primary
                    : isDarkMode
                    ? colors.secondary
                    : colors.light,
                marginHorizontal: i === 0 ? 0 : 8,
                marginRight: 8,
              }}
              onPress={() => {
                handleChangeStateEvent(item.route);
              }}>
              <Text
                style={{
                  color:
                    stateEvent === item.route
                      ? isDarkMode
                        ? colors.primary
                        : colors.light
                      : isDarkMode
                      ? colors.light
                      : colors.secondary,
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={eventsFilter}
        key={stateEvent}
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
              navigation.navigate('EventDetailScreen', {event: item});
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
      {/* <View style={{ height: 200 }} /> */}
      {loading && <Loading />}
    </View>
  );
}

export default AdminEventListScreen;
