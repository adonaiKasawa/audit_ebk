import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {BlurView} from '@react-native-community/blur';
import moment from 'moment';
import 'moment/locale/fr';
import colors from '../../style/colors';
import {file_url} from '../../../app/api';
import {capitalize} from '../../../app/config/func';
import {VideoFile} from '../../../app/store/datahome/home.video.slice';

export const playedVideoIds = new Set<string>();
const {width} = Dimensions.get('screen');

function CardVideosUI({
  navigation,
  videos,
}: {
  navigation: any;
  videos: VideoFile;
}) {
  const isDarkMode = useColorScheme() === 'dark';
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);

  // ✅ Fonction pour extraire le lien vidéo
  const getVideoUrl = (lien?: string): string | null => {
    if (!lien) return null;
    if (lien.includes('src="')) {
      const match = lien.match(/src="([^"]+)"/);
      return match && match[1] ? match[1] : null;
    }
    if (lien.endsWith('.mp4')) return `${file_url}${lien}`;
    return null;
  };

  const videoUrl = getVideoUrl(videos?.lien);

  // ✅ Image principale du contenu vidéo
  const miniatureUrl = videos?.photo
    ? `${file_url}${videos.photo}`
    : 'https://via.placeholder.com/400x200?text=Pas+d%27image';

  // ✅ Image de l’église
  const logoEgliseUrl = videos?.eglise?.photo_eglise
    ? `${file_url}${videos.eglise.photo_eglise}`
    : 'https://via.placeholder.com/100x100?text=Eglise';

  const handleGotoPlayer = () => {
    playedVideoIds.add(videos.id.toString());
    navigation.push('VideosPlayer', {
      video: {...videos, lien: videoUrl},
      resume: alreadyPlayed,
    });
  };

  useEffect(() => {
    if (playedVideoIds.has(videos.id.toString())) {
      setAlreadyPlayed(true);
    }
  }, [videos.id]);

  const VideosDescriptionView = () => (
    <>
      <FastImage
        source={{
          uri: logoEgliseUrl,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        style={{width: 50, height: 50, borderRadius: 25}}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={{flex: 1, marginLeft: 15}}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={2}
          style={style(isDarkMode).card_video_title}>
          {videos.titre}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 10,
          }}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={style(isDarkMode).card_video_detail}>
            {capitalize(videos?.eglise?.nom_eglise?.toLowerCase() || '')}
          </Text>
          <Text style={{color: colors.gris, fontSize: 10}}>
            {moment(videos.createdAt).fromNow()}
          </Text>
        </View>
      </View>
    </>
  );

  return (
    <TouchableOpacity
      onPress={handleGotoPlayer}
      style={style(isDarkMode).card_contenair}>
      <View style={style(isDarkMode).card_miniature_img}>
        <FastImage
          source={{
            uri: miniatureUrl,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={{
            width: width,
            height: 188,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>

      {Platform.OS === 'ios' ? (
        <View style={style(isDarkMode).card_description}>
          <FastImage
            source={{
              uri: miniatureUrl,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
            style={{
              width: width,
              height: 79,
              borderRadius: 10,
              opacity: 0.8,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <BlurView
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              height: 79,
              position: 'absolute',
              left: 0,
              right: 0,
              paddingHorizontal: 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
            blurType={isDarkMode ? 'dark' : 'light'}
            blurAmount={20}
            reducedTransparencyFallbackColor={colors.white}>
            {VideosDescriptionView()}
          </BlurView>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: isDarkMode ? colors.primary : colors.light,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              height: 79,
            }}>
            {VideosDescriptionView()}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default React.memo(CardVideosUI);

const style = (dark: boolean = true) =>
  StyleSheet.create({
    card_contenair: {
      height: 267,
      width: width,
      borderRadius: 20,
      backgroundColor: colors.lighter,
      marginBottom: 10,
    },
    card_miniature_img: {
      height: 188,
    },
    card_description: {
      height: 79,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    card_video_title: {
      color: dark ? colors.light : colors.dark,
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
    },
    card_video_detail: {
      color: colors.gris,
      fontSize: 14,
    },
  });

// import React, {useEffect, useState} from 'react';
// import {ItemVideos} from '../../../app/config/interface';
// import {
//   Dimensions,
//   Image,
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   useColorScheme,
// } from 'react-native';
// import colors from '../../style/colors';
// import {BlurView} from '@react-native-community/blur';
// import {file_url} from '../../../app/api';
// import moment from 'moment';
// import 'moment/locale/fr';
// import {capitalize} from '../../../app/config/func';
// import FastImage from 'react-native-fast-image';
// export const playedVideoIds = new Set<string>();

// const {width, height} = Dimensions.get('screen');

// function CardVideosUI({
//   navigation,
//   videos,
// }: {
//   navigation: any;
//   route: any;
//   videos: ItemVideos;
// }) {
//   // const [videos, setVideos] = useState<ItemVideos>();
//   const isDarkMode = useColorScheme() === 'dark';

//   const [alreadyPlayed, setAlreadyPlayed] = useState(false);

//   // const backgroundStyle = { backgroundColor: isDarkMode ? colors.primary : colors.lighter };

//   // const handleGotoPlayer = () => {
//   //   navigation.push('VideosPlayer', {
//   //     video: videos,
//   //   });
//   // };

//   // const handleGotoPlayer = () => {
//   //   if (!alreadyPlayed) {
//   //     playedVideoIds.add(videos.id.toString()); // marquer comme lu
//   //     navigation.push('VideosPlayer', {
//   //       video: videos,
//   //     });
//   //   } else {
//   //     // Rejouer sans rechargement complet si besoin (ou feedback visuel)
//   //     navigation.navigate('VideosPlayer', {
//   //       video: videos,
//   //       resume: true, // à gérer dans ton Player si tu veux
//   //     });
//   //   }
//   // };

//   const handleGotoPlayer = () => {
//     playedVideoIds.add(videos.id.toString());

//     navigation.push('VideosPlayer', {
//       video: videos,
//       resume: alreadyPlayed, // juste un indicateur dans le paramètre
//     });
//   };

//   useEffect(() => {
//     if (playedVideoIds.has(videos.id.toString())) {
//       setAlreadyPlayed(true);
//     }
//   }, [videos.id]);

//   const VideosDescriptionView = () => {
//     return (
//       <>
//         <FastImage
//           source={{
//             uri: `${file_url}${videos?.eglise.photo_eglise}`,
//             priority: FastImage.priority.normal,
//             cache: FastImage.cacheControl.immutable, // ou web selon ton serveur
//           }}
//           style={{
//             width: 50,
//             height: 50,
//             borderRadius: 25,
//           }}
//           // resizeMode="cover"
//           resizeMode={FastImage.resizeMode.cover}
//         />
//         <View style={{flex: 1, marginLeft: 15}}>
//           <Text
//             ellipsizeMode="tail"
//             numberOfLines={2}
//             style={style(isDarkMode).card_video_title}>
//             {videos.titre}
//           </Text>
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               paddingRight: 10,
//             }}>
//             <Text
//               ellipsizeMode="tail"
//               numberOfLines={1}
//               style={style(isDarkMode).card_video_detail}>
//               {capitalize(videos.eglise.nom_eglise.toLowerCase())}
//             </Text>
//             <Text
//               ellipsizeMode="tail"
//               numberOfLines={1}
//               style={{color: colors.gris, fontSize: 10}}>
//               {moment(videos.createdAt).fromNow()}
//             </Text>
//           </View>
//         </View>
//       </>
//     );
//   };

//   return (
//     <TouchableOpacity
//       onPress={handleGotoPlayer}
//       style={style(isDarkMode).card_contenair}>
//       <View style={style(isDarkMode).card_miniature_img}>
//         <FastImage
//           source={{
//             uri: `${file_url}${videos?.photo}`,
//             priority: FastImage.priority.normal,
//             cache: FastImage.cacheControl.immutable, // ou web selon ton serveur
//           }}
//           style={{
//             width: width,
//             height: 188,
//             borderTopLeftRadius: 20,
//             borderTopRightRadius: 20,
//           }}
//           // resizeMode="cover"
//           resizeMode={FastImage.resizeMode.cover}
//         />
//       </View>
//       {Platform.OS === 'ios' ? (
//         <View style={style(isDarkMode).card_description}>
//           <FastImage
//             source={{
//               uri: `${file_url}${videos?.photo}`,
//               priority: FastImage.priority.normal,
//               cache: FastImage.cacheControl.immutable, // ou web selon ton serveur
//             }}
//             style={{
//               width: width,
//               height: 79,
//               borderRadius: 10,
//               opacity: 0.8,
//             }}
//             // resizeMode="cover"
//             resizeMode={FastImage.resizeMode.cover}
//           />
//           <BlurView
//             style={{
//               display: 'flex',
//               flexDirection: 'row',
//               justifyContent: 'space-around',
//               alignItems: 'center',
//               height: 79,
//               position: 'absolute',
//               left: 0,
//               right: 0,
//               paddingHorizontal: 10,
//               // borderRadius: 10,
//               borderTopLeftRadius: 0,
//               borderTopRightRadius: 0,
//               borderBottomLeftRadius: 10,
//               borderBottomRightRadius: 10,
//             }}
//             blurType={isDarkMode ? 'dark' : 'light'}
//             blurAmount={20}
//             reducedTransparencyFallbackColor={colors.white}
//             blurRadius={20}>
//             {VideosDescriptionView()}
//           </BlurView>
//         </View>
//       ) : (
//         <View
//           style={{backgroundColor: isDarkMode ? colors.primary : colors.light}}>
//           <View
//             style={{
//               display: 'flex',
//               flexDirection: 'row',
//               justifyContent: 'space-around',
//               alignItems: 'center',
//               height: 79,
//             }}>
//             {VideosDescriptionView()}
//           </View>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// }

// // React.memo = évite les re-render inutiles si props ne changent pas
// export default React.memo(CardVideosUI);

// const style = (dark: boolean = true) =>
//   StyleSheet.create({
//     card_contenair: {
//       height: 267,
//       width: width,
//       borderRadius: 20,
//       backgroundColor: colors.lighter,
//       marginBottom: 10,
//     },
//     card_miniature_img: {
//       height: 188,
//     },
//     card_description: {
//       height: 79,
//       borderBottomLeftRadius: 10,
//       borderBottomRightRadius: 10,
//     },
//     card_video_title: {
//       color: dark ? colors.light : colors.dark,
//       alignSelf: 'stretch',
//       overflow: 'hidden',
//       fontSize: 14,
//       fontStyle: 'normal',
//       fontWeight: '500',
//       lineHeight: 20,
//       flexWrap: 'nowrap',
//     },
//     card_video_detail: {
//       color: colors.gris,
//       fontSize: 14,
//     },
//   });
