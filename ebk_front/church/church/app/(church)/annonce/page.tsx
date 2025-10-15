"use server";

import React from "react";
import { redirect } from "next/navigation";

import ListeAnnonce from "./liste.annonce";

import { auth } from "@/auth";
import { findAnnonceByEgliseIdPaginated } from "@/app/lib/actions/annonce/annonce.req";

export default async function Annonce() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  const find = await findAnnonceByEgliseIdPaginated(
    session.user.eglise.id_eglise,
  );

  return (
    <div>
      <ListeAnnonce initData={find} session={session} />
    </div>
  );
}
