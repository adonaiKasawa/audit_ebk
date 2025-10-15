import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import colors from '../../../components/style/colors';
import {Menu, MenuItem} from 'react-native-material-menu';
import {MenuView} from '@react-native-menu/menu';

import notifee from '@notifee/react-native';

type menuType = {
  label: string;
  path: string;
  icon: React.ReactNode;
  subPath?: string;
  subSubPath?: string;
};

const menu: menuType[] = [
  {
    label: 'Accueil',
    path: 'Bottom',
    subPath: 'Home',
    subSubPath: 'VideosHome',
    icon: <AntDesign name="home" color={colors.lighter} size={20} />,
  },
  {
    label: 'Églises',
    path: 'ChurchList',
    icon: (
      <Image
        source={require('../../../../assets/img/ecclessia.png')}
        style={{width: 20, height: 20}}
      />
    ),
  },
  {
    label: 'Communiqués',
    path: 'Communiques',
    icon: (
      <Ionicons name="newspaper-outline" color={colors.lighter} size={20} />
    ),
  },
  {
    label: 'Programmes',
    path: 'Programmes',
    icon: <AntDesign name="profile" color={colors.lighter} size={20} />,
  },
  {
    label: 'Rendez-vous',
    path: 'PostPonne',
    icon: <AntDesign name="clockcircleo" color={colors.lighter} size={20} />,
  },
  {
    label: 'Témoignages',
    path: 'TestimonialsHandler',
    icon: <FontAwesome6 name="clapperboard" color={colors.lighter} size={20} />,
  },
  {
    label: 'Formation',
    path: 'BibleStudys',
    icon: (
      <SimpleLineIcons name="graduation" size={22} color={colors.lighter} />
    ),
  },
  {
    label: 'Événement',
    path: 'EventScreen',
    icon: <MaterialIcons name="event" size={22} color={colors.lighter} />,
  },
  {
    label: 'Sondage',
    path: 'SondageScreen',
    icon: <AntDesign name="barschart" size={22} color={colors.lighter} />,
  },
  {
    label: 'Notification',
    path: 'Notification',
    icon: <AntDesign name="bells" color={colors.lighter} size={20} />,
  },
  {
    label: 'Paramètres',
    path: 'Settings',
    icon: <AntDesign name="setting" color={colors.lighter} size={20} />,
  },
];

const PopoverMenu = ({navigation}: {navigation: any}) => {
  const [visible, setVisible] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const [badgeNotification, setBadgeNotification] = useState<number>(0);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const hideMenu = (item?: menuType) => {
    if (item) {
      if (item.subPath && item.subSubPath) {
        navigation.navigate(item.path, {
          screen: item.subPath,
        });
      } else if (item.path) {
        navigation.navigate(item.path);
      }
    }
    setVisible(false);
  };

  const showMenu = () => setVisible(true);

  const getBadgeCount = useCallback(async () => {
    const badge = await notifee.getBadgeCount();
    setBadgeNotification(badge);
  }, [badgeNotification]);

  useEffect(() => {
    getBadgeCount();
  }, []);

  return (
    <View style={styles.container}>
      {Platform.OS == 'android' ? (
        <Menu
          visible={visible}
          anchor={
            <TouchableOpacity onPress={showMenu}>
              <Feather
                name="menu"
                color={isDarkMode ? colors.lighter : colors.darker}
                size={30}
              />
            </TouchableOpacity>
          }
          onRequestClose={hideMenu}
          animationDuration={500}
          style={styles.menuContainer}>
          <MenuItem disabled>
            <Text style={{fontWeight: 'bold'}}>Menu</Text>
          </MenuItem>
          {menu.map(item => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.path}
                onPress={() => {
                  hideMenu(item);
                }}
                style={styles.menuItem}>
                {Icon}
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </Menu>
      ) : (
        <MenuView
          title="Menu"
          onPressAction={({nativeEvent}) => {
            // warn(JSON.stringify(nativeEvent));
            if (nativeEvent.event === 'Home') {
              navigation.navigate('Bottom', {
                screen: 'Home',
              });
            } else {
              navigation.navigate(nativeEvent.event);
            }
          }}
          actions={[
            {
              id: 'Home',
              title: 'Accueil',
              image: Platform.select({
                ios: 'house',
                android: 'ic_menu_add',
              }),
            },
            {
              id: 'ChurchList',
              title: 'Églises',
            },
            {
              id: 'Communiques',
              title: 'Communiqués',
              image: Platform.select({
                ios: 'newspaper',
                android: 'ic_menu_delete',
              }),
            },
            {
              id: 'Programmes',
              title: 'Programmes',
              image: Platform.select({
                ios: 'list.bullet.rectangle',
                android: 'ic_menu_delete',
              }),
            },
            {
              id: 'PostPonne',
              title: 'Rendez-vous',
              image: Platform.select({
                ios: 'calendar.badge.clock',
                android: 'ic_menu_delete',
              }),
            },
            {
              id: 'PostPonne',
              title: 'w-vous',
              image: Platform.select({
                ios: 'calendar.badge.clock',
                android: 'ic_menu_delete',
              }),
            },
            {
              id: 'PostPonne',
              title: 'Rendez-vous',
              image: Platform.select({
                ios: 'calendar.badge.clock',
                android: 'ic_menu_delete',
              }),
            },
            {
              id: 'PostPonne',
              title: 'Rendez-vous',
              image: Platform.select({
                ios: 'calendar.badge.clock',
                android: 'ic_menu_delete',
              }),
            },
            {
              id: 'TestimonialsHandler',
              title: 'Témoignages',
              image: Platform.select({
                ios: 'movieclapper',
                android: 'ic_menu_delete',
              }),
            },
            {
              id: 'BibleStudys',
              title: 'Formation',
              image: Platform.select({
                ios: 'graduation',
                android: 'graduation',
              }),
            },
            {
              id: 'SondageScreen',
              title: 'Sondage',
              image: Platform.select({
                ios: 'graduation',
                android: 'graduation',
              }),
            },

            {
              id: 'Notification',
              title: `${
                badgeNotification ? badgeNotification + ' ' : ''
              }Notification`,
              image: Platform.select({
                ios: 'bell',
                android: 'ic_menu_delete',
              }),
            },
            {
              id: 'Settings',
              title: 'Paramètres',
              image: Platform.select({
                ios: 'gearshape',
                android: 'ic_menu_delete',
              }),
            },
          ]}
          shouldOpenOnLongPress={false}>
          <TouchableOpacity>
            <Feather
              name="menu"
              color={isDarkMode ? colors.lighter : colors.darker}
              size={30}
            />
          </TouchableOpacity>
        </MenuView>
      )}
    </View>
  );
};

export default PopoverMenu;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  menuContainer: {
    display: 'flex',
    width: 200,
    backgroundColor: colors.secondary,
    paddingBottom: 10,
    borderRadius: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    gap: 10,
    marginVertical: 10,
  },
  menuItemText: {
    color: colors.lighter,
    fontSize: 18,
  },
});
