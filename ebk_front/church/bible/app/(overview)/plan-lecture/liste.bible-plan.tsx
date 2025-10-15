"use client";

import React, { useState } from "react";
import { Session } from "next-auth";
import { Tabs, Tab } from "@heroui/tabs";

import {
  BiblePlanByUserStarted,
  BiblePlanLecturePaginated,
} from "@/app/lib/config/interface";
import { CardPlanLectureStartedUI, CardPlanLectureUI } from "@/ui/card/card.ui";

export function ListePlanLecture({
  initData,
  findPlanStart,
}: {
  findPlanStart: BiblePlanByUserStarted[];
  initData: BiblePlanLecturePaginated;
  session: Session | null;
}) {
  const [selected, setSelected] = useState<string | number>("0");

  return (
    <div className="flex flex-col">
      <div
        className="flex rounded-lg"
        style={{ marginTop: 20, marginBottom: 30, justifyContent: "center" }}
      >
        <Tabs
          aria-label="Options"
          selectedKey={selected}
          onSelectionChange={setSelected}
        >
          <Tab key="0" title="Mes plans" />
          <Tab key="1" title="Trouver des plans" />
        </Tabs>
      </div>

      <div className="md:flex flex-col">
        {selected == "0" &&
          findPlanStart &&
          findPlanStart.map((item) => {
            if (item.plans !== null) {
              return (
                <CardPlanLectureStartedUI
                  key={`${item.createdAt}`}
                  startedPlan={item}
                />
              );
            }
          })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {selected == "1" &&
          initData.items &&
          initData.items
            .filter(
              (i) =>
                !findPlanStart
                  .map((f) => f.plans !== null && f.plans.id)
                  .includes(i.id),
            )
            .map((item) => (
              <CardPlanLectureUI key={`${item.createdAt}`} plan={item} />
            ))}
      </div>
    </div>
  );
}
