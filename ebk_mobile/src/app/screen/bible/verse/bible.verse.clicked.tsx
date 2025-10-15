import React, {useRef} from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import colors from '../../../../components/style/colors';
import {selectBibleStore} from '../../../store/bible/bible.slice';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import {front_url} from '../../../api';
import {groupConsecutiveVerses} from '../../../config/func';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Toast} from '../../../../components/toast';

type Props = {
  verseTextSelected: {id: number; text: string}[];
  navigation: any;
};

function BibleVerserClickedModal(props: Props) {
  const {navigation} = props;
  const isDarkMode = useColorScheme() === 'dark';
  const bibleStore = useAppSelector(selectBibleStore);
  const {bookSelected, chapterSelected, version} = bibleStore;
  const {theme} = bibleStore.font;
  const dispatch = useAppDispatch();
  const toastRef = useRef<any>({});

  const handelCopyVerseText = () => {
    const verse = props.verseTextSelected
      .sort((a, b) => a.id - b.id)
      .map(item => item.text)
      .join(' ');
    const link = `${front_url}bible/${
      bookSelected.Numero
    }/${chapterSelected}?verse=${groupConsecutiveVerses(
      props.verseTextSelected,
      '_',
    )}&version=${version}`;
    const ref = `${
      bookSelected.Nom
    } ${chapterSelected}:${groupConsecutiveVerses(
      props.verseTextSelected,
    )} ${version}`;
    const copyVerseText = `« ${verse} » \n ${ref} \n ${link}`;
    console.log(copyVerseText);

    Clipboard.setString(copyVerseText);
    toastRef.current.show({
      title: 'Copie du verset',
      description: ref,
      type: 'success',
    });
  };

  const handelSaveNote = () => {
    console.log('verseTextSelected', props.verseTextSelected);
    console.log(bibleStore.bookSelected);
    console.log(bibleStore.chapterSelected);
    console.log(bibleStore.version);
    navigation.navigate('CreateNoteVerseBibleScreen', {
      version,
      book: bookSelected,
      chapter: chapterSelected,
      verse: props.verseTextSelected,
      action: 'created',
      uuid: null,
    });
  };

  const handleShareVerseSelected = async () => {
    const verse = props.verseTextSelected
      .sort((a, b) => a.id - b.id)
      .map(item => item.text)
      .join(' ');
    const link = `${front_url}bible/${
      bookSelected.Numero
    }/${chapterSelected}?verse=${groupConsecutiveVerses(
      props.verseTextSelected,
      '_',
    )}&version=${version}`;
    const ref = `${
      bookSelected.Nom
    } ${chapterSelected}:${groupConsecutiveVerses(
      props.verseTextSelected,
    )} ${version}`;
    const copyVerseText = `« ${verse} » \n ${ref} \n ${link}`;
    try {
      const result = await Share.share({message: copyVerseText});
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const handlCreateImageByVeserSelected = () => {
    navigation.navigate('ImageBibleSelectorScreen', {
      verseTextSelected: props.verseTextSelected,
    });
  };

  const option = [
    {
      icon: 'edit',
      text: 'Note',
      action: handelSaveNote,
    },
    {
      icon: 'copy',
      text: 'Copier',
      action: handelCopyVerseText,
    },
    {
      icon: 'upload',
      text: 'Partager',
      action: handleShareVerseSelected,
    },
    {
      icon: 'image',
      text: 'Image',
      action: handlCreateImageByVeserSelected,
    },
    {
      icon: 'git-pull-request',
      text: 'Comparer',
      action: handelSaveNote,
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        gap: 10,
        backgroundColor: theme.background,
      }}>
      <Text
        style={{fontWeight: 'bold', color: theme.color, textAlign: 'center'}}>
        Sélectionné: {bookSelected.Nom} {chapterSelected}:
        {groupConsecutiveVerses(props.verseTextSelected)} {version}
      </Text>
      {Platform.OS === 'android' ? (
        <BottomSheetScrollView
          horizontal
          showsHorizontalScrollIndicator={false}>
          {option.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={item.action}
                style={[
                  style(isDarkMode).btn,
                  {backgroundColor: colors.black},
                ]}>
                <Feather name={item.icon} size={20} color={colors.white} />
                <Text style={style(isDarkMode).btnText}>{item.text}</Text>
              </TouchableOpacity>
            );
          })}
        </BottomSheetScrollView>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {option.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={item.action}
                style={[
                  style(isDarkMode).btn,
                  {backgroundColor: colors.black},
                ]}>
                <Feather name={item.icon} size={20} color={colors.white} />
                <Text style={style(isDarkMode).btnText}>{item.text}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
      <Toast ref={toastRef} />
    </View>
  );
}

const style = (isDarkMode = true) =>
  StyleSheet.create({
    btn: {
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5,
      height: 60,
      paddingHorizontal: 15,
      gap: 4,
    },
    btnText: {
      color: colors.white,
      fontSize: 12,
    },
  });

export default BibleVerserClickedModal;
