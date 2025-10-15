"use server";

import React from "react";
import { redirect } from "next/navigation";

import ListeBibleStudy from "./liste.biblestudy";

import { auth } from "@/auth";
import { findBibleStudyByEgliseIdPaginated } from "@/app/lib/actions/etudeBiblique/etudeBiblique.req";

export default async function BibleStudy() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const find = await findBibleStudyByEgliseIdPaginated(
    session.user.eglise.id_eglise,
  );

  return (
    <div>
      <ListeBibleStudy initData={find} session={session} />
    </div>
  );
}
