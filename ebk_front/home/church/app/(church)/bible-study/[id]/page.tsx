"use server";
import React from "react";
import { redirect } from "next/navigation";

import ListeContentBibleStudy from "./list.content.biblestudy";

import { auth } from "@/auth";
import { findBibleStudyById } from "@/app/lib/actions/etudeBiblique/etudeBiblique.req";

export default async function BibleStudy({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  const { id } = await params;

  const find = await findBibleStudyById(parseInt(id));

  if (find.hasOwnProperty("statusCode") && find.hasOwnProperty("message")) {
    redirect("/church/bible-study");
  }

  return (
    <div>
      <h1 className="text-3xl">Etude Biblique : {find.titre}</h1>
      <ListeContentBibleStudy
        initData={find.contentsBibleStudy}
        params={await params}
        session={session}
      />
    </div>
  );
}
