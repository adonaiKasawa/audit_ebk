import React, {useState} from 'react';
import BibleSelectTabBar from './bible.select.tabbar';
import BookSelector from './book.selector';
import ChapterSelector from './chapter.selector';
import {Text, TouchableOpacity, useColorScheme, View} from 'react-native';
import VerseSelector from './verse.selector';
import colors from '../../../components/style/colors';
import Feather from 'react-native-vector-icons/Feather';

const BibleSelectScreen = ({navigation}: any) => {
  const [index, setIndex] = useState(0);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const onComplete = () => {
    // navigation.goBack();
    navigation.navigate('BibleViewer');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundStyle.backgroundColor,
        paddingBottom: 45,
      }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
          paddingHorizontal: 10,
        }}>
        {/* 🔥 Bouton menu pour ouvrir le Drawer */}
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          {/* <Feather
            name="menu"
            size={26}
            color={isDarkMode ? colors.white : colors.primary}
          /> */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={26} color="#000" />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Titre */}
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: isDarkMode ? colors.white : colors.primary,
            }}>
            Références
          </Text>
        </View>
      </View>

      {/* Sélecteurs */}
      <BibleSelectTabBar index={index} onChange={setIndex} />
      {index === 0 && <BookSelector onNavigate={setIndex} />}
      {index === 1 && <ChapterSelector onNavigate={setIndex} />}
      {index === 2 && <VerseSelector onComplete={onComplete} />}
    </View>
  );
};

export default BibleSelectScreen;
