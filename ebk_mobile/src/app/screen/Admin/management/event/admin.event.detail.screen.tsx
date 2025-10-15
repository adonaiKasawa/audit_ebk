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
  Modal,
  StyleSheet,
} from 'react-native';
import {jwtDecode} from 'jwt-decode';
import {useAppDispatch, useAppSelector} from '../../../../store/hooks';
import {selectAuth} from '../../../../store/auth/auth.slice';
import colors from '../../../../../components/style/colors';
import {
  checkedSubscribeEventApi,
  findEventByEgliseIdApi,
  findEventByIdApi,
} from '../../../../api/event/event.req';
import {
  ManagementEvent,
  PayloadUserInterface,
} from '../../../../config/interface';
import moment from 'moment';
import {file_url} from '../../../../api';
import Loading from '../../../../../components/loading';
import QRCode from 'react-native-qrcode-svg';
import {TextInput} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingGif from '../../../../../components/loading/loadingGif';

function AdminEventDetailScreen({navigation, route}: any) {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const userDecode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const eglise = userDecode?.eglise;
  const isDarkMode = useColorScheme() === 'dark';
  const [loading, setLoading] = useState<boolean>(false);
  const event: ManagementEvent = route.params?.event;
  const [eventSubscribe, setEventSubscribe] = useState<any[]>([]);
  const [eventSubscribeFilter, setEventSubscribeFilter] = useState<any[]>([]);
  const [refreshing, setrefreshing] = React.useState<boolean>(false);
  const [viewQrcode, setViewQrcode] = React.useState<boolean>(false);
  const [Qrcode, setQRcode] = React.useState<string>('');
  const [pending, setPending] = React.useState<boolean>(false);
  const [isChecked, setIsChecked] = React.useState<boolean>(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const handleFindEventById = async () => {
    if (event) {
      setLoading(true);
      const find = await findEventByIdApi(event.id.toString());
      setLoading(false);
      console.log(find?.data);
      console.log(find?.data.id);

      if (find?.status === 200) {
        setEventSubscribe(find.data.eventSubscriptions.reverse());
        setEventSubscribeFilter(find.data.eventSubscriptions.reverse());
      }
    }
  };

  const handleViewQrcode = (qrcode: string, isCheck: boolean) => {
    setViewQrcode(true);
    setQRcode(qrcode);
    setIsChecked(isCheck);
  };

  const handleCheckedBilling = async () => {
    if (Qrcode) {
      setPending(true);
      const check = await checkedSubscribeEventApi(Qrcode, event.id);
      setPending(false);
      if (check?.status === 200) {
        setIsChecked(true);
        handleFindEventById();
        setViewQrcode(false);
        Alert.alert('Vérification', 'La verification se bien passer');
      } else {
        Alert.alert('Vérification', check?.data.message);
      }
    }
  };

  const handelFilter = (e: string) => {
    if (e) {
      const filtered = eventSubscribeFilter.filter(
        item =>
          `${item.user.nom.toLowerCase()} ${item.user.prenom.toLowerCase()}`.includes(
            e.toLowerCase(),
          ) ||
          `${item.user.prenom.toLowerCase()} ${item.user.nom.toLowerCase()}`.includes(
            e.toLowerCase(),
          ) ||
          `@${item.user.username.toLowerCase()}`.includes(e.toLowerCase()) ||
          `${item.user.username.toLowerCase()}`.includes(e.toLowerCase()) ||
          `${item.user.telephone.toLowerCase()}`.includes(e.toLowerCase()),
      );
      setEventSubscribeFilter(filtered);
    } else {
      setEventSubscribeFilter(eventSubscribe);
    }
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
      // handleFindEventById();
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
            fontSize: 20,
            color: isDarkMode ? colors.white : colors.primary,
          }}>
          Évenement: {event.name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: isDarkMode ? colors.white : colors.primary,
            }}>
            Réservation: {eventSubscribe.length}
          </Text>
          {/* <TouchableOpacity
            style={{
              paddingVertical: 5,
              paddingHorizontal: 16,
              borderRadius: 10,
              backgroundColor: (isDarkMode) ? colors.white : colors.primary ,
            }}
            onPress={() => { navigation.navigate("EventScannerQrCode", {event})}}
          >
            <Text style={{ color: (isDarkMode) ? colors.primary : colors.light, fontSize: 16, fontWeight: '500' }}>Vérifier le QRCode</Text>
          </TouchableOpacity> */}
        </View>
        <TextInput
          style={{
            borderRadius: 10,
            borderColor: colors.gris,
            borderWidth: 1,
            paddingHorizontal: 5,
            backgroundColor: isDarkMode ? colors.secondary : colors.light,
            color: isDarkMode ? colors.white : colors.black,
          }}
          placeholder="Réchercher la réservation"
          placeholderTextColor={colors.gris}
          onChangeText={handelFilter}
        />
      </View>
      <FlatList
        data={eventSubscribeFilter}
        key={eventSubscribeFilter.length}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{
              marginVertical: 5,
              borderRadius: 15,
              backgroundColor: isDarkMode ? colors.secondary : colors.light,
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            onPress={() => {
              handleViewQrcode(item.uuid, item.isChecked !== null);
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Image
                source={{uri: `${file_url}${item.user.profil}`}}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: colors.blackrgba2,
                }}
              />
              <View>
                <Text
                  style={{color: isDarkMode ? colors.white : colors.primary}}>
                  {item.user.nom} {item.user.prenom}
                </Text>
                <Text style={{color: colors.gris}}>@{item.user.username}</Text>
              </View>
            </View>
            <View>
              <Text style={{color: isDarkMode ? colors.white : colors.primary}}>
                {moment(item.createdAt).fromNow()}
              </Text>
              <Text style={{color: colors.gris, fontSize: 10}}>
                ref: {item.paymentReference}
              </Text>
              {item.isChecked !== null && (
                <MaterialCommunityIcons
                  size={10}
                  name="sticker-check-outline"
                  color={colors.green}
                />
              )}
              {item.isChecked === null && (
                <MaterialCommunityIcons
                  size={15}
                  name="reload-alert"
                  color={colors.warning}
                />
              )}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{paddingBottom: 10, paddingHorizontal: 5}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleFindEventById}
          />
        }
      />
      {loading && <Loading />}
      <Modal
        animationType="slide"
        transparent={true}
        visible={viewQrcode}
        onRequestClose={() => {
          setViewQrcode(false);
        }}>
        <View style={styles(isDarkMode).centeredView}>
          <View style={styles(isDarkMode).modalView}>
            <View
              style={{
                marginTop: 10,
                marginHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  styles(isDarkMode).modalText,
                  {textAlign: 'left', fontWeight: 'bold', fontSize: 17},
                ]}>
                QRCode du billet de l'Évenement
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setViewQrcode(false);
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: colors.gris,
                  }}>
                  x
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginHorizontal: 20,
                marginTop: 10,
                paddingBottom: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <QRCode
                value={Qrcode}
                logo={{uri: `${file_url}${event.eglise.photo_eglise}`}}
                logoBackgroundColor={colors.white}
                size={300}
              />
              {isChecked ? (
                <View style={{marginTop: 10}}>
                  <MaterialCommunityIcons
                    size={30}
                    name="sticker-check-outline"
                    color={colors.green}
                  />
                  <Text style={{color: colors.green}}>Le billet est valid</Text>
                </View>
              ) : (
                <View style={{gap: 10, marginTop: 10}}>
                  <TouchableOpacity
                    disabled={pending}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 10,
                      backgroundColor: isDarkMode
                        ? colors.white
                        : colors.primary,
                      flexDirection: 'row',
                    }}
                    onPress={() => {
                      handleCheckedBilling();
                    }}>
                    <Text
                      style={{
                        color: isDarkMode ? colors.primary : colors.light,
                        fontSize: 16,
                        fontWeight: '500',
                      }}>
                      Vérifier le QRCode
                    </Text>
                    {pending && <LoadingGif width={20} height={20} />}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = (isDarkMode = true) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.blackrgba2,
    },
    modalView: {
      margin: 15,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      backgroundColor: isDarkMode ? colors.primary : colors.lighter,
      flexWrap: 'nowrap',
    },
    modalText: {
      color: isDarkMode ? colors.white : colors.black,
      alignContent: 'center',
      alignItems: 'center',
      display: 'flex',
    },
    buttonContainer: {
      justifyContent: 'space-between',
      gap: 10,
      marginTop: 10,
    },
    button: {
      backgroundColor: isDarkMode ? colors.white : colors.black,
      paddingHorizontal: 24,
      paddingVertical: 15,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    btnDecline: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      paddingHorizontal: 24,
      paddingVertical: 15,
    },
    btnText: {
      color: isDarkMode ? colors.black : colors.white,
    },
    btnDeclineText: {
      color: isDarkMode ? colors.white : colors.primary,
    },
  });

export default AdminEventDetailScreen;
