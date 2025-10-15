import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import BibleHeader from './bible.header';
import {selectBibleStore} from '../../store/bible/bible.slice';
import {useAppSelector} from '../../store/hooks';
import {
  FlatList,
  ScrollView,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';
import {getChapter} from '../../api/bible/bible.json.api';
import colors from '../../../components/style/colors';
import ReadTextVerser, {ReadTextVerserRender} from './verse/readTextVerse';
import Loading from '../../../components/loading';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import BibleParamsModal from './bible.params.modal';
import BibleVerserClickedModal from './verse/bible.verse.clicked';
import Feather from 'react-native-vector-icons/Feather';

interface BibleViewerProps {
  navigation: any;
}
export type BottomSheetOpendedByType = 'bibleParams' | 'VerseClicked';

const formatVerses = (verses: string[]) =>
  verses.reduce((acc, v) => acc + v, '');

const BibleViewer = ({navigation}: BibleViewerProps) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verses, setVerses] = useState<any[]>([]);
  const [verseTextSelected, setVerseTextSelected] = useState<
    {id: number; text: string}[]
  >([]);
  const [bottomSheetOpendedBy, setBottomSheetOpendedBy] =
    useState<BottomSheetOpendedByType>('bibleParams');
  const dispatch = useDispatch();

  const bible = useAppSelector(selectBibleStore);
  const {
    bookSelected,
    chapterSelected,
    verseSelected,
    version,
    focusVerses,
    font,
  } = bible;
  const {theme, size, content, textAlign} = font;
  const isDarkMode = useColorScheme() === 'dark';

  const snapPoints = React.useMemo(() => ['30%', '50%', '70%', '100%'], []);
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);

  const handleCloseBottomSheetPress = () => bottomSheetRef?.current?.close();

  const handlePresentModalPress = React.useCallback(
    (opendedBy: BottomSheetOpendedByType) => {
      if (opendedBy !== bottomSheetOpendedBy) {
        handleCloseBottomSheetPress();
      }
      setBottomSheetOpendedBy(opendedBy);
      bottomSheetRef.current?.present();
    },
    [bottomSheetOpendedBy],
  );

  const handleSheetChanges = React.useCallback((index: number) => {
    if (index === -1) {
      setBottomSheetOpendedBy('bibleParams');
    }
  }, []);

  useEffect(() => {
    loadVerses();
  }, [bookSelected, chapterSelected, version]);

  const loadVerses = async () => {
    setIsLoading(true);
    try {
      const versesToLoad = await getChapter(
        version.toString(),
        bookSelected.Numero.toString(),
        chapterSelected.toString(),
      );
      setVerses(versesToLoad);
      setError(false);
    } catch {
      setError(true);
    }
    setIsLoading(false);
  };

  return (
    <BottomSheetModalProvider>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        {/* ✅ Header customisé mais garde toute la logique BibleHeader */}
        <View
          style={{
            height: 55,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            backgroundColor: '#fff',
            elevation: 4,
          }}>
          {/* Bouton menu drawer */}
          {/* <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Feather name="menu" size={26} color="#000" />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={26} color="#000" />
          </TouchableOpacity>

          {/* ⚡ Ici on garde le composant BibleHeader pour ses fonctionnalités */}
          <BibleHeader
            navigation={navigation}
            onBibleParamsClick={handlePresentModalPress}
            verseFormatted={
              focusVerses ? formatVerses(focusVerses) : verseSelected.toString()
            }
            version={version}
            bookName={bookSelected.Nom}
            chapter={chapterSelected}
            hasBackButton={false}
            bottomSheetOpendedBy={bottomSheetOpendedBy}
          />

          {/* Bouton paramètres police (Aa) */}
          <TouchableOpacity
            onPress={() => handlePresentModalPress('bibleParams')}>
            <Feather name="type" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* ✅ Contenu */}
        {error && (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{textAlign: 'center'}}>
              {`Désolé ! Une erreur est survenue: \n Ce chapitre n'existe pas dans cette version.\n Si vous êtes en mode parallèle, désactivez la version concernée.`}
            </Text>
          </View>
        )}
        {isLoading && <Loading />}
        {!error && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{flex: 1, marginHorizontal: 20}}>
            {content == 'ligne' ? (
              <FlatList
                data={verses}
                keyExtractor={(_, i) => i.toString()}
                style={{paddingBottom: 120}}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <ReadTextVerser
                    id={item.id}
                    text={item.text}
                    chapter={item.chapter}
                    fontSize={size}
                    color={theme.color}
                    background={theme.background}
                    bold={'bold'}
                    textAlign={textAlign}
                    handlePresentModalPress={handlePresentModalPress}
                    verseTextSelected={verseTextSelected}
                    setVerseTextSelected={setVerseTextSelected}
                    handleCloseBottomSheetPress={handleCloseBottomSheetPress}
                  />
                )}
              />
            ) : (
              <ReadTextVerserRender
                id={0}
                text={''}
                chapter={1}
                fontSize={size}
                color={theme.color}
                background={theme.background}
                bold={'bold'}
                textAlign={textAlign}
                textChapter={verses}
                handlePresentModalPress={handlePresentModalPress}
                verseTextSelected={verseTextSelected}
                setVerseTextSelected={setVerseTextSelected}
                handleCloseBottomSheetPress={handleCloseBottomSheetPress}
              />
            )}
            <View style={{height: 200}} />
          </ScrollView>
        )}

        {/* ✅ BottomSheet params / verset cliqué */}
        <BottomSheetModal
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          snapPoints={
            bottomSheetOpendedBy === 'bibleParams' ? snapPoints : [snapPoints[0]]
          }
          index={bottomSheetOpendedBy === 'bibleParams' ? 2 : 0}
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
              paddingBottom: 100,
            }}>
            <View style={{flex: 1}}>
              {bottomSheetOpendedBy === 'bibleParams' && <BibleParamsModal />}
              {bottomSheetOpendedBy === 'VerseClicked' && (
                <BibleVerserClickedModal
                  navigation={navigation}
                  verseTextSelected={verseTextSelected}
                />
              )}
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default BibleViewer;
