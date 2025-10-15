"use server";

import ClienViewPlanLecture from "./client.page";

import { auth } from "@/auth";
import {
  getContentDaysForPlan,
  getOnePlanLecture,
} from "@/app/lib/actions/plan-lecture/plan_lecture.req";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  const find = await getOnePlanLecture(parseInt(id));
  const contentDays = await getContentDaysForPlan(parseInt(id));
  let findPlanStart = null;

  return (
    <div>
      <ClienViewPlanLecture
        contentDays={contentDays}
        findPlanStart={findPlanStart || []}
        initData={find}
        params={await params}
        session={session}
      />
    </div>
  );
}
