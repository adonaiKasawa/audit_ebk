"use client";

import React, { useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";
import { OnProgressProps } from "react-player/base";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Slider } from "@heroui/slider";
import { ScrollShadow } from "@heroui/scroll-shadow";
import {
  IoPlaySkipForwardOutline,
  IoPlaySkipBackOutline,
} from "react-icons/io5";
import { GrFormView } from "react-icons/gr";

import {
  CiPlay1,
  CiPause1,
  CiVolumeHigh,
  CiChat1,
  // CiWarning,
  // CiStar,
  CiVolumeMute,
} from "react-icons/ci";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import { Link } from "@heroui/link";
import { Session } from "next-auth";

import Loading from "./loading";
import { ForwardRefPlayer } from "./player";

import { IFramePlayer } from ".";

import { file_url } from "@/app/lib/request/request";
import {
  findFilesNotEglisePaginatedApi,
  getFileById,
} from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";
import { Commentaires, ItemVideos, VideoPaginated } from "@/app/lib/config/interface";
import CardVideoFileUI from "@/ui/card/card.ui";
import { Duration, randomArray } from "@/app/lib/config/func";
import { CommentUI } from "@/ui/comment/comment.item";
import { LikeFileUI } from "@/ui/like/like.ui";
import { ShareFormModal } from "@/ui/modal/form/share";
import { FavoriSignaleUI } from "@/ui/favoriSignale/favoris.signale";
import { createVideoViewApi } from "@/app/lib/actions/views/views.req";

const filter = [
  "Louange",
  "Adoration",
  "Prière",
  "Culte",
  "Prophétie",
  "Témoignage",
  "Délivrances",
  "Fois",
  "Pardon",
  "Bénédiction",
];

export default function VideosPlayer({
  params,
  session,
}: {
  params: { id: string };
  session: Session | null;
}) {
  // const pathname = usePathname();
  const [video, setVideo] = useState<ItemVideos>();
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [slideVol, setSlidVol] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  // const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  // const [pip, setPip] = useState<boolean>(false);
  const [poucentageProgress, setPoucentageProgress] = useState<number>(0);
  const play: any = useRef();
  const refPlayer: any = useRef(null);
  const { id } = params;
  const [videos, setVideos] = useState<VideoPaginated>();
  const [comments, setComments] = useState<Commentaires[]>(video?.commentaire || []);
  const swiperRef = useRef<SwiperClass>();
  const [viewsCount, setViewsCount] = useState(video?.views?.length || 0);



  useEffect(() => {
    const data = getFileById(id, TypeContentEnum.videos);

    data
      .then((value: any) => {
        setVideo(value);
      })
      .catch(() => {
        notFound();
      });
    const all = findFilesNotEglisePaginatedApi(TypeContentEnum.videos);

    all.then((v: any) => {
      if (!v.hasOwnProperty("statusCode") && !v.hasOwnProperty("message")) {
        setVideos({ items: randomArray(v?.items), ...v });
      }
    });
  }, [id]);

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

    useEffect(() => {
      if (video && session?.user && video.id) {
        createVideoViewApi(video.id)
        setViewsCount((prev: number) => prev + 1);
      }
    }, [video, session]);

  return (
    <>
      {video ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="col-span-1 lg:col-span-8">
            <div className="w-full overflow-x-hidden">
              {video.interne ? (
                <>
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
                      url={`${file_url}${video.lien}`}
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
                </>
              ) : (
                <IFramePlayer iframe={video.lien} />
              )}
              <div
                className="w-full max-w-full video-player-description mt-2"
                // onClick={() => {
                //   if (slideVol) {
                //     setSlidVol(false);
                //   }
                // }}
                // onKeyDown={(e) => {
                //   if ((e.key === "Enter" || e.key === " ") && slideVol) {
                //     setSlidVol(false);
                //   }
                // }}
              >
                <div
                  className="w-full video-player-description-img-blur1"
                  style={{
                    background: `url(${file_url}${video.photo}), lightgray 0% 0% / 154.22531366348267px 154.22531366348267px repeat, radial-gradient(151.92% 127.02% at 15.32% 21.04%, rgba(165, 239, 255, 0.20) 0%, rgba(110, 191, 244, 0.04) 77.08%, rgba(70, 144, 212, 0.00) 100%)`,
                  }}
                >
                  <div className="w-full grid grid-cols-5">
                    <div className="col-span-2 video-player-description-frame-content-1">
                      <Image
                        alt={video.auteur}
                        className="object-cover rounded-md"
                        height={50}
                        src={`${file_url}${video.photo}`}
                        width={50}
                      />
                      <div className="video-player-description-frame-title">
                        <p className="video-player-description-title">
                          {video.titre.toLowerCase()}
                        </p>
                        <p className="video-player-description-auteur">
                          {video.auteur.toLowerCase()}
                        </p>
                        <Link href={`/c/@${video.eglise.username_eglise}`}>
                          <p className="video-player-description-eglise">
                            {video.eglise.nom_eglise.toUpperCase()}
                          </p>
                        </Link>
                      </div>
                    </div>
                    <div className="col-span-3 px-4 video-player-description-frame-content-2 items-center">
                      <div className="w-full h-full items-center video-player-controler-action gap-3">
                        {video.interne ? (
                          <div className="flex">
                            <IoPlaySkipBackOutline color={"white"} size={30} />
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
                              color={"white"}
                              size={30}
                            />
                          </div>
                        ) : null}
                        <div className="w-full flex justify-between items-center">
                          {video.interne ? (
                            <>
                              {" "}
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
                            </>
                          ) : null}

                          <LikeFileUI
                            fileType={TypeContentEnum.videos}
                            idFile={video.id}
                            likes={video.likes}
                            session={session}
                          />
                          <div className="flex items-center justify-center">
                            <CiChat1 size={30} />
                        <p className="text-xs"> {video?.commentaire.length} </p>
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            <p className="text-xs"> {viewsCount} </p>
                            <span className="text-xs">vues</span>
                          </div>
                          <ShareFormModal
                            file={video}
                            session={session}
                            typeContent={TypeContentEnum.videos}
                          />
                          <FavoriSignaleUI
                            contentId={video.id}
                            initFavoris={video.favoris}
                            session={session}
                            typeContent={TypeContentEnum.videos}
                          />
                        </div>
                      </div>
                      {video.interne ? (
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
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-full video-player-blur">
                {video.interne ? (
                  <video
                    ref={play}
                    className="video-player-blur"
                    muted={true}
                    preload="metadata"
                    src={`${file_url}${video.lien}`}
                  />
                ) : (
                  <IFramePlayer iframe={video.lien} />
                )}
              </div>
            </div>
            <CommentUI
              comments={video.commentaire}
              idEglise={video.eglise.id_eglise}
              idFile={parseInt(id)}
              loadingComment={false}
              session={session}
              typeFile={TypeContentEnum.videos}
              setComments={(newComments) => {
                setComments(newComments);
                setVideo((prev) =>
                  prev ? { ...prev, commentaire: newComments } : prev
              );
            }}
            />
          </div>
          <div className="col-span-1 lg:col-span-4">
            <div className="w-full flex items-center gap-1">
              <button
                className="filter-list-video-navigation"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <ChevronLeftIcon className="w-6" />{" "}
              </button>
              <Swiper
                className="w-full item-center"
                modules={[Navigation, Pagination]}
                slidesPerView={3}
                spaceBetween={3}
                onSlideChange={() => {}}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                // navigation={true}
              >
                {filter.map((item, i) => (
                  <SwiperSlide key={i}>
                    <Button className="filter-list-videos-btn">
                      <p className="filter-list-videos-btn-text">{item}</p>
                    </Button>
                  </SwiperSlide>
                ))}
              </Swiper>
              <button
                className="filter-list-video-navigation"
                onClick={() => swiperRef.current?.slideNext()}
              >
                <ChevronRightIcon className="w-6" />{" "}
              </button>
            </div>

            <ScrollShadow hideScrollBar className="h-[600px] gap-3">
              {videos?.items.map((item) => (
                <div
                  key={`${item.createdAt}_${item.id}_videoplayer`}
                  className="mt-4"
                >
                  <CardVideoFileUI video={item} />
                </div>
              ))}
            </ScrollShadow>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
