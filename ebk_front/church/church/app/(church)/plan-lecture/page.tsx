"use server";

import React from "react";
import { redirect } from "next/navigation";

import ListePlanLecture from "./liste.plan_lecture";

import { auth } from "@/auth";
import { getAllPlanLecturesPagination } from "@/app/lib/actions/plan-lecture/plan_lecture.req";

export default async function BibleStudy() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const find = await getAllPlanLecturesPagination();

  return (
    <div>
      <ListePlanLecture initData={find} session={session} />
    </div>
  );
}
