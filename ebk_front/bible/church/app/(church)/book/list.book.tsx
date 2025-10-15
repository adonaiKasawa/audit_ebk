"use client";

import React from "react";
import { Session } from "next-auth";

import { VideoPaginated } from "@/app/lib/config/interface";
import BooksSsrTableUI from "@/ui/table/book/book.ssr.table";

export function ListeBook({
  book,
  session,
}: {
  book: VideoPaginated;
  session: Session;
}) {
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-4xl">Livres</h1>
      </div>
      <BooksSsrTableUI initData={book} session={session} />
    </div>
  );
}
