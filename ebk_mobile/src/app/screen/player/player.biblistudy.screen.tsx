import React from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import {file_url} from '../../api';
import {useEffect, useRef, useState} from 'react';
import colors from '../../../components/style/colors';
import VideoPlayer from 'react-native-video-controls';
import LinearGradient from 'react-native-linear-gradient';
import ActionContent from '../../../components/actions_content/actions.content.ui';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {selectAuth} from '../../store/auth/auth.slice';
import {jwtDecode} from 'jwt-decode';
import {TypeContentEnum} from '../../config/enum';
import {
  ItemBibleStudy,
  ItemContentBibleStudy,
  ItemVideos,
} from '../../config/interface';
import moment from 'moment';
import {CardBibleStudyContentUI} from '../bibleStudys/bibleStudy.content.screen';

const width = Dimensions.get('screen').width;

export default function BibleStudyVideosPlayerScreen({navigation, route}: any) {
  const previousWidth = Dimensions.get('screen').width;
  const previousHeight = Dimensions.get('screen').height;
  const [isHorizontal, setIsHorizontal] = useState<boolean>(
    previousWidth > previousHeight,
  );
  const videoRef = useRef(null);
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const userDecode = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = useState<any>(userDecode);
  const isDarkMode = useColorScheme() === 'dark';
  const [videos, setVideos] = useState<any>([]);
  const bibleStudys: ItemBibleStudy = route.params?.bibleStudy;
  const bibleStudyContent: ItemContentBibleStudy =
    route.params?.bibleStudyContent;

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

  const onBuffer = () => {};

  const onError = () => {};

  return (
    <View
      style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}
      onLayout={onLayout}>
      <View style={{flex: 1}}>
        <VideoPlayer
          controls={true}
          source={{uri: `${file_url}${bibleStudyContent.content}`}}
          onBuffer={onBuffer}
          onError={onError}
          onEnterFullscreen={() => {
            setIsHorizontal(true);
          }}
          style={styles.backgroundVideo}
          // resizeMode={"contain"}
          navigator={navigation}
          volume={1.0}
        />
      </View>
      <View
        style={{
          flex: isHorizontal ? 0 : 2,
          display: isHorizontal ? 'none' : undefined,
        }}>
        <LinearGradient
          colors={[colors.gris, isDarkMode ? colors.primary : colors.white]}
          start={{x: 0.5, y: 0.1}}
          end={{x: 0.5, y: 0.9}}
          style={{
            width: '100%',
            // height: 100,
            padding: 10,
          }}>
          <Text
            style={{color: colors.lighter, fontWeight: 'bold', fontSize: 20}}>
            {bibleStudyContent.titre}
          </Text>
          <Text style={{color: colors.secondary, fontSize: 15}}>
            {/* 4.4k vues .  */}
            {moment(bibleStudyContent.createdAt).fromNow()}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginTop: 20,
            }}>
            <Image
              source={{uri: `${file_url}${bibleStudys.eglise.photo_eglise}`}}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
              }}
            />
            <View style={{alignItems: 'center'}}>
              <Text
                ellipsizeMode="tail"
                style={{
                  color: isDarkMode ? colors.light : colors.primary,
                  fontSize: 15,
                  fontWeight: '500',
                }}>
                {bibleStudys.eglise.nom_eglise}
              </Text>
              {/* <Text style={{ color: colors.gris, fontSize: 12, }}>
            54.6 k membres
          </Text> */}
            </View>
          </View>
          <View style={{height: 50}}>
            <ActionContent
              navigation={navigation}
              content={bibleStudyContent}
              typeContent={TypeContentEnum.bibleStudyContent}
            />
          </View>
        </LinearGradient>

        <View style={{flex: 1}}>
          <FlatList
            data={bibleStudys.contentsBibleStudy}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item}) => (
              <CardBibleStudyContentUI
                isActivated={bibleStudyContent.id}
                bibleStudy={bibleStudys}
                bibleStudyContent={item}
                navigation={navigation}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundVideo: {
    width: '100%',
    height: '100%',
  },
});
