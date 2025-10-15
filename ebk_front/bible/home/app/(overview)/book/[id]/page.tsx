"use server";

import React from "react";

import ClientBookPage from "./client.page";

import { auth } from "@/auth";
import { getFileById } from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await auth();
  const book = await getFileById(id, TypeContentEnum.livres);

  return (
    <div>
      <ClientBookPage initData={book} params={await params} session={session} />
    </div>
  );
};

export default Page;
