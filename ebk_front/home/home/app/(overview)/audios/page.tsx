"use server";

// Groupe 1 : imports externes
import React from "react";
import { Session } from "next-auth";

// Ligne vide entre groupes

// Groupe 2 : imports internes / alias
import { auth } from "@/auth";
import { findFilesPaginatedApi } from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";
import Link from "next/link";
import ListeAudios from "./list.audios";

export default async function Audios() {
  const session: Session | null = await auth();
  const audios = await findFilesPaginatedApi(TypeContentEnum.audios);

  return (
    <div>
      <ListeAudios initData={audios} session={session} />
    </div>
  );
}
