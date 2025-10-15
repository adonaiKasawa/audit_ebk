import React, {useState, useCallback, useRef} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  useColorScheme,
} from 'react-native';
import colors from '../../../components/style/colors';
import moment from 'moment';
import {file_url} from '../../api';
import {TypeContentEnum} from '../../config/enum';
import {capitalize} from '../../config/func';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import CommentUI from '../../../components/comment/comment.ui';
import Feather from 'react-native-vector-icons/Feather';
import ActionContent from '../../../components/actions_content/actions.content.ui';
import FastImage from 'react-native-fast-image';

const {width, height} = Dimensions.get('screen');

export default function ImagesPlayerScreen({navigation, route}: any) {
  const images = route.params?.images;
  const isDarkMode = useColorScheme() === 'dark';
  const [commentCount, setCommentCount] = useState(
    images.commentaire?.length || 0,
  );

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
  };

  const snapPoints = React.useMemo(() => ['90%'], []);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleAfterComment = (value: number) => {
    setCommentCount(value);
  };

  return (
    <BottomSheetModalProvider>
      <View
        style={[
          styles.container,
          {backgroundColor: backgroundStyle.backgroundColor},
        ]}>
        {/* Bouton fermer */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}>
          <Feather name="x" size={20} color={colors.white} />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* IMAGE */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('ImagesGalleryViewer', {
                images: images.photos, // ou envoie toute la data si besoin
                current: 0, // index de l’image actuelle
              })
            }>
            <FastImage
              source={{
                uri: `${file_url}${images.photos[0]}`,
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable,
              }}
              style={styles.image}
              // resizeMode="contain"
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          {/* Infos auteur */}
          <View style={styles.headerInfo}>
            <FastImage
              source={{
                uri: `${file_url}${images?.eglise.photo_eglise}`,
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable,
              }}
              style={styles.avatar}
              // resizeMode="cover"
              resizeMode={FastImage.resizeMode.cover}
            />
            <View>
              <Text
                style={[
                  styles.username,
                  {
                    color: isDarkMode ? colors.white : colors.primary,
                    maxWidth: '90%',
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {capitalize(images.eglise.nom_eglise.toLowerCase())}
              </Text>
              <Text style={styles.date}>
                {moment(images.createdAt).fromNow()}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text
            style={[
              styles.description,
              {color: isDarkMode ? colors.white : colors.primary},
            ]}>
            {images.descrition}
          </Text>

          {/* Actions */}
          <ActionContent
            handlePresentModalPress={handlePresentModalPress}
            typeContent={TypeContentEnum.images}
            navigation={navigation}
            content={images}
            commentCount={commentCount}
          />
        </ScrollView>

        {/* BottomSheet pour commentaires */}
        <BottomSheetModal ref={bottomSheetRef} snapPoints={snapPoints}>
          <BottomSheetView
            style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
            <CommentUI
              idFile={images.id}
              typeFile={TypeContentEnum.images}
              afterComment={handleAfterComment}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  closeBtn: {
    position: 'absolute',
    top: 20,
    left: 12,
    zIndex: 10,
    backgroundColor: colors.blackrgba3,
    borderRadius: 20,
    padding: 5,
  },
  image: {
    width: width,
    height: height * 0.5,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  avatar: {width: 40, height: 40, borderRadius: 20},
  username: {fontWeight: 'bold', fontSize: 14},
  date: {color: colors.gris, fontSize: 12},
  description: {fontSize: 13, paddingHorizontal: 10, marginBottom: 10},
});
// import React, {useState} from 'react';
// import {
//   Dimensions,
//   FlatList,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   useColorScheme,
//   View,
// } from 'react-native';
// import {ItemPicture} from '../../config/interface';
// import colors from '../../../components/style/colors';
// import {Image} from 'react-native';
// import moment from 'moment';
// import ActionContent from '../../../components/actions_content/actions.content.ui';
// import {file_url} from '../../api';
// import {TypeContentEnum} from '../../config/enum';
// import {capitalize} from '../../config/func';
// import {
//   BottomSheetModal,
//   BottomSheetModalProvider,
//   BottomSheetView,
// } from '@gorhom/bottom-sheet';
// import CommentUI from '../../../components/comment/comment.ui';

// const {width} = Dimensions.get('screen');
// // const {width, height} = Dimensions.get('screen');

// export default function ImagesPlayerScreen({navigation, route}: any) {
//   const images: ItemPicture = route.params?.images;

//   const isDarkMode = useColorScheme() === 'dark';
//   const [commentCount, setCommentCount] = useState<any>(
//     images.commentaire?.length || 0,
//   );

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? colors.primary : colors.lighter,
//   };

//   const snapPoints = React.useMemo(() => ['100%', '100%'], []);

//   const bottomSheetRef = React.useRef<BottomSheetModal>(null);

//   // callbacks
//   const handlePresentModalPress = React.useCallback(() => {
//     bottomSheetRef.current?.present();
//   }, []);

//   const handleSheetChanges = React.useCallback(() => {}, []);

//   const handleGotoPlayer = () => {
//     navigation.navigate('ImagesGalleryViewer', {
//       images: images.photos,
//     });
//   };

//   const handleAfterComment = (value: React.SetStateAction<number>) => {
//     setCommentCount(value);
//   };

//   return (
//     <BottomSheetModalProvider>
//       <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
//         <View style={style().card_contenair}>
//           <View style={style(isDarkMode).card_contenair_view}>
//             <View style={style(isDarkMode).card_description}>
//               <Image
//                 source={{uri: `${file_url}${images?.eglise.photo_eglise}`}}
//                 style={{
//                   width: 30,
//                   height: 30,
//                   borderRadius: 10,
//                 }}
//                 resizeMode="cover"
//               />

//               <View>
//                 <Text
//                   ellipsizeMode="tail"
//                   numberOfLines={1}
//                   style={style(isDarkMode).card_video_detail}>
//                   {capitalize(images.eglise.nom_eglise.toLowerCase())}
//                 </Text>
//                 <Text style={{color: colors.gris, fontSize: 10}}>
//                   {moment(images.createdAt).fromNow()}
//                 </Text>
//               </View>
//             </View>
//             <TouchableOpacity onPress={handleGotoPlayer}>
//               <FlatList
//                 data={images.photos}
//                 keyExtractor={item => item.toString()}
//                 horizontal={true}
//                 showsHorizontalScrollIndicator={false}
//                 pagingEnabled={true}
//                 renderItem={({item, index}) => (
//                   <View
//                     key={index + index - 1 + '' + item}
//                     style={{width: width, paddingHorizontal: 10}}>
//                     <Image
//                       source={{uri: `${file_url}${item}`}}
//                       style={{
//                         height: 300,
//                         width: width - 20,
//                         borderRadius: 20,
//                       }}
//                       resizeMode="cover"
//                     />
//                     <View
//                       style={{
//                         position: 'absolute',
//                         right: 20,
//                         top: 10,
//                         paddingVertical: 5,
//                         paddingHorizontal: 10,
//                         backgroundColor: colors.blackrgba7,
//                         borderRadius: 10,
//                       }}>
//                       <Text
//                         style={{
//                           color: colors.light,
//                           fontSize: 17,
//                           fontWeight: '400',
//                         }}>
//                         {index + 1} / {images.photos.length}
//                       </Text>
//                     </View>
//                   </View>
//                 )}
//               />
//             </TouchableOpacity>

//             <ScrollView showsVerticalScrollIndicator={false}>
//               <Text style={style(isDarkMode).card_video_title}>
//                 {images.descrition}
//               </Text>
//             </ScrollView>
//           </View>
//         </View>

//         <View style={{height: 60}}>
//           <ActionContent
//             handlePresentModalPress={handlePresentModalPress}
//             typeContent={TypeContentEnum.images}
//             navigation={navigation}
//             content={images}
//             commentCount={commentCount}
//           />
//         </View>

//         <BottomSheetModal
//           ref={bottomSheetRef}
//           onChange={handleSheetChanges}
//           snapPoints={snapPoints}>
//           <BottomSheetView
//             style={{
//               flex: 1,
//               backgroundColor: backgroundStyle.backgroundColor,
//             }}>
//             <CommentUI
//               idFile={images.id}
//               typeFile={TypeContentEnum.images}
//               afterComment={handleAfterComment}
//             />
//           </BottomSheetView>
//         </BottomSheetModal>
//       </View>
//     </BottomSheetModalProvider>
//   );
// }

// const style = (dark: boolean = true) =>
//   StyleSheet.create({
//     card_contenair: {
//       width: width,
//       flex: 3,
//       // backgroundColor: colors.red
//     },
//     card_contenair_view: {
//       paddingVertical: 5,
//     },
//     card_miniature_img: {
//       height: 300,
//       width: width - 10,
//     },
//     card_description: {
//       width: width,
//       display: 'flex',
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 20,
//       padding: 10,
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
//     },
//   });
