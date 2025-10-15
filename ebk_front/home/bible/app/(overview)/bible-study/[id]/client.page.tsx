"use client";

import React, { useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import { Session } from "next-auth";
import { Button } from "@heroui/button";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Slider } from "@heroui/slider";
import Link from "next/link";
import {
  CiPause1,
  CiPlay1,
  CiVolumeHigh,
  CiVolumeMute,
  CiChat1,
} from "react-icons/ci";
import {
  IoPlaySkipBackOutline,
  IoPlaySkipForwardOutline,
} from "react-icons/io5";
import { Image } from "@heroui/image";

import { file_url } from "@/app/lib/request/request";
import { TypeContentEnum } from "@/app/lib/config/enum";
import {
  ItemBibleStudy,
  ItemContentBibleStudy,
} from "@/app/lib/config/interface";
import { Duration } from "@/app/lib/config/func";
import { CommentUI } from "@/ui/comment/comment.item";
import { LikeFileUI } from "@/ui/like/like.ui";
import { ShareFormModal } from "@/ui/modal/form/share";
import { FavoriSignaleUI } from "@/ui/favoriSignale/favoris.signale";
import Loading from "@/app/loading/page";
import { CardContenteBibleStudyUI } from "@/ui/card/card.ui";

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

export default function ClienBiblePage({
  params,
  initData,
  session,
}: {
  params: { id: string };
  initData: ItemBibleStudy;
  session: Session | null;
}) {
  const { id } = params;
  const contentListe: ItemContentBibleStudy[] = initData.contentsBibleStudy;
  const [contentSelected, setContentSelected] = useState<ItemContentBibleStudy>(
    initData.contentsBibleStudy[0],
  );
  const [duration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [slideVol, setSlidVol] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  // const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  // const [pip, setPip] = useState<boolean>(false);
  const [poucentageProgress, setPoucentageProgress] = useState<number>(0);
  // const [currentAudio, setCurrentAudios] = useState<any>(
  //   contentSelected.content,
  // );
  // const [isPlay, setIsPlay] = useState<boolean>(false);
  const play: any = useRef();
  const refPlayer: any = useRef(null);
  const swiperRef = useRef<SwiperClass>();

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

  // const handlerDuration = (duration: number) => {
  //   setDuration(duration);
  // };

  // const handlerProgress = (state: OnProgressProps) => {
  //   setProgress(state.playedSeconds);
  //   setPoucentageProgress((state.playedSeconds / duration) * 100);
  // };

  const handlerPlay = () => {
    if (playing) {
      play?.current?.pause();
    } else {
      play?.current?.play();
    }
    setPlaying(!playing);
  };

  // const getPlayer = () => {
  //   const ext = getFileExtension(contentSelected.content)?.toLocaleLowerCase();

  //   if (
  //     ext === "mp4" ||
  //     ext === "mov" ||
  //     ext === "mkv" ||
  //     ext === "webm" ||
  //     ext === "avi"
  //   ) {
  //     // return (
  //     // <ForwardRefPlayer
  //     //   ref={refPlayer}
  //     // autoPlay={true}
  //     // className=''
  //     // config={{
  //     //   file: {
  //     //     hlsOptions: {
  //     //     }
  //     //   }
  //     // }}
  //     // height={"auto"}
  //     // muted={muted}
  //     // playing={playing}
  //     // url={`${file_url}${contentSelected.content}`}
  //     // volume={volume}
  //     // width={"100%"}
  //     // onDuration={handlerDuration}
  //     // onEnded={() => { setPlaying(false) }}
  //     // onError={(e: any) => {
  //     //   console.log(e);
  //     // }}
  //     // onPlay={() => { }}
  //     // onProgress={handlerProgress}
  //     // onSeek={(e: number) => console.log(e)}
  //     // />
  //     // );
  //   } else if (ext === "mp3") {
  //     return (
  //       <div>
  //         <section className="fixed bottom-0 right-0 left-0 z-50">
  //           {/* <PlayerAudios
  //             session={session}
  //             audio={currentAudio}
  //             setIsPlay={setIsPlay}
  //           /> */}
  //         </section>
  //       </div>
  //     );
  //   } else if (ext === "pdf") {
  //     return (
  //       <Link href={`${file_url}${contentSelected.content}`} target={"_blank"}>
  //         <Image
  //           isBlurred
  //           isZoomed
  //           alt={`${contentSelected.content}`}
  //           src={`${file_url}${contentSelected.image}`}
  //         />
  //       </Link>
  //     );
  //   }
  // };

  return (
    <>
      {contentSelected ? (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <div className="video-player-layout">
              <>
                <div className="video-player-viewer">
                  return{" "}
                  {/* <ForwardRefPlayer
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
                    url={`${file_url}${contentSelected.content}`}
                    volume={volume}
                    width={"100%"}
                    onDuration={handlerDuration}
                    onEnded={() => {
                      setPlaying(false);
                    }}
                    onError={(e: any) => {
                      console.log(e);
                    }}
                    onPlay={() => {}}
                    onProgress={handlerProgress}
                    onSeek={(e: number) => console.log(e)}
                  /> */}
                </div>
              </>
              <button
                className="w-full max-w-full video-player-description mt-2"
                onClick={() => {
                  if (slideVol) {
                    setSlidVol(false);
                  }
                }}
              >
                <div
                  className="w-full video-player-description-img-blur1"
                  style={{
                    background: `url(${file_url}${contentSelected.image}), lightgray 0% 0% / 154.22531366348267px 154.22531366348267px repeat, radial-gradient(151.92% 127.02% at 15.32% 21.04%, rgba(165, 239, 255, 0.20) 0%, rgba(110, 191, 244, 0.04) 77.08%, rgba(70, 144, 212, 0.00) 100%)`,
                  }}
                >
                  <div className="w-full grid grid-cols-5">
                    <div className="col-span-2 video-player-description-frame-content-1">
                      <Image
                        alt={`${contentSelected.createdAt}`}
                        className="object-cover rounded-md"
                        height={50}
                        src={`${file_url}${contentSelected.image}`}
                        width={50}
                      />
                      <div className="video-player-description-frame-title">
                        <p className="video-player-description-title">
                          {contentSelected.titre.toLowerCase()}
                        </p>
                        {/* <p className="video-player-description-auteur">{video.auteur.toLowerCase()}</p> */}
                        <Link href={`/@${initData.eglise.username_eglise}`}>
                          <p className="video-player-description-eglise">
                            {initData.eglise.nom_eglise.toUpperCase()}
                          </p>
                        </Link>
                      </div>
                    </div>
                    <div className="col-span-3 px-4 video-player-description-frame-content-2 items-center">
                      <div className="w-full h-full items-center video-player-controler-action gap-3">
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
                          <IoPlaySkipForwardOutline color={"white"} size={30} />
                        </div>
                        <div className="w-full flex justify-between items-center">
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

                          <LikeFileUI
                            fileType={TypeContentEnum.bibleStudyContent}
                            idFile={contentSelected.id}
                            likes={contentSelected.likes}
                            session={session}
                          />
                          <CiChat1
                            className="cursor-pointer"
                            color={"white"}
                            size={30}
                          />
                          <ShareFormModal
                            file={initData}
                            session={session}
                            typeContent={TypeContentEnum.bibleStudyContent}
                          />
                          <FavoriSignaleUI
                            contentId={contentSelected.id}
                            initFavoris={contentSelected.favoris}
                            session={session}
                            typeContent={TypeContentEnum.bibleStudyContent}
                          />
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
              </button>
              <div className="w-full h-full video-player-blur">
                <video
                  ref={play}
                  className="video-player-blur"
                  muted={true}
                  src={`${file_url}${contentSelected.content}`}
                />
              </div>
            </div>
            <CommentUI
              comments={contentSelected.commentaire}
              idEglise={initData.eglise.id_eglise}
              idFile={parseInt(id)}
              loadingComment={false}
              session={session}
              typeFile={TypeContentEnum.bibleStudyContent}
            />
          </div>
          <div className="col-span-4">
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
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
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
              {contentListe?.map((item) => (
                <div
                  key={`${item.createdAt}_${item.id}_videoplayer`}
                  className="mt-4"
                >
                  <CardContenteBibleStudyUI
                    contentebibleStudy={item}
                    setSelectedContent={setContentSelected}
                  />
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
