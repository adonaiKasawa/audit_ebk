"use server";

import React from "react";

import { ClientBible } from "./client.bible";

import { auth } from "@/auth";
import {
  getHistoryBible,
  getTagBible,
} from "@/app/lib/actions/bible/bible.req";

export default async function page() {
  const session = await auth();
  const tags = await getTagBible(session?.user?.sub);
  const history = await getHistoryBible(session?.user?.sub);

  return (
    <div>
      <ClientBible initData={{ tags, history }} session={session} />
    </div>
  );
}
