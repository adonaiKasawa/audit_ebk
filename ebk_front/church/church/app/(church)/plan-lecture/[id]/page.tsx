"use server";
import React from "react";
import { redirect } from "next/navigation";

import ClienViewPlanLecture from "../client.view.plant.reader";

import { auth } from "@/auth";
import {
  getContentDaysForPlan,
  getOnePlanLecture,
} from "@/app/lib/actions/plan-lecture/plan_lecture.req";

export default async function ReadingPlanById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  const { id } = await params;
  const find = await getOnePlanLecture(parseInt(id));
  const contentDays = await getContentDaysForPlan(parseInt(id));
  // let findPlanStart = null;

  return (
    <div>
      <ClienViewPlanLecture
        contentDays={contentDays}
        findPlanStart={[]}
        initData={find}
        params={await params}
        session={session}
      />
    </div>
  );
}
