"use server";

import React from "react";

import ListePicktures from "./list.picture";

import { findFilesPaginatedApi } from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";
import { auth } from "@/auth";

export default async function Picktures() {
  const session = await auth();

  const find = await findFilesPaginatedApi(TypeContentEnum.images);

  return (
    <div className="flex justify-center">
      <ListePicktures initData={find} session={session} />
    </div>
  );
}
