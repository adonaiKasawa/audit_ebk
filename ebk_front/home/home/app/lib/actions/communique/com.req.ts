"use server";
import { HttpRequest } from "../../request/request";

export const findCommuniqueByChurchIdApi = async (id: number) =>
  await HttpRequest(`communique/findByEgliseId/paginated/${id}`, "GET");
export const createCommuniqueApi = async (dto: { communique: string }) =>
  await HttpRequest(`communique/create`, "POST", dto);
export const updateCommuniqueApi = async (
  dto: { communique: string },
  id: number,
) => await HttpRequest(`communique/${id}`, "PATCH", dto);
export const deleteCommuniqueApi = async (id: number) =>
  await HttpRequest(`communique/delete/${id}`, "DELETE");

export const resendNotificationApi = async (id: number) =>
  await HttpRequest(`communique/resendNotification/${id}`, "POST");
