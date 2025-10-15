import * as React from 'react';
import {
  Animated,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import {View, Text} from 'react-native';
import colors from '../../../../components/style/colors';
import Feather from 'react-native-vector-icons/Feather';
import PopoverMenu from '../../popover/popover.menu';
import {useAppSelector} from '../../../store/hooks';
import {selectAuth} from '../../../store/auth/auth.slice';
import {jwtDecode} from 'jwt-decode';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

function HeaderBottomNavigation({
  navigation,
  title,
}: {
  title: string | any;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  navigation: any;
}) {
  const auth = useAppSelector(selectAuth);
  const userDecode = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = React.useState<any>(userDecode);
  const eglise = user?.eglise;
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  return (
    <View
      style={{
        justifyContent: 'center',
        backgroundColor: backgroundStyle.backgroundColor,
        height: 70,
        paddingHorizontal: 10,
        paddingVertical: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8,
        }}>
        <PopoverMenu navigation={navigation} />
        <View style={{flex: 1}}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              color: isDarkMode ? colors.lighter : colors.darker,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {title}
          </Text>
        </View>
        <View style={{flexDirection: 'row', gap: 10}}>
          {auth.isAuthenticated && eglise ? (
            // <TouchableOpacity
            //   onPress={() => {
            //     navigation.navigate('HomeChurch');
            //   }}
            //   style={{
            //     height: 50,
            //     width: 50,
            //     justifyContent: 'center',
            //     alignItems: 'center',
            //     borderRadius: 25,
            //   }}>
            //   <Image
            //     source={path.LOGOEBK}
            //     style={{
            //       width: 40,
            //       height: 40,
            //       // borderRadius: 25,
            //       resizeMode: 'cover',
            //     }}
            //   />
            // </TouchableOpacity>
            <View></View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChurchList');
              }}
              style={{
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.blackrgba,
                borderRadius: 25,
              }}>
              <FontAwesome5Icon
                name="church"
                size={18}
                color={colors.white}
                style={{fontWeight: 'bold'}}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Search');
            }}
            style={{
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.blackrgba,
              borderRadius: 25,
            }}>
            <Feather
              name="search"
              size={20}
              color={colors.white}
              style={{fontWeight: 'bold'}}
            />
          </TouchableOpacity>
          {auth.isAuthenticated && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProfileScreen');
              }}
              style={{
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.blackrgba,
                borderRadius: 25,
              }}>
              <Feather name="user" size={20} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* <View
        style={{
          backgroundColor: isDarkMode ? colors.secondary : colors.light,
          marginBottom: 20,
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          paddingHorizontal: 10
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: isDarkMode ? colors.secondary : colors.light,
            paddingVertical: 20,
            fontWeight: '600',
            fontSize: 18,
            color: isDarkMode ? colors.light : colors.secondary,
            alignItems: 'center',
            borderRadius: 16,
          }}
          placeholder='Recherche'
        />
      </View> */}
    </View>
  );
}
export default HeaderBottomNavigation;
