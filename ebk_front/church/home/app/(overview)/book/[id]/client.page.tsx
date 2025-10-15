"use client";
import React from "react";
import { Session } from "next-auth";

import { ItemVideos } from "@/app/lib/config/interface";
import { file_url } from "@/app/lib/request/request";
import ReaderPDF from "@/ui/readerPdf/reader.pdf";

const ClientBookPage = ({
  initData,
  session,
}: {
  params: { id: string };
  initData: ItemVideos;
  session: Session | null;
}) => {
  return (
    <div className="flex w-full">
      <ReaderPDF
        initData={initData}
        link={`${file_url}${initData.lien}`}
        session={session}
      />
    </div>
  );
};

export default ClientBookPage;
