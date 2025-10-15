// import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { CiPause1, CiPlay1 } from "react-icons/ci";
// import { SwiperClass } from "swiper/react";
import { Session } from "next-auth";
import { OnProgressProps } from "react-player/base";
import { Slider } from "@heroui/slider";

// import { ForwardRefPlayer } from "../player/player";
// FIX: Update the import path or create the missing file/component
// Example: If the correct path is "../player/ForwardRefPlayer", use:
import { ForwardRefPlayer } from "../player/player";
import { CommentModalUI } from "../modal/form/comment";
import { FavoriSignaleUI } from "../favoriSignale/favoris.signale";
import { LikeFileUI } from "../like/like.ui";

import { ActionDropDownTestMonialUI } from "./action.dropdown";

import { TypeContentEnum } from "@/app/lib/config/enum";
import { Duration } from "@/app/lib/config/func";
import { file_url } from "@/app/lib/request/request";
import { ItemTesmonial } from "@/app/lib/config/interface";

// ... tes imports restent identiques

export default function TesmonialPlayerUI({
  testmonial,
  session,
  handleFindTestmonials,
}: {
  testmonial: ItemTesmonial;
  session?: Session | null;
  handleFindTestmonials: () => Promise<void>;
}) {
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume] = useState<number>(0.8);
  const [muted] = useState<boolean>(false);
  const [poucentageProgress, setPoucentageProgress] = useState<number>(0);
  const play: any = useRef();
  const refPlayer: any = useRef(null);
  const [isHover, setIsHover] = useState<boolean>(false);

  const handleSeek = (seconds: number) => {
    setPoucentageProgress(seconds);
    setProgress((seconds * duration) / 100);
    refPlayer?.current?.seekTo((seconds * duration) / 100);
    if (play?.current?.currentTime) {
      play.current.currentTime = (seconds * duration) / 100;
    }
  };

  const handlerDuration = (duration: number) => setDuration(duration);

  const handlerProgress = (state: OnProgressProps) => {
    setProgress(state.playedSeconds);
    setPoucentageProgress((state.playedSeconds / duration) * 100);
  };

  const handlerPlay = () => {
    if (playing) {
      play?.current?.pause();
    } else {
      play?.current?.play();
    }
    setPlaying(!playing);
  };

  return (
    <>
      <div
        className="relative testmonial-player-viewer bg-zinc-500 cursor-pointer"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setTimeout(() => setIsHover(false), 500)}
      >
        <ForwardRefPlayer
          ref={refPlayer}
          autoPlay={true}
          config={{ file: { hlsOptions: {} } }}
          height={"auto"}
          muted={muted}
          playing={playing}
          url={`${file_url}${testmonial.link}`}
          volume={volume}
          width={"100%"}
          onDuration={handlerDuration}
          onEnded={() => setPlaying(false)}
          onProgress={handlerProgress}
        />

        {/* Menu déroulant */}
        <div className="absolute top-0 right-0 z-10">
          {session && (
            <ActionDropDownTestMonialUI
              contentId={testmonial.id}
              handleFindTestmonials={handleFindTestmonials}
              initFavoris={testmonial.favoris}
              session={session ?? null}
              testmonial={testmonial}
              typeContent={TypeContentEnum.testimonials}
            />
          )}
        </div>

        {/* Play/Pause overlay */}
        {isHover && (
          <div className="absolute inset-0 flex justify-center items-center">
            <button
              className="bg-background p-4 rounded-full flex justify-center items-center"
              onClick={handlerPlay}
            >
              {playing ? (
                <CiPause1 className="text-foreground" size={30} />
              ) : (
                <CiPlay1 className="text-foreground" size={30} />
              )}
            </button>
          </div>
        )}

        {/* Barre de progression */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-2 z-10 px-2">
          <Duration className="text-xs text-white" seconds={duration} />
          <Slider
            hideThumb
            className="max-w-md flex-1"
            classNames={{ filler: "w-full bg-white" }}
            color="foreground"
            value={poucentageProgress}
            onChange={(e) => handleSeek(parseInt(e.toString()))}
          />
          <Duration className="text-xs text-white" seconds={progress} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-center z-10 p-2 gap-2">
          {/* Like */}
          <LikeFileUI
            fileType={TypeContentEnum.testimonials}
            idFile={testmonial.id}
            likes={testmonial.likesCount}
            session={session ?? null}
            onRefresh={handleFindTestmonials}
          />

          {/* Commentaires via modal */}
          {session && (
            <div className="mt-1">
              <CommentModalUI
                comments={testmonial.commentaire || []}
                idEglise={0} // ou l’ID si nécessaire
                idFile={testmonial.id}
                loadingComment={false}
                session={session}
                typeFile={TypeContentEnum.testimonials}
              />
            </div>
          )}

          {/* Favoris / Signaler */}
          <FavoriSignaleUI
            contentId={testmonial.id}
            initFavoris={testmonial.favoris}
            session={session ?? null}
            typeContent={TypeContentEnum.testimonials}
          />
        </div>
      </div>
    </>
  );
}
