import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import colors from '../../style/colors';
import ActionContent from '../../actions_content/actions.content.ui';
import {file_url} from '../../../app/api';
import {capitalize} from '../../../app/config/func';
import moment from 'moment';
import 'moment/locale/fr';
import {TypeContentEnum} from '../../../app/config/enum';
import FastImage from 'react-native-fast-image';
import Feather from 'react-native-vector-icons/Feather';

const {width} = Dimensions.get('screen');

export default function CardImagesUI({
  images,
  navigation,
  handlePresentModalPress,
}: {
  images: any;
  navigation: any;
  handlePresentModalPress?: (
    mode: 'menu' | 'comments',
    typeContent: TypeContentEnum,
    idFile: number,
  ) => void;
}) {
  const [showMaxLines, setShowMaxLines] = useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';

  const handleGotoPlayer = () => {
    navigation.navigate('ImagesViewer', {images});
  };

  return (
    <TouchableOpacity onPress={handleGotoPlayer} activeOpacity={0.9}>
      <View style={style().card_container}>
        <View style={style(isDarkMode).card_inner}>
          {/* HEADER */}
          <View style={style().header}>
            <View style={style().headerLeft}>
              <FastImage
                source={{
                  uri: `${file_url}${images?.eglise.photo_eglise}`,
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.immutable,
                }}
                resizeMode={FastImage.resizeMode.cover}
                style={style().avatar}
              />

              <View>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={style(isDarkMode).username}>
                  {capitalize(images.eglise.nom_eglise.toLowerCase())}
                </Text>
                <Text style={style().time}>
                  {moment(images.createdAt).fromNow()}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() =>
                handlePresentModalPress?.(
                  'menu',
                  TypeContentEnum.images,
                  images.id,
                )
              }
              style={{padding: 5}}>
              <Feather name="more-horizontal" size={22} color={colors.gris} />
            </TouchableOpacity>
          </View>

          {/* IMAGES */}
          <View style={style().imageContainer}>
            <FlatList
              data={images.photos}
              keyExtractor={(item, index) => `${item}-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              renderItem={({item, index}) => (
                <View key={index} style={style().imageWrapper}>
                  <FastImage
                    source={{
                      uri: `${file_url}${item}`,
                      priority: FastImage.priority.normal,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    style={style().postImage}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  {/* compteur en haut à droite */}
                  <View style={style().imageCounter}>
                    <Text style={style().counterText}>
                      {index + 1} / {images.photos.length}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>

          {/* DESCRIPTION */}
          {images.descrition ? (
            <Text
              onPress={() => setShowMaxLines(!showMaxLines)}
              ellipsizeMode="tail"
              numberOfLines={showMaxLines ? undefined : 3}
              style={style(isDarkMode).description}>
              {images.descrition}
            </Text>
          ) : null}

          {/* SEPARATOR */}
          <View style={style().separator} />

          {/* ACTIONS */}
          <ActionContent
            handlePresentModalPress={handlePresentModalPress}
            typeContent={TypeContentEnum.images}
            navigation={navigation}
            content={images}
            commentCount={false}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const style = (dark: boolean = true) =>
  StyleSheet.create({
    card_container: {
      width: width,
      marginBottom: 15,
    },
    card_inner: {
      borderWidth: 0.7,
      borderColor: colors.gris,
      borderRadius: 12,
      backgroundColor: dark ? colors.blackrgba2 : colors.white,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    username: {
      fontSize: 14,
      fontWeight: '600',
      color: dark ? colors.white : colors.black,
      maxWidth: 220,
    },
    time: {
      color: colors.gris,
      fontSize: 11,
    },
    imageContainer: {
      height: 300,
    },
    imageWrapper: {
      width: width,
    },
    postImage: {
      height: 300,
      width: width,
    },
    imageCounter: {
      position: 'absolute',
      right: 15,
      top: 10,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: colors.blackrgba7,
      borderRadius: 8,
    },
    counterText: {
      color: colors.light,
      fontSize: 12,
    },
    description: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 13,
      lineHeight: 18,
      color: dark ? colors.light : colors.black,
    },
    separator: {
      borderTopWidth: 0.5,
      borderTopColor: colors.gris,
      marginHorizontal: 10,
      marginTop: 5,
    },
  });

// import React, {useState, useCallback, useRef} from 'react';
// import {
//   Dimensions,
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   useColorScheme,
// } from 'react-native';
// import colors from '../../style/colors';
// import ActionContent from '../../actions_content/actions.content.ui';
// import {file_url} from '../../../app/api';
// import {capitalize} from '../../../app/config/func';
// import moment from 'moment';
// import 'moment/locale/fr';
// import {TypeContentEnum} from '../../../app/config/enum';
// import FastImage from 'react-native-fast-image';
// import Feather from 'react-native-vector-icons/Feather';

// const {width} = Dimensions.get('screen');

// export default function CardImagesUI({
//   images,
//   navigation,
//   handlePresentModalPress,
// }: {
//   images: any;
//   navigation: any;
//   handlePresentModalPress?: (
//     mode: 'menu' | 'comments', // premier argument
//     typeContent: TypeContentEnum,
//     idFile: number,
//   ) => void;
// }) {
//   const [showMaxLines, setShowMaxLines] = useState<boolean>(false);
//   const isDarkMode = useColorScheme() === 'dark';

//   const handleGotoPlayer = () => {
//     navigation.navigate('ImagesViewer', {
//       images: images,
//     });
//   };

//   return (
//     <TouchableOpacity onPress={handleGotoPlayer}>
//       <View style={style().card_contenair}>
//         <View style={style(isDarkMode).card_contenair_view}>
//           {/* HEADER avec photo église + nom + bouton menu options */}
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               paddingHorizontal: 10,
//             }}>
//             <View style={style(isDarkMode).card_description}>
//               <FastImage
//                 source={{
//                   uri: `${file_url}${images?.eglise.photo_eglise}`,
//                   priority: FastImage.priority.normal,
//                   cache: FastImage.cacheControl.immutable,
//                 }}
//                 style={{
//                   width: 30,
//                   height: 30,
//                   borderRadius: 10,
//                 }}
//                 resizeMode={FastImage.resizeMode.cover}
//               />

//               <View>
//                 <Text
//                   ellipsizeMode="tail"
//                   numberOfLines={1}
//                   style={style(isDarkMode).card_video_detail}>
//                   {capitalize(images.eglise.nom_eglise.toLowerCase())}
//                 </Text>
//                 <Text
//                   style={{
//                     color: colors.gris,
//                     fontSize: 10,
//                     paddingBottom: 5,
//                   }}>
//                   {moment(images.createdAt).fromNow()}
//                 </Text>
//               </View>
//             </View>

//             {/* ✅ Bouton menu (3 points) */}
//             <TouchableOpacity
//               // onPress={() => optionsSheetRef.current?.present()}
//               onPress={() =>
//                 handlePresentModalPress?.(
//                   'menu',
//                   TypeContentEnum.images,
//                   images.id,
//                 )
//               }
//               style={{padding: 5}}>
//               <Feather name="more-vertical" size={20} color={colors.gris} />
//             </TouchableOpacity>
//           </View>

//           {/* IMAGES LIST */}
//           <View style={{height: 300}}>
//             <FlatList
//               data={images.photos}
//               keyExtractor={item => item.toString()}
//               horizontal={true}
//               showsHorizontalScrollIndicator={false}
//               pagingEnabled={true}
//               renderItem={({item, index}) => (
//                 <View key={index} style={{width: width, paddingHorizontal: 10}}>
//                   <FastImage
//                     source={{
//                       uri: `${file_url}${item}`,
//                       priority: FastImage.priority.normal,
//                       cache: FastImage.cacheControl.immutable,
//                     }}
//                     style={{
//                       height: 300,
//                       width: width - 20,
//                       borderRadius: 20,
//                     }}
//                     resizeMode={FastImage.resizeMode.cover}
//                   />
//                   <View
//                     style={{
//                       position: 'absolute',
//                       right: 20,
//                       top: 10,
//                       paddingVertical: 5,
//                       paddingHorizontal: 10,
//                       backgroundColor: colors.blackrgba7,
//                       borderRadius: 10,
//                     }}>
//                     <Text
//                       style={{
//                         color: colors.light,
//                         fontSize: 17,
//                         fontWeight: '400',
//                       }}>
//                       {index + 1} / {images.photos.length}
//                     </Text>
//                   </View>
//                 </View>
//               )}
//             />
//           </View>

//           {/* DESCRIPTION */}
//           <Text
//             onPress={() => {
//               setShowMaxLines(!showMaxLines);
//             }}
//             ellipsizeMode="tail"
//             numberOfLines={showMaxLines ? undefined : 4}
//             style={style(isDarkMode).card_video_title}>
//             {images.descrition}
//           </Text>

//           {/* ACTIONS */}
//           <ActionContent
//             handlePresentModalPress={handlePresentModalPress}
//             typeContent={TypeContentEnum.images}
//             navigation={navigation}
//             content={images}
//             commentCount={false}
//           />
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }

// const style = (dark: boolean = true) =>
//   StyleSheet.create({
//     card_contenair: {
//       width: width,
//     },
//     card_contenair_view: {
//       borderWidth: 0.5,
//       borderColor: colors.gris,
//       borderRadius: 20,
//       paddingVertical: 5,
//     },
//     card_description: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 10,
//     },
//     card_video_title: {
//       color: colors.gris,
//       fontSize: 11,
//       padding: 10,
//     },
//     card_video_detail: {
//       color: dark ? colors.white : colors.primary,
//       fontSize: 14,
//       lineHeight: 20,
//       width: 230,
//     },
//   });
