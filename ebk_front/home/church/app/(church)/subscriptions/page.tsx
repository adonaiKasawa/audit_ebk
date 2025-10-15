"use server";

import React from "react";
import { redirect } from "next/navigation";

import ListeAbonnement from "./liste.abonnement";

import { auth } from "@/auth";
import { findAbonnementByEgliseIdPaginated } from "@/app/lib/actions/abonnement/abonnement.req";

export default async function Abonnement() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  const find = await findAbonnementByEgliseIdPaginated(
    session.user.eglise.id_eglise,
  );

  return (
    <div>
      <ListeAbonnement initData={find} session={session} />
    </div>
  );
}
