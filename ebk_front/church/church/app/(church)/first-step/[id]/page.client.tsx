"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { OnProgressProps } from "react-player/base";
import {
  IoPlaySkipForwardOutline,
  IoPlaySkipBackOutline,
} from "react-icons/io5";
import { CiPlay1, CiPause1, CiVolumeHigh, CiVolumeMute } from "react-icons/ci";
import { Slider } from "@heroui/slider";
import { ScrollShadow } from "@heroui/scroll-shadow";

import { tuto } from "../tuto";

import { file_url } from "@/app/lib/request/request";
import { CardVideoTutoUI } from "@/ui/card/card.ui";
import { Duration } from "@/app/lib/config/func";
import { ForwardRefPlayer } from "@/ui/player/player";

export default function PageFirstStepByIdVideo({
  params,
}: {
  params: { id: string };
}) {
  const [video, setVideo] = useState<{
    title: string;
    link: string;
    id: number;
  }>();
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [slideVol, setSlidVol] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [poucentageProgress, setPoucentageProgress] = useState<number>(0);
  const play: any = useRef();
  const refPlayer: any = useRef(null);
  const { id } = params;

  const router = useRouter();

  useEffect(() => {
    const find = tuto.find((item) => item.id === parseInt(id));

    if (find) {
      setVideo(find);
      play?.current?.play();
    } else {
      router.back();
    }
  }, [router, id]);

  const handleSeek = (seconds: number) => {
    setPoucentageProgress(seconds);
    setProgress((seconds * duration) / 100);
    refPlayer?.current?.seekTo((seconds * duration) / 100);
    if (play?.current?.currentTime) {
      play.current.currentTime = (seconds * duration) / 100;
    }
  };

  const handleToggleVolume = () => {
    setMuted(!muted);
  };

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
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <div className="video-player-layout">
            <div className="video-player-viewer">
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
                url={`${file_url}${video?.link}`}
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
            </div>
            <div
              className="w-full max-w-full video-player-description mt-2"
              // onClick={() => {
              //   if (slideVol) {
              //     setSlidVol(false);
              //   }
              // }}
            >
              <div
                className="w-full video-player-description-img-blur1"
                style={{
                  background: `url(${file_url}${video?.link}), lightgray 0% 0% / 154.22531366348267px 154.22531366348267px repeat, radial-gradient(151.92% 127.02% at 15.32% 21.04%, rgba(165, 239, 255, 0.20) 0%, rgba(110, 191, 244, 0.04) 77.08%, rgba(70, 144, 212, 0.00) 100%)`,
                }}
              >
                <div className="w-full grid grid-cols-5">
                  <div className="col-span-2 video-player-description-frame-content-1">
                    <div className="video-player-description-frame-title">
                      <p className="video-player-description-title">
                        {video?.title.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-3 px-4 video-player-description-frame-content-2 items-center">
                    <div className="w-full h-full justify-between items-center video-player-controler-action gap-3">
                      <div className="flex w-full items-center justify-center">
                        <IoPlaySkipBackOutline
                          className="text-foreground cursor-pointer"
                          size={30}
                        />
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
                        <IoPlaySkipForwardOutline
                          className="text-foreground cursor-pointer"
                          size={30}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        {!muted ? (
                          <div className="flex flex-col justify-center items-center">
                            {slideVol ? (
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
                                  setVolume(parseInt(e.toString()) / 100);
                                  setTimeout(() => {
                                    setSlidVol(false);
                                  }, 2000);
                                }}
                              />
                            ) : null}
                            <CiVolumeHigh
                              className="cursor-pointer"
                              color={"white"}
                              size={30}
                              onClick={() => {}}
                              onDoubleClick={handleToggleVolume}
                              onMouseOver={() => {
                                setSlidVol(true);
                              }}
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
                      </div>
                    </div>
                    <div className="w-full gap-4  video-player-controler-timer-slider">
                      <Duration seconds={duration} />
                      <Slider
                        classNames={{
                          base: "max-w-md",
                          trackWrapper: "w-full",
                          track: "border-s-foreground-200",
                          filler: "w-full bg-foreground ",
                          thumb:
                            "transition-transform shadow-small bg-foreground rounded-full w-2 h-2 block group-data-[dragging=true]:scale-50",
                        }}
                        defaultValue={poucentageProgress}
                        size="sm"
                        value={poucentageProgress}
                        onChange={(e) => {
                          handleSeek(parseInt(e.toString()));
                        }}
                      />

                      <Duration seconds={progress} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-full video-player-blur">
              <video
                ref={play}
                className="video-player-blur"
                muted={true}
                src={`${file_url}${video?.link}`}
              />
            </div>
          </div>
        </div>
        <div className="col-span-4">
          {/* <div className="w-full flex items-center gap-1">
          <button className="filter-list-video-navigation" onClick={() => swiperRef.current?.slidePrev()}><ChevronLeftIcon className="w-6" /> </button>
          <Swiper
            spaceBetween={3}
            slidesPerView={3}
            modules={[Navigation, Pagination]}
            // navigation={true}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => {
              console.log(swiper)
              swiperRef.current = swiper
            }}
            className="w-full item-center"
          >
            {
              filter.map((item, i) => (
                <SwiperSlide key={i}>
                  <Button className="filter-list-videos-btn">
                    <p className="filter-list-videos-btn-text">
                      {item}
                    </p>
                  </Button>
                </SwiperSlide>
              ))
            }
          </Swiper>
          <button className="filter-list-video-navigation" onClick={() => swiperRef.current?.slideNext()}><ChevronRightIcon className="w-6" /> </button>
        </div> */}

          <ScrollShadow hideScrollBar className="h-[600px] gap-3">
            {tuto.map((item) => (
              <div key={`${item.id}_videoplayer`} className="mt-4">
                <CardVideoTutoUI video={item} />
              </div>
            ))}
          </ScrollShadow>
        </div>
      </div>
    </>
  );
}
