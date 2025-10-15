"use server";

import { AppointmentEnum } from "../../config/enum";
import { HttpRequest } from "../../request/request";

export const createDayApi = async (dto: {
  jour: string;
  limite: number;
  startTime: string;
  endTime: string;
}) => await HttpRequest("rendezvous/create/day", "POST", dto);

export const findDayApi = async () =>
  await HttpRequest("rendezvous/day", "GET");

export const deleteDayApi = async (id: number) =>
  await HttpRequest(`rendezvous/day/${id}`, "DELETE");

export const findAppointmentApi = async () =>
  await HttpRequest("rendezvous/find/forchurch", "GET");

export const postponeAppointmentApi = async (
  dto: { postponeDate: string; motif: string },
  id: number,
) => await HttpRequest(`rendezvous/postpone/${id}`, "POST", dto);

export const cancelAppointmentApi = async (id: number) =>
  await HttpRequest(`rendezvous/${id}`, "DELETE");

export const confirmAppointmentApi = async (id: number) =>
  await HttpRequest(`rendezvous/confirm/appointment/${id}`, "PATCH", {
    decision: AppointmentEnum.APPROUVED,
  });
