import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import colors from '../../../components/style/colors';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  selectBibleStore,
  setDeleteNote,
  setNoteCreated,
  StateBible,
} from '../../store/bible/bible.slice';
import {groupConsecutiveVerses} from '../../config/func';
import {Toast} from '../../../components/toast';
import {getChapter, getVersesRange} from '../../api/bible/bible.json.api';
import Feather from 'react-native-vector-icons/Feather';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Clipboard from '@react-native-clipboard/clipboard';
import {front_url} from '../../api';

const BibleNoteListScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const bible = useAppSelector(selectBibleStore);
  const dispatch = useAppDispatch();
  const {font, noteCreated} = bible;
  const {theme} = font;
  const isDarkMode = useColorScheme() === 'dark';
  const reversedArrayNote = noteCreated.slice().reverse();
  const [isLoading, setIsLoading] = useState(false);
  const [noteSelected, setNoteSelected] =
    useState<StateBible['noteCreated'][0]>();

  const toastRef = useRef<any>({});

  const snapPoints = React.useMemo(() => ['30%', '50%', '70%', '100%'], []);

  const bottomSheetRef = React.useRef<BottomSheetModal>(null);

  const handleCloseBottomSheetPress = () => bottomSheetRef?.current?.close();
  const handleOpenPress = () => bottomSheetRef?.current?.expand();
  const handleCallapsePress = () => bottomSheetRef?.current?.collapse();

  const handlePresentModalPress = (item: StateBible['noteCreated'][0]) => {
    bottomSheetRef.current?.present();
    setNoteSelected(item);
  };

  const handelCopyVerseText = () => {
    if (noteSelected) {
      const verse = noteSelected.verse
        .sort((a, b) => a.id - b.id)
        .map(item => item.text)
        .join(' ');
      const link = `${front_url}bible/${noteSelected.book.Numero}/${
        noteSelected.chapter
      }?verse=${groupConsecutiveVerses(noteSelected.verse, '_')}&version=${
        noteSelected.version
      }`;
      const ref = `${noteSelected.book.Nom} ${
        noteSelected.chapter
      }:${groupConsecutiveVerses(noteSelected.verse)} ${noteSelected.version}`;
      const copyVerseText = `« ${verse} » \n ${ref} \n ${link}`;
      console.log(copyVerseText);

      Clipboard.setString(copyVerseText);
      toastRef.current.show({
        title: 'Copie du verset',
        description: ref,
        type: 'success',
      });
    } else {
      toastRef.current.show({
        title: 'Erreur de Copie',
        description: 'Impossible de copier',
        type: 'error',
      });
    }
  };
  const handelUpdateNote = () => {
    if (noteSelected) {
      navigation.navigate('CreateNoteVerseBibleScreen', {
        ...noteSelected,
        action: 'updated',
      });
    }
  };

  const handelDeleteNote = () => {
    if (noteSelected) {
      dispatch(setDeleteNote({uuid: noteSelected?.uuid}));
      handleCloseBottomSheetPress();
    } else {
      toastRef.current.show({
        title: 'Impossible  de suppresion',
        description: 'Erreur de suppresion de la note ',
        type: 'error',
      });
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  useEffect(() => {
    // console.log(reversedArrayNote);
  }, []);

  return (
    <BottomSheetModalProvider>
      <View style={{backgroundColor: theme.background, flex: 1}}>
        <View
          style={{
            height: 50,
            alignItems: 'center',
            marginHorizontal: 5,
            marginBottom: 5,
          }}>
          <Text
            style={{
              color: theme.color,
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Note
          </Text>
        </View>
        <View style={{flex: 1, paddingHorizontal: 10}}>
          <FlatList
            data={reversedArrayNote}
            keyExtractor={i => i.uuid}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <RenderItemText
                note={item}
                handlePresentModalPress={handlePresentModalPress}
              />
            )}
          />
        </View>
        <BottomSheetModal
          ref={bottomSheetRef}
          onChange={i => {}}
          snapPoints={[snapPoints[0]]}
          index={0}
          style={{
            paddingBottom: 200,
          }}
          handleStyle={{
            backgroundColor: theme.background,
            opacity: 0.9,
          }}
          handleIndicatorStyle={{
            backgroundColor: colors.gris,
          }}>
          <BottomSheetView
            style={{
              flex: 1,
              backgroundColor: theme.background,
              opacity: 0.9,
            }}>
            <View style={{flex: 1, justifyContent: 'space-between'}}>
              {noteSelected && (
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: theme.color,
                    textAlign: 'center',
                  }}>{`${noteSelected.book.Nom} ${
                  noteSelected.chapter
                }:${groupConsecutiveVerses(noteSelected.verse)} ${
                  noteSelected.version
                }`}</Text>
              )}
              <TouchableOpacity
                onPress={handelCopyVerseText}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomColor: colors.gris,
                  borderBottomWidth: 1,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 17,
                    color: theme.color,
                  }}>
                  Copier
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handelUpdateNote}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomColor: colors.gris,
                  borderBottomWidth: 1,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 17,
                    color: theme.color,
                  }}>
                  Modifier
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handelDeleteNote}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomColor: colors.gris,
                  borderBottomWidth: 1,
                }}>
                <Text
                  style={{color: colors.red, fontWeight: 'bold', fontSize: 17}}>
                  Supprimer
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
        <Toast ref={toastRef} />
      </View>
    </BottomSheetModalProvider>
  );
};

const RenderItemText = ({
  note,
  handlePresentModalPress,
}: {
  note: StateBible['noteCreated'][0];
  handlePresentModalPress: (item: StateBible['noteCreated'][0]) => void;
}) => {
  const {uuid, version, book, chapter, verse, title, description} = note;
  const bible = useAppSelector(selectBibleStore);
  const dispatch = useAppDispatch();
  const {theme} = bible.font;
  const [verset, seVerset] = useState<
    {
      id: number;
      chapter: string;
      text: string;
    }[]
  >([]);

  const handelLoadNote = async (
    version: string | number,
    book: number,
    chapter: number,
    startVerse: number,
    endVerse: number,
  ) => {
    const versesToLoad = await getVersesRange(
      version.toString(),
      book.toString(),
      chapter.toString(),
      startVerse,
      endVerse,
    );
    console.log('versesToLoad', versesToLoad);
    seVerset(versesToLoad);
  };

  useEffect(() => {
    handelLoadNote(
      version,
      book.Numero,
      chapter,
      verse[0].id,
      verse[verse.length - 1].id,
    );
  }, []);

  const ref = `${book.Nom} ${chapter}:${groupConsecutiveVerses(
    verse,
  )} ${version}`;

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: theme.background,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.gris,
        marginVertical: 5,
        padding: 10,
      }}>
      <Text style={{fontSize: 17, fontWeight: 'bold', color: theme.color}}>
        {title}
      </Text>
      <Text style={{fontSize: 15, fontWeight: 'bold', color: colors.gris}}>
        {ref}
      </Text>
      {verset && verset.length > 0 && (
        <Text
          style={{color: theme.color}}
          lineBreakMode="tail"
          numberOfLines={3}>
          {verset[0].text}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => {
          handlePresentModalPress(note);
        }}
        style={{marginHorizontal: 10, alignSelf: 'flex-end'}}>
        <Feather name="more-horizontal" color={theme.color} size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default BibleNoteListScreen;
