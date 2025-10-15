import React from "react";

import SondageQstPageClient from "./page.client";

import { auth } from "@/auth";
import { findSondageQstApi } from "@/app/lib/actions/sondageQst/sondageQst.req";

export default async function SondageQstPage() {
  const session = await auth();

  const sondage = await findSondageQstApi();

  return (
    <div>
      <SondageQstPageClient initData={{ sondage }} session={session} />
    </div>
  );
}
