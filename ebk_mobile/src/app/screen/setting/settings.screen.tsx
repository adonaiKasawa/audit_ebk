import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {logoutUser, selectAuth} from '../../store/auth/auth.slice';
import {jwtDecode} from 'jwt-decode';
import {PayloadUserInterface} from '../../config/interface';
import colors from '../../../components/style/colors';

function SettingsScreen({navigation}: any) {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const decode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;

  const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
    decode,
  );
  const [camelCaseName, setCamelCaseName] = React.useState<string>('');

  const isDarkMode = useColorScheme() === 'dark';

  React.useEffect(() => {
    if (user && auth.isAuthenticated) {
      let nomPrenom = user.nom + user.prenom;
      let sansEspaces = nomPrenom.replace(/\s+/g, '');
      let camelCase =
        sansEspaces.charAt(0).toLowerCase() + sansEspaces.slice(1);
      setCamelCaseName(camelCase);
    }
  }, []);

  const renderItem = (
    title: string,
    subtitle: string,
    icon: any,
    onPress: () => void,
  ) => (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        {icon}
        <View style={{marginLeft: 12, flex: 1}}>
          <Text
            style={[
              styles.itemTitle,
              {color: isDarkMode ? colors.whitergba8 : colors.primary},
            ]}>
            {title}
          </Text>
          {subtitle !== '' && (
            <Text
              style={[
                styles.itemSubtitle,
                {color: isDarkMode ? colors.whitergba6 : colors.gris},
              ]}>
              {subtitle}
            </Text>
          )}
        </View>
        <Feather name="chevron-right" size={22} color={colors.gris} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? colors.primary : colors.cardLight},
      ]}>
      {auth.isAuthenticated && (
        <View
          style={[
            styles.section,
            {backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight},
          ]}>
          <Text
            style={[
              styles.sectionTitle,
              {color: isDarkMode ? colors.whitergba6 : colors.gris},
            ]}>
            Compte
          </Text>
          {renderItem(
            'Compte utilisateur',
            'Infos, mot de passe, connexion',
            <Feather name="user" size={24} color={colors.blue} />,
            () =>
              navigation.navigate('Account', {
                screen: 'ProfilAccount',
              }),
          )}
        </View>
      )}

      <View
        style={[
          styles.section,
          {backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight},
        ]}>
        <Text
          style={[
            styles.sectionTitle,
            {color: isDarkMode ? colors.whitergba6 : colors.gris},
          ]}>
          Informations
        </Text>
        {renderItem(
          'Mentions légales',
          'Éditeur : LinkEd Solution DRC SARL',
          <Feather name="award" size={24} color={colors.blue} />,
          () =>
            navigation.navigate('PrivacyAppScreen', {
              link: 'mentions_legale',
            }),
        )}
        {renderItem(
          'Termes et conditions',
          "L'utilisation implique l'acceptation des conditions",
          <FontAwesome name="legal" size={24} color={colors.blue} />,
          () =>
            navigation.navigate('PrivacyAppScreen', {
              link: 'terms_of_use',
            }),
        )}
        {renderItem(
          'Politique de confidentialité',
          'Collecte et gestion de vos données personnelles',
          <MaterialIcons name="privacy-tip" size={24} color={colors.blue} />,
          () =>
            navigation.navigate('PrivacyAppScreen', {
              link: 'privacy',
            }),
        )}
      </View>

      <View
        style={[
          styles.section,
          {backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight},
        ]}>
        <Text
          style={[
            styles.sectionTitle,
            {color: isDarkMode ? colors.whitergba6 : colors.gris},
          ]}>
          Connexion
        </Text>
        <View>
          {auth.isAuthenticated
            ? renderItem(
                `Se déconnecter de @${camelCaseName}`,
                '',
                <Feather name="log-out" size={24} color={colors.red} />,
                () => {
                  dispatch(logoutUser());
                  navigation.navigate('Account', {
                    screen: 'signIn',
                  });
                },
              )
            : renderItem(
                'Ajouter un compte',
                'Connexion ou deconnexion',
                <Feather name="log-in" size={24} color={colors.green} />,
                () =>
                  navigation.navigate('Account', {
                    screen: 'signUp',
                  }),
              )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  section: {
    marginVertical: 12,
    marginHorizontal: 15,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomColor: colors.whitergba4,
    borderBottomWidth: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default SettingsScreen;

// import * as React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   useColorScheme,
//   ScrollView,
// } from 'react-native';
// import {StackNavigationScreenProps} from '../../../components/props/props.navigation';
// import colors from '../../../components/style/colors';
// import Feather from 'react-native-vector-icons/Feather';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import {useAppDispatch, useAppSelector} from '../../store/hooks';
// import {logoutUser, selectAuth} from '../../store/auth/auth.slice';
// import {jwtDecode} from 'jwt-decode';
// import {PayloadUserInterface} from '../../config/interface';

// function SettingsScreen({navigation}: any) {
//   const auth = useAppSelector(selectAuth);
//   const dispatch = useAppDispatch();
//   const decode: PayloadUserInterface | undefined = auth.access_token
//     ? jwtDecode(auth.access_token)
//     : undefined;
//   const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
//     decode,
//   );
//   const [camelCaseName, setCamelCaseName] = React.useState<string>('');
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? colors.primary : colors.lighter,
//   };

//   const AccountUser = () => {
//     return (
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate('Account', {
//             screen: 'ProfilAccount',
//           });
//         }}
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           borderBottomColor: colors.gris,
//           borderBottomWidth: 2,
//           paddingHorizontal: 10,
//           paddingVertical: 20,
//           gap: 10,
//         }}>
//         <Feather
//           name="user"
//           size={25}
//           color={isDarkMode ? colors.white : colors.primary}
//         />
//         <View>
//           <Text style={{color: isDarkMode ? colors.white : colors.primary}}>
//             Compte utilisateur
//           </Text>
//           <Text style={{color: colors.gris, fontSize: 10}}>
//             Information d'utilisateur, Mot de passe, Connexion{' '}
//           </Text>
//         </View>
//         <View style={{flex: 1, alignItems: 'flex-end'}}>
//           <Feather
//             name="chevron-right"
//             size={25}
//             color={isDarkMode ? colors.white : colors.primary}
//             style={{justifyContent: 'flex-end'}}
//           />
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const MetionLegale = () => {
//     return (
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate('PrivacyAppScreen', {
//             link: 'mentions_legale',
//           });
//         }}
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           borderBottomColor: colors.gris,
//           borderBottomWidth: 2,
//           paddingHorizontal: 10,
//           paddingVertical: 20,
//           gap: 10,
//         }}>
//         <Feather
//           name="award"
//           size={25}
//           color={isDarkMode ? colors.white : colors.primary}
//         />
//         <View>
//           <Text style={{color: isDarkMode ? colors.white : colors.primary}}>
//             Mentions légales
//           </Text>
//           <Text style={{color: colors.gris, fontSize: 10}}>
//             1. editeur: LinkEd Solution DRC SARL, 2. Direction et p....{' '}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const TermsOfUse = () => {
//     return (
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate('PrivacyAppScreen', {
//             link: 'terms_of_use',
//           });
//         }}
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           borderBottomColor: colors.gris,
//           borderBottomWidth: 2,
//           paddingHorizontal: 10,
//           paddingVertical: 20,
//           gap: 10,
//         }}>
//         <FontAwesome
//           name="legal"
//           size={25}
//           color={isDarkMode ? colors.white : colors.primary}
//         />
//         <View>
//           <Text style={{color: isDarkMode ? colors.white : colors.primary}}>
//             Termes et condition d'utilisation
//           </Text>
//           <Text style={{color: colors.gris, fontSize: 10}}>
//             L'utilisation de la plateforme EcclesiaBook implique l'acceptation
//             pleine et entière des conditions
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const LegacyPrivate = () => {
//     return (
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate('PrivacyAppScreen', {
//             link: 'privacy',
//           });
//         }}
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           borderBottomColor: colors.gris,
//           borderBottomWidth: 2,
//           paddingHorizontal: 10,
//           paddingVertical: 20,
//           gap: 10,
//         }}>
//         <MaterialIcons
//           name="privacy-tip"
//           size={25}
//           color={isDarkMode ? colors.white : colors.primary}
//         />
//         <View>
//           <Text style={{color: isDarkMode ? colors.white : colors.primary}}>
//             Politique de confidentialité
//           </Text>
//           <Text style={{color: colors.gris, fontSize: 10}}>
//             Cette politique de confidentialité vous infrome de nos politiques en
//             matière de collecte de données, d'utilisation et de divulgation des
//             Informations personnelles lorsque vous utilisez le réseau social
//             évengelique EcclesiaBooK
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const Coneexion = () => {
//     return (
//       <View style={{gap: 10, paddingVertical: 20}}>
//         {auth.isAuthenticated ? (
//           <TouchableOpacity
//             onPress={() => {
//               dispatch(logoutUser());
//               navigation.navigate('Account', {
//                 screen: 'signIn',
//               });
//             }}
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               paddingHorizontal: 10,
//             }}>
//             <Text style={{color: isDarkMode ? colors.white : colors.primary}}>
//               Se déconnecter de @{camelCaseName}
//             </Text>
//             <Feather
//               name="chevron-right"
//               size={25}
//               color={isDarkMode ? colors.white : colors.primary}
//               style={{justifyContent: 'flex-end'}}
//             />
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             onPress={() => {
//               navigation.navigate('Account', {
//                 screen: 'signUp',
//               });
//             }}
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               paddingHorizontal: 10,
//             }}>
//             <Text style={{color: isDarkMode ? colors.white : colors.primary}}>
//               Ajouter un compte
//             </Text>
//             <Feather
//               name="chevron-right"
//               size={25}
//               color={isDarkMode ? colors.white : colors.primary}
//               style={{justifyContent: 'flex-end'}}
//             />
//           </TouchableOpacity>
//         )}
//         {/* <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 50 }}>
//         <Text style={{ color: isDarkMode ? colors.white : colors.primary }}>Déconnecter tous les comptes</Text>
//         <Feather name='chevron-right' size={25} color={isDarkMode ? colors.white : colors.primary} style={{ justifyContent: 'flex-end' }} />
//       </TouchableOpacity> */}
//       </View>
//     );
//   };

//     const PreferenceTheme = () => {
//     return (
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           paddingHorizontal: 10,
//           paddingVertical: 20,
//           borderBottomColor: colors.gris,
//           borderBottomWidth: 2,
//           gap: 10,
//         }}>
//         <MaterialCommunityIcons
//           name="theme-light-dark"
//           size={25}
//           color={isDarkMode ? colors.white : colors.primary}
//         />
//         <View>
//           <Text style={{color: isDarkMode ? colors.white : colors.primary}}>
//             Preference theme
//           </Text>
//           <Text style={{color: colors.gris, fontSize: 10}}>
//             Claire, Sombre, Système
//           </Text>
//         </View>
//         <View
//           style={{
//             flexDirection: 'row',
//             gap: 20,
//             justifyContent: 'flex-end',
//             flex: 1,
//             paddingHorizontal: 10,
//           }}>
//           <TouchableOpacity>
//             {isDarkMode ? (
//               <Feather name="moon" size={25} color={colors.gris} />
//             ) : (
//               <Ionicons name="moon" size={25} color={colors.black} />
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity>
//             {isDarkMode ? (
//               <Ionicons name="sunny" size={25} color={colors.white} />
//             ) : (
//               <Feather name="sun" size={25} color={colors.gris} />
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity>
//             <Feather name="smartphone" size={25} color={colors.gris} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   const AvisSugeestion = () => {
//     return (
//       <TouchableOpacity
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           borderBottomColor: colors.gris,
//           borderBottomWidth: 2,
//           paddingHorizontal: 10,
//           paddingVertical: 20,
//           gap: 10,
//         }}>
//         <MaterialCommunityIcons
//           name="clipboard-edit-outline"
//           size={25}
//           color={isDarkMode ? colors.white : colors.primary}
//         />
//         <View>
//           <Text style={{color: isDarkMode ? colors.white : colors.primary}}>
//             Avis et suggestion
//           </Text>
//           <Text style={{color: colors.gris, fontSize: 10}}>
//             Vos avis et suggestion nous aide à améloirer l'application et
//             l'ensemble du reréseau sosocial évengelique EcclesiaBooK
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const About = () => {
//     return (
//       <TouchableOpacity
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           borderBottomColor: colors.gris,
//           borderBottomWidth: 2,
//           paddingHorizontal: 10,
//           paddingVertical: 20,
//           gap: 10,
//         }}>
//         <Feather
//           name="info"
//           size={25}
//           color={isDarkMode ? colors.white : colors.primary}
//         />
//         <View>
//           <Text style={{color: isDarkMode ? colors.white : colors.primary}}>
//             À propos
//           </Text>
//           <Text style={{color: colors.gris, fontSize: 10}}>
//             Le réseau social évangélique qui uni tous les enfants de Dieu au
//             sein de l'Eglise corps du Christ sur un espace
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   React.useEffect(() => {
//     if (user && auth.isAuthenticated) {
//       let nomPrenom = user.nom + user.prenom;
//       let sansEspaces = nomPrenom.replace(/\s+/g, '');
//       let camelCase =
//         sansEspaces.charAt(0).toLowerCase() + sansEspaces.slice(1);
//       setCamelCaseName(camelCase);
//     }
//   }, []);

//   return (
//     <ScrollView
//       style={{
//         flex: 1,
//         backgroundColor: backgroundStyle.backgroundColor,
//         paddingBottom: 20,
//       }}>
//       {auth.isAuthenticated && (
//         <Text style={{marginLeft: 10, color: colors.gris, marginVertical: 10}}>
//           Compte
//         </Text>
//       )}
//       {auth.isAuthenticated && AccountUser()}
//       {/* {PreferenceTheme()} */}
//       <Text style={{marginLeft: 10, color: colors.gris, marginVertical: 10}}>
//         Information
//       </Text>
//       {MetionLegale()}
//       {TermsOfUse()}
//       {LegacyPrivate()}
//       {/* {AvisSugeestion()}
//       {About()} */}

//       <Text style={{marginLeft: 10, color: colors.gris, marginVertical: 10}}>
//         Connexion
//       </Text>
//       {Coneexion()}
//     </ScrollView>
//   );
// }

// export default SettingsScreen;
