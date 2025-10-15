"use server";

import React from "react";
import { redirect } from "next/navigation";

import { ListeVideos } from "./list.vid";

import { auth } from "@/auth";
import { findFilesByChurchPaginatedApi } from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";

export default async function videos() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  const videos = await findFilesByChurchPaginatedApi(
    TypeContentEnum.videos,
    session.user.eglise.id_eglise,
  );

  return (
    <div>
      <ListeVideos session={session} videos={videos} />
    </div>
  );
}
