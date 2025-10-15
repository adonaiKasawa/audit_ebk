"use client";

import { Session } from "next-auth";
import React from "react";

import MembresSsrTableUI from "@/ui/table/membres/membre.ssr.table";

export default function ListMembres({
  session,
  initData,
}: {
  session: Session;
  initData: any;
}) {
  return (
    <div>
      <h1 className="text-4xl">Membres</h1>
      <MembresSsrTableUI initData={initData} session={session} />
    </div>
  );
}
