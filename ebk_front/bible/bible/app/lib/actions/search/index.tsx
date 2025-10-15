"use server";

import { HttpRequest } from "../../request/request";

export const findSearchApi = async (s_query: string) =>
  await HttpRequest(`search/${s_query}`, "GET");
