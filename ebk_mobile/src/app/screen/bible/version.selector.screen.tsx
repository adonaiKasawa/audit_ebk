import React from 'react';

import VersionSelectorItem from './version.selector.item';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  DowloadedVersionType,
  selectBibleStore,
  setRomoveVersionDownloaded,
  setSelectedVersion,
  VersionCode,
} from '../../store/bible/bible.slice';
import {
  Button,
  SectionList,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {
  getVersionsBySections,
  versions,
} from '../../helpers/filesystem/bibleVersions';
import {MenuDivider} from 'react-native-material-menu';
import colors from '../../../components/style/colors';
import useDimensions from '../../helpers/useDimensions';
import Feather from 'react-native-vector-icons/Feather';
import * as RNFS from '@dr.pogodin/react-native-fs';

const VersionSelectorScreen = ({navigation}: any) => {
  const bible = useAppSelector(selectBibleStore);
  const {dowloadedVersion} = bible;
  const dispatch = useAppDispatch();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const setAndClose = (vers: VersionCode) => {
    dispatch(
      setSelectedVersion({
        version: vers,
      }),
    );

    navigation.goBack();
  };

  const getListe = () => {
    // MainBundlePath

    RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then(result => {
        // stat the first file
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .then(statResult => {
        if (statResult[0].isFile()) {
          // if we have a file, read it
          return RNFS.readFile(statResult[1], 'utf8');
        }

        return 'no file';
      })
      .then(contents => {
        // log the file contents
      })
      .catch(err => {});
  };

  const deleteVersion = (version: DowloadedVersionType) => {
    dispatch(setRomoveVersionDownloaded(version));
  };

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{padding: 10}}>
          <Feather
            name="arrow-left"
            size={24}
            color={isDarkMode ? colors.white : colors.primary}
          />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text
            style={{
              textAlign: 'center',
              color: isDarkMode ? colors.white : colors.primary,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Version
          </Text>
        </View>
      </View>

      <Button onPress={getListe} title="get file" />

      {dowloadedVersion.length > 0 && (
        <View>
          <SectionList
            contentContainerStyle={{
              paddingBottom: 10,
              maxWidth: useDimensions().window.width,
            }}
            stickySectionHeadersEnabled={false}
            sections={[{title: 'Versions Téléchargé', data: dowloadedVersion}]}
            keyExtractor={item => `${item.id}`}
            renderSectionHeader={({section: {title}}) => (
              <View style={{paddingHorizontal: 20, marginTop: 20}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: isDarkMode ? colors.white : colors.primary,
                  }}>
                  {title}
                </Text>
                <MenuDivider color={colors.gris} />
              </View>
            )}
            renderItem={({item}) => {
              const version = versions[item.id];
              return (
                <View
                  style={{
                    flex: 1,
                    margin: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{marginHorizontal: 10}}
                    onPress={() => setAndClose(item.id)}>
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          color:
                            item.id === bible.version
                              ? colors.blue
                              : colors.gris,
                          fontSize: 12,
                          opacity: 0.5,
                          fontWeight: 'bold',
                        }}>
                        {version.id}
                      </Text>
                      <View style={{flexWrap: 'wrap'}}>
                        <Text
                          style={{
                            color:
                              item.id === bible.version
                                ? colors.blue
                                : colors.gris,
                            fontSize: 16,
                          }}>
                          {version.name}
                        </Text>
                      </View>
                      <Text style={{color: colors.gris, fontSize: 10}}>
                        {version.c}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {version.id !== 'LSG' && (
                    <TouchableOpacity
                      onPress={() => {
                        deleteVersion(item);
                      }}
                      style={{padding: 10}}>
                      <Feather name="trash-2" size={18} color={colors.red} />
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        </View>
      )}

      <SectionList
        contentContainerStyle={{
          paddingTop: 0,
          paddingBottom: 150,
          width: useDimensions().window.width,
          maxWidth: useDimensions().window.width,
        }}
        stickySectionHeadersEnabled={false}
        sections={getVersionsBySections()}
        keyExtractor={item => `${item.id}`}
        renderSectionHeader={({section: {title}}) => (
          <View style={{paddingHorizontal: 20, marginTop: 20}}>
            <Text
              style={{
                fontSize: 16,
                color: isDarkMode ? colors.white : colors.primary,
              }}>
              {title}
            </Text>
            <MenuDivider color={colors.gris} />
          </View>
        )}
        renderItem={({item}) => (
          <VersionSelectorItem
            onChange={(vers: any) => setAndClose(vers)}
            version={item}
            isSelected={item.id === bible.version}
          />
        )}
      />
    </View>
  );
};

export default VersionSelectorScreen;
