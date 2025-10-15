"use server";

import { HttpRequest } from "../../request/request";

export const CreateShareApi = async (
  s_share_code: string | null,
  u_user: string | null,
  t_type_file: string | null,
) =>
  await HttpRequest(
    `share?s_share_code=${s_share_code}&u_user=${u_user}&t_type_file=${t_type_file}`,
    "POST",
  );
export const CreateShareNoGaurdApi = async (
  s_share_code: string | null,
  u_user: string | null,
  t_type_file: string | null,
) =>
  await HttpRequest(
    `share/create/nogaurd?s_share_code=${s_share_code}&u_user=${u_user}&t_type_file=${t_type_file}`,
    "POST",
  );
