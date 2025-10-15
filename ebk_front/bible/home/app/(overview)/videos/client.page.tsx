"use client";

import React, { useEffect, useState } from "react";

import CardVideoFileUI from "@/ui/card/card.ui";
import { ItemVideos, VideoPaginated } from "@/app/lib/config/interface";

export default function ClienPageVideos({
  initData,
}: {
  initData: VideoPaginated;
}) {
  const [videos] = useState<VideoPaginated>(initData);

  // const firstVideos = async () => {
  //   const req = await findFilesPaginatedApi(TypeContentEnum.videos);

  //   if (!req.hasOwnProperty("statusCode") && !req.hasOwnProperty("message")) {
  //     setVideos(req);
  //   }
  // };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {videos &&
        videos?.items.map((item) => (
          <CardVideoFileUI key={item.id} video={item} />
        ))}
    </section>
  );
}

export function VideosSuggestion({ videos }: { videos: VideoPaginated }) {
  const [video, setVideos] = useState<ItemVideos[] | null>(null);

  useEffect(() => {
    const handleFIndVideos = () => {
      const e = [];

      for (let i = 0; i < videos.items.length; i++) {
        if (i < 6) {
          e.push(videos.items[i]);
        }
      }
      setVideos(e);
    };

    handleFIndVideos();
  }, [videos]);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {video &&
        video.map((item) => <CardVideoFileUI key={item.id} video={item} />)}
    </section>
  );
}
