import React, {useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import colors from '../style/colors';

const DataDisclosureModal = ({
  firstOpen,
  handelSetFirstOpen,
}: {
  firstOpen: boolean;
  handelSetFirstOpen: () => void;
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const openURL = async (link: string) => {
    const url = `https://ecclesiabook.org/legacy?v=${link}`;
    await Linking.openURL(url);
  };

  const onAccept = () => {
    handelSetFirstOpen();
  };

  const onDecline = () => {
    return Alert.alert(
      'Autorisation requise',
      `Si vous n'acceptez pas les mises à jour sur les termes et condition d'utilisation et Politique de confidentialité, vous ne pourrez pas profiter de nos produit et services gratuitement.\n\nVeuillez lire les termes et condition d'utilisation et la Politique de confidentialité`,
    );
  };

  const terms_of_use = (terms: boolean = true) => (
    <Text
      onPress={() => {
        openURL(terms ? 'terms_of_use' : 'privacy');
      }}
      style={{color: colors.light2, textDecorationLine: 'underline'}}>
      {terms
        ? `Le terms et condition d'utilisation`
        : `La Politique de confidentialité`}
    </Text>
  );

  useEffect(() => {}, []);

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          paddingTop: 40,
        }}>
        <Image
          source={require('../../../assets/img/ecclessia.png')}
          style={{width: 100, height: 100}}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={firstOpen}
        onRequestClose={() => {}}>
        <View style={styles(isDarkMode).centeredView}>
          <View style={styles(isDarkMode).modalView}>
            <Text
              style={[
                styles(isDarkMode).modalText,
                {textAlign: 'center', fontWeight: 'bold', fontSize: 17},
              ]}>
              Divilgation sur le collect de donnée
            </Text>
            <Text
              style={[styles(isDarkMode).modalText, {textAlign: 'justify'}]}>
              * EcclesiaBook collecte les images des utilisateurs pour permettre
              aux utilisateurs d’avoir des photos de profil et de leur permettre
              de se reconnaître les uns des autres dans les fils de discussions
              lorsque l’utilisateur publie l’image.
              {'\n'}
              {'\n'}* EcclesiaBook collecte les vidéos des membres pour
              alimenter le module “Témoignage” et facilite les interactions
              lorsque l’utilisateur publie la vidéo.
              {'\n'}
              {'\n'}* EcclesiaBook centraliser le contenu vidéo de ses membres
              pour favoriser l’engagement au sein des fils actualités
            </Text>

            <Text
              style={[
                styles(isDarkMode).modalText,
                {textAlign: 'center', fontWeight: 'bold', fontSize: 17},
              ]}>
              Mise à jour {`\n`} sur le termes et condition d'utilisation {`\n`}
              & {`\n`}la politique de confidentialité
            </Text>
            <Text style={styles(isDarkMode).modalText}>
              Vous confirmez avoir lu et accepté les mises à jour sur :
            </Text>
            {terms_of_use()}
            {/* <Text style={styles(isDarkMode).modalText}>;</Text> */}
            {terms_of_use(false)}

            <View style={styles(isDarkMode).buttonContainer}>
              <TouchableOpacity
                style={styles(isDarkMode).button}
                onPress={onAccept}>
                <Text style={styles(isDarkMode).btnText}>
                  Accepter et entrer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles(isDarkMode).btnDecline}
                onPress={onDecline}>
                <Text style={styles(isDarkMode).btnDeclineText}>Refuser</Text>
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

export default DataDisclosureModal;
