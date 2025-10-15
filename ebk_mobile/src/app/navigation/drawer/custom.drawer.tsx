import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Share,
  FlatList,
  TextInput,
  useColorScheme,
  Modal,
  StyleSheet,
} from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {logoutUser, selectAuth} from '../../store/auth/auth.slice';
import {jwtDecode} from 'jwt-decode';
import {selectTheme} from '../../store/theme/theme.slice';
import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import LinearGradient from 'react-native-linear-gradient';
import {useWindowDimensions} from 'react-native';
import {resetToken} from '../../store/token/token.slice';
import colors from '../../../components/style/colors';
import localAssets from '../../config/local.assets';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const auth = useAppSelector(selectAuth);
  const user: any = auth?.access_token ? jwtDecode(auth?.access_token) : null;
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const [isModalVisible, setModalVisible] = React.useState<boolean>(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
    color: isDarkMode ? colors.lighter : colors.primary,
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `https://play.google.com/store/apps/details?id=com.ecclesiabook`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{marginTop: 10}}>
        <View>
          <Image
            source={localAssets.logoApp}
            resizeMode="contain"
            style={{
              height: 50,
              width: 50,
              // borderRadius: 40,
              marginBottom: 10,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 15,
              fontFamily: 'Roboto-Medium',
              marginBottom: 5,
              textAlign: 'center',
            }}>
            EcclesiaBook
          </Text>
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Roboto-Medium',
              marginBottom: 5,
              textAlign: 'center',
            }}>
            {user?.prenom}
            {user?.nom}
          </Text>
        </View>
        <View style={{flex: 1, paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View
        style={{padding: 20, borderTopWidth: 1, borderTopColor: colors.gris}}>
        <TouchableOpacity
          onPress={() => {
            onShare();
          }}
          style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons
              name="share-social-outline"
              size={22}
              color={backgroundStyle.color}
            />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Imprima-Regular',
                marginLeft: 5,
                color: backgroundStyle.color,
              }}>
              partager à un ami
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            toggleModal();
          }}
          style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="help" size={22} color={backgroundStyle.color} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Imprima-Regular',
                marginLeft: 5,
                color: backgroundStyle.color,
              }}>
              Avis & suggestions
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Vous allez vous déconnecter',
              `Rester connecter à votre églises quel que soit votre localisation.`,
              [
                {
                  text: 'SE DÉCONNECTER',
                  onPress: () => {
                    dispatch(logoutUser());
                    dispatch(resetToken());
                    setTimeout(() => {
                      props.navigation.navigate('Login');
                    }, 200);
                  },
                  style: 'cancel',
                },
                {text: 'ANNULER', onPress: () => {}},
              ],
            );
          }}
          style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons
              name="exit-outline"
              size={22}
              color={backgroundStyle.color}
            />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Imprima-Regular',
                marginLeft: 5,
                color: backgroundStyle.color,
              }}>
              Déconnexion
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <ModalPays
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
        navigation={props.navigation}
      />
    </View>
  );
};

export default CustomDrawerContent;

type ModalProps = {
  navigation: DrawerNavigationHelpers;
  isModalVisible: boolean;
  toggleModal: () => void;
};

const ModalPays = ({navigation, isModalVisible, toggleModal}: ModalProps) => {
  const [text, setText] = React.useState<string>('');
  const width = useWindowDimensions().width;
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
    color: isDarkMode ? colors.lighter : colors.primary,
  };
  const handleSubmiteSuggestion = async () => {
    if (text) {
      Alert.alert(
        'EcclesiaBook',
        "Merci beaucoup; vos avis et suggestion nous aide à ameloire l'application.",
      );
      setText('');
      toggleModal();
    } else {
      Alert.alert('EcclesiaBook', 'le champ ne doit pas être vide.');
    }
  };

  return (
    <View style={{backgroundColor: backgroundStyle.backgroundColor}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {}}>
        <View style={styles(isDarkMode).centeredView}>
          <View
            style={{
              padding: 5,
              marginHorizontal: 5,
              backgroundColor: backgroundStyle.backgroundColor,
              top: -1,
              borderRadius: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignContent: 'center',
                marginVertical: 10,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: backgroundStyle.color,
                  textAlign: 'center',
                }}>
                Avis & Suggestions
              </Text>
              <TouchableOpacity
                onPress={toggleModal}
                style={{
                  borderRadius: 5,
                  backgroundColor: colors.secondary,
                  width: 20,
                  height: 20,
                  alignSelf: 'flex-end',
                }}>
                <Text style={{textAlign: 'center'}}>X</Text>
              </TouchableOpacity>
            </View>
            <View style={{borderTopColor: colors.gris, borderTopWidth: 0.5}} />
            <View style={{marginTop: 20, marginHorizontal: 10, gap: 5}}>
              <TextInput
                multiline
                onChangeText={e => setText(e)}
                value={text}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 16,
                  backgroundColor: isDarkMode ? colors.secondary : colors.light,
                  width: '100%',
                  borderRadius: 15,
                }}
                placeholder={'Votre avis & suggestion...'}
                placeholderTextColor={colors.gris}
              />
              <TouchableOpacity
                style={{
                  marginVertical: 8,
                  width: '100%',
                  height: 50,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: isDarkMode ? colors.white : colors.primary,
                }}
                onPress={() => {
                  handleSubmiteSuggestion();
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: isDarkMode ? colors.primary : colors.white,
                  }}>
                  Envoyer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = (isDarkMode = true) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.blackrgba2,
    },
    modalView: {
      margin: 15,
      borderRadius: 20,
      padding: 35,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      backgroundColor: isDarkMode ? colors.primary : colors.lighter,
      flexWrap: 'nowrap',
    },
    modalText: {
      color: isDarkMode ? colors.white : colors.black,
      alignContent: 'center',
      alignItems: 'center',
      display: 'flex',
      marginBottom: 10,
    },
    buttonContainer: {
      justifyContent: 'space-between',
      gap: 10,
      marginTop: 10,
    },
    button: {
      backgroundColor: isDarkMode ? colors.white : colors.black,
      paddingHorizontal: 24,
      paddingVertical: 15,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    btnDecline: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      paddingHorizontal: 24,
      paddingVertical: 15,
    },
    btnText: {
      color: isDarkMode ? colors.black : colors.white,
    },
    btnDeclineText: {
      color: isDarkMode ? colors.white : colors.primary,
    },
  });
