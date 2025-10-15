"use server";

import { redirect } from "next/navigation";
import React from "react";

import QuizBibliqueDetailClientPage from "./page.client";

import { auth } from "@/auth";
import {
  findQuestionnairesByQuizIdApi,
  findQuizByIdApi,
  findResultQuizApi,
} from "@/app/lib/actions/quizBiblique/quiz.req";

export default async function QuizBibliqueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  const { id } = await params;
  const find = await findQuestionnairesByQuizIdApi(id);
  const quizFind = await findQuizByIdApi(id);
  const quizResult = await findResultQuizApi(id);

  return (
    <QuizBibliqueDetailClientPage
      initData={{
        questions: find,
        quiz: quizFind,
        quizResult: quizResult,
      }}
      params={await params}
    />
  );
}
