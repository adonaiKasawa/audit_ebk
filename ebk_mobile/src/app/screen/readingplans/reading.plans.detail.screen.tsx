import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {ItemBiblePlanLecture} from '../../config/interface';
import colors from '../../../components/style/colors';
import {file_url} from '../../api';
import Feather from 'react-native-vector-icons/Feather';
import {getContentDaysForPlan} from '../../api/readingplans/readingplans.req';
import {useState} from 'react';

const ReadingPlanDetailScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
    color: isDarkMode ? colors.white : colors.primary,
  };
  const Width = Dimensions.get('window').width;
  const plan: ItemBiblePlanLecture = route.params.plan;
  const [contentDaysForPlan, setContentDaysForPlan] = useState<any>();
  const handelFindDay = async () => {
    const find = await getContentDaysForPlan(plan.id);
  };

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          style={{padding: 10}}
          onPress={() => {
            navigation.goBack();
          }}>
          <Feather
            name="arrow-left"
            size={30}
            color={isDarkMode ? colors.white : colors.black}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: isDarkMode ? colors.white : colors.black,
              fontSize: 17,
            }}
            numberOfLines={1}>
            {plan.title}
          </Text>
        </View>
      </View>
      <View style={{padding: 10, flex: 1}}>
        <Image
          source={{uri: `${file_url}${plan.picture}`}}
          width={Width - 20}
          height={Width / 2}
          style={{
            borderRadius: 10,
            resizeMode: 'cover',
          }}
        />
        <Text
          style={{
            fontSize: 30,
            fontWeight: '500',
            color: backgroundStyle.color,
          }}>
          {plan.title}
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: '500',
            color: backgroundStyle.color,
          }}>
          {plan.number_days} jours
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'justify',
            color: backgroundStyle.color,
            marginTop: 20,
          }}>
          {plan.description}
        </Text>

        <View
          style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              backgroundColor: isDarkMode ? colors.white : colors.primary,
              width: Width - 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 25,
            }}
            onPress={() => {
              // envoyer une requete pour market le debut de la lecture du plan
            }}>
            <Text
              style={{
                color: isDarkMode ? colors.black : colors.white,
                fontSize: 18,
              }}>
              Commencer la lecture
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReadingPlanDetailScreen;
