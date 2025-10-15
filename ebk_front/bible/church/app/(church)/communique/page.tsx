"use server";

import { redirect } from "next/navigation";

import { ListCommuniques } from "./list.com";

import { auth } from "@/auth";
import { findCommuniqueByChurchIdApi } from "@/app/lib/actions/communique/com.req";
import { CommuniquesPaginated } from "@/app/lib/config/interface";

export default async function communiques() {
  const session = await auth();

  if (!session) {
    redirect("/church");
  }

  let stCommuniques: CommuniquesPaginated | undefined =
    await findCommuniqueByChurchIdApi(session?.user?.eglise.id_eglise);

  if (
    stCommuniques?.hasOwnProperty("statusCode") &&
    stCommuniques?.hasOwnProperty("error")
  ) {
    stCommuniques = undefined;
  }

  return (
    <div>
      <ListCommuniques initCommuniques={stCommuniques} />
    </div>
  );
}
