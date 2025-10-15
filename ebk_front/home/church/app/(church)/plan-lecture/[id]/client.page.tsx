"use client";

import React from "react";
import { Session } from "next-auth";

import { ItemContentBibleStudy } from "@/app/lib/config/interface";
import BibleStudyContentSsrTableUI from "@/ui/table/bibleStudy/biblestudy.content.ssr.table";

export default function ListeContentBibleStudy({
  params,
  initData,
  session,
}: {
  params: { id: string };
  initData: ItemContentBibleStudy[];
  session: Session;
}) {
  return (
    <div>
      <BibleStudyContentSsrTableUI
        initData={initData}
        params={params}
        session={session}
      />
    </div>
  );
}
