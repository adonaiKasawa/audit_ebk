"use client";

import React from "react";
import { Session } from "next-auth";

import BibleStudySsrTableUI from "@/ui/table/bibleStudy/bible.ssr.table";
import { BibleStudyPaginated } from "@/app/lib/config/interface";

export default function ListeBibleStudy({
  session,
  initData,
}: {
  session: Session;
  initData: BibleStudyPaginated;
}) {
  return (
    <div>
      <h1 className="text-3xl">Etude Biblique</h1>
      <BibleStudySsrTableUI initData={initData} session={session} />
    </div>
  );
}
