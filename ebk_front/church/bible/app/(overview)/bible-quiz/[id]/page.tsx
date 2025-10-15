"use server";

import BibleQuizPageClientById from "./page.client";

import {
  findOneQuizByUserAnsweredApi,
  findQuestionnairesByQuizIdApi,
  findQuizByIdApi,
  findResultQuizApi,
} from "@/app/lib/actions/quizBiblique/quiz.req";
import { auth } from "@/auth";

export default async function BibleQuizPageById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  const quiz = await findQuizByIdApi(id);
  const questions = await findQuestionnairesByQuizIdApi(id);
  const answer = await findOneQuizByUserAnsweredApi(
    quiz.id,
    session ? session?.user.sub : 0,
  );
  const quizResult = await findResultQuizApi(id);

  return (
    <BibleQuizPageClientById
      initData={{
        quiz,
        questions,
        alreadyAnswered: session ? answer : [],
        quizResult,
      }}
      session={session}
    />
  );
}
