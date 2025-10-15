"use server";

import { HttpRequest } from "../../request/request";

export interface CreatQuizDto {
  title: string;
  description: string;
  difficulty: string;
  type: string;
  timer: string;
}

export interface AddQuestionQuizDto {
  dto: [{ question: string }];
}

export interface IOccurenceQstDto {
  occurrence: string;
  isresponse: boolean;
}

export interface AddOccurenceInQuestionDto {
  dto: IOccurenceQstDto[];
}

export interface CreateQuizAnswerDto {
  timer: string;
  response: string;
  questionId: number;
}

export interface CreateQuizAnswerArrayDto {
  dto: CreateQuizAnswerDto[];
}

export const creatQuizBibliqueApi = async (data: CreatQuizDto) =>
  await HttpRequest(`quiz`, "POST", data);
export const addQuestionInQuizApi = async (
  data: AddQuestionQuizDto,
  quizId: number,
) => await HttpRequest(`quiz/addQuestionInQuiz/${quizId}`, "POST", data);
export const addOccurenceInQuestionApi = async (
  data: AddOccurenceInQuestionDto,
  questionId: number,
) =>
  await HttpRequest(`quiz/addOccurenceInQuestion/${questionId}`, "POST", data);
export const createQuizAnswerApi = async (data: CreateQuizAnswerArrayDto) =>
  await HttpRequest(`quiz/createQuizAnswer`, "POST", data);

export const findQuizBibliquePaginatedApi = async () =>
  await HttpRequest(`quiz/pagination?page=1&limit=200`, "GET");
export const findQuizBibliqueApi = async (userId: number) =>
  await HttpRequest(
    `quiz/findByUserCreated/pagination/${userId}?page=1&limit=200`,
    "GET",
  );
export const findQuestionnairesByQuizIdApi = async (quizId: string) =>
  await HttpRequest(`quiz/findQuestionnairesByQuizId/${quizId}`, "GET");
export const findQuizByIdApi = async (quizId: string) =>
  await HttpRequest(`quiz/${quizId}`, "GET");
export const findResultQuizApi = async (quizId: string) =>
  await HttpRequest(`quiz/findResultQuiz/${quizId}`, "GET");

export const findQuizByUserRespondedApi = async (userId: number) =>
  await HttpRequest(
    `quiz/findByUserResponded/pagination/${userId}?page=1&limit=200`,
    "GET",
  );
export const findOneQuizByUserAnsweredApi = async (
  quizId: number,
  userId: number,
) =>
  await HttpRequest(
    `quiz/findOneQuizByUserAnswered/${quizId}/${userId}`,
    "GET",
  );

export const updateQuizApi = async (
  dto: Partial<CreatQuizDto>,
  quizId: number,
) => await HttpRequest(`quiz/updateQuiz/${quizId}`, "PATCH", dto);
export const updateOccurenceApi = async (
  dto: Partial<IOccurenceQstDto>,
  occurenceId: string,
) => await HttpRequest(`quiz/updateOccurrence/${occurenceId}`, "PATCH", dto);
export const updateQuestionApi = async (
  dto: { question: string },
  qstId: number,
) => await HttpRequest(`quiz/updateQuestion/${qstId}`, "PATCH", dto);

export const deleteQuizApi = async (quizId: number) =>
  await HttpRequest(`quiz/removeQuiz/${quizId}`, "DELETE");
export const deleteOccurenceApi = async (occurenceId: string) =>
  await HttpRequest(`quiz/removeOccurence/${occurenceId}`, "DELETE");
export const deleteQuestionApi = async (qstId: string) =>
  await HttpRequest(`quiz/removeQuestion/${qstId}`, "DELETE");
