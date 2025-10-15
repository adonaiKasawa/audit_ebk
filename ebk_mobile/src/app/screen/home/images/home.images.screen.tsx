import * as React from 'react';
import {
  View,
  FlatList,
  useColorScheme,
  RefreshControl,
  ActivityIndicator,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../../components/style/colors';
import CardImagesUI from '../../../../components/card/images/card.image';
import {TypeContentEnum} from '../../../config/enum';
import SkeletonImageCard from '../../../../components/skeleon/skeleton.leader.image';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Feather';
import {findSignaleContentsByUserApi} from '../../../api/signale/signale.req';

const {width} = Dimensions.get('window');

function HomeImagesScreen({
  navigation,
  images,
  handelGetFiles,
  handlePresentModalPress,
  links,
}: {
  navigation: any;
  route: any;
  images: any[];
  handelGetFiles?: (
    typeContent: TypeContentEnum,
    links?: string,
  ) => Promise<void>;
  handlePresentModalPress: (
    mode: 'menu' | 'comments',
    typeContent: TypeContentEnum,
    idFile: number,
  ) => void;
  links: {next: string};
}) {
  const isDarkMode = useColorScheme() === 'dark';
  const [visibleItems, setVisibleItems] = React.useState<any[]>([]);
  const [loadedCount, setLoadedCount] = React.useState<number>(5);
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [loadingSkeleton, setLoadingSkeleton] = React.useState<boolean>(true);

  // 🎧 ID de la vidéo en lecture
  const [playingVideoId, setPlayingVideoId] = React.useState<number | null>(
    null,
  );
  // 🔇 ID de la vidéo avec le son activé
  const [soundVideoId, setSoundVideoId] = React.useState<number | null>(null);

  const [signaleContents, setSignaleContens] = React.useState<any[]>([]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  async function signaleContent() {
    const contentType = 'images';
    const response = await findSignaleContentsByUserApi(contentType);
    console.log('response signale data : ', response?.data);
  }

  const handleGetSignalContents = React.useCallback(async () => {
    const contentType = 'images';
    try {
      const response = await findSignaleContentsByUserApi(contentType);
      if (Array.isArray(response?.data)) {
        setSignaleContens(response?.data);
        // setBlockedContent(response.data);
      } else {
        // setBlockedContent([]); // toujours un tableau pour éviter .some() undefined
        // console.warn('blockedContent non valide :', response?.data);
      }
    } catch (err) {
      setSignaleContens([]); // fallback
      console.warn('Erreur récupération des dontennus signalés :', err);
    }
  }, []);

  React.useEffect(() => {
    setLoadedCount(5);
    if (images?.length > 0) setLoadingSkeleton(false);
  }, [images]);

  React.useEffect(() => {
    handleGetSignalContents();
  }, [handleGetSignalContents]);

  React.useEffect(() => {
    signaleContent();
  }, []);

  React.useEffect(() => {
    setVisibleItems(images.slice(0, loadedCount));
  }, [images, loadedCount]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (handelGetFiles) await handelGetFiles(TypeContentEnum.images);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (loadingMore || !links?.next) return;
    setLoadingMore(true);
    await handelGetFiles?.(TypeContentEnum.images, links.next);
    setLoadingMore(false);
  };

  const renderFooter = () =>
    loadingMore ? (
      <View style={{paddingVertical: 20}}>
        <ActivityIndicator size="small" color="#999999" />
      </View>
    ) : null;

  const renderItem = ({item}: {item: any}) => {
    if (item.type === 'testimonial') {
      const isPlaying = playingVideoId === item.id;
      const isSoundOn = soundVideoId === item.id;

      return (
        <View
          style={{
            width: width - 20,
            height: 300,
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            marginVertical: 10,
            alignSelf: 'center',
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TestimonialDetail', {
                initialVideoId: item.id,
              });
            }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* Pas de contenu ici, juste le click */}
            <Video
              source={{uri: item.cachedUri}}
              style={{width: '100%', height: '100%'}}
              resizeMode="cover"
              repeat={true}
              paused={!isPlaying}
              muted={isSoundOn} // 🔊 corrige pour mute/unmute
            />

            {/* Bouton commentaires */}
            {/* <TouchableOpacity
              onPress={() =>
                handlePresentModalPress(TypeContentEnum.testimonials, item.id)
              }
              style={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                padding: 10,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 5,
              }}>
              <Text style={{color: '#fff'}}>Voir commentaires</Text>
            </TouchableOpacity> */}

            {/* Bouton Play / Pause */}
            <TouchableOpacity
              onPress={() => setPlayingVideoId(isPlaying ? null : item.id)}
              style={{
                position: 'absolute',
                bottom: 15,
                right: 50,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 20,
                padding: 6,
              }}>
              <Icon
                name={isPlaying ? 'pause' : 'play'}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>

            {/* Bouton Son */}
            <TouchableOpacity
              onPress={() => setSoundVideoId(isSoundOn ? null : item.id)}
              style={{
                position: 'absolute',
                bottom: 15,
                right: 10,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 20,
                padding: 6,
              }}>
              <Icon
                name={!isSoundOn ? 'volume-2' : 'volume-x'}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <CardImagesUI
          navigation={navigation}
          images={item}
          handlePresentModalPress={handlePresentModalPress}
        />
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundStyle.backgroundColor,
        paddingTop: 10,
      }}>
      {loadingSkeleton ? (
        <FlatList
          data={Array.from({length: 6})}
          keyExtractor={(_, i) => i.toString()}
          renderItem={() => <SkeletonImageCard />}
          numColumns={1}
        />
      ) : (
        <FlatList
          data={visibleItems}
          keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          initialNumToRender={3}
          windowSize={5}
          maxToRenderPerBatch={3}
          removeClippedSubviews={true}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={() => setLoadedCount(prev => prev + 5)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
}

export default HomeImagesScreen;

// import * as React from 'react';
// import {
//   View,
//   FlatList,
//   useColorScheme,
//   RefreshControl,
//   ActivityIndicator,
//   Text,
//   Dimensions,
//   TouchableOpacity,
// } from 'react-native';
// import colors from '../../../../components/style/colors';
// import CardImagesUI from '../../../../components/card/images/card.image';
// import {TypeContentEnum} from '../../../config/enum';
// import SkeletonImageCard from '../../../../components/skeleon/skeleton.leader.image';
// import Video from 'react-native-video';
// import Icon from 'react-native-vector-icons/Feather';

// const {width} = Dimensions.get('window');

// function HomeImagesScreen({
//   navigation,
//   route,
//   images,
//   handelGetFiles,
//   handlePresentModalPress,
//   links,
// }: {
//   navigation: any;
//   route: any;
//   images: any[];
//   handelGetFiles?: (
//     typeContent: TypeContentEnum,
//     links?: string,
//   ) => Promise<void>;
//   handlePresentModalPress: (
//     typeContent: TypeContentEnum,
//     idFile: number,
//   ) => void;
//   links: {next: string};
// }) {
//   const isDarkMode = useColorScheme() === 'dark';
//   const [visibleItems, setVisibleItems] = React.useState<any[]>([]);
//   const [loadedCount, setLoadedCount] = React.useState<number>(5);
//   const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
//   const [refreshing, setRefreshing] = React.useState<boolean>(false);
//   const [loadingSkeleton, setLoadingSkeleton] = React.useState<boolean>(true);

//   // 🎧 ID de la vidéo en lecture
//   const [playingVideoId, setPlayingVideoId] = React.useState<number | null>(
//     null,
//   );
//   // 🔇 ID de la vidéo avec le son activé
//   const [soundVideoId, setSoundVideoId] = React.useState<number | null>(null);

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? colors.primary : colors.lighter,
//   };

//   React.useEffect(() => {
//     setLoadedCount(5);
//     if (images?.length > 0) setLoadingSkeleton(false);
//   }, [images]);

//   React.useEffect(() => {
//     setVisibleItems(images.slice(0, loadedCount));
//   }, [images, loadedCount]);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     if (handelGetFiles) await handelGetFiles(TypeContentEnum.images);
//     setRefreshing(false);
//   };

//   const loadMore = async () => {
//     if (loadingMore || !links?.next) return;
//     setLoadingMore(true);
//     await handelGetFiles?.(TypeContentEnum.images, links.next);
//     setLoadingMore(false);
//   };

//   const renderFooter = () =>
//     loadingMore ? (
//       <View style={{paddingVertical: 20}}>
//         <ActivityIndicator size="small" color="#999999" />
//       </View>
//     ) : null;

//   const renderItem = ({item}: {item: any}) => {
//     if (item.type === 'testimonial') {
//       const isPlaying = playingVideoId === item.id;
//       const isSoundOn = soundVideoId === item.id;

//       return (
//         <View
//           style={{
//             width: width - 20,
//             height: 300,
//             backgroundColor: '#000',
//             justifyContent: 'center',
//             alignItems: 'center',
//             borderRadius: 20,
//             marginVertical: 10,
//             alignSelf: 'center',
//             overflow: 'hidden',
//             shadowColor: '#000',
//             shadowOffset: {width: 0, height: 2},
//             shadowOpacity: 0.3,
//             shadowRadius: 4,
//             elevation: 5,
//           }}>
//           <Video
//             source={{uri: item.cachedUri}}
//             style={{width: '100%', height: '100%'}}
//             resizeMode="cover"
//             repeat={true}
//             paused={!isPlaying} // ❌ en pause si ce n’est pas la vidéo active
//             muted={isSoundOn} // 🔇 son seulement si l'utilisateur a activé
//           />

//           {/* Bouton commentaires */}
//           <TouchableOpacity
//             onPress={() =>
//               handlePresentModalPress(TypeContentEnum.testimonials, item.id)
//             }
//             style={{
//               position: 'absolute',
//               bottom: 10,
//               left: 10,
//               padding: 10,
//               backgroundColor: 'rgba(0,0,0,0.5)',
//               borderRadius: 5,
//             }}>
//             <Text style={{color: '#fff'}}>Voir commentaires</Text>
//           </TouchableOpacity>

//           {/* Bouton Play / Pause */}
//           <TouchableOpacity
//             onPress={() => setPlayingVideoId(isPlaying ? null : item.id)}
//             style={{
//               position: 'absolute',
//               bottom: 15,
//               right: 50,
//               backgroundColor: 'rgba(0,0,0,0.5)',
//               borderRadius: 20,
//               padding: 6,
//             }}>
//             <Icon name={isPlaying ? 'pause' : 'play'} size={20} color="#fff" />
//           </TouchableOpacity>

//           {/* Bouton Son */}
//           <TouchableOpacity
//             onPress={() => setSoundVideoId(isSoundOn ? null : item.id)}
//             style={{
//               position: 'absolute',
//               bottom: 15,
//               right: 10,
//               backgroundColor: 'rgba(0,0,0,0.5)',
//               borderRadius: 20,
//               padding: 6,
//             }}>
//             <Icon
//               name={!isSoundOn ? 'volume-2' : 'volume-x'}
//               size={20}
//               color="#fff"
//             />
//           </TouchableOpacity>
//         </View>
//       );
//     } else {
//       return (
//         <CardImagesUI
//           navigation={navigation}
//           images={item}
//           handlePresentModalPress={handlePresentModalPress}
//         />
//       );
//     }
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: backgroundStyle.backgroundColor,
//         paddingTop: 10,
//       }}>
//       {loadingSkeleton ? (
//         <FlatList
//           data={Array.from({length: 6})}
//           keyExtractor={(_, i) => i.toString()}
//           renderItem={() => <SkeletonImageCard />}
//           numColumns={1}
//         />
//       ) : (
//         <FlatList
//           data={visibleItems}
//           keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
//           ItemSeparatorComponent={() => <View style={{height: 10}} />}
//           numColumns={1}
//           showsVerticalScrollIndicator={false}
//           initialNumToRender={3}
//           windowSize={5}
//           maxToRenderPerBatch={3}
//           removeClippedSubviews={true}
//           renderItem={renderItem}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//           onEndReached={() => setLoadedCount(prev => prev + 5)}
//           onEndReachedThreshold={0.5}
//           ListFooterComponent={renderFooter}
//         />
//       )}
//     </View>
//   );
// }

// export default HomeImagesScreen;
