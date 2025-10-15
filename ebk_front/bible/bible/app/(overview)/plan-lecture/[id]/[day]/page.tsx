"use server";

import ClienBiblePage from "./client.page";

import { auth } from "@/auth";
import { findBibleStudyById } from "@/app/lib/actions/etudeBiblique/etudeBiblique.req";
import { progressPlanLectures } from "@/app/lib/actions/plan-lecture/plan_lecture.req";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; day: number }>;
}) {
  const session = await auth();
  const find = await findBibleStudyById(parseInt((await params).id));

  await progressPlanLectures((await params).day);

  return (
    <div>
      <ClienBiblePage initData={find} params={await params} session={session} />
    </div>
  );
}
