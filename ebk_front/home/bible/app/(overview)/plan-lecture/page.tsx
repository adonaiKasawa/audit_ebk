"use server";

import React from "react";

import { ListePlanLecture } from "./liste.bible-plan";

import { auth } from "@/auth";
import {
  getAllPlanLecturesPagination,
  getPlanLectureUserStarted,
} from "@/app/lib/actions/plan-lecture/plan_lecture.req";

export default async function page() {
  const session = await auth();
  const find = await getAllPlanLecturesPagination();

  let findPlanStart = null;

  if (session?.user) findPlanStart = await getPlanLectureUserStarted();

  // console.log(findPlanStart);

  return (
    <div>
      <ListePlanLecture
        findPlanStart={findPlanStart || []}
        initData={find}
        session={session}
      />
    </div>
  );
}
