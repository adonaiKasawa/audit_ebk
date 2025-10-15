"use server";

export interface InputTagInterface {
  title: string;
  description: string;
  version: string;
  book: string;
  chapter: string;
  verse: string;
  colorTag: string;
}

interface InputHistory {
  version: string;
  book: string;
  chapter: string;
  verse: string;
}

import { HttpRequest } from "../../request/request";

export const deleteHistoryBible = async (userId: number) =>
  await HttpRequest(`bible/readHistory/${userId}`, "DELETE");

export const getHistoryBible = async (userId: number | undefined) =>
  await HttpRequest(`bible/readHistory/${userId}`, "GET");

export const getTagBible = async (userId: number | undefined) =>
  await HttpRequest(`bible/tag/${userId}`, "GET");

export const postHistoryBible = async (data: InputHistory) =>
  await HttpRequest(`bible/readHistory/`, "POST", data);

export const postTagBible = async (data: InputTagInterface) =>
  await HttpRequest(`bible/tag/`, "POST", data);

export const deleteTagBible = async (userId: number) =>
  await HttpRequest(`bible/tag/${userId}`, "DELETE");

export const findCommentBySubjectForumApi = async (id: number) =>
  await HttpRequest(
    `comment/findByContentId/paginated/${id}/sujetForum?page=1&limit=100000000`,
    "GET",
  );
