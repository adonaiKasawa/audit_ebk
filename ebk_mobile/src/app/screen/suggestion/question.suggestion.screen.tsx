import {jwtDecode} from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {
  Alert,
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
import Feather from 'react-native-vector-icons/Feather';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {selectAuth} from '../../store/auth/auth.slice';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {PayloadUserInterface, Suggestion, Users} from '../../config/interface';
import colors from '../../../components/style/colors';
import {findSuggestionsByUseApi, sendSuggestionApi} from '../../api/auth';
import LoadingGif from '../../../components/loading/loadingGif';

import {SkeletonLoaderSuggestion} from '../../../components/skeleon/skeleton.loader.ui';
import SuggestionItem from '../../../components/suggestion/suggestion.item.ui';

function QuestionSuggestionScreen({navigation}: {navigation: any}) {
  const auth = useAppSelector(selectAuth);
  const decode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
    decode,
  );
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [motivation, setMotifivation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]); // 1. State local

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const getSuggestions = async () => {
    // 2. Fonction pour fetch
    try {
      setLoadingSuggestions(true);
      const response = await findSuggestionsByUseApi();
      if (response?.status === 200 && response.data) {
        setSuggestions(response.data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des suggestions :', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    // 3. Chargement au montage
    getSuggestions();
  }, []);

  const handelSendAvisEndSuggestion = async () => {
    if (auth.isAuthenticated) {
      if (motivation) {
        setLoading(true);
        const send = await sendSuggestionApi(motivation);
        setLoading(false);
        console.log(send);

        if (send?.status === 201) {
          Alert.alert('Envoie réussir', 'Merci pour votre soutien.', [
            {
              text: 'Ok',
              onPress: () => {
                navigation.goBack();
              },
              style: 'cancel',
            },
            {
              text: 'Donnez un autre avis',
              onPress: () => {
                setMotifivation('');
              },
            },
          ]);
        } else {
          Alert.alert(
            "Message d'erreur",
            "Une erreur est survenue lors de l'envoie de votre message.",
          );
        }
      } else {
        Alert.alert(
          'Champ vide',
          'Veuillez écrire un message avant de l’envoyer.',
        );
      }
    } else {
      Alert.alert(
        'Connexion requise',
        'Votre interaction est précieuse. Connectez-vous pour aimer le contenu.',
        [
          {
            text: 'SE CONNECTER',
            onPress: () => {
              navigation.navigate('Account', {
                screen: 'signIn',
              });
            },
            style: 'cancel',
          },
          {text: 'ANNULER', onPress: () => {}},
        ],
      );
    }
  };

  return (
    <BottomSheetModalProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={20}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: backgroundStyle.backgroundColor,
            borderBottomWidth: 0.5,
            borderBottomColor: isDarkMode ? '#333' : '#ccc',
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather
              name="arrow-left"
              size={26}
              color={isDarkMode ? colors.white : colors.black}
            />
          </TouchableOpacity>

          <View style={{flex: 1, alignItems: 'center'}}>
            <Text
              style={{
                color: isDarkMode ? colors.white : colors.black,
                fontSize: 18,
                fontWeight: '600',
              }}>
              Suggestions & Avis
            </Text>
          </View>
          <View style={{width: 26}} />
        </View>
        <ScrollView
          style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
          <View style={{padding: 10}}>
            <View style={{paddingBottom: 0, paddingHorizontal: 8}}>
              <Text
                style={{
                  color: isDarkMode ? colors.white : colors.primary,
                  fontSize: 13,
                  fontWeight: '400',
                  marginBottom: 10,
                  lineHeight: 21,
                }}>
                Vos avis, suggestions, ou remarques sont les bienvenus pour
                améliorer l’application. Merci de prendre un moment pour les
                partager.
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <TextInput
                multiline
                numberOfLines={3}
                style={[
                  styles(isDarkMode).textInput,
                  {
                    height: 80,
                    paddingTop: 12,
                    paddingBottom: 12,
                    fontSize: 14,
                    textAlignVertical: 'top',
                    borderWidth: 1,
                    borderColor: isDarkMode ? '#444' : '#ccc',
                    flex: 1,
                  },
                ]}
                placeholder="Écrivez votre suggestion ici..."
                placeholderTextColor={colors.gris}
                value={motivation}
                onChangeText={setMotifivation}
              />

              {loading ? (
                <LoadingGif width={40} height={40} />
              ) : (
                <TouchableOpacity
                  onPress={handelSendAvisEndSuggestion}
                  style={[
                    styles(isDarkMode).submitBtn,
                    {
                      width: 40,
                      height: 40,
                      paddingVertical: 12,
                      marginTop: 'auto',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}>
                  <Feather
                    name="send"
                    size={20}
                    color={isDarkMode ? colors.primary : colors.white}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {loadingSuggestions ? (
            <SkeletonLoaderSuggestion />
          ) : (
            <SuggestionItem
              colorScheme={isDarkMode ? 'dark' : 'light'}
              suggestions={suggestions}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </BottomSheetModalProvider>
  );
}

export default QuestionSuggestionScreen;

const styles = (isDarkMode: boolean = true) =>
  StyleSheet.create({
    topPart: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleTop: {
      color: isDarkMode ? colors.white : colors.primary,
      fontSize: Platform.OS === 'android' ? 25 : 30,
      fontWeight: 'bold',
    },
    description: {
      color: colors.gris,
      fontSize: 12,
      textAlign: 'center',
      paddingHorizontal: 10,
    },
    bottomPart: {
      flex: 3,
      backgroundColor: isDarkMode ? colors.white : colors.primary,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      paddingHorizontal: 10,
      paddingTop: 30,
      gap: 15,
    },
    textInput: {
      backgroundColor: isDarkMode ? colors.secondary : colors.white,
      borderRadius: 14,
      paddingHorizontal: 15,
      color: isDarkMode ? colors.white : colors.primary,
    },
    submitBtn: {
      backgroundColor: isDarkMode ? colors.light : colors.primary,
      borderRadius: 16,
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 5,
    },
    textPrivacy: {
      fontWeight: 'bold',
      color: isDarkMode ? colors.black : colors.white,
    },
  });
