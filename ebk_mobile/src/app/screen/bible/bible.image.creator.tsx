import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import colors from '../../../components/style/colors';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {selectBibleStore} from '../../store/bible/bible.slice';
import Feather from 'react-native-vector-icons/Feather';
import {findFontList} from '../../api/bible/bible.req';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {api_url, front_url} from '../../api';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {formatBytes, groupConsecutiveVerses} from '../../config/func';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {DirectoryTree} from '../../config/interface';
import {downloadFont} from '../../helpers/download/fonts.download';
import {selectDownloadedFonts} from '../../store/fonts/fonts.slice';
import LoadingGif from '../../../components/loading/loadingGif';
import * as RNFS from '@dr.pogodin/react-native-fs';
import ColorPicker, {
  Panel2,
  OpacitySlider,
  returnedResults,
  Panel1,
} from 'reanimated-color-picker';
import ViewShot from 'react-native-view-shot';
import {Alert} from 'react-native';
import {requestSavePermission} from '../../../components/camera/MediaPage';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import path from '../../../components/image/path';

const CreateImageVerseBibleScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {
    imageSelected,
    verseTextSelected,
  }: {verseTextSelected: {id: number; text: string}[]; imageSelected: string} =
    route.params;
  const bible = useAppSelector(selectBibleStore);
  const dispatch = useAppDispatch();
  const {bookSelected, chapterSelected, version, font} = bible;
  const {theme} = font;
  const {width} = Dimensions.get('screen');
  const verse = verseTextSelected
    .sort((a, b) => a.id - b.id)
    .map(item => item.text)
    .join(' ');
  const ref = `${bookSelected.Nom} ${chapterSelected}:${groupConsecutiveVerses(
    verseTextSelected,
  )} ${version}`;
  const link = `${front_url}bible/${
    bookSelected.Numero
  }/${chapterSelected}?verse=${groupConsecutiveVerses(
    verseTextSelected,
    '_',
  )}&version=${version}`;
  const copyVerseText = `« ${verse} » \n ${ref} \n ${link}`;

  const [fileProgress, setFileProgress] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [textAlign, setTextAlign] = useState<
    'center' | 'auto' | 'left' | 'right' | 'justify' | undefined
  >('center');
  const [textColor, setTextColor] = useState<string>(colors.white);
  const [textFontSize, setTextFontSize] = useState<number>(18);
  const [textFontFamily, setTextFontFamily] = useState<string>('');
  const [textFontWeight, setTextFontWeight] =
    useState<TextStyle['fontWeight']>('bold');
  const [fontList, setFontList] = useState<DirectoryTree>([]);
  const {downloadedFonts} = useAppSelector(selectDownloadedFonts);
  const [onDownLoadFont, setOnDownLoadFont] = useState<string>('');
  const [option, setOption] = useState<'font' | 'size' | 'color'>('size');
  const [savingState, setSavingState] = useState<'none' | 'saving' | 'saved'>(
    'none',
  );
  const [pathFileSaved, setPathFileSaved] = useState<string>('');
  const ViewShotref = useRef(null);

  const calculateProgress = (
    {bytesWritten}: RNFS.DownloadProgressCallbackResultT,
    fontFileSize: number,
  ) => {
    const fileProgress = Math.floor((bytesWritten / fontFileSize) * 100) / 100;
    setFileProgress(fileProgress);
  };

  const handleFontDownload = async (
    fontName: string,
    fontUrl: string,
    fontSize: number,
  ) => {
    setIsLoading(true);
    setOnDownLoadFont(fontName);
    const path = await downloadFont(
      fontName,
      fontUrl,
      fontSize,
      dispatch,
      calculateProgress,
    );
    setIsLoading(false);
    if (path) {
      setTextFontFamily(fontName); // Mise à jour de la police sélectionnée
    }
  };

  const handleFindListFont = async () => {
    const find = await findFontList();
    if (find?.status === 200) {
      setFontList(find.data);
    }
  };

  const handelChangeFont = () => {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{}}>
          {fontList.map(item => {
            if (item.type === 'directory') {
              const firstFile = item.contents.find(
                content => content.type === 'file',
              );
              if (firstFile) {
                const fontUrl = `${api_url}fonts/${item.name}/${firstFile.name}`;
                const isDownloaded = downloadedFonts.some(font => {
                  console.log('IS DOWNLOAD', font, firstFile.name);

                  return font === firstFile.name;
                });
                const isSelected =
                  textFontFamily === firstFile.name.replace('.ttf', '');

                return (
                  <TouchableOpacity
                    onPress={() => {
                      isDownloaded
                        ? setTextFontFamily(firstFile.name.replace('.ttf', ''))
                        : null;
                    }}
                    style={{
                      padding: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: 20, color: theme.color}}>
                      {item.name}
                    </Text>
                    {isSelected && (
                      <Feather name="check" size={30} color={theme.color} />
                    )}
                    {!isDownloaded && (
                      <>
                        {isLoading && onDownLoadFont === firstFile.name ? (
                          <LoadingGif
                            width={20}
                            height={20}
                            progress={`${fileProgress}`}
                          />
                        ) : (
                          <TouchableOpacity
                            onPress={() =>
                              handleFontDownload(
                                firstFile.name,
                                fontUrl,
                                firstFile.size,
                              )
                            }
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 4,
                            }}>
                            <View>
                              <Text style={{fontSize: 12, color: theme.color}}>
                                Télécharger
                              </Text>
                              <Text
                                style={{
                                  fontSize: 10,
                                  textAlign: 'right',
                                  color: colors.gris,
                                }}>
                                {formatBytes(firstFile.size)}
                              </Text>
                            </View>
                            <Feather
                              name="download-cloud"
                              size={20}
                              color={theme.color}
                            />
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                );
              }
            }
          })}
        </ScrollView>
      </View>
    );
  };

  const handleChangeSize = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              setTextAlign('left');
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              backgroundColor: colors.black,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Feather name="align-left" size={24} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setTextAlign('center');
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              backgroundColor: colors.black,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Feather name="align-center" size={24} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setTextAlign('right');
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              backgroundColor: colors.black,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Feather name="align-right" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            gap: 10,
            marginTop: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              setTextFontSize(e => (e > 18 ? e - 5 : e));
            }}
            style={{
              width: 100,
              height: 50,
              borderRadius: 10,
              backgroundColor: colors.black,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontWeight: '400',
                color: colors.white,
              }}>
              A
            </Text>
          </TouchableOpacity>
          <Text style={{fontSize: 25, color: theme.color}}>{textFontSize}</Text>
          <TouchableOpacity
            onPress={() => {
              setTextFontSize(e => (e < 40 ? e + 5 : e));
            }}
            style={{
              width: 100,
              height: 50,
              borderRadius: 10,
              backgroundColor: colors.black,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 30,
                fontWeight: 'bold',
                color: colors.white,
              }}>
              A
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const onSelectColor = ({hex}: returnedResults) => {
    // do something with the selected color.
    console.log(hex);
    setTextColor(hex);
  };

  const handleChangeColor = () => {
    return (
      <ScrollView style={{flex: 1, marginVertical: 10}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ColorPicker
            style={{width: '70%', gap: 10}}
            value={colors.white}
            onComplete={onSelectColor}>
            <Panel1 />
            <Panel2 />
            <OpacitySlider />
          </ColorPicker>
        </View>
      </ScrollView>
    );
  };

  const handleShareLocalImage = async () => {
    const localImagePath = `${RNFS.DocumentDirectoryPath}`; // Chemin dans le dossier local
    console.log(localImagePath);

    console.log(pathFileSaved);

    try {
      await Share.share({
        title: "Partager l'image",
        url: pathFileSaved, // Préfixe "file://" nécessaire pour Android
        message: copyVerseText,
      });
    } catch (error) {
      console.error('Erreur lors du partage', error);
    }
  };

  const onSavePressed = useCallback(async () => {
    try {
      setSavingState('saving');
      const hasPermission = await requestSavePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission refusée!',
          `Vision Camera n'a pas l'autorisation d'enregistrer le média dans votre pellicule.`,
        );
        return;
      }
      if (ViewShotref?.current) {
        ViewShotref.current.capture().then(async (uri: string) => {
          console.log('do something with ', uri);
          const saveFile = await CameraRoll.saveAsset(uri, {
            type: 'photo',
            album: 'EcclesiaBooK',
          });
          // console.log(saveFile.node.image.filepath);
          // console.log(saveFile.node.image.uri);
          setPathFileSaved(`${uri}`);
          setSavingState('saved');
        });
      } else {
        throw new Error('not current ref');
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      setSavingState('none');
      Alert.alert(
        'Échec de la sauvegarde!',
        `Une erreur inattendue s'est produite lors de la tentative de sauvegarde de votre photo. ${message}`,
      );
    }
  }, []);

  const onCapture = useCallback((uri: string) => {
    console.log('do something with ', uri);
  }, []);

  const handleCancel = () => {
    Alert.alert(
      "L'image n'a pas été enregistrée",
      "Souhaitez-vous annuler la création de l'image ?",
      [
        {
          text: 'Annuler le modification',
          onPress: () => {
            navigation.goBack();
          },
          style: 'destructive',
        },
        {
          text: 'Continuer le modification',
          onPress: () => {},
          style: 'cancel',
        },
      ],
    );
  };

  useEffect(() => {
    console.log(downloadedFonts);
    handleFindListFont();
  }, []);

  return (
    <View style={{backgroundColor: theme.background, flex: 1}}>
      <View
        style={{
          height: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 5,
          marginBottom: 5,
        }}>
        <TouchableOpacity onPress={handleCancel} style={{padding: 5}}>
          <Text style={{color: theme.color, fontSize: 20}}>Annuler</Text>
        </TouchableOpacity>
        {savingState === 'none' && (
          <TouchableOpacity
            onPress={onSavePressed}
            style={{
              backgroundColor: colors.black,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
              borderRadius: 25,
              paddingVertical: 10,
            }}>
            <Text
              style={{color: colors.white, fontSize: 20, fontWeight: 'bold'}}>
              Enregistrer
            </Text>
          </TouchableOpacity>
        )}
        {savingState === 'saved' && (
          <View
            style={{
              flexDirection: 'row',
              gap: 4,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Feather name="check" size={30} color={theme.color} />
            <TouchableOpacity onPress={handleShareLocalImage} style={{}}>
              <Feather name="share" size={30} color={theme.color} />
            </TouchableOpacity>
          </View>
        )}
        {savingState === 'saving' && <LoadingGif width={20} height={20} />}
      </View>
      <ViewShot
        ref={ViewShotref}
        onCapture={onCapture}
        style={{width: width, height: width}}>
        <ImageBackground
          source={{uri: imageSelected}}
          alt={`listImage${imageSelected}`}
          resizeMode="cover"
          style={{
            width: width,
            height: width,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign,
              color: textColor,
              fontSize: textFontSize,
              fontFamily: textFontFamily,
              fontWeight: textFontWeight,
            }}>
            {verse}
          </Text>
          <Text
            style={{
              textAlign,
              color: textColor,
              fontSize: textFontSize,
              fontFamily: textFontFamily,
              fontWeight: textFontWeight,
            }}>
            {ref}
          </Text>
          <View
            style={{
              position: 'absolute',
              bottom: 5,
              left: 5,
              right: 5,
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={path.LOGOEBK}
                width={50}
                height={50}
                style={{width: 50, height: 50}}
              />
              <Text style={{color: textColor}}>EcclesiaBook</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Image
                  source={path.appstore}
                  width={25}
                  height={25}
                  style={{width: 25, height: 25}}
                />
                <Image
                  source={path.playstore}
                  width={25}
                  height={25}
                  style={{width: 25, height: 25}}
                />
              </View>
              <Text style={{color: textColor}}>
                https://ecclesiabook.org/bible
              </Text>
            </View>
          </View>
        </ImageBackground>
      </ViewShot>
      <View style={{flex: 1}}>
        {option === 'font' && handelChangeFont()}
        {option === 'size' && handleChangeSize()}
        {option === 'color' && handleChangeColor()}
      </View>
      <View
        style={{
          flexDirection: 'row',
          height: 70,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            setOption('font');
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            height: 70,
            borderTopColor: option === 'font' ? theme.color : colors.gris,
            borderTopWidth: option === 'font' ? 2 : 0.5,
          }}>
          <Fontisto name="font" size={17} color={theme.color} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setOption('size');
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            height: 70,
            borderTopColor: option === 'size' ? theme.color : colors.gris,
            borderTopWidth: option === 'size' ? 2 : 0.5,
          }}>
          <Text style={{color: theme.color, fontSize: 17, fontWeight: 'bold'}}>
            Aa
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setOption('color');
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            height: 70,
            borderTopColor: option === 'color' ? theme.color : colors.gris,
            borderTopWidth: option === 'color' ? 2 : 0.5,
          }}>
          <Entypo name="colours" size={17} color={theme.color} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = (theme: {background: string; color: string}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: theme.background,
      opacity: 0.9,
    },
    btnproceed: {
      padding: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.black,
      marginVertical: 20,
      borderRadius: 16,
    },
  });

export default CreateImageVerseBibleScreen;
