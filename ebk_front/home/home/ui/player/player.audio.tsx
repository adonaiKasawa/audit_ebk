"use client";

import React, { useEffect, useRef, useState } from "react";
import { Slider } from "@heroui/slider";
import {
  CiPause1,
  CiPlay1,
  CiVolumeHigh,
  CiVolumeMute,
} from "react-icons/ci";
import {
  IoPlaySkipBackOutline,
  IoPlaySkipForwardOutline,
} from "react-icons/io5";
import { Image } from "@heroui/image";
import { OnProgressProps } from "react-player/base";
import { useTheme } from "next-themes";
import { Link } from "@heroui/link";
import { Session } from "next-auth";

import { LikeFileUI } from "../like/like.ui";
import { CommentModalUI } from "../modal/form/comment";
import { ShareFormModal } from "../modal/form/share";
import { FavoriSignaleUI } from "../favoriSignale/favoris.signale";

import { TypeContentEnum } from "@/app/lib/config/enum";
import { ForwardRefPlayer } from "@/app/(overview)/videos/[id]/player";
import { ItemVideos } from "@/app/lib/config/interface";
import { file_url } from "@/app/lib/request/request";
import { Duration } from "@/app/lib/config/func";
import { createAudioHistoriqueApi, createAudioViewApi } from "@/app/lib/actions/views/views.req";

export function PlayerAudios({
  audio,
  setIsPlay,
  session,
}: {
  audio: ItemVideos | undefined;
  setIsPlay: React.Dispatch<React.SetStateAction<boolean>>;
  session: Session | null;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  

  useEffect(() => {
    setMounted(true);
  }, []);

  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [slideVol, setSlidVol] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [poucentageProgress, setPoucentageProgress] = useState<number>(0);
  const [playedHalf, setPlayedHalf] = useState(false);
  const refPlayer = useRef<any>(null);
  const [viewsCount, setViewsCount] = useState(0);



  //console.log(audio?.id);
  //console.log(session);
  
  
  

  const handlerPlay = () => {
    if (!playing) {
      refPlayer.current?.getInternalPlayer()?.play?.();
      setPlaying(true);
      setIsPlay(true);
    } else {
      refPlayer.current?.getInternalPlayer()?.pause?.();
      setPlaying(false);
      setIsPlay(false);
    }
  };

  const handleSeek = (seconds: number) => {
    setPoucentageProgress(seconds);
    const seekTo = (seconds * duration) / 100;
    setProgress(seekTo);
    refPlayer?.current?.seekTo(seekTo);
  };

  const handleToggleVolume = () => setMuted(!muted);

  const handlerDuration = (d: number) => setDuration(d);



  useEffect(() => {
  if (!audio?.id || !session?.user?.sub) return;

  const key = `viewed-audio-${audio.id}-${session.user.sub}`;
  const alreadyPlayed = localStorage.getItem(key);

  if (alreadyPlayed) {
    console.log("🔒 Audio déjà streamé par ce user, blocage enregistrement");
    setPlayedHalf(true);
  } else {
    setPlayedHalf(false);
  }
}, [audio?.id, session?.user?.sub]);

useEffect(() => {
  setPlayedHalf(false);
}, [audio?.id]);

useEffect(() => {
  if (audio?.views) {
    setViewsCount(audio.views.length);
  } else {
    setViewsCount(0);
  }
}, [audio]);
 

  const handleProgress = (playedSeconds: number) => {
  console.log("🟢 compteur lancé");

  const viewedKey = `viewed-audio-${audio?.id}-${session?.user?.sub}`;
  const alreadyViewed = localStorage.getItem(viewedKey);

  if (alreadyViewed) {
    console.log("⚠️ Historique déjà enregistré, on ne fait rien");
    return;
  }

  if (!playedHalf && playedSeconds >= 5) {
    console.log("✅ Condition remplie, on enregistre");
    setPlayedHalf(true);

    if (session?.user && audio?.id) {
      createAudioViewApi(audio.id)
        .then(() => {
          console.log("✅ Vue audio enregistrée");
          localStorage.setItem(viewedKey, "true");
          setViewsCount((prev: number) => prev + 1);
          if (audio.views) {
          audio.views.push({ userId: session.user.sub });
        } else {
          audio.views = [{ userId: session.user.sub }];
        }
      
        })
        .catch((err) => console.error("❌ Erreur vue :", err));
      createAudioHistoriqueApi(audio.id)
        .then((response) =>
          console.log("✅ Historique enregistré : ", response)
        )
        .catch((err) => console.error("❌ Erreur historique :", err));
    } else {
      console.warn("⚠️ session ou audio.id manquant !");
    }
  } else {
    console.log("⏳ Attente ou déjà traité...");
  }
};

  const handlerProgress = (state: OnProgressProps) => {
    setProgress(state.playedSeconds);
    setPoucentageProgress((state.playedSeconds / duration) * 100 || 0);
    handleProgress(state.playedSeconds)
  };

  if (!audio || !mounted) return null;

  return (
    <div
      className="video-player-description"
      onClick={() => {
        if (slideVol) setSlidVol(false);
      }}
    >
      <ForwardRefPlayer
        ref={refPlayer}
        autoPlay={true}
        className="hidden"
        config={{
          file: {
            hlsOptions: {},
          },
        }}
        height={0}
        muted={muted}
        playing={playing}
        url={`${file_url}${audio.lien}`}
        volume={volume}
        width={0}
        onDuration={handlerDuration}
        onEnded={() => setPlaying(false)}
        onError={() => {}}
        onPlay={() => {}}
        onProgress={handlerProgress}
        onSeek={() => {}}
      />
      <div
        className={
          theme === "light"
            ? "bg-default-200 video-player-description-img-blur-light px-6"
            : "w-full video-player-description-img-blur1 px-6"
        }
        style={{
          background: `url(${file_url}${audio.photo}), lightgray 0% 0% / 154px 154px repeat, radial-gradient(151.92% 127.02% at 15.32% 21.04%, rgba(165, 239, 255, 0.20) 0%, rgba(110, 191, 244, 0.04) 77.08%, rgba(70, 144, 212, 0.00) 100%)`,
        }}
      >
        <div className="h-full w-full grid grid-cols-5">
          <div className="flex gap-4 items-center">
            <Image
              alt={audio.auteur}
              className="object-cover w-14 h-12 rounded-md bg-blue-500"
              src={`${file_url}${audio.photo}`}
            />
            <div className="video-player-description-frame-title">
              <p className="video-player-description-title">
                {audio.titre?.toLowerCase()}
              </p>
              <p className="video-player-description-auteur">
                {audio.auteur?.toLowerCase()}
              </p>
              <Link href={`/c/@${audio.eglise?.username_eglise}`}>
                <p className="video-player-description-eglise">
                  {audio.eglise?.nom_eglise.toUpperCase()}
                </p>
              </Link>
            </div>
          </div>

          <div className="col-span-3 flex flex-col justify-center items-center gap-4">
            <div className="flex gap-4">
              <IoPlaySkipBackOutline className="cursor-pointer" size={30} />
              {playing ? (
                <CiPause1
                  className="cursor-pointer"
                  size={30}
                  onClick={handlerPlay}
                />
              ) : (
                <CiPlay1
                  className="cursor-pointer"
                  size={30}
                  onClick={handlerPlay}
                />
              )}
              <IoPlaySkipForwardOutline className="cursor-pointer" size={30} />
            </div>
            <div className="flex w-full justify-center gap-4">
              <Duration seconds={duration} />
              <Slider
                classNames={{
                  base: "max-w-md",
                  trackWrapper: "w-full",
                  track: "border-s-white-200",
                  filler: "w-full bg-white",
                  thumb:
                    "transition-transform shadow-small bg-white rounded-full w-2 h-2 block group-data-[dragging=true]:scale-50",
                }}
                defaultValue={0}
                size="sm"
                value={isNaN(poucentageProgress) ? 0 : poucentageProgress}
                onChange={(e) => {
                  const val = parseInt(e.toString());
                  if (!isNaN(val)) handleSeek(val);
                }}
              />
              <Duration seconds={progress} />
            </div>
          </div>

          <div className="w-full flex justify-between items-center">
            {!muted ? (
              <div className="flex flex-col justify-center items-center">
                {slideVol && (
                  <Slider
                    aria-label="volume"
                    className="absolute h-24 top-[-100px]"
                    classNames={{
                      thumb:
                        "transition-transform shadow-small bg-foreground rounded-full w-2 h-2 block group-data-[dragging=true]:scale-50",
                    }}
                    defaultValue={volume * 100}
                    orientation="vertical"
                    size="sm"
                    value={volume * 100}
                    onChange={(e) => {
                      const vol = parseInt(e.toString()) / 100;
                      setVolume(isNaN(vol) ? 0.8 : vol);
                      setTimeout(() => setSlidVol(false), 2000);
                    }}
                  />
                )}
                <CiVolumeHigh
                  className="cursor-pointer"
                  size={30}
                  onClick={() => {}}
                  onDoubleClick={handleToggleVolume}
                  onMouseOver={() => setSlidVol(true)}
                />
              </div>
            ) : (
              <CiVolumeMute
                className="cursor-pointer"
                color={"white"}
                size={30}
                onClick={handleToggleVolume}
              />
            )}

            <LikeFileUI
              fileType={TypeContentEnum.audios}
              idFile={audio.id}
              likes={audio.likes}
              session={session}
            />
            <CommentModalUI
              comments={audio.commentaire}
              idEglise={audio.eglise?.id_eglise}
              idFile={audio.id}
              loadingComment={false}
              session={session}
              typeFile={TypeContentEnum.audios}
            />
             <div className="flex items-center justify-center gap-1">
                <p className="text-xs"> {viewsCount} </p>
                <span className="text-xs">streams</span>
              </div>
            <ShareFormModal
              file={audio}
              session={session}
              typeContent={TypeContentEnum.audios}
            />
            <FavoriSignaleUI
              contentId={audio.id}
              initFavoris={audio.favoris}
              session={session}
              typeContent={TypeContentEnum.audios}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
