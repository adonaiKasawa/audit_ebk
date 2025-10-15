import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import colors from '../../style/colors';
import {file_url} from '../../../app/api';
import moment from 'moment';
import FastImage from 'react-native-fast-image';

// const {width, height} = Dimensions.get('screen');
const {width} = Dimensions.get('screen');

export default function CardBooksUI({livres, navigation}: any) {
  const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  // };

  const handelGoToReaderBook = () => {
    navigation.navigate('BooksPlayer', {
      book: livres,
    });
  };

  return (
    <TouchableOpacity
      onPress={handelGoToReaderBook}
      style={style(isDarkMode).card_contenair}>
      <View style={style(isDarkMode).card_contenair_view}>
        <View>
          <FastImage
            source={{
              uri: `${file_url}${livres.photo}`,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable, // ou web selon ton serveur
            }}
            style={{
              width: width / 2 - 30,
              height: 159,
              borderRadius: 20,
            }}
            // resizeMode="cover"
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View style={style(isDarkMode).card_description}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <FastImage
              source={{
                uri: `${file_url}${livres.eglise.photo_eglise}`,
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable,
              }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 10,
              }}
              // resizeMode="cover"
              resizeMode={FastImage.resizeMode.cover}
            />
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={style(isDarkMode).card_video_detail}>
              {livres.eglise.nom_eglise}
            </Text>
          </View>
          <View>
            <Text
              ellipsizeMode="tail"
              numberOfLines={2}
              style={style(isDarkMode).card_video_title}>
              {livres.titre}
            </Text>
            <Text style={style(isDarkMode).card_video_detail}>
              {moment(livres.createdAt).fromNow()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const style = (dark: boolean = true) =>
  StyleSheet.create({
    card_contenair: {
      height: 280,
      width: width / 2,
      padding: 5,
      marginBottom: 10,
    },
    card_contenair_view: {
      height: 280,
      borderWidth: 0.5,
      borderColor: colors.gris,
      borderRadius: 20,
      padding: 10,
    },

    card_miniature_img: {
      height: 107,
      width: 106,
    },

    card_description: {
      width: width / 2 - 30,
      height: 100,
      overflow: 'hidden',
      marginTop: 5,
    },
    card_video_title: {
      color: dark ? colors.light : colors.primary,
      alignSelf: 'stretch',
      overflow: 'hidden',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '500',
      flexWrap: 'wrap',
    },
    card_video_detail: {
      color: colors.gris,
      fontSize: 14,
    },
  });
