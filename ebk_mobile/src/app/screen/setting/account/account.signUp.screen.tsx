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
import {CreateAccountApi} from '../../../api/auth';
import {loginUser} from '../../../store/auth/auth.slice';
import Loading from '../../../../components/loading';

export default function AccountSignUpScreen({navigation}: any) {
  const dispatch = useAppDispatch();
  const [nom, setNom] = useState<string>('');
  const [prenom, setPrenom] = useState<string>('');
  const [telephone, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confpassword, setConfPassword] = useState<string>('');
  const [seeConfpassword, setSeeConfPassword] = useState<boolean>(true);
  const [seepassword, setSeePassword] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const phone = useRef(null);

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const handSignUp = async () => {
    if (nom && prenom && telephone && password) {
      if (password === confpassword) {
        if (password.length >= 8) {
          if (telephone.length > 4) {
            setLoading(true);
            const createAccount = await CreateAccountApi({
              nom,
              prenom,
              email,
              telephone,
              password,
            });
            if (createAccount?.access_token && createAccount?.refresh_token) {
              dispatch(
                loginUser({
                  isAuthenticated: true,
                  access_token: createAccount.access_token,
                  refresh_token: createAccount.refresh_token,
                }),
              );
              navigation.navigate('Bottom');
            } else {
              if (createAccount?.statusCode === 409) {
                Alert.alert('Erreur', createAccount?.message);
              } else if (createAccount?.statusCode === 400) {
                createAccount?.message.forEach((el: string) => {
                  Alert.alert('Erreur', el);
                });
              }
              setLoading(false);
            }
          } else {
            Alert.alert('Erreur', 'Numéro invalide.');
          }
        } else {
          Alert.alert(
            'Erreur',
            'Le mot de passe doit contenir au moins 8 caractères.',
          );
        }
      } else {
        Alert.alert(
          'Erreur',
          'Le mot de passe et sa confirmation doivent correspondre.',
        );
      }
    } else {
      Alert.alert('Champs Obligatoires', 'Tous les champs sont obligatoires.');
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <View style={styles(isDarkMode).topPart}>
        <Text style={styles(isDarkMode).titleTop}>
          Inscription à EcclesiaBooK
        </Text>
        <Text style={styles(isDarkMode).description}>
          Crée un compte, participe activement aux forums, plonge dans l'étude
          biblique, et partage la foi sur EcclesiaBook.
        </Text>
        <TouchableOpacity
          style={{paddingHorizontal: 10, marginBottom: 10}}
          onPress={() => navigation.navigate('Bottom', {screen: 'Home'})}>
          <Image
            source={require('../../../../../assets/img/ecclessia.png')}
            style={{width: 50, height: 50, marginTop: 10}}
          />
        </TouchableOpacity>
      </View>

      <View style={styles(isDarkMode).bottomPart}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}
          keyboardVerticalOffset={30}>
          <ScrollView style={{flex: 1}}>
            <TextInput
              style={styles(isDarkMode).textInput}
              placeholder="Nom"
              placeholderTextColor={colors.gris}
              value={nom}
              onChangeText={setNom}
            />
            <TextInput
              style={styles(isDarkMode).textInput}
              placeholder="Prénom"
              placeholderTextColor={colors.gris}
              value={prenom}
              onChangeText={setPrenom}
            />
            <PhoneInput
              initialCountry={'cd'}
              ref={phone}
              onChangePhoneNumber={setPhoneNumber}
              textStyle={{color: isDarkMode ? colors.white : colors.primary}}
              cancelText="Annuler"
              confirmText="Confirmer"
              pickerBackgroundColor={isDarkMode ? colors.primary : colors.white}
              style={styles(isDarkMode).textInput}
            />
            {/* Password */}
            <View style={styles(isDarkMode).inputPasswordContainer}>
              <TextInput
                style={styles(isDarkMode).passwordInput}
                placeholder="Mot de passe"
                placeholderTextColor={colors.gris}
                secureTextEntry={seepassword}
                value={password}
                onChangeText={setPassword}
              />
              <Feather
                onPress={() => setSeePassword(!seepassword)}
                name={seepassword ? 'lock' : 'unlock'}
                size={20}
                color={isDarkMode ? colors.white : colors.primary}
                style={{padding: 10}}
              />
            </View>
            <View style={styles(isDarkMode).inputPasswordContainer}>
              <TextInput
                style={styles(isDarkMode).passwordInput}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor={colors.gris}
                secureTextEntry={seeConfpassword}
                value={confpassword}
                onChangeText={setConfPassword}
              />
              <Feather
                onPress={() => setSeeConfPassword(!seeConfpassword)}
                name={seeConfpassword ? 'lock' : 'unlock'}
                size={20}
                color={isDarkMode ? colors.white : colors.primary}
                style={{padding: 10}}
              />
            </View>

            <TouchableOpacity
              style={styles(isDarkMode).submitBtn}
              onPress={handSignUp}>
              <Text style={styles(isDarkMode).submitBtnText}>S'inscrire</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('signIn')}
              style={{marginVertical: 10}}>
              <Text style={styles(isDarkMode).loginText}>
                Tu as déjà un compte ? Connexion
              </Text>
            </TouchableOpacity>

            <Text style={styles(isDarkMode).privacyText}>
              En continuant avec un compte basé dans le pays suivant :{' '}
              <Text style={styles(isDarkMode).textPrivacy}>
                Congo - Kinshasa
              </Text>
              , tu acceptes nos{' '}
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
        </KeyboardAvoidingView>
      </View>
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
    },
    titleTop: {
      color: isDarkMode ? colors.white : colors.primary,
      fontSize: 20,
      fontWeight: '700',
      textAlign: 'center',
      marginTop: 10,
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
      paddingTop: 30,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: -2},
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    textInput: {
      backgroundColor: isDarkMode ? colors.secondary : colors.lighter,
      height: 50,
      borderRadius: 14,
      paddingHorizontal: 15,
      marginVertical: 10,
      color: isDarkMode ? colors.white : colors.primary,
      fontSize: 15,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    inputPasswordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? colors.secondary : colors.lighter,
      borderRadius: 14,
      marginVertical: 10,
      paddingHorizontal: 10,
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

// import React from 'react';
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
// import {CreateAccountApi} from '../../../api/auth';
// import {loginUser} from '../../../store/auth/auth.slice';
// import Loading from '../../../../components/loading';

// export default function AccountSignUpScreen({navigation}: any) {
//   const dispatch = useAppDispatch();

//   const [nom, setNom] = useState<string>('');
//   const [prenom, setPrenom] = useState<string>('');
//   const [telephone, setPhoneNumber] = useState<string>('');
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [confpassword, setConfPassword] = useState<string>('');
//   const [seeConfpassword, setSeeConfPassword] = useState<boolean>(true);
//   const [seepassword, setSeePassword] = useState<boolean>(true);

//   const [loading, setLoading] = useState<boolean>(false);
//   const phone = useRef(null);

//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? colors.primary : colors.lighter,
//   };

//   const handSignUp = async () => {
//     if (nom !== '' && prenom !== '' && telephone !== '' && password !== '') {
//       if (password === confpassword) {
//         if (password.length >= 8) {
//           if (telephone.length > 4) {
//             setLoading(true);
//             const createAccount = await CreateAccountApi({
//               nom,
//               prenom,
//               email,
//               telephone,
//               password,
//             });
//             if (
//               createAccount?.hasOwnProperty('access_token') &&
//               createAccount?.hasOwnProperty('refresh_token')
//             ) {
//               dispatch(
//                 loginUser({
//                   isAuthenticated: true,
//                   access_token: createAccount?.access_token,
//                   refresh_token: createAccount?.refresh_token,
//                 }),
//               );
//               navigation.navigate('Bottom');
//             } else {
//               if (createAccount?.statusCode === 409) {
//                 Alert.alert('Erreur', createAccount?.message);
//               } else if (createAccount?.statusCode === 400) {
//                 createAccount?.message.forEach((element: string) => {
//                   Alert.alert('Erreur', element);
//                 });
//               }
//               setLoading(false);
//             }
//           } else {
//             Alert.alert(
//               'Erreur',
//               "Le numéro que vous avez entré n'est pas valide. Veuillez réessayer avec un numéro correct.",
//             );
//           }
//         } else {
//           Alert.alert(
//             'Erreur',
//             'Le mot de passe doit contenir au moins 8 caractères et inclure une combinaison de lettres, de chiffres et de caractères spéciaux pour renforcer sa sécurité.',
//           );
//         }
//       } else {
//         Alert.alert(
//           'Erreur',
//           'Le mot de passe et sa confirmation doivent être identiques pour des raisons de sécurité et de validation.',
//         );
//       }
//     } else {
//       Alert.alert('Champs Obligatoires', 'Tous les champs sont obligatoires.');
//     }
//   };

//   return (
//     <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
//       <View style={styles(isDarkMode).topPart}>
//         <Text style={styles(isDarkMode).titleTop}>
//           Inscription à EcclesiaBooK
//         </Text>
//         <Text style={styles(isDarkMode).description}>
//           Crée un compte, participe activement aux forums, plonge plus
//           profondément dans l'étude biblique, et partage la merveille de la foi
//           en témoignant de la grâce divine sur EcclesiaBook.
//         </Text>
//         <TouchableOpacity
//           style={{
//             padding: 10,
//           }}
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
//       <View style={styles(isDarkMode).bottomPart}>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={{flex: 1}}
//           keyboardVerticalOffset={30}>
//           <ScrollView style={{flex: 1}}>
//             <TextInput
//               style={styles(isDarkMode).textInput}
//               placeholder="Nom"
//               placeholderTextColor={colors.gris}
//               value={nom}
//               onChangeText={e => setNom(e)}
//             />
//             <TextInput
//               style={styles(isDarkMode).textInput}
//               placeholder="Prénom"
//               placeholderTextColor={colors.gris}
//               value={prenom}
//               onChangeText={e => setPrenom(e)}
//             />
//             <PhoneInput
//               initialCountry={'cd'}
//               ref={phone}
//               onChangePhoneNumber={e => {
//                 setPhoneNumber(e);
//               }}
//               textStyle={{
//                 color: isDarkMode ? colors.white : colors.black,
//               }}
//               cancelText={'Annuler'}
//               confirmText={'Confirmer'}
//               pickerBackgroundColor={isDarkMode ? colors.primary : colors.white}
//               pickerItemStyle={{
//                 backgroundColor: isDarkMode ? colors.primary : colors.white,
//               }}
//               pickerButtonColor={colors.primary}
//               cancelTextStyle={{
//                 padding: 10,
//                 backgroundColor: isDarkMode ? colors.secondary : colors.light,
//                 borderRadius: 10,
//               }}
//               confirmTextStyle={{
//                 padding: 10,
//                 backgroundColor: isDarkMode ? colors.secondary : colors.light,
//                 borderRadius: 10,
//               }}
//               flagStyle={{
//                 width: 30,
//                 height: 20,
//                 padding: 10,
//               }}
//               buttonTextStyle={{
//                 color: colors.gris,
//                 backgroundColor: colors.gris,
//                 padding: 10,
//               }}
//               style={styles(isDarkMode).textInput}
//             />
//             <View
//               style={[
//                 styles(isDarkMode).textInput,
//                 {
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                 },
//               ]}>
//               <TextInput
//                 style={[styles(isDarkMode).textInput, {width: '90%'}]}
//                 placeholder="Mot de passe"
//                 placeholderTextColor={colors.gris}
//                 secureTextEntry={seepassword}
//                 value={password}
//                 onChangeText={e => setPassword(e)}
//               />
//               <Feather
//                 onPress={() => {
//                   setSeePassword(!seepassword);
//                 }}
//                 name={seepassword ? 'lock' : 'unlock'}
//                 size={20}
//                 color={isDarkMode ? colors.white : colors.primary}
//                 style={{padding: 10}}
//               />
//             </View>
//             <View
//               style={[
//                 styles(isDarkMode).textInput,
//                 {
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                 },
//               ]}>
//               <TextInput
//                 style={{
//                   flex: 1,
//                   height: 50,
//                   color: isDarkMode ? colors.white : colors.primary,
//                 }}
//                 placeholder="Confirmer le mot de passer"
//                 placeholderTextColor={colors.gris}
//                 secureTextEntry={seeConfpassword}
//                 value={confpassword}
//                 onChangeText={e => setConfPassword(e)}
//               />
//               <Feather
//                 onPress={() => {
//                   setSeeConfPassword(!seeConfpassword);
//                 }}
//                 name={seeConfpassword ? 'lock' : 'unlock'}
//                 size={20}
//                 color={isDarkMode ? colors.white : colors.primary}
//                 style={{padding: 10}}
//               />
//             </View>

//             <TouchableOpacity
//               onPress={handSignUp}
//               style={styles(isDarkMode).submitBtn}>
//               <Text
//                 style={{
//                   color: isDarkMode ? colors.white : colors.primary,
//                   fontSize: 25,
//                 }}>
//                 S'inscrire
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => {
//                 navigation.navigate('signIn');
//               }}
//               style={{marginVertical: 10}}>
//               <Text
//                 style={{
//                   color: isDarkMode ? colors.secondary : colors.light,
//                   fontSize: 15,
//                   textAlign: 'center',
//                   fontWeight: 'bold',
//                 }}>
//                 Tu as déjà un compte ? Connexion
//               </Text>
//             </TouchableOpacity>
//             <View style={{marginVertical: 10}}>
//               <Text
//                 style={{
//                   color: colors.gris,
//                   textAlign: 'center',
//                 }}>
//                 En continuant avec un compte basé dans le pays suivant :
//                 <Text style={styles(isDarkMode).textPrivacy}>
//                   Congo - Kinshasa
//                 </Text>
//                 , tu acceptes nos{' '}
//                 <Text style={styles(isDarkMode).textPrivacy}>
//                   Conditions d'utilisation{' '}
//                 </Text>
//                 et reconnais avoir lu notre{' '}
//                 <Text style={styles(isDarkMode).textPrivacy}>
//                   Politique de confidentialité.
//                 </Text>
//               </Text>
//             </View>
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
//       flex: 3,
//       backgroundColor: isDarkMode ? colors.white : colors.primary,
//       borderTopLeftRadius: 50,
//       borderTopRightRadius: 50,
//       paddingHorizontal: 10,
//       paddingTop: 30,
//       gap: 15,
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