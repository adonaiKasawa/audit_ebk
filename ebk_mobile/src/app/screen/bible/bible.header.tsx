import React, {memo, useEffect, useState} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import useDimensions from '../../helpers/useDimensions';
import Feather from 'react-native-vector-icons/Feather';
import {Text} from 'react-native';
import truncate from '../../helpers/truncate';
import {Version} from '../../helpers/filesystem/bibleVersions';
import {selectBibleStore, VersionCode} from '../../store/bible/bible.slice';
import colors from '../../../components/style/colors';
import {useAppSelector} from '../../store/hooks';
import {BottomSheetOpendedByType} from './bible.viewer';
import {Menu, MenuItem} from 'react-native-material-menu';
import {MenuView} from '@react-native-menu/menu';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type menuType = {
  label: string;
  path: string;
  icon: (color: string) => React.ReactNode;
  subPath?: string;
  subSubPath?: string;
};

const menu: menuType[] = [
  {
    label: 'Note',
    path: 'BibleNoteListScreen',
    icon: (color: string) => <Feather name="edit" color={color} size={20} />,
  },
];

interface BibleHeaderProps {
  navigation: any;
  hasBackButton?: boolean;
  onBibleParamsClick: (opendedBy: BottomSheetOpendedByType) => void;
  commentsDisplay?: boolean;
  version: VersionCode;
  bookName: string;
  chapter: number;
  verseFormatted: string;
  isReadOnly?: boolean;
  isSelectionMode?: boolean;
  isParallel?: boolean;
  bottomSheetOpendedBy: BottomSheetOpendedByType;
}

const Header = ({
  navigation,
  hasBackButton,
  onBibleParamsClick,
  version,
  bookName,
  chapter,
  verseFormatted,
  isReadOnly,
  isSelectionMode,
  bottomSheetOpendedBy,
}: BibleHeaderProps) => {
  const isDarkMode = useColorScheme() === 'dark';

  const dispatch = useDispatch();
  const dimensions = useDimensions();
  const isSmall = dimensions.screen.width < 400;
  const bibleStore = useAppSelector(selectBibleStore);
  const {theme} = bibleStore.font;
  const [visible, setVisible] = useState(false);
  // const actions = useBibleTabActions(bibleAtom)

  useEffect(() => {
    // actions.setTitle(`${t(bookName)} ${chapter} - ${version}`)
  }, [bookName, chapter, version]);

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

  if (isReadOnly) {
    // HeaderView
    return (
      <View
        style={{
          maxWidth: 830,
          width: '100%',
          alignSelf: 'center',
          alignItems: 'stretch',
        }}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TouchableOpacity style={{padding: 10}}>
            <Feather name="arrow-left" size={20} />
          </TouchableOpacity>
        </View>
        <View style={{}}>
          <Text>
            {bookName} {chapter}:{verseFormatted} - {version}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', height: 40}}>
      {hasBackButton && (
        <TouchableOpacity style={{padding: 10}}>
          <Feather name="arrow-left" size={20} color={theme.color} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('BibleSelectScreen');
        }}
        style={{paddingHorizontal: 15}}>
        <Text style={{fontSize: 20, color: theme.color}}>
          {isSmall
            ? truncate(`${bookName} ${chapter}`, 10)
            : `${bookName} ${chapter}`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('VersionSelectorScreen');
        }}
        style={{marginRight: 'auto'}}>
        <Text style={{fontSize: 20, color: theme.color}}>{version}</Text>
      </TouchableOpacity>
      {bottomSheetOpendedBy === 'bibleParams' && (
        <TouchableOpacity
          onPress={() => {
            onBibleParamsClick('bibleParams');
          }}
          style={{width: 25}}>
          <Text
            style={{
              marginRight: 0,
              color: theme.color,
              fontSize: 17,
              fontWeight: 'bold',
            }}>
            Aa
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ReadingPlansScreen');
        }}
        style={{paddingHorizontal: 5}}>
        <MaterialCommunityIcons
          name="notebook-check-outline"
          size={20}
          color={theme.color}
        />
      </TouchableOpacity>

      {Platform.OS == 'android' ? (
        <Menu
          visible={visible}
          anchor={
            <TouchableOpacity style={{paddingHorizontal: 5}} onPress={showMenu}>
              <Feather name="more-vertical" color={theme.color} size={30} />
            </TouchableOpacity>
          }
          onRequestClose={hideMenu}
          animationDuration={500}
          style={styles(theme).menuContainer}>
          {/* <MenuItem disabled><Text style={{ fontWeight: 'bold' }}>Menu</Text></MenuItem> */}
          {menu.map(item => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.path}
                onPress={() => {
                  hideMenu(item);
                }}
                style={styles(theme).menuItem}>
                {Icon(theme.color)}
                <Text style={styles(theme).menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </Menu>
      ) : (
        <MenuView
          title=""
          onPressAction={({nativeEvent}) => {
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
              id: 'BibleNoteListScreen',
              title: 'Note',
              image: Platform.select({
                ios: 'square.and.pencil',
                android: 'ic_menu_add',
              }),
            },
          ]}
          shouldOpenOnLongPress={false}>
          <TouchableOpacity style={{paddingHorizontal: 5}}>
            <Feather name="more-vertical" color={theme.color} size={20} />
          </TouchableOpacity>
        </MenuView>
      )}
      {/* <Menu
            element={
              <Box
                row
                center
                height={60}
                width={50}
                opacity={isFullscreen ? 0 : 1}
              >
                <FeatherIcon name="more-vertical" size={18} />
              </Box>
            }
            popover={
              <>
              {!commentsDisplay && isFR && (
                  <MenuOption onSelect={onOpenCommentaire}>
                    <Box row alignItems="center">
                      <MaterialIcon name="chat" size={20} />
                      <Text marginLeft={10}>{t('Commentaire désactivé')}</Text>
                    </Box>
                  </MenuOption>
                )} 
               {commentsDisplay && isFR && (
                  <MenuOption
                    onSelect={() => dispatch(setSettingsCommentaires(false))}
                  >
                    <Box row alignItems="center">
                      <MaterialIcon name="chat" size={20} color="primary" />
                      <Text marginLeft={10}>{t('Commentaire activé')}</Text>
                    </Box>
                  </MenuOption>
                )} 
                <MenuOption
                  onSelect={
                    isParallel ? removeAllParallelVersions : addParallelVersion
                  }
                >
                  <Box row alignItems="center">
                    <ParallelIcon color={isParallel ? 'primary' : 'default'} />
                    <Text marginLeft={10}>{t('Affichage parallèle')}</Text>
                  </Box>
                </MenuOption>
                <MenuOption onSelect={() => navigation.navigate('History')}>
                  <Box row alignItems="center">
                    <MaterialIcon name="history" size={20} />
                    <Text marginLeft={10}>{t('Historique')}</Text>
                  </Box>
                </MenuOption> 
                 <MenuOption
                  onSelect={() => {
                    setIsFullScreen(true)
                    Platform.OS === 'android' &&
                      ImmersiveMode.setBarMode('FullSticky')
                    StatusBar.setHidden(true)
                  }}
                >
                  <Box row alignItems="center">
                    <MaterialIcon name="fullscreen" size={20} />
                    <Text marginLeft={10}>{t('Plein écran')}</Text>
                  </Box>
                </MenuOption>
              </>
            }
          />  */}
    </View>
  );
};

export default Header;

const styles = (theme: {background: string; color: string}) =>
  StyleSheet.create({
    container: {
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 20,
    },
    menuContainer: {
      display: 'flex',
      width: 200,
      backgroundColor: theme.background,
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
      color: theme.color,
      fontSize: 18,
    },
  });
