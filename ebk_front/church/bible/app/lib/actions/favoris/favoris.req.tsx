"use server";

import { TypeContentEnum } from "../../config/enum";
import { HttpRequest } from "../../request/request";

export const createFavorisApi = async (
  typeContent: TypeContentEnum,
  contentId: number,
) => await HttpRequest(`favoris/${contentId}?files=${typeContent}`, "POST");
export const findFavorisByContetTypeAndUserApi = async (
  typeContent: TypeContentEnum,
) =>
  await HttpRequest(`favoris/findByContentTypeAndUser/${typeContent}`, "GET");
export const findFavorisByContetTypeAndUserApiByUser = async (
  typeContent: TypeContentEnum,
  id: string | number,
) =>
  await HttpRequest(
    `favoris/findByContentTypeAndUser/${id}/${typeContent}`,
    "GET",
  );
export const findFavorisByUserApi = async () =>
  await HttpRequest(`favoris/findByUser`, "GET");
export const deleteFavorisApi = async (contentId: number) =>
  await HttpRequest(`favoris/${contentId}`, "DELETE");
