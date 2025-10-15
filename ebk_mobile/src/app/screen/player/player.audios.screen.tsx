import React, {useState, useCallback} from 'react';
import {
  Dimensions,
  ImageBackground,
  Platform,
  Text,
  TouchableOpacity,
  View,
  // ViewToken,
  useColorScheme,
} from 'react-native';
import colors from '../../../components/style/colors';
import {file_url} from '../../api';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import ActionContent from '../../../components/actions_content/actions.content.ui';
import ControllerAudiosPlayerUI from '../../../components/player/audios/controller.audios.player';
import {TypeContentEnum} from '../../config/enum';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import CommentUI from '../../../components/comment/comment.ui';
import {AudioFile} from '../../store/datahome/home.audio.slice';
// import {useAppSelector} from '../../store/hooks';
import {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import FastImage from 'react-native-fast-image';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default function AudiosPlayerScreen({navigation, route}: any) {
  const audio: AudioFile = route.params.audios;
  // const audiosFromStore = useAppSelector(state => state.homeaudios.audios);
  // const audioId = route.params.audios?.id;
  // const audio: AudioFile = audiosFromStore.find(a => a.id === audioId)!;
  // const [audios, setAudios] = useState<AudioFile[]>([audio]);
  // const [activePostId, setActivePostId] = React.useState<string>('1');
  const [commentCount, setCommentCount] = useState<any>(
    audio.commentaire?.length || 0,
  );

  const streamCount = audio?.views?.length ?? 0;

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  // const handleViewableItemsChanged = React.useCallback(
  //   ({
  //     viewableItems, // changed,
  //   }: {
  //     viewableItems: ViewToken[];
  //     changed: ViewToken[];
  //   }) => {
  //     if (viewableItems.length > 0 && viewableItems[0].isViewable) {
  //       const firstVisibleIndex = viewableItems[0].item;
  //       // setActivePostId(firstVisibleIndex);
  //     }
  //   },
  //   [],
  // );

  const handleAfterComment = (value: React.SetStateAction<number>) => {
    setCommentCount(value);
  };

  // const onEndReached = () => {};

  return (
    // backgroundStyle.backgroundColor
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      {/* <FlatList
        data={audios}
        renderItem={({item}) => ( */}
      <AudiosPlayerItem
        navigation={navigation}
        audio={audio}
        commentCount={commentCount}
        handleAfterComment={handleAfterComment}
        streamCount={streamCount}
      />
      {/* )}
        pagingEnabled={true}
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        onViewableItemsChanged={handleViewableItemsChanged}
        onEndReached={onEndReached}
        onEndReachedThreshold={3}
      /> */}
    </View>
  );
}

// AudiosPlayerItem
function AudiosPlayerItem({
  audio,
  navigation,
  commentCount,
  handleAfterComment,
  streamCount,
}: {
  audio: AudioFile;
  navigation: any;
  commentCount: number;
  handleAfterComment: (value: React.SetStateAction<number>) => void;
  streamCount: number;
}) {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };
  const snapPoints = React.useMemo(() => ['100%', '100%'], []);
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const optionsSheetRef = React.useRef<BottomSheetModal>(null); // ✅ ajouté pour le menu

  const [toastMessage, setToastMessage] = useState('');

  const handlePresentModalPress = React.useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleSheetChanges = React.useCallback(() => {}, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000); // Disparaît après 3 secondes
  };

  // Mettre en flou l'ecran apres le clique sur menu
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5} // Niveau d'assombrissement
      />
    ),
    [],
  );

  return (
    <BottomSheetModalProvider>
      <View style={{flex: 1}}>
        <ImageBackground
          source={{uri: `${file_url}${audio.photo}`}}
          blurRadius={20}
          style={{
            width,
            height: Platform.OS === 'ios' ? height - 80 : height,
          }}
          resizeMode="cover">
          <View style={{flex: 1}}>
            {/* ✅ HEADER avec bouton menu ajouté */}
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={{padding: 10}}>
                  <Feather name="chevron-down" size={30} color={colors.white} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => optionsSheetRef.current?.present()}
                  style={{padding: 10}}>
                  <Feather
                    name="more-vertical"
                    size={24}
                    color={colors.white}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{height: width, alignItems: 'center'}}>
              <FastImage
                source={{
                  uri: `${file_url}${audio.photo}`,
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={{
                  width: width - 20,
                  height: width,
                  borderRadius: 20,
                }}
                // resizeMode="cover"
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <View style={{padding: 10}}>
              <View>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={{
                    color: colors.white,
                    fontSize: 15,
                    fontWeight: '500',
                  }}>
                  {audio.titre}
                </Text>
                <Text
                  style={{color: colors.gris, fontSize: 10, fontWeight: '500'}}>
                  {moment(audio.createdAt).fromNow()}
                </Text>
                <Text style={{color: '#fff', fontSize: 14, marginTop: 4}}>
                  🎧 {streamCount} {''} {streamCount > 1 ? 'streams' : 'stream'}
                </Text>
              </View>
              <View
                style={{
                  marginVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}>
                <FastImage
                  source={{
                    uri: `${file_url}${audio.eglise.photo_eglise}`,
                    priority: FastImage.priority.normal,
                    cache: FastImage.cacheControl.immutable, // ou web selon ton serveur
                  }}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 25,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={2}
                  style={{
                    color: colors.white,
                    fontSize: 15,
                    fontWeight: '500',
                  }}>
                  {audio.eglise.nom_eglise}
                </Text>
              </View>
              <View style={{height: 50}}>
                <ActionContent
                  handlePresentModalPress={handlePresentModalPress}
                  typeContent={TypeContentEnum.audios}
                  navigation={navigation}
                  content={audio}
                  commentCount={commentCount}
                />
              </View>
            </View>
            <View>
              <ControllerAudiosPlayerUI audios={audio} />
            </View>
          </View>

          {/* ✅ BOTTOMSHEET DES COMMENTAIRES */}
          <BottomSheetModal
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            snapPoints={snapPoints}
            index={0}>
            <BottomSheetView
              style={{
                flex: 1,
                backgroundColor: backgroundStyle.backgroundColor,
              }}>
              <CommentUI
                idFile={audio.id}
                typeFile={TypeContentEnum.audios}
                afterComment={handleAfterComment}
              />
            </BottomSheetView>
          </BottomSheetModal>

          {/* ✅ BOTTOMSHEET MENU OPTIONS */}
          <BottomSheetModal
            ref={optionsSheetRef}
            index={0}
            snapPoints={['30%']}
            backgroundStyle={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
            backdropComponent={renderBackdrop}>
            <BottomSheetView style={{padding: 20}}>
              <TouchableOpacity
                onPress={() => {
                  optionsSheetRef.current?.dismiss();
                  navigation.navigate('HistoricalAudiosScreen');
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}>
                <Feather name="clock" size={20} color={colors.primary} />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 16,
                    fontWeight: '500',
                    color: colors.primary,
                  }}>
                  Historique des audios
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  optionsSheetRef.current?.dismiss();
                  showToast('Fonctionnalité Favoris bientôt disponible');
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}>
                <Feather name="star" size={20} color={colors.gris} />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 16,
                    fontWeight: '500',
                    color: colors.gris,
                  }}>
                  Favoris
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  optionsSheetRef.current?.dismiss();
                  showToast('Fonctionnalité Audios masqués bientôt disponible');
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}>
                <Feather name="eye-off" size={20} color={colors.gris} />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 16,
                    fontWeight: '500',
                    color: colors.gris,
                  }}>
                  Audios masqués
                </Text>
              </TouchableOpacity>
            </BottomSheetView>
          </BottomSheetModal>
        </ImageBackground>
        {toastMessage !== '' && (
          <View
            style={{
              position: 'absolute',
              bottom: 40,
              left: 20,
              right: 20,
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', fontSize: 14}}>{toastMessage}</Text>
          </View>
        )}
      </View>
    </BottomSheetModalProvider>
  );
}
