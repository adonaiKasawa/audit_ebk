"use client";

import React from "react";
import { Session } from "next-auth";

import { PicturePaginated } from "@/app/lib/config/interface";
import PictureSsrTableUI from "@/ui/table/picture/picture.ssr.table";

export function ListePicture({
  picture,
  session,
}: {
  picture: PicturePaginated;
  session: Session;
}) {
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-4xl">Images</h1>
      </div>
      <PictureSsrTableUI initData={picture} session={session} />
    </div>
  );
}
