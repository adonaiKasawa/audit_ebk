// import { ImageGallery } from '@georstat/react-native-image-gallery';
import {NavigationProp} from '@react-navigation/native';
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
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import {ItemAnnonces, PayloadUserInterface} from '../../../config/interface';
import {findAnnoncePaginated} from '../../../api/annonce/annonce.req';
import colors from '../../../../components/style/colors';
import LoadingGif from '../../../../components/loading/loadingGif';
import {file_url, front_url} from '../../../api';
import moment from 'moment';
import {capitalize} from '../../../config/func';
import WebView, {WebViewNavigation} from 'react-native-webview';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {jwtDecode} from 'jwt-decode';
import {selectAuth} from '../../../store/auth/auth.slice';
import {
  gatWay,
  MerchantID,
  MerchantPassword,
  url_back,
} from '../../../config/props';

function AnnonceEventPaymentScreen({navigation, route}: any) {
  const Dimensions = useWindowDimensions();
  const width = Dimensions.width;
  const annonce: ItemAnnonces = route.params?.annonce;
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const decode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
    decode,
  );

  const [loading, setLoading] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const webview = React.useRef<WebView>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };
  const openGallery = async () => {
    setIsOpen(true);
  };
  const closeGallery = () => setIsOpen(false);

  const handleGotoPlayer = (images: string[]) => {
    navigation.navigate('ImagesGalleryViewer', {
      images: images,
    });
  };

  const handlePress = React.useCallback(async (url: string) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Je ne sais pas comment ouvrir cette URL: ${url}`);
    }
  }, []);

  const handleWebViewNavigationStateChange = (
    newNavState: WebViewNavigation,
  ) => {
    // newNavState looks something like this:
    // {
    //   url?: string;
    //   title?: string;
    //   loading?: boolean;
    //   canGoBack?: boolean;
    //   canGoForward?: boolean;
    // }
    console.log(newNavState);

    const {url} = newNavState;
    if (!url) return;

    if (webview.current) {
      // handle certain doctypes
      if (url.includes('.pdf')) {
        webview.current.stopLoading();
        // open a modal with the PDF viewer
      }

      // one way to handle a successful form submit is via query strings
      if (url.includes('?message=success')) {
        webview.current.stopLoading();
        // maybe close view?
      }

      // one way to handle errors is via query string
      if (url.includes('?errors=true')) {
        webview.current.stopLoading();
      }

      // redirect somewhere else
      if (url.includes('google.com')) {
        const newURL = 'https://reactnative.dev/';
        const redirectTo = 'window.location = "' + newURL + '"';
        webview.current.injectJavaScript(redirectTo);
      }
    }
  };

  React.useEffect(() => {
    let isMount = true;
    if (isMount) {
      console.log(annonce);
    }

    return () => {
      isMount = false;
    };
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      {annonce && user && (
        <View style={{flex: 1}}>
          {/* <View style={{ height: 70, backgroundColor: backgroundStyle.backgroundColor, justifyContent: 'center', paddingHorizontal: 10 }}>
             
            </View> */}
          <WebView
            ref={webview}
            originWhitelist={['*']}
            source={{uri: `${front_url}event/${annonce.event.id}`}}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            style={{flex: 1}}
            textZoom={100}
          />
          <View
            style={{
              height: 70,
              backgroundColor: backgroundStyle.backgroundColor,
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}>
            <View style={{flexDirection: 'row', gap: 20}}>
              <TouchableOpacity
                onPress={() => {
                  webview.current?.goBack();
                }}>
                <AntDesign
                  name="arrowleft"
                  size={24}
                  color={isDarkMode ? colors.white : colors.black}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  webview.current?.reload();
                }}>
                <AntDesign
                  name="reload1"
                  size={24}
                  color={isDarkMode ? colors.white : colors.black}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  webview.current?.goForward();
                }}>
                <AntDesign
                  name="arrowright"
                  size={24}
                  color={isDarkMode ? colors.white : colors.black}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

export default AnnonceEventPaymentScreen;

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
