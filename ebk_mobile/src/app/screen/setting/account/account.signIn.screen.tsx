import React, {useRef, useState} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import colors from '../../../../components/style/colors';
import PhoneInput from 'react-native-phone-input';
import Feather from 'react-native-vector-icons/Feather';
import {useAppDispatch} from '../../../store/hooks';
import {AuthLoginApi} from '../../../api/auth';
import {loginUser} from '../../../store/auth/auth.slice';
import Loading from '../../../../components/loading';
import {jwtDecode} from 'jwt-decode';
import {PayloadUserInterface} from '../../../config/interface';

export default function AccountSignInScreen({navigation}: any) {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [seePassword, setSeePassword] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const phoneRef = useRef(null);

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const handleAuthentication = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Authentification', 'Identifiants vides');
      return;
    }

    setLoading(true);
    try {
      const response = await AuthLoginApi({telephone: phoneNumber, password});
      setLoading(false);

      if (response?.access_token && response?.refresh_token) {
        dispatch(
          loginUser({
            isAuthenticated: true,
            access_token: response.access_token,
            refresh_token: response.refresh_token,
          }),
        );
        const user: PayloadUserInterface = jwtDecode(response.access_token);

        if (user?.eglise) {
          navigation.navigate('Bottom', {screen: 'HomeChurch'});
        } else {
          navigation.navigate('Bottom', {screen: 'Home'});
        }
      } else if (response?.message) {
        if (typeof response.message === 'string') {
          if (response.message === 'confirme-compte') {
            navigation.navigate('ConfirmCompteAfterCreate', {tel: phoneNumber});
          } else {
            Alert.alert('Authentification', response.message);
          }
        } else if (Array.isArray(response.message)) {
          Alert.alert('Authentification', response.message.join('\n'));
        } else {
          Alert.alert(
            'Authentification',
            "Une erreur s'est produite, réessayez plus tard.",
          );
        }
      } else {
        Alert.alert('Authentification', "Une erreur inconnue s'est produite.");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert(
        'Authentification',
        'Impossible de se connecter. Vérifiez votre connexion.',
      );
    }
  };

  const renderForm = () => (
    <View style={styles(isDarkMode).bottomPart}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <View style={styles(isDarkMode).inputWrapper}>
          <PhoneInput
            initialCountry="cd"
            ref={phoneRef}
            onChangePhoneNumber={setPhoneNumber}
            textStyle={{color: isDarkMode ? colors.white : colors.primary}}
            pickerBackgroundColor={isDarkMode ? colors.primary : colors.white}
            style={{flex: 1}}
          />
          <Feather
            name="phone"
            size={20}
            color={isDarkMode ? colors.white : colors.primary}
            style={{marginRight: 10}}
          />
        </View>

        <View style={styles(isDarkMode).inputPasswordContainer}>
          <TextInput
            style={styles(isDarkMode).passwordInput}
            placeholder="Mot de passe"
            placeholderTextColor={colors.gris}
            secureTextEntry={seePassword}
            value={password}
            onChangeText={setPassword}
          />
          <Feather
            name={seePassword ? 'lock' : 'unlock'}
            size={20}
            color={isDarkMode ? colors.white : colors.primary}
            onPress={() => setSeePassword(!seePassword)}
            style={{padding: 10}}
          />
        </View>

        <TouchableOpacity
          style={styles(isDarkMode).submitBtn}
          onPress={handleAuthentication}>
          <Text style={styles(isDarkMode).submitBtnText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('signUp')}
          style={{marginVertical: 10}}>
          <Text style={styles(isDarkMode).loginText}>
            Tu n'as pas un compte ? S'inscrire
          </Text>
        </TouchableOpacity>

        <Text style={styles(isDarkMode).privacyText}>
          En continuant avec un compte basé dans le pays suivant :
          <Text style={styles(isDarkMode).textPrivacy}> Congo - Kinshasa</Text>,
          tu acceptes nos{' '}
          <Text style={styles(isDarkMode).textPrivacy}>
            Conditions d'utilisation
          </Text>{' '}
          et reconnais avoir lu notre{' '}
          <Text style={styles(isDarkMode).textPrivacy}>
            Politique de confidentialité
          </Text>
          .
        </Text>
      </ScrollView>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <View style={styles(isDarkMode).topPart}>
        <Text style={styles(isDarkMode).titleTop}>
          Connexion à EcclesiaBooK
        </Text>
        <Text style={styles(isDarkMode).description}>
          Participe activement aux forums, plonge plus profondément dans l'étude
          biblique, et partage la merveille de la foi sur EcclesiaBook.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Bottom', {screen: 'Home'})}>
          <Image
            source={require('../../../../../assets/img/ecclessia.png')}
            style={{width: 50, height: 50, marginTop: 10}}
          />
        </TouchableOpacity>
      </View>

      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView
          behavior="padding"
          style={{flex: 1}}
          keyboardVerticalOffset={10}>
          {renderForm()}
        </KeyboardAvoidingView>
      ) : (
        renderForm()
      )}

      {loading && <Loading />}
    </View>
  );
}

const styles = (isDarkMode: boolean = true) =>
  StyleSheet.create({
    topPart: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingTop: 50,
    },
    titleTop: {
      color: isDarkMode ? colors.white : colors.primary,
      fontSize: 20,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 10,
    },
    description: {
      color: isDarkMode ? colors.whitergba6 : colors.gris,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 15,
    },
    bottomPart: {
      flex: 3,
      backgroundColor: isDarkMode ? colors.cardDark : colors.white,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      paddingHorizontal: 20,
      paddingTop: 20,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: -2},
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? colors.secondary : colors.lighter,
      borderRadius: 14,
      marginVertical: 10,
      height: 50,
      paddingHorizontal: 10,
    },
    inputPasswordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? colors.secondary : colors.lighter,
      borderRadius: 14,
      marginVertical: 10,
      paddingHorizontal: 10,
      height: 50,
    },
    passwordInput: {
      flex: 1,
      height: 50,
      color: isDarkMode ? colors.white : colors.primary,
      fontSize: 15,
    },
    submitBtn: {
      backgroundColor: isDarkMode ? colors.blue : colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 15,
      borderRadius: 30,
      marginVertical: 15,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    submitBtnText: {
      color: colors.white,
      fontSize: 18,
      fontWeight: '700',
    },
    loginText: {
      color: isDarkMode ? colors.secondary : colors.light,
      fontSize: 15,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    privacyText: {
      fontSize: 12,
      color: colors.gris,
      textAlign: 'center',
      marginVertical: 10,
      lineHeight: 18,
    },
    textPrivacy: {
      fontWeight: 'bold',
      color: isDarkMode ? colors.whitergba8 : colors.primary,
    },
  });

// 2eme

// import React, {useRef, useState} from 'react';
// import {
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   useColorScheme,
// } from 'react-native';
// import colors from '../../../../components/style/colors';
// import PhoneInput from 'react-native-phone-input';
// import Feather from 'react-native-vector-icons/Feather';
// import {useAppDispatch} from '../../../store/hooks';
// import {AuthLoginApi} from '../../../api/auth';
// import {loginUser} from '../../../store/auth/auth.slice';
// import Loading from '../../../../components/loading';
// import {jwtDecode} from 'jwt-decode';
// import {PayloadUserInterface} from '../../../config/interface';

// export default function AccountSignInScreen({navigation}: any) {
//   const [phoneNumber, setPhoneNumber] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [seepassword, setSeePassword] = useState<boolean>(true);
//   const [loading, setLoading] = useState<boolean>(false);
//   const dispatch = useAppDispatch();
//   const phone = useRef(null);

//   const isDarkMode = useColorScheme() === 'dark';
//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? colors.primary : colors.lighter,
//   };

//   const handleAuthentication = async () => {
//     if (phoneNumber && password) {
//       setLoading(true);
//       const authLoginApi = await AuthLoginApi({
//         telephone: phoneNumber,
//         password,
//       });
//       setLoading(false);

//       if (authLoginApi?.access_token && authLoginApi?.refresh_token) {
//         dispatch(
//           loginUser({
//             isAuthenticated: true,
//             access_token: authLoginApi.access_token,
//             refresh_token: authLoginApi.refresh_token,
//           }),
//         );
//         const user: PayloadUserInterface = jwtDecode(authLoginApi.access_token);
//         if (user?.eglise) {
//           navigation.navigate('Bottom', {
//             screen: user.eglise ? 'HomeChurch' : 'Home',
//           });
//         } else {
//           navigation.navigate('Bottom', {screen: 'Home'});
//         }
//       } else {
//         const message =
//           typeof authLoginApi.message === 'object'
//             ? authLoginApi.message.join(';\n')
//             : authLoginApi?.message ||
//               "Une erreur s'est produite, réessayez plus tard";
//         Alert.alert('Authentification', message);
//       }
//     } else {
//       Alert.alert('Authentification', 'Identifiants vides');
//     }
//   };

//   return (
//     <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
//       {/* Top Part */}
//       <View style={styles(isDarkMode).topPart}>
//         <Text style={styles(isDarkMode).titleTop}>
//           Connexion à EcclesiaBooK
//         </Text>
//         <Text style={styles(isDarkMode).description}>
//           Participe activement aux forums, plonge plus profondément dans l'étude
//           biblique, et partage la merveille de la foi en témoignant de la grâce
//           divine sur EcclesiaBook.
//         </Text>
//         <TouchableOpacity
//           style={{padding: 10}}
//           onPress={() => navigation.navigate('Bottom', {screen: 'Home'})}>
//           <Image
//             source={require('../../../../../assets/img/ecclessia.png')}
//             style={{width: 50, height: 50, marginTop: 10}}
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Bottom Part */}
//       <View style={styles(isDarkMode).bottomPart}>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={{flex: 1}}
//           // keyboardVerticalOffset={10}
//           keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 50}>
//           <ScrollView
//             style={{flex: 1}}
//             keyboardShouldPersistTaps="handled"
//             keyboardDismissMode="on-drag">
//             <PhoneInput
//               initialCountry={'cd'}
//               ref={phone}
//               onChangePhoneNumber={setPhoneNumber}
//               textStyle={{color: isDarkMode ? colors.white : colors.primary}}
//               cancelText="Annuler"
//               confirmText="Confirmer"
//               pickerBackgroundColor={isDarkMode ? colors.primary : colors.white}
//               style={styles(isDarkMode).textInput}
//             />

//             <View style={styles(isDarkMode).inputPasswordContainer}>
//               <TextInput
//                 style={styles(isDarkMode).passwordInput}
//                 placeholder="Mot de passe"
//                 placeholderTextColor={colors.gris}
//                 secureTextEntry={seepassword}
//                 value={password}
//                 onChangeText={setPassword}
//               />
//               <Feather
//                 onPress={() => setSeePassword(!seepassword)}
//                 name={seepassword ? 'lock' : 'unlock'}
//                 size={20}
//                 color={isDarkMode ? colors.white : colors.primary}
//                 style={{padding: 10}}
//               />
//             </View>

//             <TouchableOpacity
//               style={styles(isDarkMode).submitBtn}
//               onPress={handleAuthentication}>
//               <Text style={styles(isDarkMode).submitBtnText}>Se connecter</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => navigation.navigate('signUp')}
//               style={{marginVertical: 10}}>
//               <Text style={styles(isDarkMode).loginText}>
//                 Tu n'as pas un compte ? S'inscrire
//               </Text>
//             </TouchableOpacity>

//             <Text style={styles(isDarkMode).privacyText}>
//               En continuant avec un compte basé dans le pays suivant :{' '}
//               <Text style={styles(isDarkMode).textPrivacy}>
//                 Congo - Kinshasa
//               </Text>
//               , tu acceptes nos{' '}
//               <Text style={styles(isDarkMode).textPrivacy}>
//                 Conditions d'utilisation
//               </Text>{' '}
//               et reconnais avoir lu notre{' '}
//               <Text style={styles(isDarkMode).textPrivacy}>
//                 Politique de confidentialité
//               </Text>
//               .
//             </Text>
//           </ScrollView>
//           {loading && <Loading />}
//         </KeyboardAvoidingView>
//       </View>
//     </View>
//   );
// }

// const styles = (isDarkMode: boolean = true) =>
//   StyleSheet.create({
//     topPart: {
//       flex: 1,
//       alignItems: 'center',
//       justifyContent: 'center',
//       paddingHorizontal: 20,
//       paddingTop: 50,
//     },
//     titleTop: {
//       color: isDarkMode ? colors.white : colors.primary,
//       fontSize: 20,
//       fontWeight: '700',
//       textAlign: 'center',
//       marginBottom: 10,
//     },
//     description: {
//       color: isDarkMode ? colors.whitergba6 : colors.gris,
//       fontSize: 14,
//       textAlign: 'center',
//       lineHeight: 20,
//       marginBottom: 15,
//     },
//     bottomPart: {
//       flex: 3,
//       backgroundColor: isDarkMode ? colors.cardDark : colors.white,
//       borderTopLeftRadius: 40,
//       borderTopRightRadius: 40,
//       paddingHorizontal: 20,
//       paddingTop: 30,
//       shadowColor: '#000',
//       shadowOffset: {width: 0, height: -2},
//       shadowOpacity: 0.1,
//       shadowRadius: 5,
//       marginTop: 60,
//       elevation: 5,
//     },
//     textInput: {
//       backgroundColor: isDarkMode ? colors.secondary : colors.lighter,
//       height: 50,
//       borderRadius: 14,
//       paddingHorizontal: 15,
//       marginVertical: 10,
//       color: isDarkMode ? colors.white : colors.primary,
//       fontSize: 15,
//       shadowColor: '#000',
//       shadowOffset: {width: 0, height: 1},
//       shadowOpacity: 0.1,
//       shadowRadius: 2,
//       elevation: 1,
//     },
//     inputPasswordContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       backgroundColor: isDarkMode ? colors.secondary : colors.lighter,
//       borderRadius: 14,
//       marginVertical: 10,
//       paddingHorizontal: 10,
//     },
//     passwordInput: {
//       flex: 1,
//       height: 50,
//       color: isDarkMode ? colors.white : colors.primary,
//       fontSize: 15,
//     },
//     submitBtn: {
//       backgroundColor: isDarkMode ? colors.blue : colors.primary,
//       justifyContent: 'center',
//       alignItems: 'center',
//       paddingVertical: 15,
//       borderRadius: 30,
//       marginVertical: 15,
//       shadowColor: '#000',
//       shadowOffset: {width: 0, height: 3},
//       shadowOpacity: 0.2,
//       shadowRadius: 4,
//       elevation: 3,
//     },
//     submitBtnText: {
//       color: colors.white,
//       fontSize: 18,
//       fontWeight: '700',
//     },
//     loginText: {
//       color: isDarkMode ? colors.secondary : colors.light,
//       fontSize: 15,
//       textAlign: 'center',
//       fontWeight: 'bold',
//     },
//     privacyText: {
//       fontSize: 12,
//       color: colors.gris,
//       textAlign: 'center',
//       marginVertical: 10,
//       lineHeight: 18,
//     },
//     textPrivacy: {
//       fontWeight: 'bold',
//       color: isDarkMode ? colors.whitergba8 : colors.primary,
//     },
//   });

// 3eme

// import {
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   useColorScheme,
// } from 'react-native';
// import colors from '../../../../components/style/colors';
// import {useRef, useState} from 'react';
// import PhoneInput from 'react-native-phone-input';
// import Feather from 'react-native-vector-icons/Feather';
// import {useAppDispatch} from '../../../store/hooks';
// import {AuthLoginApi} from '../../../api/auth';
// import {loginUser} from '../../../store/auth/auth.slice';
// import Loading from '../../../../components/loading';
// import {jwtDecode} from 'jwt-decode';
// import React from 'react';
// import {PayloadUserInterface} from '../../../config/interface';

// export default function AccountSignInScreen({navigation}: any) {
//   const [phoneNumber, setPhoneNumber] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [seepassword, setSeePassword] = useState<boolean>(true);
//   const [loading, setLoading] = useState<boolean>(false);
//   const dispatch = useAppDispatch();
//   const phone = useRef(null);

//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? colors.primary : colors.lighter,
//   };

//   const handleAuthentication = async () => {
//     if (phoneNumber !== '' && password !== '') {
//       setLoading(true);
//       const authLoginApi = await AuthLoginApi({
//         telephone: phoneNumber,
//         password,
//       });
//       setLoading(false);

//       if (
//         authLoginApi?.hasOwnProperty('access_token') &&
//         authLoginApi?.hasOwnProperty('refresh_token')
//       ) {
//         dispatch(
//           loginUser({
//             isAuthenticated: true,
//             access_token: authLoginApi?.access_token,
//             refresh_token: authLoginApi?.refresh_token,
//           }),
//         );
//         const user: PayloadUserInterface = jwtDecode(
//           authLoginApi?.access_token,
//         );
//         if (user) {
//           if (user.hasOwnProperty('eglise')) {
//             if (user.eglise) {
//               navigation.navigate('Bottom', {
//                 screen: 'HomeChurch',
//               });
//             } else {
//               navigation.navigate('Bottom', {
//                 screen: 'Home',
//               });
//             }
//           } else {
//             navigation.navigate('Bottom', {
//               screen: 'Home',
//             });
//           }
//         } else {
//           navigation.navigate('Bottom', {
//             screen: 'Home',
//           });
//         }
//       } else {
//         if (typeof authLoginApi.message === 'object') {
//           let message = '';
//           authLoginApi.message.map(
//             (item: string) => (message += `${item}; \n`),
//           );
//           Alert.alert('Authentification', message);
//         } else if (typeof authLoginApi?.message === 'string') {
//           if (authLoginApi?.message === 'confirme-compte') {
//             navigation.navigate('ConfirmCompteAfterCreate', {
//               tel: phoneNumber,
//             });
//           } else {
//             Alert.alert('Authentification', authLoginApi?.message);
//           }
//         } else {
//           Alert.alert(
//             'Authentification',
//             "Une erreur s'est produite lors de votre connexion;\n Réessayez plus tard",
//           );
//         }
//       }
//     } else {
//       Alert.alert('Authentification', 'Identifiants vides');
//     }
//   };

//   const renderForm = () => (
//     <View style={styles(isDarkMode).bottomPart}>
//       <ScrollView style={{flex: 1}}>
//         <View style={styles(isDarkMode).inputWrapper}>
//           <PhoneInput
//             initialCountry={'cd'}
//             ref={phone}
//             onChangePhoneNumber={e => {
//               setPhoneNumber(e);
//             }}
//             textStyle={{
//               color: colors.gris,
//               width: '100%',
//             }}
//             cancelText={'Annuler'}
//             confirmText={'Confirmer'}
//             pickerBackgroundColor={isDarkMode ? colors.primary : colors.white}
//             pickerItemStyle={{
//               backgroundColor: isDarkMode ? colors.primary : colors.white,
//             }}
//             pickerButtonColor={colors.primary}
//             cancelTextStyle={{
//               padding: 10,
//               backgroundColor: isDarkMode ? colors.secondary : colors.light,
//               borderRadius: 10,
//             }}
//             confirmTextStyle={{
//               padding: 10,
//               backgroundColor: isDarkMode ? colors.secondary : colors.light,
//               borderRadius: 10,
//             }}
//             flagStyle={{
//               width: 30,
//               height: 20,
//               padding: 10,
//             }}
//             buttonTextStyle={{
//               color: colors.gris,
//               backgroundColor: colors.gris,
//               padding: 10,
//             }}
//             style={{flex: 1}}
//           />
//           <Feather
//             name="phone"
//             size={20}
//             color={isDarkMode ? colors.white : colors.primary}
//             style={{marginRight: 10}}
//           />
//         </View>

//         <View style={styles(isDarkMode).inputWrapper}>
//           <TextInput
//             style={styles(isDarkMode).textInputField}
//             placeholder="Mot de passe"
//             placeholderTextColor={colors.gris}
//             secureTextEntry={seepassword}
//             value={password}
//             onChangeText={e => setPassword(e)}
//           />
//           <TouchableOpacity
//             onPress={() => {
//               setSeePassword(!seepassword);
//             }}>
//             <Feather
//               name={seepassword ? 'lock' : 'unlock'}
//               size={20}
//               color={isDarkMode ? colors.white : colors.primary}
//               style={{padding: 10}}
//             />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           onPress={handleAuthentication}
//           style={styles(isDarkMode).submitBtn}>
//           <Text
//             style={{
//               color: isDarkMode ? colors.white : colors.primary,
//               fontSize: 25,
//             }}>
//             Se connecter
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => {
//             navigation.navigate('signUp');
//           }}
//           style={{marginVertical: 10}}>
//           <Text
//             style={{
//               color: isDarkMode ? colors.primary : colors.white,
//               fontSize: 15,
//               textAlign: 'center',
//             }}>
//             Tu n'as pas un compte ? S'inscrire
//           </Text>
//         </TouchableOpacity>
//         <View style={{marginVertical: 10}}>
//           <Text
//             style={{
//               color: colors.gris,
//               textAlign: 'center',
//             }}>
//             En continuant avec un compte basé dans le pays suivant :
//             <Text style={styles(isDarkMode).textPrivacy}>
//               {' '}
//               Congo - Kinshasa
//             </Text>
//             , tu acceptes nos{' '}
//             <Text style={styles(isDarkMode).textPrivacy}>
//               Conditions d'utilisation
//             </Text>{' '}
//             et reconnais avoir lu notre{' '}
//             <Text style={styles(isDarkMode).textPrivacy}>
//               Politique de confidentialité.
//             </Text>
//           </Text>
//         </View>
//       </ScrollView>
//     </View>
//   );

//   return (
//     <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
//       <View style={styles(isDarkMode).topPart}>
//         <Text style={styles(isDarkMode).titleTop}>
//           Connexion à EcclesiaBooK
//         </Text>
//         <Text style={styles(isDarkMode).description}>
//           Participe activement aux forums, plonge plus profondément dans l'étude
//           biblique, et partage la merveille de la foi en témoignant de la grâce
//           divine sur EcclesiaBook.
//         </Text>
//         <TouchableOpacity
//           style={{padding: 10}}
//           onPress={() => {
//             navigation.navigate('Bottom', {
//               screen: 'Home',
//             });
//           }}>
//           <Image
//             source={require('../../../../../assets/img/ecclessia.png')}
//             style={{
//               width: 50,
//               height: 50,
//               marginTop: 10,
//             }}
//           />
//         </TouchableOpacity>
//       </View>
//       {Platform.OS === 'ios' ? (
//         <KeyboardAvoidingView
//           behavior="padding"
//           style={{flex: 1}}
//           keyboardVerticalOffset={10}>
//           {renderForm()}
//         </KeyboardAvoidingView>
//       ) : (
//         <>{renderForm()}</>
//       )}
//       {loading ? <Loading /> : null}
//     </View>
//   );
// }

// const styles = (isDarkMode: boolean = true) =>
//   StyleSheet.create({
//     topPart: {
//       flex: 1,
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
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
//     bottomPart: {
//       flex: 1,
//       backgroundColor: isDarkMode ? colors.white : colors.primary,
//       borderTopLeftRadius: 50,
//       borderTopRightRadius: 50,
//       paddingHorizontal: 10,
//       paddingTop: 30,
//       gap: 15,
//     },
//     inputWrapper: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       backgroundColor: isDarkMode ? colors.secondary : colors.white,
//       borderRadius: 14,
//       paddingHorizontal: 10,
//       marginVertical: 10,
//       height: 50,
//     },
//     textInputField: {
//       flex: 1,
//       color: isDarkMode ? colors.white : colors.primary,
//     },
//     submitBtn: {
//       backgroundColor: isDarkMode ? colors.primary : colors.light,
//       justifyContent: 'center',
//       alignItems: 'center',
//       padding: 15,
//       borderRadius: 25,
//       shadowColor: 'black',
//       shadowOffset: {width: 0, height: 5},
//       shadowOpacity: 0.5,
//       shadowRadius: 2,
//       elevation: 5,
//       alignContent: 'center',
//     },
//     textPrivacy: {
//       fontWeight: 'bold',
//       color: isDarkMode ? colors.black : colors.white,
//     },
//   });
