"use client";

import { Session } from "next-auth";
import React, { useState } from "react";

import { PicturePaginated } from "@/app/lib/config/interface";
import { CardPictureFileUI } from "@/ui/card/card.ui";

export default function ListePicktures({
  initData,
  session,
}: {
  initData: PicturePaginated;
  session: Session | null;
}) {
  const [pictures] = useState<PicturePaginated>(initData);

  // useEffect(() => {
  //   const data = findFilesPaginatedApi(TypeContentEnum.images);
  //   data.then((r) => {
  //     setPictures(r);
  //   })
  // }, []);

  return (
    <div className="flex justify-center">
      <div className="gap-4">
        {pictures &&
          pictures.items.map((item) => (
            <CardPictureFileUI
              key={`${item.createdAt}${item.id}`}
              picture={item}
              session={session}
            />
          ))}
      </div>
    </div>
  );
}
