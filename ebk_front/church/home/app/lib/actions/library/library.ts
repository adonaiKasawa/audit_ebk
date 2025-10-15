"use server";

import { TypeContentEnum } from "../../config/enum";
import { HttpRequest } from "../../request/request";

import { auth } from "@/auth";

export const createFileApi = async (file: TypeContentEnum, dto: any) =>
  await HttpRequest(`${file}`, "POST", dto);

export const getFile = async (id_eglise: number, file: string) =>
  await HttpRequest(`${file}/findByEgliseId/${id_eglise}`, "GET");
export const CreateWebp = async (form: any, type: string, id_file: number) =>
  await HttpRequest(`files/webp/${id_file}/${type}`, "PATCH", form);
export const getLive = async (id_eglise: number) =>
  await HttpRequest(`live/findByEgliseId/${id_eglise}`, "GET");

export const DeleteFile = async (id_file: number, file: string) =>
  await HttpRequest(`files/delete/${id_file}?files=${file}`, "DELETE");
export const UpdateFile = async (path: string, id_file: number, data: any) =>
  await HttpRequest(`${path}/${id_file}`, "PATCH", data);

export const findFilesPaginatedApi = async (
  file: TypeContentEnum,
  page = 1,
  limit = 100,
) => {
  const session = await auth();

  if (session) {
    const id_eglise = session.user?.eglise?.id_eglise;

    if (!session.user.eglise) {
      return findFilesNotEglisePaginatedApi(file);
    } else {
      return await HttpRequest(
        `${file}/findByEgliseId/pagination/${id_eglise}?page=${page}&limit=${limit}`,
        "GET",
      );
    }
  } else {
    return await HttpRequest(
      `${file}/find/noguard/pagination?page=${page}&limit=${limit}`,
      "GET",
    );
  }
};

export const findFilesByChurchPaginatedApi = async (
  file: TypeContentEnum,
  id_eglise: number,
) =>
  HttpRequest(
    `${file}/findByEgliseId/pagination/${id_eglise}?page=1&limit=1000`,
    "GET",
  );

export const findFilesNotBlockedApi = async (typeContent: TypeContentEnum) => {
  return await HttpRequest(
    `EhE7Aiheobj6gcBCZUsTkA5KliDrWvM_API/blocked/content?type=${typeContent}`,
    "GET"
  );
};

export const getFileById = async (id_file: string, file: string) =>
  await HttpRequest(`${file}/findById/${id_file}`, "GET");

export const findFilesNotEglisePaginatedApi = async (file: TypeContentEnum) =>
  await HttpRequest(`${file}/find/noguard/pagination?page=1&limit=1000`, "GET");

export const CommentFileApi = async (
  id_file: number,
  fileType: TypeContentEnum,
  commentaire: string,
) =>
  await HttpRequest(`comment/${id_file}?files=${fileType}`, "POST", {
    commentaire,
  });

export const findCommentsByContentIdApi = async (id_file: number) =>
  await HttpRequest(
    `comment/findByContentId/paginated/${id_file}/testimonials`,
    "GET"
  );

export const LikeFileApi = async (id_file: number, fileType: TypeContentEnum) =>
  await HttpRequest(`files/favoris/${id_file}?files=${fileType}`, "POST");

export const DisLikeFileApi = async (id_favoris: number) =>
  await HttpRequest(`files/favoris/${id_favoris}`, "DELETE");
