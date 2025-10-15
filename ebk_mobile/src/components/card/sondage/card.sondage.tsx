import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import {file_url} from '../../../app/api';
import {ItemForum, ItemSondageQst} from '../../../app/config/interface';
import colors from '../../style/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
const WIDTH = Dimensions.get('screen').width;

export default function CardSondageUI({
  sondage,
  navigation,
}: {
  sondage: ItemSondageQst;
  navigation: any;
}) {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.secondary : colors.light,
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('SondageAnwseredScreen', {sondage});
      }}
      style={{
        width: WIDTH - 20,
        height: 120,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 10,
        backgroundColor: backgroundStyle.backgroundColor,
        borderRadius: 16,
      }}>
      <View style={{height: 80, width: 80}}>
        <Image
          source={{uri: `${file_url}${sondage.eglise.photo_eglise}`}}
          style={{
            width: 80,
            height: 80,
          }}
        />
        {/* <Image
        source={{ uri: `${file_url}${sondage.eglise.photo_eglise}` }}
        style={{
          position: "absolute",
          right: 10,
          bottom: -5,
          width: 30,
          height: 30,
          // borderRadius: 15
        }}
      /> */}
      </View>
      <View style={{flex: 1, width: WIDTH - 100}}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={2}
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: isDarkMode ? colors.light : colors.primary,
            }}>
            {sondage.title}
          </Text>
          <Text
            ellipsizeMode="tail"
            numberOfLines={2}
            style={{fontSize: 15, color: colors.gris}}>
            Visibilité: {sondage.public ? 'public' : 'privé'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <View style={{flexDirection: 'row', gap: 5}}>
            <AntDesign name="questioncircleo" size={20} color={colors.gris} />
            <Text style={{color: colors.gris}}>{sondage.totalQuestion}</Text>
          </View>
          <View style={{flexDirection: 'row', gap: 5}}>
            <Feather name="users" size={20} color={colors.gris} />
            <Text style={{color: colors.gris}}>{sondage.totalAnswered}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
