"use server";

import React from "react";

import EventByIdPageClient from "./page.client";

import { findEventByIdApi } from "@/app/lib/actions/management/event/event.req";
import { auth } from "@/auth";

export default async function EventByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  const find = await findEventByIdApi((await params).id);

  return <EventByIdPageClient initData={find} session={session} />;
}
