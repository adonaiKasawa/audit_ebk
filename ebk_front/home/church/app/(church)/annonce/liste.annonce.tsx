"use client";
import React from "react";
import { Session } from "next-auth";

import AnnoncesSsrTableUI from "@/ui/table/annonce/annonce.ssr.table";
import { AnnoncePaginated } from "@/app/lib/config/interface";

export default function ListeAnnonce({
  session,
  initData,
}: {
  session: Session;
  initData: AnnoncePaginated;
}) {
  return (
    <div>
      <h1 className="text-3xl">Annonces</h1>
      <AnnoncesSsrTableUI initData={initData} session={session} />
    </div>
  );
}
