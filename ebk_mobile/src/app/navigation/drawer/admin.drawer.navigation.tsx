import * as React from 'react';
import {Button, TouchableOpacity, useColorScheme, View} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AdminHomeScreen from '../../screen/Admin/home/home.screen';
import colors from '../../../components/style/colors';
import CustomDrawerContent from './custom.drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AdminEventStackNavigation from '../../screen/Admin/management/event/event.stack.navigation';

const Drawer = createDrawerNavigator();

export default function AdminChurchDrawerNavigation() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
    color: isDarkMode ? colors.white : colors.secondary,
  };

  return (
    <Drawer.Navigator
      screenOptions={({navigation}) => ({
        drawerStyle: {
          backgroundColor: isDarkMode ? colors.primary : colors.white,
          width: 240,
        },
        headerStyle: {
          backgroundColor: isDarkMode ? colors.secondary : colors.light,
        },
        headerTitleStyle: {
          color: backgroundStyle.color,
        },
        headerLeft: props => {
          return (
            <TouchableOpacity
              style={{marginLeft: 5}}
              onPress={() => {
                navigation.toggleDrawer();
              }}>
              <MaterialCommunityIcons
                name="menu"
                color={backgroundStyle.color}
                size={30}
              />
            </TouchableOpacity>
          );
        },
        drawerActiveBackgroundColor: isDarkMode ? colors.white : colors.black,
        drawerActiveTintColor: isDarkMode ? colors.black : colors.white,
        drawerInactiveTintColor: colors.gris,
      })}
      initialRouteName="AdminHome"
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="AdminHome"
        options={{
          drawerLabel: 'Accueil',
          headerTitle: 'Accueil',
          drawerIcon: props => (
            <AntDesign
              name="home"
              size={20}
              color={
                props.focused
                  ? isDarkMode
                    ? colors.black
                    : colors.white
                  : colors.gris
              }
            />
          ),
        }}
        component={AdminHomeScreen}
      />
      <Drawer.Screen
        name="AdminEvent"
        options={{
          drawerLabel: 'Événements',
          headerTitle: 'Événements',
          drawerIcon: props => (
            <AntDesign
              name="calendar"
              size={20}
              color={
                props.focused
                  ? isDarkMode
                    ? colors.black
                    : colors.white
                  : colors.gris
              }
            />
          ),
        }}
        component={AdminEventStackNavigation}
      />

      {/* <Drawer.Screen
        name="AdminIncome"
        options={{
          drawerLabel: 'Recettes',
          headerTitle: "Recettes",
          drawerIcon: (props) => <FontAwesome6 name='money-bill-trend-up' size={20} color={props.focused ? (isDarkMode ? colors.black : colors.white) : colors.gris} />
        }}
        component={AdminEventStackNavigation}
      />
      <Drawer.Screen
        name="AdminExpense"
        options={{
          drawerLabel: 'Dépenses',
          headerTitle: "Dépenses",
          drawerIcon: (props) => <FontAwesome6 name='money-bill-transfer' size={20} color={props.focused ? (isDarkMode ? colors.black : colors.white) : colors.gris} />
        }}
        component={AdminEventStackNavigation}
      /> */}
    </Drawer.Navigator>
  );
}
