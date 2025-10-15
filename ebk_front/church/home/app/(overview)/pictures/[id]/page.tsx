"use server";

import React from "react";

import { PictureClietPage } from "./client.page";

import { auth } from "@/auth";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const getParams = await params;

  return (
    <div>
      <PictureClietPage params={getParams} session={session} />
    </div>
  );
}
