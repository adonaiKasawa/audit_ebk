"use server";

import React from "react";

import ClientPage from "./client.page";

import { auth } from "@/auth";

export default async function Page({}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // const s_query = searchParams?.s_query;
  const session = await auth();

  return (
    <div>
      <ClientPage session={session} />
    </div>
  );
}
