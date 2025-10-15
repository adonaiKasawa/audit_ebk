"use server";

import { redirect } from "next/navigation";
import React from "react";

import ArchivePageByIdFolderClient from "./page.client";

import { auth } from "@/auth";
import { findArchiveByFolderIdApi } from "@/app/lib/actions/management/archive/mange.archive.req";

export default async function PageByIdFolder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  const { id } = await params;
  const findArchive = await findArchiveByFolderIdApi(id);

  return (
    <ArchivePageByIdFolderClient initData={findArchive} session={session} />
  );
}
