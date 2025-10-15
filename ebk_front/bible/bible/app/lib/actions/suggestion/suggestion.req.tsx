"use server";

import { HttpRequest } from "../../request/request";

export const createSuggestionApi = async (suggestion: string) =>
  HttpRequest(`suggestion`, "POST", { suggestion });

export const findSuggestionsByUser = async () =>
  await HttpRequest(`suggestion`, "GET");
