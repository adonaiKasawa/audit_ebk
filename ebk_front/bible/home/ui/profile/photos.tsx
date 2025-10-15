import { Session } from "next-auth";
import React from "react";

import { CardPictureFileUI } from "../card/card.ui";

import { ItemPicture } from "@/app/lib/config/interface";

export default function Photos({
  session,
  pictures,
}: {
  session: Session | null;
  pictures: ItemPicture[];
}) {
  return (
    <div
      className="flex w-full rounded-lg shadow-sm hover:shadow-md transition-shadow"
      style={{ flexWrap: "wrap", justifyContent: "space-evenly" }}
    >
      {pictures
        ?.filter(
          (item: any) =>
            item.images !== null && item?.users !== null && item?.images.photos,
        )
        ?.map((item: any) => (
          <div
            key={item.id}
            className="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            <CardPictureFileUI
              picture={{ ...item?.users, ...item.images }}
              session={session}
            />
          </div>
        ))}
    </div>
  );
}
