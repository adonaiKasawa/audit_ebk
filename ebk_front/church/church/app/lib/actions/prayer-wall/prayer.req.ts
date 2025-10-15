"use server";

import { HttpRequest } from "../../request/request";

export interface CreatePrayerWallDto {
  prayer: string;
}

export const creatPrayerWallApi = async (data: CreatePrayerWallDto) =>
  await HttpRequest(`prayer-wall`, "POST", data);

export const findPrayerWallApi = async () =>
  await HttpRequest(`prayer-wall`, "GET");
export const findPrayerWallByIdApi = async (id: number) =>
  await HttpRequest(`prayer-wall/${id}`, "GET");

export const updatedPrayerWallByIdApi = async (
  id: number,
  data: CreatePrayerWallDto,
) => await HttpRequest(`prayer-wall/${id}`, "PATCH", data);
