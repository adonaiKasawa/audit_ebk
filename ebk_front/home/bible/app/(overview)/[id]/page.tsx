"use server";

import ClienBiblePage from "./client.page";

import { auth } from "@/auth";
import { findBibleStudyById } from "@/app/lib/actions/etudeBiblique/etudeBiblique.req";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const find = await findBibleStudyById(parseInt((await params).id));

  return (
    <div>
      <ClienBiblePage initData={find} params={await params} session={session} />
    </div>
  );
}
