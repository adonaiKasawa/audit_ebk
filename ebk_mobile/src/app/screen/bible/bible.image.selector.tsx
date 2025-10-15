import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import colors from '../../../components/style/colors';
import {useAppSelector} from '../../store/hooks';
import {selectBibleStore} from '../../store/bible/bible.slice';
import Feather from 'react-native-vector-icons/Feather';
import {findListImageBible} from '../../api/bible/bible.req';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {api_url} from '../../api';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

const ImageBibleSelectorScreen = ({navigation, route}: any) => {
  const isDarkMode = useColorScheme() === 'dark';
  const bible = useAppSelector(selectBibleStore);
  const {font} = bible;
  const {theme} = font;
  const {width} = Dimensions.get('screen');
  const [listImage, setListImage] = useState<string[]>([]);
  const [imageSelected, setImageSelected] = useState<string>('');
  const [step, setStep] = useState<'selectedImage' | 'createdImage'>(
    'selectedImage',
  );

  const verseTextSelected: {id: number; text: string}[] =
    route.params.verseTextSelected;
  const snapPoints = useMemo(() => ['70%', '100%'], []);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback((imageLink: string) => {
    setImageSelected(imageLink);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    if (index === -1) {
      setStep('selectedImage');
    }
  }, []);

  const handelFindListImageBible = async () => {
    const find = await findListImageBible();
    if (find?.status === 200) {
      console.log(find.data);
      setListImage(find.data);
    }
  };

  useEffect(() => {
    handelFindListImageBible();
  }, []);

  return (
    <View style={{backgroundColor: theme.background, flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
          marginHorizontal: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Feather name="arrow-left" size={24} color={theme.color} />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text style={{color: theme.color, textAlign: 'center', fontSize: 20}}>
            Choisir une image
          </Text>
        </View>
      </View>
      <BottomSheetModalProvider>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <FlatList
            data={listImage}
            numColumns={3}
            keyExtractor={i => i}
            renderItem={({item, index}) => {
              const link = `${api_url}bible/image/${item}`;
              return (
                <TouchableOpacity
                  onPress={() => {
                    handlePresentModalPress(link);
                  }}
                  style={{margin: 2.5}}>
                  <Image
                    source={{uri: link}}
                    alt={`listImage${index}`}
                    resizeMode="cover"
                    style={{
                      width: width / 3 - 5,
                    }}
                    height={width / 3 - 5}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
          snapPoints={snapPoints}
          index={step === 'createdImage' ? 1 : 0}
          handleStyle={{
            backgroundColor: theme.background,
            opacity: 0.9,
          }}
          handleIndicatorStyle={{
            backgroundColor: colors.gris,
          }}>
          <BottomSheetView style={styles(theme).contentContainer}>
            {/* {step === "selectedImage" && */}
            <View>
              <Image
                source={{uri: imageSelected}}
                alt={`listImage${imageSelected}`}
                resizeMode="cover"
                style={{
                  width: width - 20,
                  borderRadius: 10,
                }}
                height={width - 20}
              />
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('CreateImageVerseBibleScreen', {
                    verseTextSelected,
                    imageSelected,
                  });
                }}
                style={styles(theme).btnproceed}>
                <Text style={{color: colors.white, fontSize: 17}}>
                  Continuer
                </Text>
              </TouchableOpacity>
            </View>
            {/* {step === "createdImage" && <CreateImageVerseBible navigation={navigation} imageSelected={imageSelected} verseTextSelected={verseTextSelected} />} */}
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
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

export default ImageBibleSelectorScreen;
