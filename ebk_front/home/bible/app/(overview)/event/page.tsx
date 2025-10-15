"use server";

import React from "react";

import EventPageClient from "./page.client";

import { findEventAllApi } from "@/app/lib/actions/management/event/event.req";
import { auth } from "@/auth";

export default async function EventPage() {
  const session = await auth();

  const find = await findEventAllApi(session ? true : false);

  return <EventPageClient initData={find} session={session} />;
}
