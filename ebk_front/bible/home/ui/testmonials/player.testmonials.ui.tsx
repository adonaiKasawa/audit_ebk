import { useState, useRef } from "react";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { OnProgressProps } from "react-player/base";
import { Slider } from "@heroui/slider";
// import { SwiperClass } from "swiper/react";
import clsx from "clsx";
import { Session } from "next-auth";

import { ActionDropDownTestMonialUI } from "./action.dropdown";

import { Duration } from "@/app/lib/config/func";
import { TypeContentEnum } from "@/app/lib/config/enum";
import { file_url } from "@/app/lib/request/request";
import { ItemTesmonial } from "@/app/lib/config/interface";
import { ForwardRefPlayer } from "@/app/(overview)/videos/[id]/player";

export default function TesmonialPlayerUI({
  testmonial,
  session,
  handleFindTestmonials,
}: {
  testmonial: ItemTesmonial;
  session: Session | null;
  handleFindTestmonials: () => Promise<void>;
}) {
  // const [video, setVideo] = useState<ItemVideos>();
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume] = useState<number>(0.8);
  // const [slideVol, setSlidVol] = useState<boolean>(false);
  const [muted] = useState<boolean>(false);
  // const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  // const [pip, setPip] = useState<boolean>(false);
  const [poucentageProgress, setPoucentageProgress] = useState<number>(0);
  const play: any = useRef();
  const refPlayer: any = useRef(null);
  // const [videos, setVideos] = useState<VideoPaginated>();
  const [isHover, setIsHover] = useState<boolean>(false);

  // const swiperRef = useRef<SwiperClass>();

  const handleSeek = (seconds: number) => {
    setPoucentageProgress(seconds);
    setProgress((seconds * duration) / 100);
    refPlayer?.current?.seekTo((seconds * duration) / 100);
    if (play?.current?.currentTime) {
      play.current.currentTime = (seconds * duration) / 100;
    }
  };

  // const handleToggleVolume = () => {
  //   setMuted(!muted);
  // };

  const handlerDuration = (duration: number) => {
    setDuration(duration);
  };

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
    <button
      className="relative testmonial-player-viewer cursor-pointer bg-zinc-500"
      onClick={() => {
        handlerPlay();
      }}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setTimeout(() => {
          setIsHover(false);
        }, 500);
      }}
    >
      <ForwardRefPlayer
        ref={refPlayer}
        autoPlay={true}
        className=""
        config={{
          file: {
            hlsOptions: {},
          },
        }}
        height={"auto"}
        muted={muted}
        playing={playing}
        url={`${file_url}${testmonial.link}`}
        volume={volume}
        width={"100%"}
        onDuration={handlerDuration}
        onEnded={() => {
          setPlaying(false);
        }}
        onError={() => {}}
        onPlay={() => {}}
        onProgress={handlerProgress}
        onSeek={() => {}}
      />
      <div className="absolute top-0 bottom-0 left-0 right-0">
        <div className="flex w-full absolute justify-end z-10 items-end">
          {session && (
            <ActionDropDownTestMonialUI
              contentId={testmonial.id}
              handleFindTestmonials={handleFindTestmonials}
              initFavoris={testmonial.favoris}
              session={session}
              testmonial={testmonial}
              typeContent={TypeContentEnum.testimonials}
            />
          )}
        </div>

        <div
          className={clsx("flex justify-center items-center h-full", {
            hidden: !isHover,
          })}
        >
          <button className="flex bg-background p-4 rounded-full justify-center items-center">
            {playing ? (
              <CiPause1
                className="text-foreground cursor-pointer"
                size={30}
                onClick={() => {
                  handlerPlay();
                }}
              />
            ) : (
              <CiPlay1
                className="text-foreground cursor-pointer"
                size={30}
                onClick={() => {
                  handlerPlay();
                }}
              />
            )}
          </button>
        </div>

        <div
          className="flex w-full absolute bottom-0 z-10 justify-center items-center gap-2"
          style={{ bottom: 10 }}
        >
          <Duration className={"text-xs text-white"} seconds={duration} />
          <Slider
            hideThumb
            className="max-w-md"
            classNames={{
              filler: "w-full bg-white",
            }}
            color={"foreground"}
            defaultValue={poucentageProgress}
            size="sm"
            value={poucentageProgress}
            onChange={(e) => {
              handleSeek(parseInt(e.toString()));
            }}
          />
          <Duration className={"text-xs text-white"} seconds={progress} />
        </div>
      </div>
    </button>
  );
}
