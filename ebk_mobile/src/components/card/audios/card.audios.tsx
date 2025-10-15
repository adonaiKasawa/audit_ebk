import React, {useEffect, useRef} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  Animated,
  Easing,
} from 'react-native';
import colors from '../../style/colors';
import {BlurView} from '@react-native-community/blur';
import {file_url} from '../../../app/api';
import {capitalize} from '../../../app/config/func';
import moment from 'moment';
import FastImage from 'react-native-fast-image';

const {width} = Dimensions.get('screen');

export default function CardAudiosUI({
  audios,
  isPlaying = false,
  onPress,
}: any) {
  const isDarkMode = useColorScheme() === 'dark';

  // Barre animée fréquence audio
  const bars = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];

  useEffect(() => {
    if (isPlaying) {
      bars.forEach(bar => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(bar, {
              toValue: Math.random() * 2 + 1,
              duration: 300,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(bar, {
              toValue: 1,
              duration: 300,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      });

      return () => {
        bars.forEach(bar => bar.stopAnimation());
      };
    }
  }, [isPlaying]);

  const AudiosDescriptionView = () => {
    return (
      <View style={{flex: 1, gap: 5}}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={[
            style(isDarkMode).card_video_title,
            isPlaying && {color: '#2196F3', fontWeight: 'bold'},
          ]}>
          {audios.titre?.toUpperCase()}
        </Text>
        <View style={{flexDirection: 'row', gap: 5}}>
          <FastImage
            source={{
              uri: `${file_url}${audios?.eglise.photo_eglise}`,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable, // ou web selon ton serveur
            }}
            style={{width: 30, height: 30, borderRadius: 15}}
            // resizeMode="cover"
            resizeMode={FastImage.resizeMode.cover}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '85%',
            }}>
            <View>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={style(isDarkMode).card_video_detail}>
                {capitalize(audios.eglise.nom_eglise.toLowerCase())}
              </Text>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{color: colors.gris, fontSize: 10}}>
                {moment(audios.createdAt).fromNow()}
              </Text>
            </View>
            {/* <View>
              {isPlaying && (
                <View style={{
                  backgroundColor: '#2196F3',
                  borderRadius: 20,
                  padding: 3,
                }}>
                  <Icon name="play-circle" size={18} color="#FFF" />
                </View>
              )}
            </View> */}
            {isPlaying && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  gap: 2,
                }}>
                {bars.map((bar, index) => (
                  <Animated.View
                    key={index}
                    style={{
                      width: 3,
                      height: 13,
                      marginHorizontal: 1,
                      backgroundColor: '#2196F3',
                      transform: [{scaleY: bar}],
                      borderRadius: 2,
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        style(isDarkMode).card_contenair,
        isPlaying && {borderColor: '#2196F3', borderRadius: 16},
      ]}>
      <View style={style(isDarkMode).card_miniature_img}>
        <FastImage
          source={{
            uri: `${file_url}${audios.photo}`,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable, // ou web selon ton serveur
          }}
          style={{
            height: 107,
            width: 106,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          }}
          // resizeMode="cover"
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>

      {Platform.OS === 'ios' ? (
        <View style={style(isDarkMode).card_description}>
          <FastImage
            source={{
              uri: `${file_url}${audios.photo}`,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable, // ou web selon ton serveur
            }}
            style={{
              width: width - 117,
              height: 79,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              opacity: 0.8,
            }}
            // resizeMode="cover"
            resizeMode={FastImage.resizeMode.cover}
          />
          <BlurView
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: width - 100,
              height: 106,
              position: 'absolute',
              left: 0,
              right: 0,
              paddingHorizontal: 10,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
            }}
            blurType={isDarkMode ? 'dark' : 'light'}
            blurAmount={20}
            reducedTransparencyFallbackColor={
              isDarkMode ? colors.white : colors.black
            }
            blurRadius={20}>
            {AudiosDescriptionView()}
          </BlurView>
        </View>
      ) : (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: width - 115,
            height: 107,
            paddingLeft: 5,
            borderBottomRightRadius: 15,
            borderTopRightRadius: 15,
            backgroundColor: isPlaying
              ? '#E3F2FD'
              : isDarkMode
              ? colors.secondary
              : colors.light,
          }}>
          {AudiosDescriptionView()}
        </View>
      )}
    </TouchableOpacity>
  );
}

const style = (dark: boolean = true) =>
  StyleSheet.create({
    card_contenair: {
      height: 107,
      width: width,
      display: 'flex',
      flexDirection: 'row',
    },
    card_miniature_img: {
      height: 107,
      width: 106,
    },
    card_description: {
      width: width - 100,
      height: 106,
    },
    card_video_title: {
      color: dark ? colors.white : colors.primary,
      alignSelf: 'stretch',
      overflow: 'hidden',
      fontSize: 13,
      fontStyle: 'normal',
      fontWeight: '500',
      flexWrap: 'wrap',
    },
    card_video_detail: {
      color: colors.gris,
      fontSize: 10,
    },
  });
