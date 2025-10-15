"use server";

import { TypeContentEnum } from "../../config/enum";
import { HttpRequest } from "../../request/request";

export const resendNotification = async (
  id: number,
  typeContent: TypeContentEnum,
) => await HttpRequest(`notification/resend/${typeContent}/${id}`, "GET");

export const sendTokenNotification = async (token: string) =>
  await HttpRequest(`notification/sendToken`, "POST", { token });

export const getUserNotifications = async () =>
  await HttpRequest(`notification/findByUser`, "GET");

export const changeNotificationStatus = async (notificationId: number) =>
  await HttpRequest(`notification/status/${notificationId}`, "PUT");
