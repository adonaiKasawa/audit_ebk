"use client";

import React, { useEffect, useState } from "react";

import CardVideoFileUI from "@/ui/card/card.ui";
import { ItemVideos, VideoPaginated } from "@/app/lib/config/interface";

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function ClienPageVideos({
  initData,
  
}: {
  initData: VideoPaginated;
}) {
  const [videos, setVideos] = useState<VideoPaginated>(initData);


  // const firstVideos = async () => {
  //   const req = await findFilesPaginatedApi(TypeContentEnum.videos);

  //   if (!req.hasOwnProperty("statusCode") && !req.hasOwnProperty("message")) {
  //     setVideos(req);
  //   }
  // };


    const handleBlocked = (blockedId: number) => {
    setVideos((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== blockedId),
    }));
  };

  function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {videos &&
        videos?.items.map((item) => (
          <CardVideoFileUI key={item.id} video={item}  // 👈 on passe la fonction
 />
        ))}
    </section>
  );
}

export function VideosSuggestion({ videos }: { videos: VideoPaginated }) {
  const [video, setVideos] = useState<ItemVideos[] | null>(null);

  

  
  useEffect(() => {
    if (videos?.items) {
      const firstSix = shuffleArray(videos.items).slice(0, 6);
      setVideos(firstSix);

      // 🔄 Change l'ordre toutes les 30 secondes
      const interval = setInterval(() => {
        setVideos(shuffleArray(videos.items).slice(0, 6));
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [videos]);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {video &&
        video.map((item) => <CardVideoFileUI key={item.id} video={item} />)}
    </section>
  );
}
