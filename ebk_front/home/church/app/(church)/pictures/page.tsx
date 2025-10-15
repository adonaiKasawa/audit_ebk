"use server";

import React from "react";
import { redirect } from "next/navigation";

import { ListePicture } from "./list.pic";

import { auth } from "@/auth";
import { findFilesByChurchPaginatedApi } from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";

export default async function Pictures() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  const picture = await findFilesByChurchPaginatedApi(
    TypeContentEnum.images,
    session.user.eglise.id_eglise,
  );

  return (
    <div>
      <ListePicture picture={picture} session={session} />
    </div>
  );
}
