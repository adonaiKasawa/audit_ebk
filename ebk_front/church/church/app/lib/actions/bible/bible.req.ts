"use server";

export interface InputTagInterface {
  title: "string";
  description: "string";
  version: "string";
  book: "string";
  chapter: "string";
  verse: "string";
  colorTag: "string";
}

interface InputHistory {
  version: string;
  book: string;
  chapter: string;
  verse: string;
}

import { HttpRequest } from "../../request/request";

export const deleteHistoryBible = (userId: number) =>
  HttpRequest(`bible/readHistory/${userId}`, "DELETE");

export const getHistoryBible = (userId: number | undefined) =>
  HttpRequest(`bible/readHistory/${userId}`, "GET");

export const getTagBible = (userId: number | undefined) =>
  HttpRequest(`bible/tag/${userId}`, "GET");

export const postHistoryBible = (data: InputHistory) =>
  HttpRequest(`bible/readHistory/`, "POST", data);

export const postTagBible = (data: InputTagInterface) =>
  HttpRequest(`bible/tag/`, "POST", data);

export const deleteTagBible = (userId: number) =>
  HttpRequest(`bible/tag/${userId}`, "DELETE");

export const findCommentBySubjectForumApi = async (id: number) =>
  await HttpRequest(
    `comment/findByContentId/paginated/${id}/sujetForum?page=1&limit=100000000`,
    "GET",
  );
