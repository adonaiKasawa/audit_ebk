"use server";

import { HttpRequest } from "../../request/request";

export const blockContentApi = async (
  contentId: number | string,
  contentType: string
) => {
  return HttpRequest(
    `blocked/${contentId}?contentType=${contentType}`,
    "POST"
  );
};