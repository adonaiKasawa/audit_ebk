import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../components/style/colors';
import {useAppSelector} from '../../store/hooks';
import {selectAuth} from '../../store/auth/auth.slice';
import {jwtDecode} from 'jwt-decode';
import {PayloadUserInterface} from '../../config/interface';
import {
  findAllQuiz,
  findResultQuizByUser,
  findHighsScores,
} from '../../api/quiz/quiz.req';
import {file_url} from '../../api';
import FastImage from 'react-native-fast-image';

const ScoreHistoryScreen = ({navigation}: any) => {
  const isDarkMode = useColorScheme() === 'dark';
  const auth = useAppSelector(selectAuth);
  const user = auth.access_token
    ? jwtDecode<PayloadUserInterface>(auth.access_token)
    : undefined;

  const [showQuizzes, setShowQuizzes] = useState(false);
  const [userQuizzes, setUserQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [allQuizzes, setAllQuizzes] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  useEffect(() => {
    const fetchAllQuizzes = async () => {
      try {
        const response = await findAllQuiz();
        const data = response?.data ?? {};
        setAllQuizzes(data.items || []);
      } catch (error) {
        console.log('Erreur fetchAllQuizzes:', error);
        setAllQuizzes([]);
      }
    };
    fetchAllQuizzes();
  }, []);

  // 🔥 Charger les meilleurs scores
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoadingLeaderboard(true);
      try {
        const result = await findHighsScores();
        if (result?.data) {
          console.log('Leaderboard data:', result.data); // 👈
          setLeaderboard(result.data);
        }
      } catch (err) {
        console.log('Erreur leaderboard:', err);
      } finally {
        setLoadingLeaderboard(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const fetchUserQuizzes = async () => {
    const id = user?.sub;
    setLoading(true);
    try {
      if (id) {
        const result = await findResultQuizByUser(id);
        if (result?.data) {
          setUserQuizzes(result.data);
        }
      } else {
        console.log('No user Exist');
      }
    } catch (error) {
      console.log('Erreur fetchUserQuizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleQuizzes = () => {
    if (auth.isAuthenticated) {
      if (!showQuizzes && userQuizzes.length === 0) {
        fetchUserQuizzes();
      }
      setShowQuizzes(!showQuizzes);
    } else {
      Alert.alert(
        'Connexion requise',
        'Votre interaction est précieuse. Connectez-vous SVP.',
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

  // Total des réponses correctes
  const totalCorrectAnswers = userQuizzes.reduce(
    (sum, quiz) => sum + (quiz.totalAnswerCorrect || 0),
    0,
  );

  return (
    <ScrollView
      style={[
        styles(isDarkMode).container,
        {backgroundColor: isDarkMode ? colors.primary : colors.cardLight},
      ]}>
      {/* HEADER */}
      <View style={styles(isDarkMode).headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles(isDarkMode).backBtn}>
          <Feather
            name="arrow-left"
            size={22}
            color={isDarkMode ? colors.white : colors.primary}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles(isDarkMode).header,
            {color: isDarkMode ? colors.white : colors.primary},
          ]}>
          🎯 Mes Scores
        </Text>
      </View>

      {/* HIGH SCORE */}
      <View style={styles(isDarkMode).scoreCard}>
        <Text
          style={[
            styles(isDarkMode).title,
            {color: isDarkMode ? colors.white : colors.primary},
          ]}>
          TOP SCORE!
        </Text>

        <View style={styles(isDarkMode).avatarCircle}>
          <Feather name="user" size={20} color={colors.white} />
        </View>

        <Text
          style={[
            styles(isDarkMode).playerName,
            {color: isDarkMode ? colors.white : colors.primary},
          ]}>
          Moi
        </Text>

        {/* Loader ou score */}
        {loading ? (
          <ActivityIndicator size="small" color={colors.orange} />
        ) : (
          <Text style={styles(isDarkMode).playerScore}>
            {totalCorrectAnswers} Points
          </Text>
        )}

        {/* Bouton pour afficher les quizz */}
        <TouchableOpacity
          onPress={handleToggleQuizzes}
          style={[styles(isDarkMode).mainBtn, {marginTop: 15}]}>
          <Text style={styles(isDarkMode).btnText}>
            {showQuizzes ? 'Cacher Mes Scores' : 'Afficher Mes Scores'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* MES QUIZZ */}
      {showQuizzes && (
        <View style={styles(isDarkMode).quizList}>
          <Text
            style={[
              styles(isDarkMode).quizTitle,
              {color: isDarkMode ? colors.white : colors.primary},
            ]}>
            MES QUIZZ
          </Text>

          {loading ? (
            <ActivityIndicator size="small" color={colors.orange} />
          ) : (
            userQuizzes?.map((quiz: any) => {
              if (!Array.isArray(allQuizzes)) return null;

              const quizInfo = allQuizzes.find(q => q.id === quiz.quizId);
              const quizName = quizInfo
                ? quizInfo.title
                : `Quiz #${quiz.quizId}`;

              return (
                <View key={quiz.quizId} style={styles(isDarkMode).quizItem}>
                  <Text
                    style={[
                      styles(isDarkMode).quizName,
                      {color: isDarkMode ? colors.white : colors.primary},
                    ]}>
                    {quizName}
                  </Text>
                  <Text style={styles(isDarkMode).quizScore}>
                    {quiz.totalAnswerCorrect}/
                    {quiz.totalAnswerCorrect + quiz.totalAnswerIncorrect}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      )}

      {/* LEADERBOARD */}
      <View style={styles(isDarkMode).leaderboard}>
        <Text
          style={[
            styles(isDarkMode).leaderboardTitle,
            {color: isDarkMode ? colors.white : colors.primary},
          ]}>
          Meilleurs scores
        </Text>

        {loadingLeaderboard ? (
          <ActivityIndicator size="small" color={colors.orange} />
        ) : leaderboard.length > 0 ? (
          leaderboard.map((item, index) => (
            <View key={item.user.id} style={styles(isDarkMode).leaderboardItem}>
              <Text
                style={[
                  styles(isDarkMode).rank,
                  {color: isDarkMode ? colors.white : colors.primary},
                ]}>
                {index + 1}
              </Text>

              <View style={styles(isDarkMode).leaderboardInfo}>
                {/* <Feather
                  name="user"
                  size={20}
                  color={isDarkMode ? colors.white : colors.primary}
                /> */}
                {item.user?.profil ? (
                  <FastImage
                    // source={{uri: item.user.avatarUrl}}
                    source={{
                      uri: `${file_url}${item?.user?.profil}`,
                      priority: FastImage.priority.normal,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    style={styles(isDarkMode).avatarImg}
                  />
                ) : (
                  <Feather
                    name="user"
                    size={30}
                    color={isDarkMode ? colors.white : colors.primary}
                  />
                )}

                <Text
                  style={[
                    styles(isDarkMode).leaderboardName,
                    {color: isDarkMode ? colors.white : colors.primary},
                  ]}>
                  {/* {item.user.username} */}
                  {item.user.prenom}
                </Text>
              </View>

              <Text style={styles(isDarkMode).leaderboardScore}>
                {item.globalScore} • {item.quizCount} quiz
              </Text>
            </View>
          ))
        ) : (
          <Text style={{color: colors.orange}}>Aucun score trouvé</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ScoreHistoryScreen;

const styles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {flex: 1},

    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      paddingHorizontal: 12,
      paddingTop: 10,
    },
    backBtn: {marginRight: 12, padding: 4},
    header: {fontSize: 18, fontWeight: 'bold'},

    scoreCard: {
      alignItems: 'center',
      padding: 20,
      borderRadius: 16,
      margin: 15,
      backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    title: {fontSize: 18, fontWeight: '700', marginBottom: 10},
    avatarCircle: {
      width: 40,
      height: 40,
      borderRadius: 40,
      backgroundColor: colors.blue,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    playerName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 5,
    },
    playerScore: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.orange,
    },

    mainBtn: {
      backgroundColor: isDarkMode ? colors.primary : colors.cardLight,
      padding: 10,
      borderRadius: 10,
      marginHorizontal: 5,
    },
    btnText: {
      color: isDarkMode ? colors.white : colors.primary,
      fontWeight: '600',
      fontSize: 12,
    },

    quizList: {
      marginHorizontal: 15,
      marginBottom: 20,
      borderRadius: 16,
      padding: 15,
      backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight,
    },
    quizTitle: {fontSize: 16, fontWeight: '700', marginBottom: 10},
    quizItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 0.19,
      borderBottomColor: isDarkMode ? colors.whitergba4 : colors.gris,
    },
    quizName: {
      fontSize: 12,
      fontWeight: '400',
    },
    quizScore: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.orange,
    },

    leaderboard: {
      marginHorizontal: 15,
      marginBottom: 30,
      borderRadius: 16,
      padding: 15,
      backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight,
    },
    leaderboardTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 10,
    },
    leaderboardItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 0.19,
      borderBottomColor: isDarkMode ? colors.whitergba4 : colors.gris,
    },
    rank: {
      fontSize: 12,
      fontWeight: '300',
      width: 30,
    },
    leaderboardInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    leaderboardName: {
      marginLeft: 10,
      fontSize: 12,
      fontWeight: '500',
    },
    leaderboardScore: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.orange,
    },
    // ✅ Ajout du style avatarImg
    avatarImg: {
      width: 30,
      height: 30,
      borderRadius: 22.5,
      marginRight: 10,
    },
    username: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
