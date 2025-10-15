"use server";

import React from "react";
import { redirect } from "next/navigation";

import { ClientPage } from "./client.page";

import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div>
      <ClientPage initSession={session} />
    </div>
  );
}
