"use server";

import { HttpRequest } from "../../request/request";
interface ITUpdatePlanLecture {
  title: string;
  description: string;
  categorie: string;
  number_days: number;
  picture?: number;
}
interface ITDayOfPlant {
  title: string;
  devotion: string;
  day: number;
}
interface ITContentDayOfPlant {
  book: string;
  chapter: string | null;
  verse: string | null;
  id?: number;
}

interface ITCreatDayOfPlant {
  dto: [
    {
      day: ITDayOfPlant;
      content: ITContentDayOfPlant[];
    },
  ];
}
interface ITUpdateContentOfDay {
  dto: ITContentDayOfPlant[];
}

export const createHeadPlanLecture = async (credentials: any) =>
  await HttpRequest(`bible/plans`, "POST", credentials);
export const createDayPlanLecture = async (
  dayPlan: ITCreatDayOfPlant,
  planId: number,
) => await HttpRequest(`bible/plans/createDay/${planId}`, "POST", dayPlan);

export const getContentDaysForPlan = async (planId: number) =>
  await HttpRequest(`bible/plans/find/days/${planId}`, "GET");
export const getOnePlanLecture = async (planId: number) =>
  await HttpRequest(`bible/plans/find/${planId}`, "GET");
export const getPlanLectureUserStarted = async () =>
  await HttpRequest(`bible/plans/user/started`, "GET");
export const getAllPlanLecturesPagination = async () =>
  await HttpRequest(`bible/plans/find/pagination?page=1&limit=300`, "GET");

export const updatePlanLecture = async (
  planId: number,
  data: Partial<ITUpdatePlanLecture>,
) => await HttpRequest(`bible/plans/${planId}`, "PATCH", { ...data });
export const updatePlanLectureContent = async (
  dayId: number,
  { book, chapter, verse }: { book: string; chapter: string; verse: string },
) =>
  await HttpRequest(`bible/plans/day/content/${dayId}`, "PATCH", {
    book,
    chapter,
    verse,
  });
export const updateAllContentOfDays = async (
  dayId: number,
  data: ITUpdateContentOfDay,
) => await HttpRequest(`bible/plans/day/all/content/${dayId}`, "PATCH", data);
export const updateContentPlanLecture = async (
  dayId: number,
  { title, devotion }: { title: string; devotion: string },
) =>
  await HttpRequest(`bible/plans/day/${dayId}`, "PATCH", { title, devotion });

export const deletePlanLecture = async (planId: number) =>
  await HttpRequest(`bible/plans/${planId}`, "DELETE");
export const deleteBibleStudyApi = async (id_formation: number) =>
  await HttpRequest(`bible-study/${id_formation}`, "DELETE");
export const deleteContentBibleStudyApi = async (id_content: number) =>
  await HttpRequest(`bible-study/content/${id_content}`, "DELETE");

export const userStartedPlan = async (planId: number) =>
  await HttpRequest(`bible/plans/user/started/${planId}`, "POST");
export const progressPlanLectures = async (dayId: number) =>
  await HttpRequest(`bible/plans/user/add/progress/${dayId}`, "POST", {
    dayId: dayId,
  });
