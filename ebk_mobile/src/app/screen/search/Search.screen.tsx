import React, {useCallback, useState} from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../components/style/colors';
import {Image} from 'react-native';
import {findSearchApi} from '../../api/search';
import {
  Eglise,
  ItemBibleStudy,
  ItemForum,
  ItemPicture,
  ItemVideos,
  SearchIterface,
} from '../../config/interface';
import CardChurchUI from '../../../components/card/church/card.church';
import CardImagesUI from '../../../components/card/images/card.image';
import CardBibleStudyUI from '../../../components/card/bibleStudy/card.bibleStudy';
import CardForumUI from '../../../components/card/forum/card.forum';
import CardVideosUI from '../../../components/card/videos/card.videos';

export default function SearchScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [step, setStep] = useState<string>('Tout');
  const [s_query, setQuery] = useState<string>('');
  const [search, setSearch] = useState<SearchIterface>();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const handlePresentModalPress = () => {};

  const handelFindSearch = useCallback(async () => {
    if (s_query !== null) {
      const search = await findSearchApi(s_query);
      if (search?.status === 200) {
        setSearch(search.data);
      }
    }
  }, [s_query, setSearch]);

  const RenderAllSearchItem = () => {
    return <View></View>;
  };

  const RenderSearchItem = () => {
    switch (step) {
      case 'Tout':
        return <RenderAllSearchItem />;
      case 'Eglise':
        return (
          <FlatList
            data={search?.eglise}
            keyExtractor={item => item.id_eglise.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            style={{
              paddingHorizontal: 10,
            }}
            renderItem={({item}) => (
              <CardChurchUI church={item} navigation={navigation} />
            )}
          />
        );
      case 'Vidéos':
        return (
          <FlatList
            data={search?.videos}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <CardVideosUI
                videos={item}
                navigation={navigation}
                route={route}
              />
            )}
          />
        );
      case 'Audios':
        return (
          <FlatList
            data={search?.audios}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <SearchItemUI data={{audios: search?.videos}} />
            )}
          />
        );
      case 'Livres':
        return (
          <FlatList
            data={search?.livre}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <SearchItemUI data={{livre: search?.livre}} />
            )}
          />
        );
      case 'Images':
        return (
          <FlatList
            data={search?.images}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <CardImagesUI
                handlePresentModalPress={handlePresentModalPress}
                navigation={navigation}
                images={item}
              />
            )}
          />
        );
      case 'Étude biblique':
        return (
          <FlatList
            data={search?.bibleStudy}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <CardBibleStudyUI navigation={navigation} bibleStudy={item} />
            )}
          />
        );
      case 'Forums':
        return (
          <FlatList
            data={search?.forum}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <CardForumUI navigation={navigation} forum={item} />
            )}
          />
        );
      default:
        break;
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', paddingRight: 10}}>
        <TouchableOpacity
          style={{padding: 10}}
          onPress={() => {
            navigation.goBack();
          }}>
          <Feather
            name="chevron-left"
            size={30}
            color={isDarkMode ? colors.white : colors.black}
          />
        </TouchableOpacity>
        <TextInput
          style={{
            flex: 1,
            height: 40,
            backgroundColor: isDarkMode ? colors.whitergba1 : colors.blackrgba1,
            borderRadius: 12,
            padding: 10,
            color: isDarkMode ? colors.white : colors.black,
          }}
          autoFocus={true}
          keyboardType="web-search"
          placeholder="Recherche"
          value={s_query}
          onChangeText={text => setQuery(text)}
          onSubmitEditing={handelFindSearch}
        />
        {/* <TouchableOpacity style={{ padding: 10 }}>
        <Text style={{ color: isDarkMode ? colors.white : colors.black }}>Rechercher</Text>
      </TouchableOpacity> */}
      </View>
      <View>
        <FlatList
          data={[
            'Eglise',
            'Vidéos',
            'Audios',
            'Livres',
            'Images',
            'Étude biblique',
            'Forums',
          ]}
          keyExtractor={item => item}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                setStep(item);
              }}
              style={{padding: 10}}>
              <Text
                style={{
                  color: isDarkMode
                    ? step === item
                      ? colors.white
                      : colors.gris
                    : step === item
                    ? colors.black
                    : colors.gris,
                }}>
                {item}
              </Text>
              {step === item && (
                <View
                  style={{
                    height: 2,
                    backgroundColor: isDarkMode ? colors.white : colors.black,
                  }}
                />
              )}
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={{flex: 1}}>{RenderSearchItem()}</View>
    </View>
  );
}

const SearchItemUI = ({
  data,
}: {
  data?:
    | {
        images?: ItemPicture[];
        audios?: ItemVideos[];
        videos?: ItemVideos[];
        live?: ItemVideos[];
        livre?: ItemVideos[];
        eglise?: Eglise[];
        bibleStudy?: ItemBibleStudy[];
        forum?: ItemForum[];
      }
    | undefined;
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  return (
    <TouchableOpacity
      style={{
        padding: 10,
        marginVertical: 2,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.blackrgba1,
        borderRadius: 10,
      }}>
      <View style={{}}>
        <Image
          source={require('../../../../assets/img/img1.jpeg')}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
          }}
        />
      </View>
      <View style={{flex: 1, gap: 5, marginHorizontal: 5}}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={3}
          style={{color: isDarkMode ? colors.white : colors.black}}>
          Jojol a mis en ligne Je construis ma maison de rêve !
        </Text>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{color: colors.gris, fontSize: 11}}>
          il y a 17 heurs
        </Text>
      </View>
      <View style={{width: 130}}>
        <Image
          source={require('../../../../assets/img/img2.jpeg')}
          style={{
            width: 130,
            height: 90,
            borderRadius: 14,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};
