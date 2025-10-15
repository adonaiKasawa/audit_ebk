"use client";

import React from "react";
import { Session } from "next-auth";

import { BiblePlanLecturePaginated } from "@/app/lib/config/interface";
import BiblePlanLectureSsrTableUI from "@/ui/table/plan-lecture/bible.ssr.table";

export default function ListePlanLecture({
  session,
  initData,
}: {
  session: Session;
  initData: BiblePlanLecturePaginated;
}) {
  return (
    <div>
      <h1 className="text-3xl">Plan de lecture biblique</h1>
      <BiblePlanLectureSsrTableUI initData={initData} session={session} />
    </div>
  );
}
