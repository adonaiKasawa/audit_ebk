import React, {useEffect, useRef, useState} from 'react';
import {
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
  setNoteCreated,
  setUpdateNote,
  StateBible,
} from '../../store/bible/bible.slice';
import Feather from 'react-native-vector-icons/Feather';
import {front_url} from '../../api';
import {groupConsecutiveVerses} from '../../config/func';

import LoadingGif from '../../../components/loading/loadingGif';
import {ScrollView} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import {Toast} from '../../../components/toast';
import {Book} from '../../helpers/assets/bible_versions/books-desc';

const CreateNoteVerseBibleScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {
    version,
    book,
    chapter,
    verse,
    action,
    uuid,
  }: {
    version: string | number;
    book: Book;
    chapter: number;
    verse: {id: number; text: string}[];
    action: 'created' | 'updated';
    uuid: string | null;
  } = route.params;
  const bible = useAppSelector(selectBibleStore);
  const dispatch = useAppDispatch();
  const {font, noteCreated} = bible;
  const {theme, textAlign, size} = font;
  const isDarkMode = useColorScheme() === 'dark';

  const [isLoading, setIsLoading] = React.useState(false);
  const [savingState, setSavingState] = useState<'none' | 'saving' | 'saved'>(
    'none',
  );
  const [description, setDescription] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [note, setNote] = useState<StateBible['noteCreated'][0]>();
  const newUUID = uuidv4();
  const toastRef = useRef<any>({});

  const verset = verse
    .sort((a, b) => a.id - b.id)
    .map(item => item.text)
    .join(' ');
  const ref = `${book.Nom} ${chapter}:${groupConsecutiveVerses(
    verse,
  )} ${version}`;

  const handleCancel = () => {
    navigation.goBack();
  };

  const handelSaveNote = () => {
    setSavingState('saving');
    dispatch(
      setNoteCreated({
        uuid: newUUID,
        verse: verse,
        chapter: chapter,
        book: book,
        version: version,
        title: title,
        description: description,
      }),
    );
    setSavingState('saved');
    toastRef.current.show({
      title: 'Copie du verset',
      description: ref,
      type: 'success',
    });
    navigation.navigate('BibleNoteListScreen');
  };

  const handleUpdateNote = () => {
    setSavingState('saving');
    if (uuid !== null) {
      dispatch(
        setUpdateNote({
          uuid: uuid,
          verse: verse,
          chapter: chapter,
          book: book,
          version: version,
          title: title,
          description: description,
        }),
      );
      setSavingState('saved');
      toastRef.current.show({
        title: 'La modification se bien passer',
        description: ref,
        type: 'success',
      });
    }
  };

  useEffect(() => {
    if (action === 'updated') {
      const findNote = noteCreated.find(item => item.uuid === uuid);
      if (findNote) {
        setNote(findNote);
        setTitle(findNote.title);
        setDescription(findNote.description);
      }
    }
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
        <Text style={{color: theme.color, fontSize: 20, fontWeight: 'bold'}}>
          Note
        </Text>
        {savingState === 'none' && (
          <TouchableOpacity
            disabled={title === ''}
            onPress={action === 'updated' ? handleUpdateNote : handelSaveNote}
            style={{
              backgroundColor: title === '' ? colors.blackrgba4 : colors.black,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
              borderRadius: 25,
              paddingVertical: 10,
            }}>
            <Text
              style={{
                color: title === '' ? colors.gris : colors.white,
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              {action === 'updated' ? 'Modifier' : 'Enregistrer'}
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
          </View>
        )}
        {savingState === 'saving' && <LoadingGif width={20} height={20} />}
      </View>
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <TextInput
          style={[
            styles(isDarkMode).textInput,
            {height: 70, backgroundColor: theme.color, color: theme.background},
          ]}
          placeholder="Titre"
          placeholderTextColor={colors.gris}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          multiline
          numberOfLines={4}
          style={[
            styles(isDarkMode).textInput,
            {
              height: 200,
              backgroundColor: theme.color,
              color: theme.background,
            },
          ]}
          placeholder="Déscription"
          placeholderTextColor={colors.gris}
          value={description}
          onChangeText={setDescription}
        />
      </View>
      <View style={{flex: 1, height: 'auto', paddingHorizontal: 10}}>
        <Text
          style={{
            textAlign,
            color: theme.color,
            fontSize: 16,
            fontWeight: 'bold',
          }}>
          {ref}
        </Text>
        <View
          style={{
            width: 'auto',
            height: 5,
            backgroundColor: theme.color,
            borderRadius: 50,
          }}
        />
        <ScrollView>
          <Text
            style={{
              textAlign,
              color: theme.color,
              fontSize: size,
              lineHeight: size ? size * 1.5 : 40,
              marginVertical: 5,
              fontWeight: 300,
            }}>
            {verset}
          </Text>
        </ScrollView>
      </View>
      <Toast ref={toastRef} />
    </View>
  );
};

const styles = (isDarkMode: boolean = true) =>
  StyleSheet.create({
    topPart: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleTop: {
      color: isDarkMode ? colors.white : colors.primary,
      fontSize: Platform.OS === 'android' ? 25 : 30,
      fontWeight: 'bold',
    },
    description: {
      color: colors.gris,
      fontSize: 12,
      textAlign: 'center',
      paddingHorizontal: 10,
    },
    bottomPart: {
      flex: 3,
      backgroundColor: isDarkMode ? colors.white : colors.primary,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      paddingHorizontal: 10,
      paddingTop: 30,
      gap: 15,
    },
    textInput: {
      backgroundColor: isDarkMode ? colors.secondary : colors.white,
      height: 50,
      borderRadius: 14,
      paddingHorizontal: 10,
      marginVertical: 10,
      color: isDarkMode ? colors.white : colors.primary,
    },
    submitBtn: {
      backgroundColor: isDarkMode ? colors.primary : colors.light,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 15,
      borderRadius: 25,
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 5,
      alignContent: 'center',
    },
    textPrivacy: {
      fontWeight: 'bold',
      color: isDarkMode ? colors.black : colors.white,
    },
  });
export default CreateNoteVerseBibleScreen;
