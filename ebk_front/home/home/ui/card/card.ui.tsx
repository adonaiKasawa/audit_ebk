"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Image } from "@heroui/image";
import moment from "moment";
import { Link } from "@heroui/link";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import Slider from "react-slick";
import { FaUsers } from "react-icons/fa";
import { IoDocuments, IoStar } from "react-icons/io5";

import { LikeFileUI } from "../like/like.ui";
import { CommentModalUI } from "../modal/form/comment";
import { ShareFormModal } from "../modal/form/share";
import { FavoriSignaleUI } from "../favoriSignale/favoris.signale";
import GaleryModale from "../modal/galery";

import {
  AnnoncePaginated,
  Eglise,
  ItemAnnonces,
  ItemBibleStudy,
  ItemContentBibleStudy,
  ItemPicture,
  ItemVideos,
  StatistiqueEglise,
} from "@/app/lib/config/interface";
import { ForwardRefPlayer } from "@/app/(overview)/videos/[id]/player";
import { Duration, capitalize } from "@/app/lib/config/func";
import { TypeContentEnum } from "@/app/lib/config/enum";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { findAnnoncePaginated } from "@/app/lib/actions/annonce/annonce.req";
import { findChurchStatistique } from "@/app/lib/actions/church/church";
import { file_url } from "@/app/lib/request/request";

export default function CardVideoFileUI({ video }: { video: ItemVideos }) {
  const [duration, setDuration] = useState<number>(0);
  const [imgSrc, setImageSrc] = useState<string>(`${file_url}${video.photo}`);
  const [loadImgError, setLoadImgError] = useState<boolean>(false);

  const handlerDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleImageError = () => {
    setImageSrc("./ecclessia.png");
    setLoadImgError(true);
  };

  return (
    <Link href={`/videos/${video.id}`}>
      <Card
        isBlurred
        isFooterBlurred
        className="card-videos-layout w-full"
        isHoverable={true}
        shadow="sm"
      >
        <div
          className="card-videos-img-blur-base1"
          style={{
            background: `url(${file_url}${video.photo}), lightgray 50% / cover no-repeat`,
          }}
        >
          <Image alt={`${video.titre}`} height={166} src={imgSrc} loading="lazy" width={139} />
        </div>
        {/* <div className="card-videos-group1"> */}
        {loadImgError ? (
          <div className="card-videos-img-miniature flex justify-center items-center">
            <Image
              alt={`${video.titre}`}
              loading="lazy"
              src={imgSrc}
              style={{
                width: 150,
                height: 150,
              }}
            />
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            <Image
              alt={`${video.titre}`}
              className="card-videos-img-miniature w-full"
              loading="lazy"
              src={imgSrc}
              style={{
                width: "100%",
                maxWidth: "100%",
              }}
              width={"100%"}
              onError={handleImageError}
            />
          </div>
        )}

        {video.interne && (
          <div className="card-videos-timer-layout">
            <p className="card-videos-timer">
              <Duration seconds={duration} />
            </p>
          </div>
        )}
        <CardFooter className="h-full card-videos-footer">
          <Avatar size="sm" src={`${file_url}${video.eglise.photo_eglise}`} />
          <div className="card-videos-footer-layout-text">
            <p className="card-videos-titre-text">
              {video.titre} • {video.auteur}{" "}
            </p>
            <p className="card-videos-description-text">
              {video.eglise.nom_eglise.toUpperCase()}{" "}
            </p>
            <p className="flex-1 card-videos-description-text text-foreground ">
              {video.likes.length} like • {moment(video.createdAt).fromNow()}
            </p>
          </div>
        </CardFooter>
        {video.interne && (
          <ForwardRefPlayer
            className="hidden"
            height={0}
            muted={true}
            playing={false}
            url={`${file_url}${video.lien}`}
            volume={0}
            width={0}
            onDuration={handlerDuration}
          />
        )}
      </Card>
    </Link>
  );
}

export function CardVideoTutoUI({
  video,
}: {
  video: { title: string; link: string; id: number; image?: string };
}) {
  const imgSrc = video.image || "/ecclessia.png"; // fallback si undefined

  return (
    <Card
      isBlurred
      isFooterBlurred
      isHoverable
      as={Link}
      className="card-videos-layout p-4"
      href={`/first-step/${video.id}`}
      shadow="sm"
    >
      <div
        className="card-videos-img-blur-base1"
        style={{
          background: `url(${imgSrc}), lightgray 50% / cover no-repeat`,
        }}
      >
        <Image
          alt={video.title}
          height={220} // augmenté depuis 166
          src={imgSrc}
          style={{ objectFit: "cover" }}
          width={180} // augmenté depuis 139
        />
      </div>

      <div className="card-videos-img-miniature flex justify-center items-center">
        <Image
          alt={video.title}
          height={200} // augmenté depuis 150
          src={imgSrc}
          style={{ objectFit: "cover" }}
          width={200} // augmenté depuis 150
        />
      </div>

      <CardFooter className="h-full card-videos-footer">
        <div className="card-videos-footer-layout-text">
          <p className="card-videos-titre-text">{video.title.toUpperCase()}</p>
        </div>
      </CardFooter>
    </Card>
  );
}

export function CardAudioFileUI({
  audio,
  setCurrentAudios,
  isCurrentPlay,
  isPlay,
  isLink = false,
}: {
  audio: ItemVideos;
  setCurrentAudios?: React.Dispatch<
    React.SetStateAction<ItemVideos | undefined>
  >;
  isCurrentPlay?: number;
  isPlay?: boolean;
  isLink?: boolean;
}) {
  const [duration, setDuration] = useState<number>(0);
  const handlerDuration = (duration: number) => {
    setDuration(duration);
  };

  return (
    <Link href={isLink ? `/audios/${audio.id}` : "#"}>
      <Card
        isPressable
        className={`card-audio-layout bg-default-100 cursor-pointer transition-all duration-300 ${
          isCurrentPlay === audio.id
            ? "border border-primary shadow-2xl scale-105"
            : ""
        }`}
        isBlurred={false}
        isFooterBlurred={false}
        isHoverable={true}
        shadow="sm"
        onPress={() => {
          if (isLink) {
            redirect(`/audios/${audio.id}`);
          } else {
            if (setCurrentAudios) {
              setCurrentAudios(audio);
            }
          }
        }}
      >
        <div className="flex justify-between items-center gap-4 ">
          <div className="flex w-full" style={{ width: 100 }}>
            <Image
              alt={`${audio.auteur}`}
              className="object-cover card-audio-img-min"
              loading="lazy"
              src={`${file_url}${audio.photo}`}
              style={{
                width: 100,
                height: 107,
              }}
            />
          </div>

          <div className="card-audio-description-layout mr-2">
            <p className="card-videos-titre-text ">
              {audio.titre} • {audio.auteur}
            </p>

            <div className="flex items-center justify-center gap-2">
              <Avatar
                size="sm"
                src={`${file_url}${audio?.eglise?.photo_eglise}`}
              />
              <p className="text-xs">
                {capitalize(audio?.eglise?.nom_eglise.toUpperCase())}{" "}
              </p>
            </div>
            <p className="flex-1 card-videos-description-text">
              {audio.likes?.length} like • {moment(audio.createdAt).fromNow()}
            </p>
          </div>
        </div>

        <ForwardRefPlayer
          className="hidden"
          height={0}
          muted={true}
          playing={false}
          url={`${file_url}${audio.lien}`}
          volume={0}
          width={0}
          onDuration={handlerDuration}
        />

        <div className="card-audio-timer-layout">
          <div className="card-audio-timer">
            {isPlay && isCurrentPlay === audio.id ? (
              <Image
                alt="ecclesia-annonce-ebcc1399-f216-4c48-ad25-564ba8705f03.jpeg"
                height={50}
                loading="lazy"
                src="/giphy.gif"
                width={50}
              />
            ) : (
              <Duration seconds={duration} />
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function CardBookFileUI({
  book,
}: {
  book: ItemVideos;
  session: Session | null;
}) {
  const [over, setOver] = useState<boolean>(false);

  return (
    <Card
      isBlurred
      isPressable
      as={Link}
      className="card-book-layout cursor-pointer border border-default ease-in duration-300"
      href={`/book/${book.id}`}
      shadow="sm"
      onMouseOut={() => {
        setOver(false);
      }}
      onMouseOver={() => {
        setOver(true);
      }}
    >
      {over && (
        <div
          className="card-book-img-blur ease-in duration-300"
          style={{
            background: `url(${file_url}${book.photo}), lightgray 50% / cover no-repeat`,
          }}
        />
      )}

      <div className="card-book-group1">
        <div className="card-book-frame">
          <Image
            alt={book.auteur}
            className="object-cover card-book-img-min"
            loading="lazy"
            src={`${file_url}${book.photo}`}
          />
          <div className="card-book-footer">
            <div className="card-book-frame2">
              <p className="text-left line-clamp-2 text-xs font-bold">
                {book.titre} • {book.auteur}
              </p>

              <div className="flex items-center gap-2">
                <Avatar
                  size="sm"
                  src={`${file_url}${book.eglise.photo_eglise}`}
                />
                <p className="text-left text-xs line-clamp-1 uppercase">
                  {book.eglise.nom_eglise.toUpperCase()}
                </p>
              </div>
              <p className="card-book-titre-description">
                {book.likes.length} likes • {moment(book.createdAt).fromNow()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function CardTestimonialFileUI() {
  return (
    <Card
      isBlurred
      isFooterBlurred
      className="card-testimonials-layout"
      isHoverable={true}
      shadow="sm"
    >
      <Image
        alt="Woman listing to music"
        className="object-cover card-testimonials-img"
        height={243}
        loading="lazy"
        src="https://nextui.org/images/hero-card.jpeg"
        width={310}
      />

      <CardFooter className="card-testimonials-frame">
        <div
          className="card-testimonials-img-blur"
          style={{
            background:
              "url(https://nextui.org/images/hero-card.jpeg), lightgray 50% / cover no-repeat",
          }}
        />
        <div className="card-testimonials-text-layout">
          <p className="card-testimonials-titre">
            5 jours pour traverser la Corse à pied ! (La randonnée la plus dure
            d’Europe) GR20
          </p>
          <p className="card-testimonials-decription">
            4,6 M de vues • il y a 1 mois
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

export function CardAnnonceFileUI() {
  const [annonce, setAnnoce] = useState<AnnoncePaginated>();

  const handleFindAnnonce = useCallback(async () => {
    const find = await findAnnoncePaginated();

    if (!find.hasOwnProperty("statusCode")) {
      setAnnoce(find);
    }
  }, [findAnnoncePaginated]);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 5000,
    autoplaySpeed: 5000,
    cssEase: "linear",
  };

  useEffect(() => {
    handleFindAnnonce();
  }, [handleFindAnnonce]);

  return (
    <>
      {annonce && annonce.items.length > 0 ? (
        <Card className="slider-container" style={{ height: 320, width: 700 }}>
          <Slider {...settings}>
            {annonce.items.map((item: ItemAnnonces, i: number) => (
              <Image
                key={`${i}${item.createdAt}`}
                alt={item.contente}
                className="object-cover mr-2"
                loading="lazy"
                src={`${file_url}${item.contente}`}
              />
            ))}
          </Slider>
        </Card>
      ) : (
        <div />
      )}
    </>
  );
}

export function CardPictureFileUI({
  picture,
  session,
}: {
  picture: ItemPicture;
  session: Session | null;
}) {
  return (
    <Card
      className="max-w-lg min-w-lg max-h-lg mt-4"
      style={{ minWidth: "512px", maxHeight: "677px" }}
    >
      <CardHeader className="justify-between">
        <div className="flex gap-4">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={`${file_url}${picture.eglise?.photo_eglise}`}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {picture.eglise.nom_eglise.toUpperCase()}
            </h4>
            <Link href={`/c/@${picture.eglise.username_eglise}`}>
              <h5 className="text-small tracking-tight text-default-400">
                ${picture.eglise.username_eglise}
              </h5>
            </Link>
          </div>
        </div>
        <FavoriSignaleUI
          contentId={picture.id}
          initFavoris={picture.favoris}
          session={session}
          typeContent={TypeContentEnum.images}
        />
      </CardHeader>
      <CardBody className="px-3 py-3 text-small text-default-400">
        {picture.descrition && <p> {picture.descrition} </p>}
        {picture?.photos?.length > 0 && (
          <div className="flex justify-center mt-2">
            <GaleryModale pictures={picture.photos}>
              <Image
                isZoomed
                alt="ecclesia-annonce-ebcc1399-f216-4c48-ad25-564ba8705f03.jpeg"
                className="h-auto object-cover"
                loading="lazy"
                src={`${file_url}${picture.photos[0]}`}
                style={{ maxHeight: 500 }}
                width={400}
              />
            </GaleryModale>
          </div>
        )}
      </CardBody>
      <CardFooter className="flex gap-4">
        <LikeFileUI
          fileType={TypeContentEnum.images}
          idFile={picture.id}
          likes={picture.likes || []}
          session={session}
        />
        <CommentModalUI
          comments={picture.commentaire}
          idEglise={picture.eglise.id_eglise}
          idFile={picture.id}
          loadingComment={false}
          session={session}
          typeFile={TypeContentEnum.images}
        />
        <ShareFormModal
          file={picture}
          session={session}
          typeContent={TypeContentEnum.images}
        />
      </CardFooter>
    </Card>
  );
}

export function CardEgliseUI({ eglise }: { eglise: Eglise }) {
  const [eglisesStatistique, setEglisesStatistique] =
    useState<StatistiqueEglise>();

  const handFIndStatistique = useCallback(async () => {
    const find = await findChurchStatistique(eglise.id_eglise);

    if (!find.hasOwnProperty("statusCode")) {
      setEglisesStatistique(find);
    }
  }, [eglisesStatistique]);

  useEffect(() => {
    handFIndStatistique();
  }, []);

  return (
    <Link className="mt-4 w-full" href={`/c/@${eglise?.username_eglise}`}>
      <Card className="w-full">
        <CardBody>
          <div className="grid grid-cols-3">
            <div className="flex justify-between w-full">
              <Image
                alt={`${file_url}${eglise?.photo_eglise}`}
                className="object-cover rounded"
                loading="lazy"
                src={`${file_url}${eglise?.photo_eglise}`}
                style={{
                  width: 100,
                  height: 100,
                }}
              />
            </div>
            <div className="col-span-2 flex flex-col justify-between">
              <div className="mb-2">
                <h2 className="truncate text-sm uppercase">
                  {eglise?.nom_eglise}
                </h2>
                <p className="truncate text-xs text-default-500 mt-4">
                  {eglise?.adresse_eglise}
                </p>
              </div>
              <div className="flex justify-between px-4">
                <div className="flex items-center gap-2">
                  <IoDocuments />
                  {eglisesStatistique
                    ? eglisesStatistique?.videos +
                      eglisesStatistique?.audios +
                      eglisesStatistique?.pragrammes +
                      eglisesStatistique?.communiques +
                      eglisesStatistique?.livres +
                      eglisesStatistique?.annonces +
                      eglisesStatistique?.images?.publication +
                      eglisesStatistique?.images?.photo
                    : 0}
                </div>
                <div className="flex items-center gap-2">
                  <IoStar />
                  {eglisesStatistique ? eglisesStatistique.favoris : 0}
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers />
                  {eglisesStatistique ? eglisesStatistique?.members : 0}
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

export function CardEgliseFromMapUI({
  eglise,
  handelFindInMaps,
}: {
  eglise: Eglise;
  handelFindInMaps: (localisation_eglise: string[] | null) => Promise<void>;
}) {
  return (
    <Card
      isPressable
      className="w-full mt-4"
      onClick={() => {
        handelFindInMaps(eglise.localisation_eglise);
      }}
    >
      <CardBody>
        <div className="grid grid-cols-4">
          <Image
            alt={`${file_url}${eglise?.photo_eglise}`}
            className="object-cover rounded"
            loading="lazy"
            src={`${file_url}${eglise?.photo_eglise}`}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
          />
          <div className="col-span-3 flex flex-col justify-between">
            <h2 className="truncate text-sm uppercase">{eglise.nom_eglise}</h2>
            {eglise.localisation_eglise !== null &&
              eglise.localisation_eglise.length > 0 && (
                <p>
                  {eglise.localisation_eglise[0]} |{" "}
                  {eglise.localisation_eglise[1]}
                </p>
              )}
            <p className="truncate text-xs text-default-500">
              {eglise.adresse_eglise}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function CardBibleStudyUI({
  bibleStudy,
}: {
  bibleStudy: ItemBibleStudy;
}) {
  const [totalLike, setTotalLike] = useState<number>(0);
  const [image, setImage] = useState("./ecclessia.png");

  useEffect(() => {
    bibleStudy.contentsBibleStudy.map((item: ItemContentBibleStudy) => {
      setTotalLike(totalLike + item.likes.length);
    });
    if (bibleStudy.contentsBibleStudy.length > 0) {
      if (bibleStudy.contentsBibleStudy[0].image) {
        setImage(`${file_url}${bibleStudy.contentsBibleStudy[0].image}`);
      } else {
        setImage(`./ecclessia.png`);
      }
    }
  }, []);

  return (
    <Link href={`/bible-study/${bibleStudy.id}`}>
      <Card
        isBlurred
        isFooterBlurred
        className="card-videos-layout"
        isHoverable={true}
        shadow="sm"
      >
        <div
          className="card-videos-img-blur-base1"
          style={{
            background: `url(${image}), lightgray 50% / cover no-repeat`,
          }}
        >
          <Image
            alt={`${bibleStudy.titre}`}
            height={166}
            loading="lazy"
            src={`${image}`}
            width={139}
          />
        </div>

        <Image
          alt={`${bibleStudy.titre}`}
          className="object-cover card-videos-img-miniature"
          height={243}
          loading="lazy"
          src={`${image}`}
          width={310}
        />

        <div className="card-videos-timer-layout">
          <p className="card-videos-timer">
            {bibleStudy.contentsBibleStudy.length}
          </p>
        </div>
        <CardFooter className="h-full card-videos-footer">
          <Avatar
            size="sm"
            src={`${file_url}${bibleStudy.eglise.photo_eglise}`}
          />
          <div className="card-videos-footer-layout-text">
            <p className="card-videos-titre-text">{bibleStudy.titre} </p>
            <p className="card-videos-description-text">
              {bibleStudy.eglise.nom_eglise.toUpperCase()}{" "}
            </p>
            <p className="flex-1 card-videos-description-text text-foreground ">
              {totalLike} likes • {moment(bibleStudy.createdAt).fromNow()}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export function CardForumUI({ forum }: { forum: any }) {
  return (
    <Link href={`/forum/${forum.id}`}>
      <Card
        className="max-w-26 mt-4"
        isPressable={true}
        style={{
          width: 500,
        }}
      >
        <CardHeader className="justify-between">
          <div className="flex gap-4">
            <Avatar
              isBordered
              radius="full"
              size="md"
              src={`${file_url}${forum.eglise?.photo_eglise}`}
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">
                {forum.eglise.nom_eglise.toUpperCase()}
              </h4>
              <Link href={`/c/@${forum.eglise.username_eglise}`}>
                <h5 className="text-small tracking-tight text-default-400">
                  ${forum.eglise.username_eglise}
                </h5>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-3xl">{capitalize(forum.title)}</p>
          <p className="text-gray-400">{capitalize(forum.description)}</p>
        </CardBody>
        <CardFooter className="gap-4 text-gray-500">
          <p>{forum.subjectForum.length} sujet</p>
          <p> {forum.favoris.length} favoris</p>
          <p> {forum.shared.length} partage</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
