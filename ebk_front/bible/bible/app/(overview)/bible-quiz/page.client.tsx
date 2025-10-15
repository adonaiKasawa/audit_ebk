"use client";

import { Session } from "next-auth";
import React, { useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";

import { QuizLevelDifficulty } from "@/app/lib/config/enum";
import {
  ItemQuizBibliqueDetail,
  QuizBibliquePaginated,
} from "@/app/lib/config/interface";
import { CardQuizBiblique } from "@/ui/card/card.ui";

export default function BibleQuizPageClient({
  session,
  initData,
}: {
  session: Session | null;
  initData: {
    quiz: QuizBibliquePaginated;
    quizAnswered: ItemQuizBibliqueDetail[];
  };
}) {
  const [quizList] = useState<QuizBibliquePaginated>(initData.quiz);
  const [quizAnsweredList] = useState<ItemQuizBibliqueDetail[]>(
    initData.quizAnswered,
  );

  const [selected, setSelected] = React.useState<string | number>(
    QuizLevelDifficulty.easy,
  );

  const handleRefreshQuizBiblique = async () => {};

  return (
    <div>
      <div className="flex justify-between">
        <p className="text-2xl">Quiz bibliques</p>
        <div>
          <Tabs
            aria-label="Options"
            selectedKey={selected}
            onSelectionChange={setSelected}
          >
            <Tab key={QuizLevelDifficulty.easy} title="Facile" />
            <Tab key={QuizLevelDifficulty.middle} title="Intermédiaire" />
            <Tab key={QuizLevelDifficulty.hard} title="Difficile" />
            <Tab key="answered" title="Participer" />
          </Tabs>
        </div>
      </div>

      {quizList && quizList.items.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {quizList.items
            .filter((item) => item.difficulty === selected)
            .map((item) => {
              return (
                <CardQuizBiblique
                  key={item.id}
                  handleRefreshQuizBiblique={handleRefreshQuizBiblique}
                  isCreator={false}
                  quiz={item}
                  session={session}
                />
              );
            })}
          {selected === "answered" &&
            quizAnsweredList &&
            quizAnsweredList.length > 0 &&
            quizAnsweredList.map((item) => {
              return (
                <CardQuizBiblique
                  key={item.id}
                  handleRefreshQuizBiblique={handleRefreshQuizBiblique}
                  isCreator={false}
                  quiz={item}
                  session={session}
                />
              );
            })}
        </div>
      ) : (
        <div className="h-screen justify-center items-center">
          <p className="text-neutral-200">Aucun quiz biblique pour le moment</p>
        </div>
      )}
    </div>
  );
}
