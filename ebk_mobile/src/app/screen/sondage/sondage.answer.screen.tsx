import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import colors from '../../../components/style/colors';
import {
  createAnswerApi,
  CreateSQAnswerDto,
  findAllAnswerBySurveyIdAndUserIdApi,
  findCheckIfUserAnswerSondageApi,
  findSondageQstByIdApi,
} from '../../api/sondageQst/sondageQst.req';
import {useEffect, useMemo, useState} from 'react';
import {
  ItemSondageQstDetail,
  PayloadUserInterface,
  QuestionnairesSondage,
} from '../../config/interface';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {selectAuth} from '../../store/auth/auth.slice';
import {jwtDecode} from 'jwt-decode';
import {SondageQuestionTypeEnum} from '../../config/enum';
import {RadioButtonProps} from 'react-native-radio-buttons-group';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Loading from '../../../components/loading';
import BouncyCheckboxGroup, {
  CheckboxButton,
} from 'react-native-bouncy-checkbox-group';

export default function SondageAnwseredScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const userDecode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = useState<PayloadUserInterface | undefined>(
    userDecode,
  );

  const sondageId = route.params.sondage.id;
  const [sondageQst, setSondageQst] = useState<ItemSondageQstDetail>();
  const [questionInSondage, setQuestionInSondage] =
    useState<QuestionnairesSondage[]>();

  const [responses, setResponses] = useState<CreateSQAnswerDto[]>([]);

  const [checkIfUserAnswered, setCheckIfUserAnswered] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);

  const handelFindSurveyId = async () => {
    if (sondageId) {
      setLoading(true);
      const sondage = await findSondageQstByIdApi(sondageId);
      setLoading(false);
      if (sondage?.status === 200) {
        setSondageQst(sondage.data);
        setQuestionInSondage(sondage.data.questions);
      }
    }
  };

  const handelFindAllAnswerBySurveyIdAndUserId = async () => {
    if (user) {
      const sondage = await findAllAnswerBySurveyIdAndUserIdApi(
        user.sub,
        sondageId,
      );
      if (sondage?.status === 200) {
        const response = sondage.data.map((item: any) => ({
          response: item.response,
          id_qeustion: item.question.id,
        }));

        setResponses(response);
      }
    }
  };

  const handleFindCheckIfUserAnswerSondage = async () => {
    const sondage = await findCheckIfUserAnswerSondageApi(sondageId);
    if (sondage?.status === 200) {
      setCheckIfUserAnswered(sondage.data);
    }
  };

  const renderPathImage = (i: number) => {
    let path;
    switch (i) {
      case 1:
        path = require('../../../../assets/img/icon/imoji1.png');
        return path;
        break;
      case 2:
        path = require('../../../../assets/img/icon/imoji2.png');
        return path;
        break;
      case 3:
        path = require('../../../../assets/img/icon/imoji3.png');
        return path;
        break;
      case 4:
        path = require('../../../../assets/img/icon/imoji4.png');
        return path;
        break;
      case 5:
        path = require('../../../../assets/img/icon/imoji5.png');
        return path;
        break;
      default:
        break;
    }
  };

  const renderTypeQuestion = (question: QuestionnairesSondage) => {
    const res = responses.find(item => item.id_qeustion === question.id);
    switch (question.type) {
      case SondageQuestionTypeEnum.LADDER:
        return (
          <View style={{flexDirection: 'row', gap: 5, marginLeft: 20}}>
            {[
              Array.from({length: 5}).map((_, i) => {
                i++;
                return (
                  <TouchableOpacity
                    disabled={checkIfUserAnswered}
                    key={i}
                    style={
                      res && res.response === `${i}`
                        ? {
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: isDarkMode
                              ? colors.light
                              : colors.primary,
                          }
                        : {}
                    }
                    onPress={() => handleResponseChange(question.id, `${i}`)}>
                    <Image
                      source={renderPathImage(i)}
                      width={40}
                      height={40}
                      style={{
                        width: 40,
                        height: 40,
                      }}
                    />
                  </TouchableOpacity>
                );
              }),
            ]}
          </View>
        );
      case SondageQuestionTypeEnum.TRICOLOR:
        return (
          <View style={{flexDirection: 'row', gap: 5, marginLeft: 20}}>
            {['1', '3', '5'].map(i => {
              return (
                <TouchableOpacity
                  disabled={checkIfUserAnswered}
                  key={i}
                  style={
                    res && res.response === `${i}`
                      ? {
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: isDarkMode
                            ? colors.light
                            : colors.primary,
                        }
                      : {}
                  }
                  onPress={() => handleResponseChange(question.id, `${i}`)}>
                  <Image
                    source={renderPathImage(parseInt(i))}
                    width={40}
                    height={40}
                    style={{
                      width: 40,
                      height: 40,
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        );
      case SondageQuestionTypeEnum.MCC:
        const data: CheckboxButton[] = question.occurrences.map(item => ({
          id: `${item.id}`,
          text: item.occurrence,
          textStyle: {
            color: isDarkMode ? colors.white : colors.black,
          },
        }));
        return (
          <View style={{marginLeft: 20}}>
            <BouncyCheckboxGroup
              data={data}
              initial={res && res.response}
              onChange={(selectedItem: CheckboxButton) => {
                handleResponseChange(
                  question.id,
                  selectedItem.id.toString(),
                  'checkbox',
                );
              }}
              style={{flexDirection: 'column', gap: 5}}
              checkboxProps={{
                disabled: checkIfUserAnswered,
                innerIconStyle: {
                  borderWidth: 2,
                  margin: 0,
                  padding: 0,
                },
                fillColor: isDarkMode ? colors.secondary : colors.gris,
              }}
            />
          </View>
        );
      case SondageQuestionTypeEnum.MCO:
        const checked = responses.filter(
          item => item.id_qeustion === question.id,
        );
        return (
          <View style={{gap: 10, marginLeft: 20}}>
            {question.occurrences.map((item, i) => {
              const responseCheked = checked.find(
                f => f.response === `${item.id}`,
              );
              return (
                <View key={i} style={{flexDirection: 'row', gap: 20}}>
                  <BouncyCheckbox
                    disabled={checkIfUserAnswered}
                    innerIconStyle={{
                      borderRadius: 5,
                      borderWidth: 2,
                    }}
                    fillColor={isDarkMode ? colors.secondary : colors.gris}
                    iconStyle={{
                      borderRadius: 5,
                    }}
                    isChecked={responseCheked ? true : false}
                    style={{width: 25}}
                    onPress={(isChecked: boolean) => {
                      handleResponseChange(
                        question.id,
                        item.id.toString(),
                        'checkbox',
                        isChecked,
                      );
                    }}
                  />
                  <Text
                    style={{color: isDarkMode ? colors.white : colors.primary}}>
                    {item.occurrence}
                  </Text>
                </View>
              );
            })}
          </View>
        );
      case SondageQuestionTypeEnum.MCOT:
        return (
          <View>
            <TextInput
              autoFocus
              placeholder="Entrer votre réponse"
              editable={checkIfUserAnswered}
              value={res && res.response}
              onChangeText={e => handleResponseChange(question.id, e)}
            />
          </View>
        );
      default:
        break;
    }
  };

  const hasUserAnsweredAllQuestions = (): boolean => {
    const questionIds = questionInSondage
      ? questionInSondage.map(question => question.id)
      : [];

    const allAnswered = questionIds.every(questionId => {
      return responses.some(
        response =>
          response.id_qeustion === questionId && response.response !== '',
      );
    });

    return allAnswered;
  };

  const handleResponseChange = (
    id_qeustion: number,
    response: string,
    type: string = 'all',
    isChecked: boolean = false,
  ) => {
    if (type === 'all') {
      setResponses(prev => {
        const existingResponse = prev.find(
          res => res.id_qeustion === id_qeustion,
        );
        if (existingResponse) {
          return prev.map(res =>
            res.id_qeustion === id_qeustion ? {...res, response} : res,
          );
        } else {
          return [...prev, {id_qeustion, response}];
        }
      });
    } else {
      if (type === 'checkbox') {
        setResponses(prev => {
          const responeExiste = prev.find(res => res.response === response);
          if (!responeExiste) {
            return [...prev, {id_qeustion, response}];
          } else {
            const filter = prev.filter(res => res.response !== response);
            return filter;
          }
        });
      }
    }
  };

  const handelSubmitSondage = async () => {
    if (!hasUserAnsweredAllQuestions()) {
      Alert.alert(
        'Erreur',
        'Veuillez répondre à toutes les questions avant de soumettre.',
      );
      return;
    }

    if (checkIfUserAnswered) {
      Alert.alert(
        'Attention',
        'Vos réponses à ce questionnaire ont déjà été enregistrées.',
      );
      return;
    }

    setLoading(true);
    const create = await createAnswerApi({dto: responses});
    setLoading(false);

    if (create?.status === 201 || create?.status === 200) {
      navigation.goBack();
    } else {
      if (typeof create?.data.message === 'object') {
        let message = '';
        create.data.message.map((item: string) => (message += `${item} \n`));
        Alert.alert('Erreur', message);
      } else {
        Alert.alert('Erreur', create?.data.message);
      }
    }
  };

  useEffect(() => {
    handelFindSurveyId();
    handleFindCheckIfUserAnswerSondage();
    handelFindAllAnswerBySurveyIdAndUserId();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <View
        style={{
          paddingHorizontal: 10,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBlockColor: colors.gris,
          gap: 5,
        }}>
        <Text style={{color: isDarkMode ? colors.white : colors.primary}}>
          {sondageQst?.title}
        </Text>
        <Text style={{color: colors.gris, textAlign: 'justify'}}>
          {sondageQst?.objectif}
        </Text>
        <Text style={{color: isDarkMode ? colors.white : colors.primary}}>
          Question: {sondageQst?.questions.length}
        </Text>
      </View>
      <View style={{flex: 1, marginTop: 10}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {questionInSondage?.map((item, index) => {
            return (
              <View style={{marginHorizontal: 10}} key={index}>
                <Text
                  style={{color: isDarkMode ? colors.white : colors.primary}}>
                  {index + 1 + `) `} {item.question}
                </Text>
                <View style={{marginVertical: 10}}>
                  {renderTypeQuestion(item)}
                </View>
              </View>
            );
          })}
          <View style={{height: 200}} />
        </ScrollView>
        {auth.isAuthenticated && user ? (
          checkIfUserAnswered ? (
            <View
              style={{
                padding: 10,
                backgroundColor: isDarkMode ? colors.white : colors.black,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: isDarkMode ? colors.primary : colors.white,
                  fontSize: 17,
                }}>
                Vos réponses à ce questionnaire ont déjà été enregistrées.
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handelSubmitSondage}
              style={{
                margin: 20,
                backgroundColor: isDarkMode ? colors.secondary : colors.light,
                paddingVertical: 20,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: isDarkMode ? colors.white : colors.primary,
                  fontSize: 17,
                  fontWeight: '600',
                }}>
                Envoyer votre réponse
              </Text>
            </TouchableOpacity>
          )
        ) : (
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Account', {screen: 'signIn'});
              }}
              style={{
                paddingVertical: 20,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: isDarkMode ? colors.white : colors.primary,
                  fontSize: 17,
                  fontWeight: '600',
                }}>
                Connectez-vous
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {loading && <Loading />}
    </View>
  );
}
