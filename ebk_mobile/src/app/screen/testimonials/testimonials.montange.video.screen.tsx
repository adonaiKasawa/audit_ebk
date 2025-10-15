import * as React from 'react';
import {CameraPage} from '../../../components/camera/CameraPage';
import {
  Alert,
  Dimensions,
  Image,
  LayoutChangeEvent,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {jwtDecode} from 'jwt-decode';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Video, {VideoRef, OnBufferData} from 'react-native-video';
import LoadingGif from '../../../components/loading/loadingGif';
import colors from '../../../components/style/colors';
import {styles} from '../../../components/style/style.main';
import {front_url, file_url} from '../../api';
import {
  deleteFavorisApi,
  createFavorisApi,
} from '../../api/favoris/favoris.req';
import {deleteLikeFileApi, createLikeFileApi} from '../../api/like/like.req';
import {TypeContentEnum} from '../../config/enum';
import {PayloadUserInterface} from '../../config/interface';
import PopoverMenu from '../../navigation/popover/popover.menu';
import {selectAuth} from '../../store/auth/auth.slice';
import {useAppSelector} from '../../store/hooks';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

function TestimonialsMontangeVideoScreen({navigation, route}: any) {
  const video: PhotoIdentifier = route.params?.video;
  const isDarkMode = useColorScheme() === 'dark';
  const screenIsFocused = useIsFocused();
  const auth = useAppSelector(selectAuth);
  const decode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
    decode,
  );

  const previousWidth = Dimensions.get('screen').width;
  const previousHeight = Dimensions.get('screen').height;
  const [isHorizontal, setIsHorizontal] = React.useState<boolean>(
    previousWidth > previousHeight,
  );
  const videoRef = React.useRef<VideoRef | null>(null);
  const [paused, setpaused] = React.useState<boolean>(false);
  const {height} = useWindowDimensions();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const onLayout = ({nativeEvent: {layout}}: LayoutChangeEvent) => {
    if (layout.width > layout.height) {
      setIsHorizontal(true);
    } else {
      setIsHorizontal(false);
    }
  };

  const onBuffer = (e: OnBufferData) => {};

  const onError = () => {};

  const onPaused = () => {
    setpaused(!paused);
  };

  // React.useEffect(() => {
  //   if (!videoRef.current) {
  //     return
  //   }

  //   if (activePostId !== video.id) {
  //     setpaused(true);
  //   }
  //   if (activePostId === video.id) {
  //     setpaused(false);
  //   }

  //   return () => {
  //     setpaused(false)
  //     if (videoRef.current) {
  //       videoRef.current.resume()
  //       //  = () => {}
  //     }
  //   };
  // }, [activePostId, videoRef.current]);

  return (
    <View
      style={{
        height: Platform.OS === 'ios' ? height - 75 : height,
        backgroundColor: colors.black,
      }}>
      <View
        style={{
          position: 'absolute',
          right: 10,
          bottom: 120,
          width: 60,
        }}></View>
      <Video
        source={{uri: ''}}
        style={[StyleSheet.absoluteFill]}
        volume={1}
        resizeMode="cover"
        controls={false}
        repeat={true}
        ref={videoRef}
        paused={paused || !screenIsFocused}
        playInBackground={false}
        playWhenInactive={false}
      />

      <Pressable
        style={[
          StyleSheet.absoluteFill,
          {justifyContent: 'center', alignItems: 'center'},
        ]}
        onPress={() => {
          onPaused();
        }}>
        <View
          style={{
            padding: 10,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            display: paused ? 'flex' : 'none',
          }}>
          <FontAwesome5 name="play" size={40} color={colors.blackrgba4} />
        </View>
      </Pressable>
      <View
        style={[
          StyleSheet.absoluteFill,
          {height: 50, justifyContent: 'center', paddingHorizontal: 10},
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <PopoverMenu navigation={navigation} />
          <TouchableOpacity
            style={{
              padding: 5,
              backgroundColor: colors.blackrgba,
              borderRadius: 25,
            }}>
            <Feather name="user" size={30} color={colors.lighter} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default TestimonialsMontangeVideoScreen;
