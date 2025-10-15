"use server";

import { TypeContentEnum } from "../../config/enum";
import { HttpRequest } from "../../request/request";

export const updateChurcheApi = async (data: any, id: number) =>
  await HttpRequest(`eglise/updateeglise/${id}`, "PUT", data);
export const sendChurchMessageApi = async (data: any, id: number) =>
  await HttpRequest(`eglise/eglise/contact/${id}`, "POST", data);
export const bloquerEgliseApi = async (id: number, status: any) =>
  await HttpRequest(`eglise/updateeglise/${id}`, "PUT", status);
export const deleteEglise = async (id: number) =>
  await HttpRequest(`eglise/deleteeglise/${id}`, "DELETE");

export const findChurchPaginatedApi = async () =>
  await HttpRequest(`eglise/all-paginated?page=1&limit=200`, "GET");

export const findChurchByUsername = async (username: string) =>
  await HttpRequest(`eglise/username/${username}`, "GET");
export const findFileByChurchId = async (
  id_eglise: number,
  file: TypeContentEnum,
) =>
  await HttpRequest(
    `${file}/findByEgliseId/pagination/${id_eglise}?page=1&limit=100000`,
    "GET",
  );
export const findCommentBySubjectForumApi = async (id: number) =>
  await HttpRequest(
    `comment/findByContentId/paginated/${id}/sujetForum?page=1&limit=100000000`,
    "GET",
  );
export const createSubjectForFourmApi = async (
  dto: { title: string; description: string | undefined },
  id: number,
) => await HttpRequest(`forum/subject/${id}`, "POST", dto);
export const updateSubjectForFourmApi = async (
  dto: { title: string; description: string | undefined },
  id: number,
) => await HttpRequest(`forum/subject/${id}`, "PATCH", dto);
export const deleteSubjectFourmApi = async (id: number) =>
  await HttpRequest(`forum/subject/${id}`, "DELETE");

export const findForumAllPaginatedApi = async () =>
  await HttpRequest("forum/paginated", "GET");
export const findForumByIdApi = async (id: string) =>
  await HttpRequest(`forum/findById/${id}`, "GET");
export const findForumByChurchId = async (id_eglise: number) =>
  await HttpRequest(`forum/ByEgliseId/paginated/${id_eglise}`, "GET");
export const createForumChurchApi = async (forumDto: any) =>
  await HttpRequest(`forum`, "POST", forumDto);
export const updatetFourmApi = async (
  dto: { title: string; description: string | undefined },
  id: number,
) => await HttpRequest(`forum/${id}`, "PATCH", dto);
export const deleteFourmApi = async (id: number) =>
  await HttpRequest(`forum/${id}`, "DELETE");

export const findChurchStatistique = async (id_eglise: number) =>
  await HttpRequest(`eglise/findStatistiqueByEglise/${id_eglise}`, "GET");
