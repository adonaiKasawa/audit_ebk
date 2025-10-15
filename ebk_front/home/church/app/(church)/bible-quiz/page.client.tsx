"use client";

import React, { useState } from "react";
import { Session } from "next-auth";

import { findQuizBibliqueApi } from "@/app/lib/actions/quizBiblique/quiz.req";
import { QuizBibliquePaginated } from "@/app/lib/config/interface";
import { CreateQuizFormModal } from "@/ui/modal/form/quizBiblique";
import { CardQuizBiblique } from "@/ui/card/card.ui";

export default function QuizBibliqueClientPage({
  initData,
  session,
}: {
  initData: QuizBibliquePaginated;
  session: Session;
}) {
  const { user } = session;
  const [quiz, setQuiz] = useState<QuizBibliquePaginated>(initData);

  const handleFindQuizBiblique = async () => {
    const find = await findQuizBibliqueApi(user.sub);

    if (!find.hasOwnProperty("statusCode") && !find.hasOwnProperty("message")) {
      setQuiz(find);
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <p className="text-2xl">Quiz bibliques</p>
        <CreateQuizFormModal handleFindQuizBiblique={handleFindQuizBiblique} />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {quiz.items && quiz.items.length > 0 ? (
          quiz.items.map((item, i) => (
            <CardQuizBiblique
              key={i}
              handleRefreshQuizBiblique={handleFindQuizBiblique}
              isCreator={true}
              quiz={item}
              session={session}
            />
          ))
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
