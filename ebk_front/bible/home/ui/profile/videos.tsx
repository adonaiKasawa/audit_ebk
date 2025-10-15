import React from "react";

import CardVideoFileUI from "../card/card.ui";

import { ItemVideos } from "@/app/lib/config/interface";

export default function Videos({ videos }: { videos: ItemVideos[] }) {
  return (
    <div className="grid gap-3 mt-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {videos
        ?.filter((item: any) => item.videos !== null && item?.users !== null)
        .map((item: any) => {
          return (
            <CardVideoFileUI
              key={`${item.createdAt || ""}`}
              video={{ ...item?.users, ...item.videos }}
            />
          );
        })}
    </div>
  );
}
