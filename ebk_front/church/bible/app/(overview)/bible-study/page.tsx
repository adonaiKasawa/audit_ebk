"use server";

import React from "react";

import { ListeBibleStudy } from "./liste.bible-study";

import { auth } from "@/auth";
import { findBibleStudyPaginated } from "@/app/lib/actions/etudeBiblique/etudeBiblique.req";

export default async function page() {
  const session = await auth();
  const find = await findBibleStudyPaginated();

  return (
    <div>
      <ListeBibleStudy initData={find} session={session} />
    </div>
  );
}
