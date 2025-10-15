"use server";

import React from "react";

import ClienPageVideos from "./client.page";

// import { auth } from "@/auth";
import { findFilesPaginatedApi } from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";

export default async function Page() {
  // const session = await auth();
  const req = await findFilesPaginatedApi(TypeContentEnum.videos);

  return (
    <div>
      <ClienPageVideos initData={req} />
    </div>
  );
}
