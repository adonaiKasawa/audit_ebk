"use client";

import React, { useState } from "react";
import { Session } from "next-auth";

import { CardAudioFileUI } from "@/ui/card/card.ui";
import { PlayerAudios } from "@/ui/player/player.audio";
import { ItemVideos } from "@/app/lib/config/interface";

export default function HistoriqueAudiosClient({
  session,
  historiques,
}: {
  session: Session | null;
  historiques: ItemVideos[];
}) {
  const [currentAudio, setCurrentAudio] = useState<ItemVideos | undefined>(
    historiques[0],
  );
  const [isPlay, setIsPlay] = useState<boolean>(false);

  console.log("audio historique", historiques);
  

  // Si la liste est vide, afficher message
  if (!historiques || historiques.length === 0) {
    return (
      <section className="p-6 text-center text-gray-600">
        <p>Aucun historique d&apos;audio disponible pour le moment.</p>
      </section>
    );
  }

  // Sinon afficher la liste et le player
  return (
    <>
      <section className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {historiques.map((audio, index) => (
            <CardAudioFileUI
              key={`${audio.id}-${index}`}
              audio={audio}
              isCurrentPlay={currentAudio?.id}
              isPlay={isPlay}
              setCurrentAudios={setCurrentAudio}
            />
          ))}
        </div>
      </section>

      {currentAudio && (
        <section className="fixed bottom-0 left-0 right-0 z-50">
          <PlayerAudios
            audio={currentAudio}
            session={session}
            setIsPlay={setIsPlay}
          />
        </section>
      )}
    </>
  );
}
