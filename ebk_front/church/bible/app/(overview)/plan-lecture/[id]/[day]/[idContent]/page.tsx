"use server";

import ContentPage from "./client.page";

import { auth } from "@/auth";
import {
  getContentDaysForPlan,
  getOnePlanLecture,
} from "@/app/lib/actions/plan-lecture/plan_lecture.req";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; day: number; idContent: number }>;
}) {
  const session = await auth();
  const { id } = await params;
  const find = await getOnePlanLecture(parseInt(id));
  const contentDays = await getContentDaysForPlan(parseInt(id));

  return (
    <div>
      <ContentPage
        contentDays={contentDays}
        initData={find}
        params={await params}
        session={session}
      />
    </div>
  );
}
