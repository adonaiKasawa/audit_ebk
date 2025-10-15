"use server";

import { redirect } from "next/navigation";

import QuizBibliqueClientPage from "./page.client";

import { auth } from "@/auth";
import { findQuizBibliqueApi } from "@/app/lib/actions/quizBiblique/quiz.req";

export default async function BibleQuizPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  const find = await findQuizBibliqueApi(session.user.sub);

  return <QuizBibliqueClientPage initData={find} session={session} />;
}
