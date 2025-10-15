import * as React from 'react';
import {
  View,
  Text,
  useColorScheme,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import {StackNavigationScreenProps} from '../../../components/props/props.navigation';
import colors from '../../../components/style/colors';
import {file_url} from '../../api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {Menu, MenuItem} from 'react-native-material-menu';
import {ScrollView} from 'react-native';
import {ItemBibleStudy, ItemContentBibleStudy} from '../../config/interface';
import moment from 'moment';
import {capitalize} from '../../config/func';
import {BlurView} from '@react-native-community/blur';

function BibleStudyContentScreen({
  navigation,
  route,
}: StackNavigationScreenProps) {
  const bibleStudy: ItemBibleStudy = route.params.bibleStudy;
  const [visible, setVisible] = React.useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };
  const showMenu = () => setVisible(true);
  const hideMenu = () => {
    setVisible(false);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: backgroundStyle.backgroundColor,
      }}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        {bibleStudy.contentsBibleStudy.length > 0 && (
          <Image
            source={{
              uri: `${file_url}${bibleStudy.contentsBibleStudy[0].image}`,
            }}
            style={{
              width: width - 15,
              height: 214,
              borderRadius: 16,
            }}
          />
        )}
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colors.blackrgba5,
              width: 100,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
              padding: 5,
              alignSelf: 'center',
              marginTop: 50,
            }}>
            <MaterialIcons
              name="playlist-play"
              size={30}
              color={colors.white}
            />
            <Text
              style={{color: colors.white, fontSize: 15, fontWeight: '400'}}>
              {bibleStudy.contentsBibleStudy.length} vidéos
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          padding: 15,
          flexDirection: 'row',
          gap: 10,
          backgroundColor: isDarkMode ? colors.secondary : colors.light,
          borderRadius: 16,
          margin: 10,
        }}>
        <Image
          source={{uri: `${file_url}${bibleStudy.eglise.photo_eglise}`}}
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
        />
        <View style={{justifyContent: 'center', gap: 2, flex: 1}}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              color: isDarkMode ? colors.white : colors.black,
              fontSize: 12,
            }}>
            {bibleStudy.titre}{' '}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: isDarkMode ? colors.white : colors.black,
              fontSize: 10,
            }}>
            {bibleStudy.eglise.nom_eglise}{' '}
          </Text>
        </View>
        <Menu
          visible={visible}
          anchor={
            <TouchableOpacity onPress={showMenu}>
              <Entypo
                name="dots-three-horizontal"
                size={24}
                color={isDarkMode ? colors.white : colors.black}
              />
            </TouchableOpacity>
          }
          onRequestClose={hideMenu}
          animationDuration={500}
          style={styles(isDarkMode).menuContainer}>
          <TouchableOpacity
            onPress={() => {
              hideMenu();
            }}
            style={styles(isDarkMode).menuItem}>
            <Feather
              name="flag"
              size={24}
              color={isDarkMode ? colors.white : colors.black}
            />
            <Text style={styles(isDarkMode).menuItemText}>Signaler</Text>
          </TouchableOpacity>
        </Menu>
      </View>
      {bibleStudy.contentsBibleStudy.map((item, i) => (
        <CardBibleStudyContentUI
          key={i.toString()}
          bibleStudy={bibleStudy}
          bibleStudyContent={item}
          navigation={navigation}
        />
      ))}
    </ScrollView>
  );
}
export default BibleStudyContentScreen;

const {width, height} = Dimensions.get('screen');

export function CardBibleStudyContentUI({
  bibleStudy,
  bibleStudyContent,
  isActivated,
  navigation,
}: {
  bibleStudy: ItemBibleStudy;
  bibleStudyContent: ItemContentBibleStudy;
  navigation: any;
  isActivated?: number;
}) {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const bibleStudyDescriptionView = () => {
    return (
      <View style={{flex: 1, gap: 5}}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={2}
          style={styles(isDarkMode).card_video_title}>
          {bibleStudyContent.titre}
        </Text>
        <View style={{flexDirection: 'row', gap: 5}}>
          <Image
            source={{uri: `${file_url}${bibleStudy?.eglise.photo_eglise}`}}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
            }}
            resizeMode="cover"
          />
          <View style={{justifyContent: 'space-between', paddingRight: 10}}>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={styles(isDarkMode).card_video_detail}>
              {capitalize(bibleStudy.eglise.nom_eglise.toLowerCase())}
            </Text>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{color: colors.gris, fontSize: 10}}>
              {moment(bibleStudyContent.createdAt).fromNow()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('BibleStudyVideosPlayer', {
          bibleStudy,
          bibleStudyContent,
        });
      }}
      style={styles(isDarkMode).card_contenair}>
      <View style={styles(isDarkMode).card_miniature_img}>
        <Image
          source={{uri: `${file_url}${bibleStudyContent.image}`}}
          style={{
            height: 107,
            width: 106,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          }}
          resizeMode="cover"
        />
      </View>
      {Platform.OS === 'ios' ? (
        <View style={styles(isDarkMode).card_description}>
          <Image
            source={{uri: `${file_url}${bibleStudyContent.image}`}}
            style={{
              width: width - 125,
              height: 79,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              opacity: 0.8,
            }}
            resizeMode="cover"
          />
          <BlurView
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: width - 125,
              height: 106,
              position: 'absolute',
              left: 0,
              right: 0,
              paddingHorizontal: 10,
              borderEndWidth: 1,
              borderBottomWidth: 1,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
            }}
            blurType={isDarkMode ? 'dark' : 'light'}
            blurAmount={20}
            reducedTransparencyFallbackColor={
              isDarkMode ? colors.white : colors.black
            }
            blurRadius={20}>
            {bibleStudyDescriptionView()}
          </BlurView>
        </View>
      ) : (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: width - 100,
            height: 107,
            paddingLeft: 5,
            borderBottomRightRadius: 15,
            borderTopRightRadius: 15,
            backgroundColor: isDarkMode ? colors.secondary : colors.light,
          }}>
          {bibleStudyDescriptionView()}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = (dark: boolean = true) =>
  StyleSheet.create({
    container: {
      height: '100%',
    },
    menuContainer: {
      display: 'flex',
      width: 200,
      backgroundColor: colors.primary,
      borderRadius: 20,
      marginTop: 30,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginVertical: 10,
      paddingHorizontal: 15,
    },
    menuItemText: {
      color: colors.lighter,
      fontSize: 18,
    },
    card_contenair: {
      // height: 107,
      width: width - 10,
      display: 'flex',
      flexDirection: 'row',
      paddingHorizontal: 10,
    },
    card_miniature_img: {
      height: 107,
      width: 106,
    },
    card_description: {
      width: width - 100,
      height: 106,
      borderRadius: 20,
    },
    card_video_title: {
      color: dark ? colors.white : colors.primary,
      alignSelf: 'stretch',
      overflow: 'hidden',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '500',
      flexWrap: 'wrap',
    },
    card_video_detail: {
      color: colors.gris,
      fontSize: 10,
    },
  });
