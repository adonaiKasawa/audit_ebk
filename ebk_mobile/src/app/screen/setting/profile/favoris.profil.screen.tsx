import React, {useEffect, useState} from 'react';
import {FlatList, Text, useColorScheme, View} from 'react-native';
import colors from '../../../../components/style/colors';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {selectAuth} from '../../../store/auth/auth.slice';
import {
  Eglise,
  ItemBibleStudy,
  ItemForum,
  ItemPicture,
  PayloadUserInterface,
} from '../../../config/interface';
import {jwtDecode} from 'jwt-decode';
import {findFavorisByContetTypeAndUserApi} from '../../../api/favoris/favoris.req';
import {TypeContentEnum} from '../../../config/enum';
import {typeContentArray} from '../../../config/props';
import {TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CardVideosUI from '../../../../components/card/videos/card.videos';
import CardAudiosUI from '../../../../components/card/audios/card.audios';
import CardBooksUI from '../../../../components/card/books/card.book';
import CardChurchUI from '../../../../components/card/church/card.church';
import {TestimonialsItem} from '../../testimonials/testimonials.handeler.screen';
import CardForumUI from '../../../../components/card/forum/card.forum';
import CardBibleStudyUI from '../../../../components/card/bibleStudy/card.bibleStudy';
import Loading from '../../../../components/loading';
import CardImagesUI from '../../../../components/card/images/card.image';

function FavorisProfilUserScreen({navigation}: any) {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const decode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
    decode,
  );
  const [favoris, setFavoris] = useState<{
    images: ItemPicture[];
    videos: any[];
    audios: any[];
    livres: any[];
    eglises: Eglise[];
    testimonials: any[];
    forum: ItemForum[];
    bibleStudy: ItemBibleStudy[];
  }>({
    images: [],
    videos: [],
    audios: [],
    livres: [],
    eglises: [],
    testimonials: [],
    forum: [],
    bibleStudy: [],
  });
  const [contentType, setContentType] = useState<TypeContentEnum>(
    TypeContentEnum.videos,
  );
  const [loading, setLoading] = useState<boolean>(false);

  const enumToFavorisMap: {[key in TypeContentEnum]?: keyof typeof favoris} = {
    [TypeContentEnum.images]: 'images',
    [TypeContentEnum.videos]: 'videos',
    [TypeContentEnum.audios]: 'audios',
    [TypeContentEnum.livres]: 'livres',
    [TypeContentEnum.eglises]: 'eglises',
    [TypeContentEnum.testimonials]: 'testimonials',
    [TypeContentEnum.forum]: 'forum',
    [TypeContentEnum.bibleStudy]: 'bibleStudy',
  };

  const hadleFindFavorisOfUser = async () => {
    if (user) {
      setLoading(true);
      const find = await findFavorisByContetTypeAndUserApi(
        contentType,
        user?.sub,
      );
      setLoading(false);
      const favorisKey = enumToFavorisMap[contentType];

      if (find?.hasOwnProperty('data') && favorisKey) {
        setFavoris(prev => ({
          ...prev,
          [favorisKey]: find.data,
        }));
      }
    }
  };

  const getContentToRender = () => {
    switch (contentType) {
      case TypeContentEnum.videos:
        return favoris?.videos || [];
      case TypeContentEnum.audios:
        return favoris?.audios || [];
      case TypeContentEnum.livres:
        return favoris?.livres || [];
      case TypeContentEnum.images:
        return favoris?.images || [];
      case TypeContentEnum.eglises:
        return favoris?.eglises || [];
      case TypeContentEnum.testimonials:
        return favoris?.testimonials || [];
      case TypeContentEnum.forum:
        return favoris?.forum || [];
      case TypeContentEnum.bibleStudy:
        return favoris?.bibleStudy || [];
      default:
        return [];
    }
  };

  const renderComponentByContentType = (item: any) => {
    switch (contentType) {
      case TypeContentEnum.videos:
        return (
          <CardVideosUI
            navigation={navigation}
            videos={item.videos}
            route={TypeContentEnum.videos}
          />
        );
      case TypeContentEnum.images:
        return <CardImagesUI navigation={navigation} images={item.images} />;
      case TypeContentEnum.audios:
        return (
          <CardAudiosUI
            navigation={navigation}
            audios={item.audios}
            route={TypeContentEnum.audios}
          />
        );
      case TypeContentEnum.livres:
        return (
          <CardBooksUI
            navigation={navigation}
            livres={item.livres}
            route={TypeContentEnum.livres}
          />
        );
      case TypeContentEnum.eglises:
        return <CardChurchUI navigation={navigation} church={item.eglise} />;
      case TypeContentEnum.testimonials:
        return (
          <TestimonialsItem
            item={item}
            navigation={navigation}
            handleFindTestimonials={() => {}}
          />
        );
      case TypeContentEnum.forum:
        return <CardForumUI forum={item} navigation={navigation} />;
      case TypeContentEnum.bibleStudy:
        return (
          <CardBibleStudyUI
            bibleStudy={item.bibleStudys}
            navigation={navigation}
          />
        );
      default:
        return (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: colors.gris}}>
              Pas de contenu ajouté aux favoris
            </Text>
          </View>
        );
    }
  };

  useEffect(() => {
    hadleFindFavorisOfUser();
  }, [contentType]);

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <View style={{height: 50}}>
        <FlatList
          data={typeContentArray}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            borderBottomColor: colors.gris,
            borderBottomWidth: 0.5,
            gap: 10,
            height: 50,
          }}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setContentType(item.id);
                }}
                style={{
                  width: 100,
                  height: 50,
                  borderRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {item.icon(
                  15,
                  isDarkMode
                    ? contentType === item.id
                      ? colors.white
                      : colors.gris
                    : contentType === item.id
                    ? colors.light2
                    : colors.gris,
                )}
                <Text
                  style={{
                    fontSize: 12,
                    color: isDarkMode
                      ? contentType === item.id
                        ? colors.white
                        : colors.gris
                      : contentType === item.id
                      ? colors.light2
                      : colors.gris,
                  }}>
                  {item.title}
                </Text>
                {contentType === item.id && (
                  <View
                    style={{
                      height: 3,
                      borderTopStartRadius: 10,
                      borderTopEndRadius: 10,
                      width: 80,
                      backgroundColor: isDarkMode
                        ? colors.white
                        : colors.light2,
                    }}
                  />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={{flex: 1}}>
        <FlatList
          key={
            contentType === TypeContentEnum.livres
              ? TypeContentEnum.livres
              : 'contentType'
          }
          data={getContentToRender()}
          keyExtractor={item => item.id}
          style={{marginVertical: 10}}
          numColumns={contentType === TypeContentEnum.livres ? 2 : 1}
          renderItem={({item}) => (
            <View style={{marginVertical: 5, flex: 1}}>
              {renderComponentByContentType(item)}
            </View>
          )}
        />
      </View>

      {loading && <Loading />}
    </View>
  );
}

export default FavorisProfilUserScreen;
