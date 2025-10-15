"use client";

import React from "react";
import { Session } from "next-auth";

import { VideoPaginated } from "@/app/lib/config/interface";
import AudiosSsrTableUI from "@/ui/table/audios/audios.ssr.table";

export function ListeAudois({
  videos,
  session,
}: {
  videos: VideoPaginated;
  session: Session;
}) {
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-4xl">Audios</h1>
      </div>
      <AudiosSsrTableUI initData={videos} session={session} />
    </div>
  );
}
