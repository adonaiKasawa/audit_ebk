import React from "react";
import { redirect } from "next/navigation";

import { ListAppointement } from "./list.app";

import { auth } from "@/auth";
import { findAppointmentApi } from "@/app/lib/actions/appointment/appoint.req";

export default async function Appointement() {
  const session = await auth();

  if (!session) {
    redirect("/church");
  }

  let initAppointement = await await findAppointmentApi();
  // if (stCommuniques?.hasOwnProperty("statusCode") && stCommuniques?.hasOwnProperty("error")) {
  // stCommuniques = undefined
  // }

  return (
    <div>
      <ListAppointement appointement={initAppointement} />
    </div>
  );
}
