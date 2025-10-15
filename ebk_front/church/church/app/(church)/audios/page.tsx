"use server";

import React from "react";
import { redirect } from "next/navigation";

import { ListeAudois } from "./list.audio";

import { auth } from "@/auth";
import { findFilesByChurchPaginatedApi } from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";

export default async function Audio() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  const videos = await findFilesByChurchPaginatedApi(
    TypeContentEnum.audios,
    session.user.eglise.id_eglise,
  );

  return (
    <div>
      <ListeAudois session={session} videos={videos} />
    </div>
  );
}
