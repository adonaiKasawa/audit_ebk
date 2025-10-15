"use client";

import React from "react";
import { Session } from "next-auth";

import AbonnementSsrTableUI from "@/ui/table/abonnement/abonnement.ssr.table";
import { AbonnementPaginated } from "@/app/lib/config/interface";

export default function ListeAnnonce({
  session,
  initData,
}: {
  session: Session;
  initData: AbonnementPaginated;
}) {
  return (
    <div>
      <h1 className="text-3xl">Abonnements</h1>
      <AbonnementSsrTableUI initData={initData} session={session} />
    </div>
  );
}
