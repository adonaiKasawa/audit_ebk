import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import colors from '../../../../components/style/colors';
import {PayloadUserInterface} from '../../../config/interface';
import {selectAuth} from '../../../store/auth/auth.slice';
import {useAppSelector} from '../../../store/hooks';
import {file_url} from '../../../api';
import Feather from 'react-native-vector-icons/Feather';
import {capitalize} from '../../../config/func';
import Loading from '../../../../components/loading';
import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import {
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import {requestSavePermission} from '../../../../components/camera/MediaPage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {jwtDecode} from 'jwt-decode';
import FavorisProfilUserScreen from './favoris.profil.screen';
import LikedProfilUserScreen from './liked.profil.screen';
import {PrivilegesEnum} from '../../../config/enum';

const actions = [
  {key: 'favoris', title: 'Favoris', icon: 'staro'},
  {key: 'liked', title: 'Aimé', icon: 'hearto'},
  {key: 'shared', title: 'Partagé', icon: 'sharealt'},
];

export default function ProfileScreen({navigation, route}: any) {
  const update: boolean = route.params?.update;
  const auth = useAppSelector(selectAuth);
  const decode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
    decode,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';
  const [seletdetView, setSelectedView] = useState<string>('favoris');
  const {hasPermission, requestPermission} = useCameraPermission();
  const microphonePermission = useMicrophonePermission();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.white,
  };

  const handleCameraRollPermision = async () => {
    const hasPermission = await requestSavePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission refusée!',
        `Vision Camera n'a pas l'autorisation d'enregistrer le média dans votre pellicule.`,
      );
      return;
    }
  };

  const handleAllCameraPermision = async () => {
    if (!hasPermission) {
      requestPermission();
    }
    if (!microphonePermission.hasPermission) {
      microphonePermission.requestPermission();
    }
    handleCameraRollPermision();
  };

  useEffect(() => {
    if (update) {
      let decode: PayloadUserInterface | undefined = auth.access_token
        ? jwtDecode(auth.access_token)
        : undefined;
      setUser(decode);
    }
  }, [update]);

  return (
    <View style={[styles(isDarkMode).container, backgroundStyle]}>
      {user && (
        <>
          {/* HEADER PROFIL */}
          <ImageBackground
            source={{uri: `${file_url}${user.profil}`}}
            style={styles(isDarkMode).headerBg}
            blurRadius={30}>
            <TouchableOpacity
              onPress={() => navigation.navigate('PickerFileScreen')}>
              {user.profil ? (
                <Image
                  source={{uri: `${file_url}${user.profil}`}}
                  style={styles(isDarkMode).avatar}
                />
              ) : (
                <View style={styles(isDarkMode).avatarPlaceholder}>
                  <Feather name="user" size={50} color={colors.white} />
                </View>
              )}
            </TouchableOpacity>

            <View style={{flex: 1, marginLeft: 15}}>
              <Text style={styles(isDarkMode).username}>
                {capitalize(user.nom)} {capitalize(user.prenom)}
              </Text>
              {user.eglise && (
                <View style={styles(isDarkMode).egliseWrapper}>
                  <Image
                    source={{uri: `${file_url}${user.eglise.photo_eglise}`}}
                    style={styles(isDarkMode).egliseLogo}
                  />
                  <Text style={styles(isDarkMode).egliseName}>
                    {capitalize(user.eglise.nom_eglise.toLowerCase())}
                  </Text>
                </View>
              )}
            </View>

            {/* Menu button */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Account', {screen: 'ProfilAccount'});
              }}
              style={styles(isDarkMode).menuBtn}>
              <Feather name="menu" size={26} color={colors.white} />
            </TouchableOpacity>
          </ImageBackground>

          {/* ADMIN ACTION */}
          {user.privilege_user === PrivilegesEnum.ADMIN_EGLISE && (
            <TouchableOpacity
              style={styles(isDarkMode).adminBtn}
              onPress={() =>
                navigation.navigate('AdminChurchDrawerNavigation')
              }>
              <Text style={styles(isDarkMode).adminBtnText}>
                Interagir en tant qu’administrateur
              </Text>
            </TouchableOpacity>
          )}

          {/* ACTIONS (Favoris / Aimé / Partagé) */}
          <View style={styles(isDarkMode).actionsRow}>
            {actions.map(item => (
              <TouchableOpacity
                key={item.key}
                onPress={() => setSelectedView(item.key)}
                style={styles(isDarkMode).actionBtn}>
                <AntDesign
                  name={item.icon}
                  size={24}
                  color={
                    seletdetView === item.key
                      ? isDarkMode
                        ? colors.white
                        : colors.light2
                      : colors.gris
                  }
                />
                <Text
                  style={[
                    styles(isDarkMode).actionText,
                    seletdetView === item.key && {
                      color: isDarkMode ? colors.white : colors.light2,
                      fontWeight: '600',
                    },
                  ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CONTENU */}
          {seletdetView === 'favoris' ? (
            <FavorisProfilUserScreen navigation={navigation} />
          ) : (
            <LikedProfilUserScreen navigation={navigation} />
          )}

          {loading && <Loading />}
        </>
      )}
    </View>
  );
}

const styles = (isDarkMode: boolean = false) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    headerBg: {
      height: 230,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      backgroundColor: isDarkMode ? colors.secondary : colors.lighter,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: isDarkMode ? colors.white : colors.primary,
    },
    avatarPlaceholder: {
      backgroundColor: colors.blackrgba6,
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    username: {
      fontSize: Platform.OS === 'android' ? 20 : 22,
      fontWeight: '700',
      color: colors.white,
    },
    egliseWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    egliseLogo: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: 6,
    },
    egliseName: {
      color: colors.white,
      fontSize: 13,
    },
    menuBtn: {
      padding: 8,
      backgroundColor: colors.blackrgba5,
      borderRadius: 20,
    },
    adminBtn: {
      backgroundColor: isDarkMode ? colors.white : colors.black,
      marginHorizontal: 20,
      marginVertical: 10,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      elevation: 4,
    },
    adminBtnText: {
      color: isDarkMode ? colors.black : colors.white,
      fontWeight: '600',
    },
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? colors.blackrgba4 : colors.light,
    },
    actionBtn: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionText: {
      marginTop: 3,
      fontSize: 13,
      color: colors.gris,
    },
  });

// import React, {useEffect, useState} from 'react';
// import {
//   Alert,
//   Image,
//   ImageBackground,
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   useColorScheme,
// } from 'react-native';
// import colors from '../../../../components/style/colors';
// import {PayloadUserInterface} from '../../../config/interface';
// import {selectAuth} from '../../../store/auth/auth.slice';
// import {useAppSelector} from '../../../store/hooks';
// import {file_url} from '../../../api';
// import Feather from 'react-native-vector-icons/Feather';
// import {capitalize} from '../../../config/func';
// import Loading from '../../../../components/loading';
// import {
//   CameraRoll,
//   PhotoIdentifier,
// } from '@react-native-camera-roll/camera-roll';
// import {
//   useCameraPermission,
//   useMicrophonePermission,
// } from 'react-native-vision-camera';
// import {requestSavePermission} from '../../../../components/camera/MediaPage';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import {jwtDecode} from 'jwt-decode';
// import FavorisProfilUserScreen from './favoris.profil.screen';
// import LikedProfilUserScreen from './liked.profil.screen';
// import {PrivilegesEnum} from '../../../config/enum';

// const actions = [
//   {key: 'favoris', title: 'Favoris', icon: 'staro'},
//   {key: 'liked', title: 'Aimé', icon: 'hearto'},
//   {key: 'shared', title: 'Partagé', icon: 'sharealt'},
// ];

// export default function ProfileScreen({
//   navigation,
//   route,
// }: {
//   navigation: any;
//   route: any;
// }) {
//   const update: boolean = route.params?.update;
//   const auth = useAppSelector(selectAuth);
//   const decode: PayloadUserInterface | undefined = auth.access_token
//     ? jwtDecode(auth.access_token)
//     : undefined;
//   const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
//     decode,
//   );
//   const [loading, setLoading] = useState<boolean>(false);
//   const isDarkMode = useColorScheme() === 'dark';
//   const [videos, setVideos] = React.useState<PhotoIdentifier[]>([]);
//   const [seletdetView, setSelectedView] = useState<string>('favoris');
//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? colors.primary : colors.lighter,
//   };
//   const {hasPermission, requestPermission} = useCameraPermission();
//   const microphonePermission = useMicrophonePermission();

//   const handleCameraRollPermision = async () => {
//     const hasPermission = await requestSavePermission();
//     if (!hasPermission) {
//       Alert.alert(
//         'Permission refusée!',
//         `Vision Camera n'a pas l'autorisation d'enregistrer le média dans votre pellicule.`,
//       );
//       return;
//     }
//   };

//   const handleAllCameraPermision = async () => {
//     if (!hasPermission) {
//       requestPermission();
//     }
//     if (!microphonePermission.hasPermission) {
//       microphonePermission.requestPermission();
//     }
//     handleCameraRollPermision();
//   };

//   const handleFindVideosInMemoryOfUser = React.useCallback(async () => {
//     const getAlbums = await CameraRoll.getAlbums();
//     const files = await CameraRoll.getPhotos({
//       first: 20,
//       assetType: 'All',
//       include: ['albums', 'playableDuration', 'filename', 'fileSize'],
//     });

//     if (files) {
//       // setVideos(files.edges.filter((v) => v.node.group_name.includes("EcclesiaBooK")));
//       setVideos(files.edges);
//       files.edges.map(item => {});
//     }
//   }, [CameraRoll]);

//   useEffect(() => {
//     if (update) {
//       let decode: PayloadUserInterface | undefined = auth.access_token
//         ? jwtDecode(auth.access_token)
//         : undefined;
//       setUser(decode);
//     }
//   }, [update]);
//   return (
//     <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
//       {user && (
//         <>
//           <View
//             style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
//             <ImageBackground
//               source={{uri: `${file_url}${user.profil}`}}
//               style={{
//                 height: 200,
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 paddingHorizontal: 10,
//                 gap: 20,
//                 backgroundColor: isDarkMode
//                   ? colors.whitergba1
//                   : colors.blackrgba2,
//               }}
//               blurRadius={25}
//               borderBottomLeftRadius={0}
//               borderBottomRightRadius={0}>
//               <TouchableOpacity
//                 onPress={() => {
//                   navigation.navigate('PickerFileScreen');
//                 }}>
//                 {user.profil ? (
//                   <Image
//                     source={{uri: `${file_url}${user.profil}`}}
//                     style={{
//                       width: 100,
//                       height: 100,
//                       borderRadius: 50,
//                       resizeMode: 'cover',
//                       borderWidth: 1,
//                       borderColor: backgroundStyle.backgroundColor,
//                     }}
//                   />
//                 ) : (
//                   <View
//                     style={{
//                       backgroundColor: colors.black,
//                       height: 100,
//                       width: 100,
//                       borderRadius: 50,
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                     }}>
//                     <Feather name="user" size={50} color={colors.white} />
//                   </View>
//                 )}
//               </TouchableOpacity>
//               <View>
//                 <Text style={{fontSize: 17, color: colors.white}}>
//                   {capitalize(user.nom)} {capitalize(user.prenom)}
//                 </Text>
//                 {user.eglise && (
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       gap: 5,
//                       alignItems: 'center',
//                     }}>
//                     <Image
//                       source={{uri: `${file_url}${user.eglise.photo_eglise}`}}
//                       style={{
//                         width: 20,
//                         height: 20,
//                         borderRadius: 10,
//                       }}
//                     />
//                     <Text
//                       ellipsizeMode="tail"
//                       numberOfLines={2}
//                       style={{color: colors.white}}>
//                       {capitalize(user.eglise.nom_eglise.toLowerCase())}
//                     </Text>
//                   </View>
//                 )}
//               </View>
//               <TouchableOpacity
//                 onPress={() => {
//                   navigation.navigate('Account', {screen: 'ProfilAccount'});
//                 }}
//                 style={{
//                   position: 'absolute',
//                   right: 10,
//                   top: 10,
//                   padding: 10,
//                 }}>
//                 <Feather name="menu" size={27} color={colors.white} />
//               </TouchableOpacity>
//             </ImageBackground>
//             {user.privilege_user === PrivilegesEnum.ADMIN_EGLISE && (
//               <View style={{marginHorizontal: 20, marginVertical: 5}}>
//                 <TouchableOpacity
//                   style={styles(isDarkMode).button}
//                   onPress={() => {
//                     navigation.navigate('AdminChurchDrawerNavigation');
//                   }}>
//                   <Text
//                     style={{color: isDarkMode ? colors.black : colors.white}}>
//                     Interagir en tant qu'administrateur
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-around',
//                 paddingVertical: 5,
//               }}>
//               {actions.map((item, i) => (
//                 <TouchableOpacity
//                   key={i}
//                   onPress={() => {
//                     setSelectedView(item.key);
//                   }}
//                   style={{
//                     width: 100,
//                     height: 50,
//                     borderRadius: 15,
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                   }}>
//                   <AntDesign
//                     name={item.icon}
//                     size={25}
//                     color={
//                       isDarkMode
//                         ? seletdetView === item.key
//                           ? colors.white
//                           : colors.gris
//                         : seletdetView === item.key
//                         ? colors.light2
//                         : colors.gris
//                     }
//                   />
//                   <Text
//                     style={{
//                       color: isDarkMode
//                         ? seletdetView === item.key
//                           ? colors.white
//                           : colors.gris
//                         : seletdetView === 'favoris'
//                         ? colors.light2
//                         : colors.gris,
//                     }}>
//                     {item.title}
//                   </Text>
//                   {seletdetView === item.key && (
//                     <View
//                       style={{
//                         height: 3,
//                         borderTopStartRadius: 10,
//                         borderTopEndRadius: 10,
//                         width: 80,
//                         backgroundColor: isDarkMode
//                           ? colors.white
//                           : colors.light2,
//                       }}
//                     />
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </View>
//             {seletdetView === 'favoris' ? (
//               <FavorisProfilUserScreen navigation={navigation} />
//             ) : (
//               <LikedProfilUserScreen navigation={navigation} />
//             )}
//           </View>
//           {loading && <Loading />}
//         </>
//       )}
//     </View>
//   );
// }

// const styles = (isDarkMode: boolean = true) =>
//   StyleSheet.create({
//     titleTop: {
//       color: isDarkMode ? colors.white : colors.primary,
//       fontSize: Platform.OS === 'android' ? 25 : 30,
//       fontWeight: 'bold',
//     },
//     description: {
//       color: colors.gris,
//       fontSize: 12,
//       textAlign: 'center',
//       paddingHorizontal: 10,
//     },
//     textInput: {
//       backgroundColor: isDarkMode ? colors.secondary : colors.white,
//       height: 50,
//       borderRadius: 14,
//       paddingHorizontal: 10,
//       marginVertical: 10,
//       color: isDarkMode ? colors.white : colors.primary,
//     },
//     submitBtn: {
//       backgroundColor: isDarkMode ? colors.secondary : colors.light,
//       justifyContent: 'center',
//       alignItems: 'center',
//       padding: 15,
//       borderRadius: 25,
//       shadowColor: 'black',
//       shadowOffset: {width: 0, height: 2},
//       shadowOpacity: 0.2,
//       shadowRadius: 2,
//       elevation: 2,
//       alignContent: 'center',
//     },
//     button: {
//       backgroundColor: isDarkMode ? colors.white : colors.black,
//       paddingHorizontal: 24,
//       paddingVertical: 15,
//       borderRadius: 10,
//       justifyContent: 'center',
//       alignItems: 'center',
//       shadowColor: '#000',
//       shadowOffset: {
//         width: 0,
//         height: 2,
//       },
//       shadowOpacity: 0.25,
//       shadowRadius: 4,
//       elevation: 5,
//     },
//     textPrivacy: {
//       fontWeight: 'bold',
//       color: isDarkMode ? colors.black : colors.white,
//     },
//   });
