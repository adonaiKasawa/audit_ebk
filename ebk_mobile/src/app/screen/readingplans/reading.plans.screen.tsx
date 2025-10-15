/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import colors from '../../../components/style/colors';
import {useState, useCallback, useEffect} from 'react';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ReadingPlansCard, {
  ReadingPlansCard2,
} from './components/card/reading.plans.card';
import Carousel from 'react-native-reanimated-carousel';
import {getAllPlanLecturesPagination} from '../../api/readingplans/readingplans.req';
import {
  BiblePlanLecturePaginated,
  ItemBiblePlanLecture,
} from '../../config/interface';
import React from 'react';
import Loading from '../../../components/loading';
import LoadingGif from '../../../components/loading/loadingGif';
import Feather from 'react-native-vector-icons/Feather';

type GroupedBiblePlanState = Record<string, ItemBiblePlanLecture[]>;

const ReadingPlansScreen = ({navigation}: {navigation: any}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const WIDTH = Dimensions.get('screen').width;
  const [readingplans, setReadingPlans] = useState<BiblePlanLecturePaginated>();
  const [readingplansFiltered, setReadingPlansFiltered] =
    useState<GroupedBiblePlanState>({});
  const [s_query, setQuery] = useState<string>('');
  // const [search, setSearch] = useState<SearchIterface>();
  const [typeList, setTypeList] = useState<'list' | 'cards'>('cards');
  const [stepView, setStepView] = useState<'myplans' | 'allplans' | 'finished'>(
    'myplans',
  );
  const [loading, setLoading] = useState<boolean>(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
    color: isDarkMode ? colors.lighter : colors.primary,
  };
  const IMAGE = [
    'https://d31uetu06bkcms.cloudfront.net/photo/ecclesia-photo-b49670c2-f1a9-4542-8aa4-f74d5e9be75f.jpg',
    'https://d31uetu06bkcms.cloudfront.net/photo/ecclesia-photo-81817910-f591-423f-8753-2c8da0cb71e2.jpg',
    'https://d31uetu06bkcms.cloudfront.net/photo/ecclesia-photo-050ebc84-1342-4961-b5e4-4a5059614615.jpg',
  ];

  const getIndex = (plans: ItemBiblePlanLecture[], currentIndex: number) => {
    const leftIndex = (currentIndex - 1 + plans.length) % plans.length;
    const rightIndex = (currentIndex + 1) % plans.length;
    return {leftIndex, rightIndex};
  };

  const handelFindSearch = useCallback(async () => {
    if (s_query !== null) {
    }
  }, [s_query]);

  function groupByDynamicKey(
    items: ItemBiblePlanLecture[],
    key: keyof ItemBiblePlanLecture,
  ): GroupedBiblePlanState {
    return items.reduce((acc, item) => {
      const category = item[key] as unknown as keyof ItemBiblePlanLecture; // Cast pour garantir que la clé est une string
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<keyof ItemBiblePlanLecture, ItemBiblePlanLecture[]>);
  }

  const handelFindReadingPlans = async () => {
    setLoading(true);
    const find = await getAllPlanLecturesPagination();
    setLoading(false);

    if (find?.status === 200) {
      setReadingPlans(find.data);
      const groupedByCategorie = groupByDynamicKey(
        find.data.items,
        'categorie',
      );
      setReadingPlansFiltered(groupedByCategorie);
    }
  };

  useEffect(() => {
    handelFindReadingPlans();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          // justifyContent: 'space-between', // pour espacer le bouton et le texte
          paddingHorizontal: 10,
          marginTop: 10,
        }}>
        <TouchableOpacity
          style={{paddingTop: 8}}
          onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text
          style={{
            color: backgroundStyle.color,
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 10,
            marginTop: 10,
            paddingLeft: 40,
            // textAlign: 'center',
          }}>
          Plans de lecture
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 5,
          height: 50,
          marginHorizontal: 10,
          marginTop: 10,
          backgroundColor: isDarkMode ? colors.whitergba1 : colors.blackrgba1,
          borderRadius: 50,
        }}>
        <TextInput
          style={{
            flex: 1,
            height: 50,
            padding: 10,
            color: isDarkMode ? colors.white : colors.black,
          }}
          keyboardType="web-search"
          placeholder="Recherche"
          value={s_query}
          onChangeText={text => setQuery(text)}
          onSubmitEditing={handelFindSearch}
        />
        <TouchableOpacity
          style={{
            width: 45,
            height: 45,
            borderRadius: 50,
            backgroundColor: isDarkMode ? colors.white : colors.black,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <EvilIcons
            name="search"
            size={35}
            color={backgroundStyle.backgroundColor}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 10,
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: backgroundStyle.color,
          }}>
          Sélectionnez votre prochain plan
        </Text>
        <View style={{flexDirection: 'row', gap: 10}}>
          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor:
                typeList === 'list'
                  ? isDarkMode
                    ? colors.white
                    : colors.black
                  : undefined,
            }}
            onPress={() => {
              setTypeList('list');
            }}>
            <Entypo
              name="list"
              size={20}
              color={
                typeList === 'list'
                  ? isDarkMode
                    ? colors.black
                    : colors.white
                  : backgroundStyle.color
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor:
                typeList === 'cards'
                  ? isDarkMode
                    ? colors.white
                    : colors.black
                  : undefined,
            }}
            onPress={() => {
              setTypeList('cards');
            }}>
            <MaterialCommunityIcons
              name={'cards-outline'}
              size={20}
              color={
                typeList === 'cards'
                  ? isDarkMode
                    ? colors.black
                    : colors.white
                  : backgroundStyle.color
              }
            />
            {/* cards */}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginVertical: 10, flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            padding: 10,
            marginHorizontal: 10,
            borderRadius: 10,
            backgroundColor:
              stepView === 'myplans'
                ? isDarkMode
                  ? colors.white
                  : colors.black
                : isDarkMode
                ? colors.whitergba1
                : colors.blackrgba1,
          }}
          onPress={() => {
            setStepView('myplans');
          }}>
          <Text
            style={{
              color:
                stepView === 'myplans'
                  ? isDarkMode
                    ? colors.black
                    : colors.white
                  : backgroundStyle.color,
            }}>
            Mes plans
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 10,
            marginHorizontal: 10,
            borderRadius: 10,
            backgroundColor:
              stepView === 'allplans'
                ? isDarkMode
                  ? colors.white
                  : colors.black
                : isDarkMode
                ? colors.whitergba1
                : colors.blackrgba1,
          }}
          onPress={() => {
            setStepView('allplans');
          }}>
          <Text
            style={{
              color:
                stepView === 'allplans'
                  ? isDarkMode
                    ? colors.black
                    : colors.white
                  : backgroundStyle.color,
            }}>
            Trouver des plans
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 10,
            marginHorizontal: 10,
            borderRadius: 10,
            backgroundColor:
              stepView === 'finished'
                ? isDarkMode
                  ? colors.white
                  : colors.black
                : isDarkMode
                ? colors.whitergba1
                : colors.blackrgba1,
          }}
          onPress={() => {
            setStepView('finished');
          }}>
          <Text
            style={{
              color:
                stepView === 'finished'
                  ? isDarkMode
                    ? colors.black
                    : colors.white
                  : backgroundStyle.color,
            }}>
            Terminer
          </Text>
        </TouchableOpacity>
      </View>
      {Object.entries(readingplansFiltered).length > 0 && (
        <ScrollView style={{flex: 1}}>
          {[Object.entries(readingplansFiltered)[0]].map(([key, plan]) => {
            return (
              <>
                <Carousel
                  loop
                  width={WIDTH}
                  height={400}
                  autoPlay={false}
                  data={plan}
                  renderItem={({item, index}) => {
                    const {leftIndex, rightIndex} = getIndex(plan, index);
                    return (
                      <ReadingPlansCard
                        currentPlans={plan[index]}
                        leftPlans={plan[leftIndex]}
                        rightPlans={plan[rightIndex]}
                        planItem={item}
                        navigation={navigation}
                      />
                    );
                  }}
                />
              </>
            );
          })}

          {Object.entries(readingplansFiltered).map(([key, plan]) => {
            return (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 15,
                      color: backgroundStyle.color,
                    }}>
                    {key} {plan.length}
                  </Text>
                  <TouchableOpacity
                    style={{
                      borderBottomColor: colors.gris,
                      borderBottomWidth: 1,
                    }}
                    onPress={() => {
                      navigation.navigate('ReadingPlansBycategoryScreen', {
                        category: key,
                        plans: plan,
                      });
                    }}>
                    <Text style={{color: colors.gris}}>Voir tout</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={plan}
                  keyExtractor={item => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{padding: 10}}
                  renderItem={({item}) => {
                    return (
                      <ReadingPlansCard2 navigation={navigation} item={item} />
                    );
                  }}
                />
              </View>
            );
          })}
        </ScrollView>
      )}
      {loading && <LoadingGif width={30} height={30} />}
    </View>
  );
};

export default ReadingPlansScreen;
