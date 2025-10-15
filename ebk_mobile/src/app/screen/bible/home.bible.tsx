import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useAppSelector} from '../../store/hooks';
import {selectAuth} from '../../store/auth/auth.slice';
import {jwtDecode} from 'jwt-decode';
import {PayloadUserInterface} from '../../config/interface';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// src/navigation/types.ts
export type RootStackParamList = {
  BibleHomeScreen: undefined;
  BibleViewer: undefined;
  LoginScreen: undefined;
  VersetDay: undefined;
  BibleSelectScreen: undefined;
  ReadingPlansScreen: undefined;
  BiblePanoramaLastScreen: undefined;
  BiblePanoramaNewScreen: undefined;
  QuizScreen: undefined;
};

type BibleHomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BibleHomeScreen'
>;

const BibleHomeScreen = () => {
  const navigation = useNavigation<BibleHomeScreenNavigationProp>();

  const auth = useAppSelector(selectAuth);
  const user = auth.access_token
    ? jwtDecode<PayloadUserInterface>(auth.access_token)
    : undefined;

  return (
    <ScrollView style={styles.container}>
      {/* ✅ Bloc Bienvenue / Profil */}
      <View style={styles.card}>
        {user ? (
          <>
            <Text style={styles.title}>Bonjour, {user.prenom} 👋</Text>
            <Text style={styles.subtitle}>
              Heureux de vous revoir dans la Bible App.
            </Text>
            <Text style={styles.impact}>
              "La Parole de Dieu est une lampe à tes pieds et une lumière sur
              ton sentier." (Psaume 119:105)
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('BibleViewer')}>
              <Feather name="book-open" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}> Lire la Bible</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Bienvenue</Text>
            <Text style={styles.subtitle}>
              Connectez-vous pour sauvegarder vos données dans le cloud !
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('LoginScreen')}>
              <Feather name="log-in" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}> Je me connecte</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* ✅ Apprendre */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.rowCenter}
          onPress={() => navigation.navigate('VersetDay')}>
          <Feather name="bookmark" size={18} color="#22d3ee" />
          <Text style={styles.text}> Le verset du jour</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Étudier */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.cardFlex}
          onPress={() => navigation.navigate('BibleSelectScreen')}>
          <View style={styles.rowCenter}>
            <Feather name="book" size={18} color="#a78bfa" />
            <Text style={styles.subtitle}> Plan de la Bible</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cardFlex}
          onPress={() => navigation.navigate('ReadingPlansScreen')}>
          <View style={styles.rowCenter}>
            <Feather name="file-text" size={18} color="#34d399" />
            <Text style={styles.subtitle}> Plan de lecture</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* <View style={styles.card}>
        <View style={styles.rowCenter}>
          <Feather name="headphones" size={18} color="#f472b6" />
          <Text style={styles.text}> Bible en audio</Text>
        </View>
      </View> */}

      {/* ✅ Panorama */}
      <Text style={styles.sectionTitle}>Apprendre la bible</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.cardFlex}
          onPress={() => navigation.navigate('BiblePanoramaNewScreen')}>
          <Feather name="archive" size={18} color="#facc15" />
          <Text style={styles.subtitle}> Nouveau testament </Text>
          <Text style={styles.link}>Livres (39)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cardFlex}
          onPress={() => navigation.navigate('BiblePanoramaLastScreen')}>
          <Feather name="book-open" size={18} color="#38bdf8" />
          <Text style={styles.subtitle}> Ancien testament </Text>
          <Text style={styles.link}>Livres (27)</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Méditer */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('QuizScreen')}>
        <View style={styles.rowCenter}>
          <Feather name="help-circle" size={18} color="#f59e0b" />
          <Text style={styles.text}> Quiz</Text>
        </View>
      </TouchableOpacity>
      {/* <View style={styles.card}>
        <View style={styles.rowCenter}>
          <Feather name="book" size={18} color="#06b6d4" />
          <Text style={styles.text}> Dictionnaire</Text>
        </View>
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117', // 🔥 Fond sombre façon app moderne
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#161b22', // 🔥 Cartes sombres modernes
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  impact: {
    color: '#22d3ee',
    marginTop: 6,
    fontSize: 14,
    fontStyle: 'italic',
  },
  cardFlex: {
    flex: 1,
    backgroundColor: '#161b22',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#a1a1aa',
    marginTop: 6,
    fontSize: 14,
  },
  text: {
    color: '#e5e7eb',
    fontSize: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#2563eb', // 🔥 Bouton bleu moderne
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    color: '#60a5fa',
    marginTop: 6,
    fontSize: 13,
  },
});

export default BibleHomeScreen;
