"use server";

import React from "react";

import ClietAudiosPage from "./client.page";

import { auth } from "@/auth";

export default async function Audios({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  // const dataById = await getFileById(params.id, TypeContentEnum.audios);
  // const audios = await findFilesPaginatedApi(TypeContentEnum.audios);
  return (
    <>
      <ClietAudiosPage params={await params} session={session} />
    </>
  );
}
