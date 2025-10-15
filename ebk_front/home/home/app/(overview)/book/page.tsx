"use server";

import React from "react";

import ListeBooks from "./list.page";

import { findFilesPaginatedApi } from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";
import { auth } from "@/auth";

export default async function Books() {
  const session = await auth();

  const books = await findFilesPaginatedApi(TypeContentEnum.livres);

  return (
    <div>
      <ListeBooks initData={books} session={session} />
    </div>
  );
}
