import React, {useState} from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
// import ProgressCircle from 'react-native-progress/Circle'
import {useDispatch, useSelector} from 'react-redux';
import {Version} from '../../helpers/filesystem/bibleVersions';
import colors from '../../../components/style/colors';
import Feather from 'react-native-vector-icons/Feather';
import {requireBiblePath} from '../../helpers/filesystem/requireBiblePath';
import {biblesRef, getDatabasesRef} from '../../helpers/filesystem/bibleUrl';
import * as RNFS from '@dr.pogodin/react-native-fs';
import LoadingGif from '../../../components/loading/loadingGif';
import {useAppSelector} from '../../store/hooks';
import {
  selectBibleStore,
  setDowloadVersion,
} from '../../store/bible/bible.slice';

const BIBLE_FILESIZE = 2500000;

interface Props {
  version: Version;
  isSelected?: boolean;
  onChange?: (id: string) => void;
  isParameters?: boolean;
}

const VersionSelectorItem = ({version, isSelected, onChange}: Props) => {
  const bible = useAppSelector(selectBibleStore);
  const bibleDownloadedVersion = bible.dowloadedVersion;
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);
  const dispatch = useDispatch();

  const [fileProgress, setFileProgress] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  React.useEffect(() => {
    (async () => {
      // if (shareFn && !isStrongVersion(version.id)) {
      //   shareFn(() => {
      //     setVersionNeedsDownload(true)
      //     startDownload()
      //   })
      // }
      // const v = await getIfVersionNeedsDownload(version.id)
      // setVersionNeedsDownload(v)
    })();
    if (bibleDownloadedVersion.find(item => item.id === version.id)) {
      setIsDownloaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateProgress = ({
    contentLength,
    bytesWritten,
  }: RNFS.DownloadProgressCallbackResultT) => {
    const fileProgress =
      Math.floor((bytesWritten / BIBLE_FILESIZE) * 100) / 100;
    setFileProgress(fileProgress);
  };

  const startDownload = React.useCallback(async () => {
    setIsLoading(true);

    const path = requireBiblePath(`${version.id.toString().toLowerCase()}`);
    const uri =
      version.id === 'INT'
        ? getDatabasesRef().INTERLINEAIRE
        : biblesRef[version.id];

    try {
      const download = await RNFS.downloadFile({
        fromUrl: uri,
        toFile: path,
        progress: calculateProgress,
      }).promise;
      setIsLoading(false);

      if (download.statusCode === 200) {
        dispatch(
          setDowloadVersion({
            path,
            id: version.id,
          }),
        );
        if (bibleDownloadedVersion.find(item => item.id === version.id)) {
          setIsDownloaded(true);
        }
      } else {
        Alert.alert(
          'Erreur de telecharment',
          "Impossible de commencer le téléchargement. Assurez-vous d'être connecté à internet.",
        );
      }

      // setVersionNeedsDownload(false);
    } catch (e) {
      Alert.alert(
        'Erreur de telecharment',
        "Impossible de commencer le téléchargement. Assurez-vous d'être connecté à internet.",
      );
      setIsLoading(false);
    }
  }, [version.id]);

  const updateVersion = async () => {
    // await deleteVersion()
    await startDownload();
    // dispatch(setVersionUpdated(version.id))
  };

  // const deleteVersion = async () => {
  //   const path = requireBiblePath(version.id)
  //   const file = await FileSystem.getInfoAsync(path)
  //   if (!file.uri) {
  //     return
  //   }
  //   FileSystem.deleteAsync(file.uri)
  //   setVersionNeedsDownload(true)

  //   if (version.id === 'INT') {
  //     interlineaireDB.delete()
  //   }
  // }

  // const confirmDelete = () => {
  //   Alert.alert(
  //     t('Attention'),
  //     t('Êtes-vous vraiment sur de supprimer cette version ?'),
  //     [
  //       { text: t('Non'), onPress: () => null, style: 'cancel' },
  //       {
  //         text: t('Oui'),
  //         onPress: deleteVersion,
  //         style: 'destructive',
  //       },
  //     ]
  //   )
  // }

  // if (
  //   typeof versionNeedsDownload === 'undefined' ||
  //   (isParameters && version.id === 'LSGS') ||
  //   (isParameters && version.id === 'KJVS')
  // ) {
  //   return null
  // }

  // if (versionNeedsDownload) {
  //   return (
  //     <View>
  //       <Box flex row>
  //         <Box disabled flex>
  //           <TextVersion>{version.id}</TextVersion>
  //           <HStack alignItems="center">
  //             <TextName>{version.name}</TextName>
  //             {version?.hasAudio && (
  //               <Box>
  //                 <FeatherIcon name="volume-2" size={16} color="primary" />
  //               </Box>
  //             )}
  //           </HStack>
  //           <TextCopyright>{version.c}</TextCopyright>
  //         </Box>
  //         {!isLoading && version.id !== 'LSGS' && version.id !== 'KJVS' && (
  //           <TouchableOpacity
  //             onPress={startDownload}
  //             style={{ padding: 10, alignItems: 'flex-end' }}
  //           >
  //             <FeatherIcon name="download" size={20} />
  //             {version.id === 'INT' && (
  //               <Box center marginTop={5}>
  //                 <Text fontSize={10}>⚠️ {t('Taille de')} 20Mo</Text>
  //               </Box>
  //             )}
  //           </TouchableOpacity>
  //         )}
  //         {isLoading && (
  //           <Box
  //             width={80}
  //             justifyContent="center"
  //             alignItems="flex-end"
  //             mr={10}
  //           >
  //             <ProgressCircle
  //               size={20}
  //               progress={fileProgress}
  //               borderWidth={0}
  //               thickness={3}
  //               color={theme.colors.primary}
  //               unfilledColor={theme.colors.lightGrey}
  //               fill="none"
  //             />
  //           </Box>
  //         )}
  //       </Box>
  //     </Container>
  //   )
  // }

  // if (isParameters) {
  //   return (
  //     <View needsUpdate={needsUpdate}>
  //       <Box flex row center>
  //         <Box flex>
  //           <TextVersion>{version.id}</TextVersion>
  //           <TextName>{version.name}</TextName>
  //         </Box>
  //         {needsUpdate ? (
  //           <TouchableOpacity onPress={updateVersion} style={{ padding: 10 }}>
  //             <UpdateIcon name="download" size={18} />
  //           </TouchableOpacity>
  //         ) : (
  //           version.id !== 'LSG' &&
  //           version.id !== 'KJV' && (
  //             <TouchableOpacity onPress={confirmDelete} style={{ padding: 10 }}>
  //               <DeleteIcon name="trash-2" size={18} />
  //             </TouchableOpacity>
  //           )
  //         )}
  //       </Box>
  //     </Container>
  //   )
  // }

  return (
    <View
      style={{
        flex: 1,
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity
        disabled={!isDownloaded}
        onPress={() => onChange && onChange(`${version.id}`)}>
        <View style={{flex: 1}}>
          <Text
            style={{
              color: isSelected && isDownloaded ? colors.blue : colors.gris,
              fontSize: 12,
              opacity: 0.5,
              fontWeight: 'bold',
            }}>
            {version.id}
          </Text>
          <View style={{flexWrap: 'wrap'}}>
            <Text
              style={{
                color: isSelected && isDownloaded ? colors.blue : colors.gris,
                fontSize: 16,
              }}>
              {version.name}
            </Text>
            {/* {version?.hasAudio && (
              <View>
                <Feather name="volume-2" size={16} color="primary" />
              </View>
            )} */}
          </View>
          <Text style={{color: colors.gris, fontSize: 10}}>{version.c}</Text>
        </View>
      </TouchableOpacity>
      {!isDownloaded && (
        <>
          {isLoading ? (
            <View>
              <LoadingGif width={50} height={50} progress={`${fileProgress}`} />
            </View>
          ) : (
            <TouchableOpacity onPress={updateVersion} style={{padding: 10}}>
              <Feather
                name="download"
                size={18}
                color={isDarkMode ? colors.white : colors.black}
              />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default VersionSelectorItem;
