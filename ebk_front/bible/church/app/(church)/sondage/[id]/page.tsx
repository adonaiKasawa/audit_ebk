import React from "react";
import { redirect } from "next/navigation";

import SondageQstByIdPageClient from "./page.client";

import { findSondageQstByIdApi } from "@/app/lib/actions/sondageQst/sondageQst.req";
import { auth } from "@/auth";

export default async function SondageQstByIdClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect("/church");
  }
  const { id } = await params;
  const sondage = await findSondageQstByIdApi(parseInt(id));

  return (
    <div>
      <SondageQstByIdPageClient
        initData={{ sondage }}
        params={await params}
        session={session}
      />
    </div>
  );
}
