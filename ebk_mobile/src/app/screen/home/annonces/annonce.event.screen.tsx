import * as React from 'react';
import {
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Image,
  useColorScheme,
  Alert,
  Linking,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {ItemAnnonces, PayloadUserInterface} from '../../../config/interface';
import colors from '../../../../components/style/colors';
import LoadingGif from '../../../../components/loading/loadingGif';
import {file_url, front_url} from '../../../api';
import moment from 'moment';
import {capitalize} from '../../../config/func';
import {findCheckedSubscribeUserEventApi} from '../../../api/event/event.req';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {jwtDecode} from 'jwt-decode';
import {selectAuth} from '../../../store/auth/auth.slice';
import QRCode from 'react-native-qrcode-svg';
import Entypo from 'react-native-vector-icons/Entypo';

function AnnonceEventScreen({navigation, route}: any) {
  const Dimensions = useWindowDimensions();
  const width = Dimensions.width;
  const annonce: ItemAnnonces = route.params?.annonce;
  const [loading, setLoading] = React.useState<boolean>(false);
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const userDecode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [isOpen, setIsOpen] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState<boolean>(false);
  const [isCheck, setIsCheck] = React.useState<boolean>(false);

  const [refreshing, setrefreshing] = React.useState<boolean>(false);
  const [subscribe, setSubscribe] = React.useState<any>();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const openGallery = async () => {
    setIsOpen(true);
  };
  const closeGallery = () => setIsOpen(false);

  const handleGotoPayment = () => {
    navigation.navigate('AnnonceEventPaymentScreen', {
      annonce: annonce,
    });
  };

  const handlePress = React.useCallback(async (url: string) => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, []);

  const handleCheckedSubscribeUserEvent = async () => {
    // console.log(userDecode);

    if (userDecode) {
      setLoading(true);
      setIsChecked(false);
      const find = await findCheckedSubscribeUserEventApi(
        userDecode?.sub,
        annonce.event.id,
      );
      setLoading(false);
      console.log(find?.data);
      if (find?.status === 200) {
        console.log(find.data.uuid);
        setIsChecked(true);
        setIsCheck(true);
        setSubscribe(find.data);
      }
    }
  };

  React.useEffect(() => {
    let isMount = true;
    if (isMount) {
      console.log(annonce);
      handleCheckedSubscribeUserEvent();
    }

    return () => {
      isMount = false;
    };
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      {annonce && (
        <View style={{flex: 1}}>
          {/* BOUTON "X" POUR RETOUR */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              top: 40,
              left: 20,
              zIndex: 10,
              backgroundColor: colors.blackrgba4,
              borderRadius: 25,
              padding: 8,
            }}>
            <Entypo name="cross" size={16} color={colors.white} />
          </TouchableOpacity>

          {/* IMAGE */}
          <Image
            source={{uri: `${file_url}${annonce.contente}`}}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
          {/* <ScrollView style={{flex: 1, paddingHorizontal: 10, }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleCheckedSubscribeUserEvent}
              />
            }>
            <View style={{ borderBottomWidth: 1, borderBottomColor: colors.gris, paddingBottom: 5 }}>
              <Text style={{ color: isDarkMode ? colors.white : colors.black, fontSize: 25 }}>Événement Associer</Text>
            </View>
            <View style={{ borderRadius: 15, borderColor: isDarkMode ? colors.white : colors.primary, borderWidth: 1, padding: 10, marginTop: 20, gap: 10 }}>
              <Text style={{ color: isDarkMode ? colors.white : colors.black, fontSize: 20, fontWeight: "bold" }}>{annonce.event.name}</Text>
              <Text style={{ color: isDarkMode ? colors.white : colors.black, fontSize: 18, fontWeight: "bold" }}>{capitalize(moment(annonce.event.dateEvent).format("dddd, DD MMMM YYYY"))}</Text>
              <Text style={{ color: colors.gris, fontSize: 15 }}>{annonce.event.description}</Text>
              <Text style={{ color: isDarkMode ? colors.white : colors.black, fontSize: 18, fontWeight: "bold" }}>{annonce.event.isFree ? "Gratuit" : annonce.event.price + " USD Billet"}</Text>

              <TouchableOpacity style={{ flexDirection: "row", gap: 4 }} onPress={() => { handlePress(annonce.event.adressMap) }}>
                <Text style={{ color: colors.blue }}>{annonce.event.adressMap}</Text>
              </TouchableOpacity>
            </View>

            {(loading) && <View style={{ alignItems: 'center', marginTop: 20 }}>
              <LoadingGif width={50} height={50} />
            </View>}
            {!loading && !isChecked &&
              <View style={{ marginTop: 40 }}>
                <TouchableOpacity onPress={handleGotoPayment} style={styles(isDarkMode).button}>
                  <Text style={{ color: isDarkMode ? colors.black : colors.white, fontSize: 18, fontWeight: "500" }}>Réserver votre billet</Text>
                </TouchableOpacity>
              </View>
            }
            {(isChecked && subscribe) &&
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <QRCode
                  value={`${front_url}event/check-subscribe/${subscribe.uuid}`}
                  // logo={{ uri: `${file_url}${subscribe.event.eglise.photo_eglise}` }}
                  logoBackgroundColor={colors.white}
                  size={200}
                />
                {subscribe.isChecked !== null && <Entypo name='emoji-happy' size={50} color={colors.green} />}
                {subscribe.isChecked !== null && <Text style={{ color: isDarkMode ? colors.white : colors.black }}>Ce ticker a déjà été vérifier.</Text>}
              </View>
            }
          </ScrollView> */}
        </View>
      )}
    </View>
  );
}

export default AnnonceEventScreen;

const styles = (isDarkMode: boolean = true) =>
  StyleSheet.create({
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
  });
