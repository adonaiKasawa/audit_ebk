/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/rules-of-hooks */
import React, {useCallback} from 'react';
import HomeScreen from '../../screen/home/home.screen';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BlurView} from '@react-native-community/blur';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import colors from '../../../components/style/colors';
import ForumScreen from '../../screen/forum/forum.screen';
import TestimonialsScreen from '../../screen/testimonials/testimonials.screen';
import HeaderBottomNavigation from './header/header.bottom.navigation';
import {selectAuth} from '../../store/auth/auth.slice';
import {useAppSelector} from '../../store/hooks';
import {PayloadUserInterface} from '../../config/interface';
import {jwtDecode} from 'jwt-decode';
import {useFocusEffect} from '@react-navigation/native';
import BibleScreen from '../../screen/bible/bible.screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import QuestionSuggestionScreen from '../../screen/suggestion/question.suggestion.screen';
import ChurchListScreen from '../../screen/church/church.list.screen';
import HomeChurchScreen from '../../screen/HomeChurch/home.chuch.screen';

const Tab = createBottomTabNavigator();

const renderIcon = (
  path: string,
  isDarkMode: boolean = true,
  isFocused: boolean = false,
) => {
  const auth = useAppSelector(selectAuth);
  const userDecode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
    userDecode,
  );

  useFocusEffect(
    useCallback(() => {
      const e: PayloadUserInterface | undefined = auth.access_token
        ? jwtDecode(auth.access_token)
        : undefined;
      if (user && e) {
        if (user.iat !== e.iat) {
          setUser(e);
        }
      } else {
        if (auth.isAuthenticated) {
          const e: PayloadUserInterface | undefined = auth.access_token
            ? jwtDecode(auth.access_token)
            : undefined;
          setUser(e);
        } else {
          setUser(undefined);
        }
      }
    }, [user, auth]),
  );

  switch (path) {
    case 'Home':
      return (
        <AntDesign
          name="home"
          size={20}
          color={
            isDarkMode
              ? isFocused
                ? colors.light
                : colors.gris
              : isFocused
              ? colors.white
              : colors.gris
          }
        />
      );
    case 'Forums':
      return (
        <AntDesign
          name="form"
          size={20}
          color={
            isDarkMode
              ? isFocused
                ? colors.light
                : colors.gris
              : isFocused
              ? colors.white
              : colors.gris
          }
        />
      );
    case 'Churchs':
      return (
        <MaterialCommunityIcons
          name="church" // ✅ Icône dispo dans MaterialCommunityIcons
          size={20}
          color={
            isDarkMode
              ? isFocused
                ? colors.light
                : colors.gris
              : isFocused
              ? colors.white
              : colors.gris
          }
        />
      );
    case 'Bible':
      return (
        <Feather
          name="book-open"
          size={20}
          color={
            isDarkMode
              ? isFocused
                ? colors.light
                : colors.gris
              : isFocused
              ? colors.white
              : colors.gris
          }
        />
      );
    case 'Testimonials':
      return (
        <FontAwesome6
          name="clapperboard"
          size={20}
          color={
            isDarkMode
              ? isFocused
                ? colors.light
                : colors.gris
              : isFocused
              ? colors.white
              : colors.gris
          }
        />
      );
    default:
      break;
  }
};

function MyTabBar({state, descriptors, navigation}: any) {
  const isDarkMode = useColorScheme() === 'dark';

  const renderItem = () => {
    return (
      <>
        {state.routes.map((route: any, index: number) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <View key={index}>
              <View
                style={{
                  borderTopColor: isFocused ? colors.white : undefined,
                  borderTopWidth: isFocused ? 5 : undefined,
                  borderRadius: 5,
                }}
              />
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  padding: 20,
                  // borderRadius: 35,
                  // backgroundColor: (isFocused) ? colors.blackrgba4 : 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {renderIcon(route.name, isDarkMode, isFocused)}
                <Text
                  style={{
                    color: isFocused ? colors.white : colors.gris,
                    fontSize: 11,
                  }}>
                  {label}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </>
    );
  };

  const renderContainer = () => {
    if (Platform.OS === 'ios') {
      return (
        <BlurView
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            bottom: 0,
            height: 60,
            position: 'absolute',
            left: 0,
            right: 0,
            // borderRadius: 40,
          }}
          blurType={'dark'}
          blurAmount={10}
          // reducedTransparencyFallbackColor="white"
          blurRadius={10}>
          {renderItem()}
        </BlurView>
      );
    } else {
      return (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            bottom: 0,
            height: 70,
            position: 'absolute',
            left: 0,
            right: 0,
            backgroundColor: colors.blackrgba8,
            // borderRadius: 50
          }}>
          {renderItem()}
        </View>
      );
    }
  };

  return <>{renderContainer()}</>;
}

const RenderNavigator = ({
  children,
  navigation,
}: {
  children: React.ReactNode;
  navigation: any;
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return (
      <>
        <Tab.Navigator
          initialRouteName={'Home'}
          tabBar={props => <MyTabBar {...props} />}
          screenOptions={{
            header: ({navigation, route, options}) => {
              return (
                <HeaderBottomNavigation
                  navigation={navigation}
                  title={
                    options.headerTitle ? options?.headerTitle : route.name
                  }
                  style={options.headerStyle}
                />
              );
            },
            tabBarStyle: {
              // position: 'absolute',
              // height: 70,
              // paddingTop: Platform.OS === 'ios' ? 15 : 0,
            },
            tabBarShowLabel: true,
            tabBarBackground: () => (
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="light"
                blurAmount={10}
                reducedTransparencyFallbackColor="white"
              />
            ),
            tabBarButton: props => <TouchableOpacity {...props} />,
          }}>
          {children}
        </Tab.Navigator>
      </>
    );
  }
};

function BottomTabNavigation({navigation}: any) {
  const auth = useAppSelector(selectAuth);
  const userDecode = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = React.useState<any>(userDecode);
  const eglise = user?.eglise;

  useFocusEffect(
    useCallback(() => {
      const e: PayloadUserInterface | undefined = auth.access_token
        ? jwtDecode(auth.access_token)
        : undefined;
      if (user && e) {
        if (user.iat !== e.iat) {
          setUser(e);
        }
      } else {
        if (auth.isAuthenticated) {
          const e: PayloadUserInterface | undefined = auth.access_token
            ? jwtDecode(auth.access_token)
            : undefined;
          setUser(e);
        } else {
          setUser(undefined);
        }
      }
    }, [user, auth]),
  );

  return (
    <RenderNavigator navigation={navigation}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => renderIcon('Home'),
          headerTitle: 'Accueil',
          tabBarLabel: 'Accueil',
        }}
      />
      <Tab.Screen
        name="Forums"
        component={ForumScreen}
        options={{
          tabBarIcon: () => renderIcon('Forums'),
          tabBarLabel: 'Forum',
        }}
      />

      {/* add church  */}
      <Tab.Screen
        name="Churchs"
        component={
          auth.isAuthenticated && eglise ? HomeChurchScreen : ChurchListScreen
        }
        options={{
          tabBarIcon: () => renderIcon('Churchs'),
          tabBarLabel: auth?.isAuthenticated ? 'Église' : 'Églises',
        }}
      />
      <Tab.Screen
        name="Testimonials"
        component={TestimonialsScreen}
        options={{
          tabBarIcon: () => renderIcon('Testimonials'),
          headerShown: false,
          tabBarLabel: 'Témoignages',
        }}
      />
      <Tab.Screen
        name="Bible"
        component={BibleScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => renderIcon('Bible'),
          headerTitle: 'Bible',
          tabBarLabel: 'Bibles',
        }}
      />
    </RenderNavigator>
  );
}

export default BottomTabNavigation;

/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/rules-of-hooks */

// import React, {useCallback} from 'react';
// import {
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   useColorScheme,
// } from 'react-native';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {BlurView} from '@react-native-community/blur';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Feather from 'react-native-vector-icons/Feather';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {useFocusEffect} from '@react-navigation/native';
// import {jwtDecode} from 'jwt-decode';

// import colors from '../../../components/style/colors';
// import {useAppSelector} from '../../store/hooks';
// import {selectAuth} from '../../store/auth/auth.slice';
// import {PayloadUserInterface} from '../../config/interface';

// // Screens
// import HomeScreen from '../../screen/home/home.screen';
// import ForumScreen from '../../screen/forum/forum.screen';
// import TestimonialsScreen from '../../screen/testimonials/testimonials.screen';
// import BibleScreen from '../../screen/bible/bible.screen';
// import QuestionSuggestionScreen from '../../screen/suggestion/question.suggestion.screen';
// import ChurchListScreen from '../../screen/church/church.list.screen';
// import HomeChurchScreen from '../../screen/HomeChurch/home.chuch.screen';
// import HeaderBottomNavigation from './header/header.bottom.navigation';

// const Tab = createBottomTabNavigator();

// /* ---------------- ICONES ---------------- */
// // const renderIcon = (
// //   path: string,
// //   isDarkMode: boolean = true,
// //   isFocused: boolean = false,
// // ) => {
// //   switch (path) {
// //     case 'Home':
// //       return (
// //         <AntDesign
// //           name="home"
// //           size={24}
// //           color={isFocused ? colors.light : colors.gris}
// //         />
// //       );
// //     case 'Forums':
// //       return (
// //         <AntDesign
// //           name="form"
// //           size={24}
// //           color={isFocused ? colors.light : colors.gris}
// //         />
// //       );
// //     case 'Churchs':
// //       return (
// //         <MaterialCommunityIcons
// //           name="church"
// //           size={24}
// //           color={isFocused ? colors.light : colors.gris}
// //         />
// //       );
// //     case 'Bible':
// //       return (
// //         <Feather
// //           name="book-open"
// //           size={24}
// //           color={isFocused ? colors.light : colors.gris}
// //         />
// //       );
// //     case 'Testimonials':
// //       return (
// //         <FontAwesome6
// //           name="clapperboard"
// //           size={24}
// //           color={isFocused ? colors.light : colors.gris}
// //         />
// //       );
// //     default:
// //       return null;
// //   }
// // };

// /* ---------------- ICONES ---------------- */
// const renderIcon = (
//   path: string,
//   isFocused: boolean = false,
// ) => {
//   // Couleur active façon Facebook/LinkedIn
//   const activeColor = colors.lightBlue || '#1877F2'; // bleu Facebook
//   const inactiveColor = '#666'; // gris/noir doux

//   switch (path) {
//     case 'Home':
//       return (
//         <AntDesign
//           name="home"
//           size={22}
//           color={isFocused ? activeColor : inactiveColor}
//         />
//       );
//     case 'Forums':
//       return (
//         <AntDesign
//           name="form"
//           size={22}
//           color={isFocused ? activeColor : inactiveColor}
//         />
//       );
//     case 'Churchs':
//       return (
//         <MaterialCommunityIcons
//           name="church"
//           size={22}
//           color={isFocused ? activeColor : inactiveColor}
//         />
//       );
//     case 'Bible':
//       return (
//         <Feather
//           name="book-open"
//           size={22}
//           color={isFocused ? activeColor : inactiveColor}
//         />
//       );
//     case 'Testimonials':
//       return (
//         <FontAwesome6
//           name="clapperboard"
//           size={2}
//           color={isFocused ? activeColor : inactiveColor}
//         />
//       );
//     default:
//       return null;
//   }
// };
