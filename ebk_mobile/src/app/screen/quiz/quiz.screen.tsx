import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';
import {findAllQuiz, findResultQuizByUser} from '../../api/quiz/quiz.req';
import {useAppSelector} from '../../store/hooks';
import {selectAuth} from '../../store/auth/auth.slice';
import {jwtDecode} from 'jwt-decode';
import {PayloadUserInterface} from '../../config/interface';
import colors from '../../../components/style/colors';

const QuizScreen = ({navigation}: any) => {
  const isDarkMode = useColorScheme() === 'dark';
  const auth = useAppSelector(selectAuth);
  const user = auth.access_token
    ? jwtDecode<PayloadUserInterface>(auth.access_token)
    : undefined;

  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<number[]>([]);

  // 🔹 fetchData pour récupérer quiz et résultats utilisateur
  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await findAllQuiz();
      const data = response?.data ?? {};
      setQuizzes(data.items || []);

      if (user?.sub) {
        const result = await findResultQuizByUser(user.sub);
        const done = result?.data?.map((q: any) => q.quizId) || [];
        setCompletedQuizzes(done);
      }
    } catch (error) {
      console.log('Erreur fetch quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 useFocusEffect → se lance à chaque retour sur cet écran
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [user?.sub]),
  );

  const levels = [
    {key: 'easy', label: 'Facile', color: colors.green, icon: 'smile'},
    {key: 'middle', label: 'Intermédiaire', color: colors.blue, icon: 'meh'},
    {key: 'hard', label: 'Difficile', color: colors.red, icon: 'frown'},
  ];

  const renderItem = (
    title: string,
    subtitle: string,
    icon: any,
    onPress: () => void,
    disabled: boolean = false,
  ) => (
    <TouchableOpacity
      style={[
        styles(isDarkMode).itemContainer,
        disabled && {opacity: 0.5}, // grisé si bloqué
      ]}
      onPress={() => {
        if (!disabled) {
          onPress();
        } else {
          Alert.alert('Quiz déjà effectué', 'Vous avez déjà complété ce quiz.');
        }
      }}
      activeOpacity={disabled ? 1 : 0.8}
      disabled={disabled}>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        {icon}
        <View style={{marginLeft: 12, flex: 1}}>
          <Text
            style={[
              styles(isDarkMode).itemTitle,
              {color: isDarkMode ? colors.whitergba8 : colors.primary},
            ]}>
            {title}
          </Text>
          {subtitle !== '' && (
            <Text
              style={[
                styles(isDarkMode).itemSubtitle,
                {color: isDarkMode ? colors.whitergba6 : colors.gris},
              ]}>
              {subtitle}
            </Text>
          )}
        </View>
        {!disabled && (
          <Feather name="chevron-right" size={20} color={colors.gris} />
        )}
        {disabled && <Feather name="lock" size={18} color={colors.red} />}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles(isDarkMode).center}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles(isDarkMode).container,
        {backgroundColor: isDarkMode ? colors.primary : colors.cardLight},
      ]}>
      {/* HEADER */}
      <View style={styles(isDarkMode).headerRow}>
        <TouchableOpacity
          onPress={() =>
            selectedLevel ? setSelectedLevel(null) : navigation.goBack()
          }
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
          {selectedLevel ? 'Quiz' : '📚 Liste des Quiz'}
        </Text>
      </View>

      {/* Niveaux */}
      {!selectedLevel && (
        <View
          style={[
            styles(isDarkMode).section,
            {
              backgroundColor: isDarkMode ? colors.cardDark : colors.cardLight,
            },
          ]}>
          <Text
            style={[
              styles(isDarkMode).sectionTitle,
              {color: isDarkMode ? colors.whitergba6 : colors.gris},
            ]}>
            Choisir un niveau
          </Text>

          {levels.map(level => (
            <View key={level.key}>
              {renderItem(
                level.label,
                `Quiz niveau ${level.label.toLowerCase()}`,
                <Feather name={level.icon} size={22} color={level.color} />,
                () => setSelectedLevel(level.key),
              )}
            </View>
          ))}

          {/* Bloc Score */}
          <View style={{marginTop: 20}}>
            {renderItem(
              'Voir mes scores',
              `Total de ${completedQuizzes.length} quiz joués`,
              <Feather name="bar-chart-2" size={22} color={colors.orange} />,
              () => navigation.navigate('ScoreHistoryScreen'),
            )}
          </View>
        </View>
      )}

      {/* Quiz filtrés */}
      {selectedLevel &&
        quizzes
          .filter(q => q.difficulty === selectedLevel)
          .map(quiz => {
            const alreadyDone = completedQuizzes.includes(quiz.id);

            return (
              <View key={quiz.id}>
                {renderItem(
                  quiz.title,
                  `${quiz.questionnairesCount} questions • ${quiz.timer}`,
                  <Feather name="book" size={22} color={colors.blue} />,
                  () =>
                    navigation.navigate('QuizDetailScreen', {
                      quizId: quiz.id,
                      quizTitle: quiz.title,
                    }),
                  alreadyDone, // ✅ bloqué si déjà fait
                )}
              </View>
            );
          })}
    </ScrollView>
  );
};

export default QuizScreen;

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
    backBtn: {
      marginRight: 12,
      padding: 4,
    },
    header: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? colors.primary : colors.cardLight,
    },
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
      marginHorizontal: 15,
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
