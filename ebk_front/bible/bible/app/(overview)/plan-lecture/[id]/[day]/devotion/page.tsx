"use server";

import DevotionPage from "./client.page";

import { auth } from "@/auth";
import {
  getContentDaysForPlan,
  getOnePlanLecture,
} from "@/app/lib/actions/plan-lecture/plan_lecture.req";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; day: number }>;
}) {
  const session = await auth();
  const find = await getOnePlanLecture(parseInt((await params).id));
  const contentDays = await getContentDaysForPlan(parseInt((await params).id));

  return (
    <div>
      <DevotionPage
        contentDays={contentDays}
        initData={find}
        params={await params}
        session={session}
      />
    </div>
  );
}
