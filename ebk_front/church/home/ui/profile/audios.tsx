import React from "react";

import { CardAudioFileUI } from "../card/card.ui";

import { ItemVideos } from "@/app/lib/config/interface";

export default function Audios({ audios }: { audios: ItemVideos[] }) {
  return (
    <div className="grid gap-3 mt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {audios?.map((item: any) => (
        <CardAudioFileUI key={`${item.createdAt}`} isLink audio={item.audios} />
      ))}
    </div>
  );
}
