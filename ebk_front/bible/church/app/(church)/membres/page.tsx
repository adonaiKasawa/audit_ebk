"use server";

import React from "react";
import { redirect } from "next/navigation";

import ListMembres from "./liste.mem";

import { auth } from "@/auth";
import { findMembreApi } from "@/app/lib/actions/membre/memb.req";

export default async function Membres() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  const membres = await findMembreApi(session.user.eglise.id_eglise);

  return (
    <div>
      <ListMembres initData={membres} session={session} />
    </div>
  );
}
