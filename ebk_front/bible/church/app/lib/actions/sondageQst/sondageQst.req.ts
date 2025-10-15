"use server";

import { SondageQuestionTypeEnum } from "../../config/enum";
import { HttpRequest } from "../../request/request";

export interface CreatSondageQstDto {
  title: string;
  public: boolean;
  objectif: string | null;
}
export interface CreateSondageQuestionDto {
  question: string;
  type: SondageQuestionTypeEnum;
}

export interface CreateSQOccurenceDto {
  occurrence: string;
}

export interface CreateSQOccurenceArrayDto {
  dto: CreateSQOccurenceDto[];
}

export interface CreateSQAnswerDto {
  response: string;
  id_qeustion: number;
}

export interface CreateSQAnswerArrayDto {
  dto: CreateSQAnswerDto[];
}

export const createSondageQstApi = async (dto: CreatSondageQstDto) =>
  HttpRequest(`sondage`, "POST", dto);
export const createSondageQuestionApi = async (
  dto: CreateSondageQuestionDto,
  sondageId: number,
) => HttpRequest(`sondage/createQuestion/${sondageId}`, "POST", dto);
export const addOccurenceInSondageQuestionApi = async (
  dto: CreateSQOccurenceArrayDto,
  qstId: number,
) => HttpRequest(`sondage/addOccurrenceInQuestion/${qstId}`, "POST", dto);
export const createAnswerApi = async (dto: CreateSQAnswerArrayDto) =>
  HttpRequest(`sondage/createAnswer`, "POST", dto);

export const findSondageQstApi = async () =>
  HttpRequest(`sondage/pagination`, "GET");
export const findSondageQstByEglsieIdApi = async (egliseId: number) =>
  HttpRequest(`sondage/pagination/${egliseId}`, "GET");
export const findSondageQstByIdApi = async (sondageId: number) =>
  HttpRequest(`sondage/findSondageById/${sondageId}`, "GET");
export const findCheckIfUserAnswerSondageApi = async (sondageId: number) =>
  HttpRequest(`sondage/answer/checkUser/${sondageId}`, "GET");
export const findSondageQstUserAnsweredApi = async (userId: number) =>
  HttpRequest(`sondage/answer/user/${userId}`, "GET");
export const findAllAnswerBySurveyIdAndUserIdApi = async (
  userId: number,
  sondageId: number,
) => HttpRequest(`sondage/answer/allOfuser/${userId}/${sondageId}`, "GET");
export const findAnswerBySondageIdApi = async (sondageId: number) =>
  HttpRequest(`sondage/findAnswerBySondageId/${sondageId}`, "GET");

export const updateSondageQstApi = async (
  dto: Partial<CreatSondageQstDto>,
  sondageId: number,
) => HttpRequest(`sondage/update/${sondageId}`, "PATCH", dto);
export const updateQuestionInSondageApi = async (
  dto: Partial<CreateSondageQuestionDto>,
  qstId: number,
) => HttpRequest(`sondage/question/${qstId}`, "PATCH", dto);
export const updateSondageQstOccurenceApi = async (
  dto: CreateSQOccurenceDto,
  occurenceId: number,
) => HttpRequest(`sondage/occurrence/${occurenceId}`, "PATCH", dto);

export const deleteQuestionInSondageApi = async (qstId: number) =>
  HttpRequest(`sondage/question/${qstId}`, "DELETE");
export const deleteSondageQstOccurenceApi = async (occurenceId: number) =>
  HttpRequest(`sondage/occurrence/${occurenceId}`, "DELETE");
export const deleteSondageQstApi = async (sondageId: number) =>
  HttpRequest(`sondage/remove/${sondageId}`, "DELETE");
