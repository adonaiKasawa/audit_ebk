import React from "react";
import { redirect } from "next/navigation";

import SondageQstPageClient from "./page.client";

import { auth } from "@/auth";
import { findSondageQstByEglsieIdApi } from "@/app/lib/actions/sondageQst/sondageQst.req";

export default async function SondageQstPage() {
  const session = await auth();

  if (!session) {
    redirect("/church");
  }
  const { user } = session;

  const sondage = await findSondageQstByEglsieIdApi(user.eglise.id_eglise);

  return (
    <div>
      <SondageQstPageClient initData={{ sondage }} session={session} />
    </div>
  );
}
