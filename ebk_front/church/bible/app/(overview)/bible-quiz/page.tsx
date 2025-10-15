"use server";

import BibleQuizPageClient from "./page.client";

import {
  findQuizBibliquePaginatedApi,
  findQuizByUserRespondedApi,
} from "@/app/lib/actions/quizBiblique/quiz.req";
import { auth } from "@/auth";

export default async function BibleQuizPage() {
  const session = await auth();

  const quiz = await findQuizBibliquePaginatedApi();

  const quizAnswered = await findQuizByUserRespondedApi(
    session ? session?.user.sub : 0,
  );

  return (
    <div>
      <BibleQuizPageClient
        initData={{ quiz, quizAnswered: session ? quizAnswered.items : [] }}
        session={session}
      />
    </div>
  );
}
