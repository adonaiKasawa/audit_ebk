"use server";

import { HttpRequest } from "../../request/request";

export const createSignaleApi = async (typeContent: string, id: number) =>
  HttpRequest(`signale/${typeContent}/${id}`, "POST");
