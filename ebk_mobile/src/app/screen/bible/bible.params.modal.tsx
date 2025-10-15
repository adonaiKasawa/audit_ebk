import React from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import colors from '../../../components/style/colors';
import {
  selectBibleStore,
  setBibleAlignText,
  setBibleFontSize,
  setBibleModeContent,
  setBibleTheme,
  Theme,
} from '../../store/bible/bible.slice';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import Feather from 'react-native-vector-icons/Feather';

function BibleParamsModal() {
  const isDarkMode = useColorScheme() === 'dark';
  const bibleStore = useAppSelector(selectBibleStore);
  const dispatch = useAppDispatch();

  const {theme, size, content} = bibleStore.font;

  const handleChangeTheme = (item: {background: string; color: string}) => {
    dispatch(setBibleTheme(item));
  };

  const handleChangeSize = (add: boolean = true) => {
    if (add) {
      if (size < 45) {
        dispatch(setBibleFontSize(size + 5));
      }
    } else {
      if (size > 15) {
        dispatch(setBibleFontSize(size - 5));
      }
    }
  };
  const handleChangeModeLign = (lign: 'ligne' | 'continu') => {
    dispatch(setBibleModeContent(lign));
  };
  const handleChangeAlignText = (
    align: 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined,
  ) => {
    dispatch(setBibleAlignText(align));
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        gap: 20,
        backgroundColor: theme.background,
      }}>
      <View style={{gap: 10}}>
        <Text style={{color: theme.color, fontSize: 15}}>
          Taile de la police : {size}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            gap: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              handleChangeSize(false);
            }}
            style={style(isDarkMode).btnSizeText}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontWeight: '400',
                color: isDarkMode ? colors.white : colors.primary,
              }}>
              A
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleChangeSize();
            }}
            style={style(isDarkMode).btnSizeText}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 30,
                fontWeight: 'bold',
                color: isDarkMode ? colors.white : colors.primary,
              }}>
              A
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{width: 'auto', height: Platform.OS === 'ios' ? 120 : 'auto'}}>
        <FlatList
          data={Theme}
          horizontal={Platform.OS === 'ios' ? true : false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.background}
          numColumns={Platform.OS === 'android' ? 4 : 1}
          renderItem={({item, index}) => (
            <TouchableOpacity
              key={index}
              style={[
                style(isDarkMode).btnTheme,
                {backgroundColor: item.background},
              ]}
              onPress={() => {
                handleChangeTheme(item);
              }}>
              <View>
                <View
                  style={{
                    backgroundColor: item.color,
                    width: 50,
                    height: 2,
                    marginBottom: 8,
                  }}
                />
                <View
                  style={{
                    backgroundColor: item.color,
                    width: 45,
                    height: 2,
                    marginBottom: 8,
                  }}
                />
                <View
                  style={{
                    backgroundColor: item.color,
                    width: 40,
                    height: 2,
                    marginBottom: 8,
                  }}
                />
                <View
                  style={{
                    backgroundColor: item.color,
                    width: 35,
                    height: 2,
                    marginBottom: 8,
                  }}
                />
                <View
                  style={{
                    backgroundColor: item.color,
                    width: 30,
                    height: 2,
                    marginBottom: 8,
                  }}
                />
                <View
                  style={{
                    backgroundColor: item.color,
                    width: 25,
                    height: 2,
                    marginBottom: 8,
                  }}
                />
              </View>
              <BouncyCheckbox
                isChecked={item.background === theme.background}
                style={{width: 25}}
                onPress={(isChecked: boolean) => {}}
              />
            </TouchableOpacity>
          )}
        />
      </View>

      <View
        style={{flexDirection: 'row', justifyContent: 'space-around', gap: 20}}>
        <TouchableOpacity
          onPress={() => {
            handleChangeModeLign('ligne');
          }}
          style={style(isDarkMode).btnSizeText}>
          <Feather
            name="list"
            size={24}
            color={isDarkMode ? colors.white : colors.black}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleChangeModeLign('continu');
          }}
          style={style(isDarkMode).btnSizeText}>
          <Feather
            name="menu"
            size={24}
            color={isDarkMode ? colors.white : colors.black}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{flexDirection: 'row', justifyContent: 'space-around', gap: 20}}>
        <TouchableOpacity
          onPress={() => {
            handleChangeAlignText('center');
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            backgroundColor: isDarkMode ? colors.secondary : colors.light,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Feather
            name="align-center"
            size={24}
            color={isDarkMode ? colors.white : colors.black}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleChangeAlignText('justify');
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            backgroundColor: isDarkMode ? colors.secondary : colors.light,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Feather
            name="align-justify"
            size={24}
            color={isDarkMode ? colors.white : colors.black}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleChangeAlignText('left');
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            backgroundColor: isDarkMode ? colors.secondary : colors.light,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Feather
            name="align-left"
            size={24}
            color={isDarkMode ? colors.white : colors.black}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleChangeAlignText('right');
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            backgroundColor: isDarkMode ? colors.secondary : colors.light,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Feather
            name="align-right"
            size={24}
            color={isDarkMode ? colors.white : colors.black}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const style = (isDarkMode = true) =>
  StyleSheet.create({
    btnSizeText: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: isDarkMode ? colors.secondary : colors.light,
      width: '50%',
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnTheme: {
      width: 70,
      height: 105,
      borderRadius: 16,
      margin: 5,
      paddingTop: 10,
      alignItems: 'center',
      gap: 5,
    },
  });

export default BibleParamsModal;
