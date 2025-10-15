"use server";

import { TypeContentEnum } from "../../config/enum";
import { HttpRequest } from "../../request/request";

export const createLikeFileApi = async (id_file: number, type_file: string) =>
  await HttpRequest(`like/${id_file}?files=${type_file}`, "POST");
export const deleteLikeFileApi = async (
  id_file: number,
  fileType: TypeContentEnum,
) => await HttpRequest(`like/${id_file}`, "DELETE");
