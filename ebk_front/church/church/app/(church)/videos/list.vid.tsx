"use client";

import React from "react";
import { Session } from "next-auth";

import { VideoPaginated } from "@/app/lib/config/interface";
import VideosSsrTableUI from "@/ui/table/videos/videos.ssr.table";

export function ListeVideos({
  videos,
  session,
}: {
  videos: VideoPaginated;
  session: Session;
}) {
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-4xl">Vidéos</h1>
      </div>
      <VideosSsrTableUI initData={videos} session={session} />
    </div>
  );
}
