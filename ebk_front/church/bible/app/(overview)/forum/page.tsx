"use server";

import React from "react";

import ListForum from "./list.forum";

import { auth } from "@/auth";
import { findForumAllPaginatedApi } from "@/app/lib/actions/church/church";

export default async function forum() {
  const session = await auth();
  const forums = await findForumAllPaginatedApi();

  return (
    <div>
      <ListForum initData={forums} session={session} />
    </div>
  );
}
