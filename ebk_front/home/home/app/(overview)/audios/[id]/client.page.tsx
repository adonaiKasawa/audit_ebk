"use client";

// Groupe 1 : imports externes (librairies)
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Session } from "next-auth";

// Ligne vide entre groupes d'import

// Groupe 2 : imports alias internes
import {
  findFilesPaginatedApi,
  getFileById,
} from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";
import { ItemVideos, VideoPaginated } from "@/app/lib/config/interface";
import { CardAudioFileUI } from "@/ui/card/card.ui";
import { PlayerAudios } from "@/ui/player/player.audio";

export default function ClientAudiosPage({
  params,
  session,
}: {
  params: { id: string };
  session: Session | null;
  initData?: VideoPaginated | null;
  dataById?: ItemVideos | undefined;
}) {
  const { id } = params;
  const [audios, setAudios] = useState<VideoPaginated | null>(null);
  const [currentAudio, setCurrentAudios] = useState<ItemVideos | undefined>();
  const [isPlay, setIsPlay] = useState<boolean>(false);

  const handleFindFiles = useCallback(async () => {
    const data = await findFilesPaginatedApi(TypeContentEnum.audios);

    if (!data.hasOwnProperty("statusCode") && !data.hasOwnProperty("message")) {
      setAudios(data);
    }
  }, []);

  const handleFindFileById = useCallback(async () => {
    const dataById = await getFileById(id, TypeContentEnum.audios);

    if (
      !dataById.hasOwnProperty("statusCode") &&
      !dataById.hasOwnProperty("message")
    ) {
      setCurrentAudios(dataById);
    }
  }, [id]);

  useEffect(() => {
    handleFindFileById();
    handleFindFiles();
  }, [handleFindFileById, handleFindFiles]);

  return (
    <>
     <div className="flex justify-between items-center mb-4">

  </div>
      <section className="grid grid-cols-1 md:grid-cols-3  sm:grid-cols-3 xs:grid-cols-2 gap-4 pb-36">
        <Suspense fallback={"loading"}>
          {audios?.items.map((item) => (
            <CardAudioFileUI
              key={`${item.createdAt}_${item.id}`}
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
