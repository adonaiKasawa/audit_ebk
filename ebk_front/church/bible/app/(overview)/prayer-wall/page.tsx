"use server";
import React from "react";

import PrayerWallPageClient from "./page.client";

import { auth } from "@/auth";
import { findPrayerWallApi } from "@/app/lib/actions/prayer-wall/prayer.req";

export default async function PrayerWallPage() {
  const session = await auth();

  const find = await findPrayerWallApi();

  return (
    <div>
      <div className="background-prayer-wall" />
      <PrayerWallPageClient initData={find} session={session} />
    </div>
  );
}
