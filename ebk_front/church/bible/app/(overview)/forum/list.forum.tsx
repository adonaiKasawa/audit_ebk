"use client";

import React from "react";
import { Session } from "next-auth";

import { CardForumUI } from "@/ui/card/card.ui";

export default function ListForum({
  initData,
}: {
  session: Session | null;
  initData: any;
}) {
  const isLoading = !initData?.items || initData.items.length === 0;
  
  return (
    <div className="flex flex-col items-center">
      {initData.items && initData.items.length > 0 ? (
        initData?.items.map((item: any) => (
          <CardForumUI key={item.id} forum={item} />
        ))
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p className="text-2xl text-gray-400">Aucun de forum disponible</p>
        </div>
      )}
    </div>
  );
}
