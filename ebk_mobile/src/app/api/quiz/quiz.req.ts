import {HttpRequest} from '..';

export const findAllQuiz = async () =>
  await HttpRequest('quiz/pagination', 'GET');

export const findQuestionsQuizId = async (id: number) =>
  await HttpRequest(`quiz/findQuestionnairesByQuizId/${id}`, 'GET');

export const answerQuizContentApi = async (dto: any) =>
  await HttpRequest('quiz/createQuizAnswer', 'POST', dto);

export const findOneQuizByUserAnswered = async (
  quizId: number,
  userId: number,
) => await HttpRequest(`findOneQuizByUserAnswered/:${quizId}/${userId}`, 'GET');

export const findResultQuizByUser = async (id: number) =>
  await HttpRequest(`quiz/findResultQuizByUser/pagination/${id}`, 'GET');

export const findResultQuiz = async (quizId: number) =>
  await HttpRequest(`findResultQuiz/${quizId}`, 'GET');

export const findHighsScores = async () =>
  await HttpRequest('quiz/global-highscores', 'GET');
