import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  StyleSheet,
  Animated,
  ScrollView,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {
  answerQuizContentApi,
  findQuestionsQuizId,
} from '../../api/quiz/quiz.req';
import colors from '../../../components/style/colors';
import {useAppSelector} from '../../store/hooks';
import {selectAuth} from '../../store/auth/auth.slice';

const QuizDetailScreen = ({route, navigation}: any) => {
  const auth = useAppSelector(selectAuth);
  const {quizId, quizTitle, quizDuration = 40} = route.params;
  const isDarkMode = useColorScheme() === 'dark';

  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answerSelected, setAnswerSelected] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState(false);

  // Vérification d'authentification
  useEffect(() => {
    if (!auth.isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour passer un quiz.',
        [
          {
            text: 'SE CONNECTER',
            onPress: () => {
              navigation.navigate('Account', {screen: 'signIn'});
            },
            style: 'cancel',
          },
          {
            text: 'ANNULER',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    }
  }, [auth.isAuthenticated, navigation]);

  // Récupération des questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await findQuestionsQuizId(quizId);
        const data = response?.data ?? [];

        if (data.length === 0) return;

        const perQuestionTime = Math.floor(quizDuration / data.length);
        const remainder = quizDuration - perQuestionTime * data.length;

        const prepared = data.map((q: any, idx: number) => ({
          ...q,
          duration: perQuestionTime + (idx === data.length - 1 ? remainder : 0),
          occurrences: q.occurrences?.map((r: any) => ({
            ...r,
            selected: false,
          })),
        }));

        setQuestions(prepared);
        setCurrentQuestionIndex(0);
        setTimeLeft(prepared[0].duration || 15);
        fadeIn();
      } catch (err) {
        console.log('Erreur fetch questions:', err);
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, [quizId, quizDuration]);

  // Timer par question
  useEffect(() => {
    if (!auth.isAuthenticated || timeLeft === null || quizFinished) return;

    if (timeLeft <= 0) {
      showCorrectAnswer();
      setTimeout(goToNextQuestion, 1000);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizFinished, auth.isAuthenticated]);

  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const goToNextQuestion = () => {
    setAnswerSelected(false);
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTimeLeft(questions[nextIndex].duration || 15);
      fadeIn();
    } else {
      setQuizFinished(true);
      submitQuiz(); // Soumission automatique
    }
  };

  const showCorrectAnswer = (selectedIdx?: number) => {
    const updated = [...questions];
    updated[currentQuestionIndex].occurrences = updated[
      currentQuestionIndex
    ].occurrences.map((r: any, idx: number) => ({
      ...r,
      selected: idx === selectedIdx ? true : r.isresponse ? false : r.selected,
      showCorrect:
        r.isresponse || (selectedIdx !== undefined && idx === selectedIdx),
    }));
    setQuestions(updated);
    setAnswerSelected(true);
  };

  const handleAnswer = (rIdx: number) => {
    if (answerSelected) return;
    showCorrectAnswer(rIdx);
    setTimeout(goToNextQuestion, 1000);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      const answered = q.occurrences?.find(r => r.selected && r.isresponse);
      if (answered) score += 1;
    });
    return score;
  };

  const submitQuiz = async () => {
    try {
      setSubmitting(true);
      setErrorSubmit(false);

      const dto = questions.map((q: any) => {
        const selected = q.occurrences.find((r: any) => r.selected);

        return {
          timer: String((q.duration || 15) - (timeLeft ?? 0)),
          response: selected ? String(selected.id) : '',
          questionId: q.id,
        };
      });

      const response = await answerQuizContentApi({dto});
      if (response?.status === 201) {
        setSubmitted(true);
      } else {
        setErrorSubmit(true);
      }
    } catch (err) {
      console.log('Erreur lors de l’envoi de réponse: ', err);
      setErrorSubmit(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Chargement questions
  if (loadingQuestions) {
    return (
      <View style={styles(isDarkMode).center}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  // Quiz terminé
  if (quizFinished) {
    const score = calculateScore();
    return (
      <View
        style={[
          styles(isDarkMode).container,
          {
            backgroundColor: isDarkMode ? colors.primary : colors.cardLight,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <View
          style={{
            backgroundColor: isDarkMode ? colors.cardDark : '#f0f0f0',
            marginHorizontal: 20,
            borderRadius: 20,
            padding: 30,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          }}>
          <Text
            style={{
              color: isDarkMode ? colors.white : colors.primary,
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 15,
            }}>
            Résultat du Quiz
          </Text>
          <Text
            style={{
              color: isDarkMode ? colors.blue : colors.primary,
              fontSize: 20,
              fontWeight: '400',
            }}>
            {score} / {questions.length}
          </Text>

          {/* Loader pendant l'envoi */}
          {submitting && (
            <View style={{marginTop: 15, alignItems: 'center'}}>
              <ActivityIndicator size="large" color={colors.blue} />
              <Text style={{color: colors.blue, marginTop: 8}}>
                Envoi des réponses...
              </Text>
            </View>
          )}

          {/* Message succès */}
          {submitted && !submitting && (
            <Text style={{color: colors.secondary, marginTop: 15}}>
              ✅ Résultats envoyés avec succès
            </Text>
          )}

          {/* Message erreur */}
          {!submitted && !submitting && errorSubmit && (
            <>
              <Text style={{color: colors.red, marginBottom: 15}}>
                ⚠️ Échec de l'envoi. Vérifiez votre connexion et réessayez.
              </Text>
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  backgroundColor: colors.blue,
                  paddingVertical: 10,
                  paddingHorizontal: 31,
                  borderRadius: 12,
                }}
                onPress={submitQuiz}>
                <Text
                  style={{
                    color: colors.white,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  Réessayer
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: colors.blue,
              paddingVertical: 10,
              paddingHorizontal: 31,
              borderRadius: 12,
            }}
            onPress={() => navigation.goBack()}>
            <Text
              style={{color: colors.white, fontWeight: 'bold', fontSize: 16}}>
              Retour
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Animated.View
      style={[
        styles(isDarkMode).container,
        {
          backgroundColor: isDarkMode ? colors.primary : colors.cardLight,
          opacity: fadeAnim,
        },
      ]}>
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
            {color: isDarkMode ? colors.white : colors.primary, flexShrink: 1},
          ]}>
          {quizTitle}
        </Text>
      </View>

      <ScrollView
        style={styles(isDarkMode).section}
        showsVerticalScrollIndicator={false}>
        <Text
          style={{
            color: isDarkMode ? colors.whitergba8 : colors.primary,
            fontSize: 13,
            fontWeight: '500',
            marginBottom: 10,
          }}>
          Question {currentQuestionIndex + 1} / {questions.length}
        </Text>

        <Text
          style={{
            color: isDarkMode ? colors.white : colors.primary,
            fontSize: 15,
            fontWeight: '500',
            marginBottom: 14,
          }}>
          {currentQuestion.question}
        </Text>

        {currentQuestion.occurrences?.map((r: any, rIdx: number) => {
          let borderColor = colors.gris;
          let bgColor = 'transparent';

          if (answerSelected) {
            if (r.selected && r.isresponse) {
              borderColor = colors.green;
              bgColor = colors.green + '22';
            } else if (r.selected && !r.isresponse) {
              borderColor = colors.red;
              bgColor = colors.red + '22';
            } else if (r.isresponse) {
              borderColor = colors.green;
              bgColor = colors.green + '22';
            }
          }

          return (
            <TouchableOpacity
              key={r.id || rIdx}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 6,
                padding: 12,
                borderRadius: 12,
                borderWidth: 2,
                borderColor,
                backgroundColor: bgColor,
              }}
              onPress={() => handleAnswer(rIdx)}
              disabled={answerSelected}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.gris,
                  marginRight: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:
                    answerSelected && r.isresponse
                      ? colors.green
                      : r.selected && !r.isresponse
                      ? colors.red
                      : 'transparent',
                }}
              />
              <Text
                style={{
                  color: isDarkMode ? colors.whitergba8 : colors.primary,
                  fontSize: 14,
                  flexShrink: 1,
                }}>
                {r.occurrence}
              </Text>
            </TouchableOpacity>
          );
        })}

        <Text
          style={{
            marginTop: 20,
            color: isDarkMode ? colors.whitergba6 : colors.gris,
            fontSize: 14,
          }}>
          Temps restant: {timeLeft}s
        </Text>
      </ScrollView>
    </Animated.View>
  );
};

export default QuizDetailScreen;

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
    header: {fontSize: 14, fontWeight: 'bold'},
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
      paddingVertical: 14,
      paddingHorizontal: 16,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
      maxHeight: '80%',
    },
  });
