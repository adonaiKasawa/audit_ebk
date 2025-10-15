"use server";

import { HttpRequest } from "../../request/request";

export const createBibleStudyApi = async (credentials: any) =>
  await HttpRequest(`bible-study`, "POST", credentials);
export const createContentBibleStudyApi = async (
  credentials: any,
  id: number,
) => await HttpRequest(`bible-study/content/file/${id}`, "POST", credentials);
export const findBibleStudyById = async (id: number) =>
  await HttpRequest(`bible-study/${id}`, "GET");
export const findBibleStudyByEgliseIdPaginated = async (id_eglise: number) =>
  await HttpRequest(
    `bible-study/find/paginated/${id_eglise}?page=1&limit=100`,
    "GET",
  );
export const findBibleStudyPaginated = async () =>
  await HttpRequest(`bible-study/find/all/paginated?page=1&limit=100`, "GET");
export const updateBibleStudyApi = async (id_formation: number, dto: any) =>
  await HttpRequest(`bible-study/${id_formation}`, "PATCH", dto);
export const deleteBibleStudyApi = async (id_formation: number) =>
  await HttpRequest(`bible-study/${id_formation}`, "DELETE");
export const deleteContentBibleStudyApi = async (id_content: number) =>
  await HttpRequest(`bible-study/content/${id_content}`, "DELETE");
