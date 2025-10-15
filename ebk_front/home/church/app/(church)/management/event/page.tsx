import React from "react";
import { redirect } from "next/navigation";

import EventPageClient from "./page.client";

import { auth } from "@/auth";
import { PrivilegesEnum } from "@/app/lib/config/enum";
import { findEventByEgliseIdApi } from "@/app/lib/actions/management/event/event.req";

export default async function EventPage() {
  const session = await auth();

  if (!session || session.user.privilege_user !== PrivilegesEnum.ADMIN_EGLISE) {
    redirect("/api/auth/signin");
  }
  let id_eglise = session.user.eglise.id_eglise;
  const find = await findEventByEgliseIdApi(id_eglise);

  return <EventPageClient initData={find} session={session} />;
}
