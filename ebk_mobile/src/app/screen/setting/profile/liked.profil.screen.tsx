import React, {useEffect, useState} from 'react';
import {Text, useColorScheme, View} from 'react-native';
import colors from '../../../../components/style/colors';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {selectAuth} from '../../../store/auth/auth.slice';
import {
  Eglise,
  ItemPicture,
  PayloadUserInterface,
} from '../../../config/interface';
import {jwtDecode} from 'jwt-decode';
import {findFavorisByContetTypeAndUserApi} from '../../../api/favoris/favoris.req';
import {TypeContentEnum} from '../../../config/enum';
import {typeContentArray} from '../../../config/props';
import {TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FlatList} from 'react-native';

function LikedProfilUserScreen({navigation}: any) {
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
    picture: ItemPicture[];
    videos: any[];
    audios: any[];
    books: any[];
    eglise: Eglise[];
    testimonials: any[];
  }>();
  const [contentType, setContentType] = useState<TypeContentEnum>(
    TypeContentEnum.videos,
  );

  const hadleFindFavorisOfUser = async () => {
    // const find = await findFavorisByContetTypeAndUserApi(contentType)
  };

  useEffect(() => {
    hadleFindFavorisOfUser();
  }, [contentType]);

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <FlatList
        data={typeContentArray}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          borderBottomColor: colors.gris,
          borderBottomWidth: 0.5,
          gap: 10,
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
                    backgroundColor: isDarkMode ? colors.white : colors.light2,
                  }}
                />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

export default LikedProfilUserScreen;
