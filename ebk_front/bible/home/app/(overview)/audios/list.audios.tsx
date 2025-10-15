"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Session } from "next-auth";

import { ItemVideos, VideoPaginated } from "@/app/lib/config/interface";
import { CardAudioFileUI } from "@/ui/card/card.ui";
import { PlayerAudios } from "@/ui/player/player.audio";
import { CommentItemSkeleton } from "@/ui/skeleton/card.video.file.skleton";

export default function ListeAudios({
  initData,
  session,
}: {
  session: Session | null;
  initData: VideoPaginated;
}) {
  const [audio] = useState<VideoPaginated | null>(initData);
  const [currentAudio, setCurrentAudios] = useState<ItemVideos | undefined>(
    initData.items[0],
  );
  const [isPlay, setIsPlay] = useState<boolean>(false);

  // const handleFindFiles = async () => {
  //   const data = await findFilesPaginatedApi(TypeContentEnum.audios);

  //   if (!data.hasOwnProperty("statusCode") && !data.hasOwnProperty("message")) {
  //     setAudios(data);
  //     setCurrentAudios(data.items[0]);
  //   }
  // };

  useEffect(() => {
    let isMount = true;

    if (isMount) {
      // handleFindFiles()
    }

    return () => {
      isMount = false;
    };
  }, []);

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-1 gap-4">
        <Suspense fallback={<CommentItemSkeleton />}>
          {audio?.items.map((item) => (
            <CardAudioFileUI
              key={`${item.createdAt}`}
              audio={item}
              isCurrentPlay={currentAudio?.id}
              isPlay={isPlay}
              setCurrentAudios={setCurrentAudios}
            />
          ))}
        </Suspense>
      </section>

      <section className="fixed bottom-0 right-0 left-0 z-50">
        <PlayerAudios
          audio={currentAudio}
          session={session}
          setIsPlay={setIsPlay}
        /> 
      </section>
    </>
  );
}

export function AudiosSuggestion({ audios }: { audios: VideoPaginated }) {
  const [audio, setAudios] = useState<ItemVideos[] | null>(null);

  // const handleFindSuggestionFiles = async () => {
  //   const e:any = [];
  //   for (let i = 0; i < audios.items.length; i++) {
  //     if (i < 6) {
  //       e.push(audios.items[i]);
  //     }
  //   }
  //   setAudios(e);
  // };

  useEffect(() => {
    const handleFindSuggestionFiles = async () => {
      const e: any = [];

      for (let i = 0; i < audios.items.length; i++) {
        if (i < 6) {
          e.push(audios.items[i]);
        }
      }
      setAudios(e);
    };

    handleFindSuggestionFiles();
  }, [audios]);

  return (
    <>
      <section className="grid grid-cols-1 justify-center md:grid-cols-3  sm:grid-cols-3 xs:grid-cols-2 gap-4 mt-4">
        <Suspense fallback={"loading"}>
          {audio &&
            audio?.map((item, i) => (
              <CardAudioFileUI
                key={i}
                audio={item}
                isCurrentPlay={0}
                isLink={true}
                isPlay={false}
              />
            ))}
        </Suspense>
      </section>
    </>
  );
}
