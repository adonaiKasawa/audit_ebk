"use server";

import DescriptionPlanByIdPage from "./page.client";

import {
  getContentDaysForPlan,
  getOnePlanLecture,
} from "@/app/lib/actions/plan-lecture/plan_lecture.req";
import { auth } from "@/auth";

export default async function DescriptionPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  const plan = await getOnePlanLecture(parseInt(id));
  const contentDays = await getContentDaysForPlan(parseInt(id));

  return (
    <div>
      <DescriptionPlanByIdPage
        initData={{ plan, contentDays }}
        params={await params}
        session={session}
      />
    </div>
  );
}
