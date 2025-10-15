"use server";

import { SharePageClient } from "./page.client";

import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return (
    <div>
      <SharePageClient session={session} />
    </div>
  );
}
