"use client";

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Image } from "@heroui/image";
import moment from "moment";
import { Link } from "@heroui/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { Session } from "next-auth";
import Slider from "react-slick";
import { FaUsers } from "react-icons/fa";
import { IoDocuments, IoStar } from "react-icons/io5";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { BellIcon } from "@radix-ui/react-icons";
import { BsPatchQuestionFill } from "react-icons/bs";
import { CiEdit, CiTrash, CiLink } from "react-icons/ci";
import { FiChevronRight } from "react-icons/fi";
import { Tooltip } from "@heroui/tooltip";

import { LikeFileUI } from "../like/like.ui";
import { CommentModalUI } from "../modal/form/comment";
import { ShareFormModal } from "../modal/form/share";
import { FavoriSignaleUI } from "../favoriSignale/favoris.signale";
import GaleryModale from "../modal/galery";
import Alert from "../modal/alert";
import DialogAction from "../modal/dialog";
import { UpdateProgrammeFormModal } from "../modal/form/programme";
import {
  quizDifficulty,
  CreatAddQuestionFormModal,
} from "../modal/form/quizBiblique";

import {
  AnnoncePaginated,
  BiblePlanByUserStarted,
  Communiques,
  CommuniquesPaginated,
  Eglise,
  ItemAnnonces,
  ItemBiblePlanLecture,
  ItemBibleStudy,
  ItemContentBibleStudy,
  ItemPicture,
  ItemPrayerWall,
  ItemQuizBiblique,
  ItemSondageQst,
  ItemVideos,
  Programme,
  SousProgramme,
  StatistiqueEglise,
} from "@/app/lib/config/interface";
// import { ForwardRefPlayer } from "@/app/(overview)/videos/[id]/player";
import { Duration, capitalize } from "@/app/lib/config/func";
import { TypeContentEnum } from "@/app/lib/config/enum";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { findAnnoncePaginated } from "@/app/lib/actions/annonce/annonce.req";
import { findChurchStatistique } from "@/app/lib/actions/church/church";
import { file_url } from "@/app/lib/request/request";
import {
  updateCommuniqueApi,
  deleteCommuniqueApi,
  resendNotificationApi,
} from "@/app/lib/actions/communique/com.req";
import { updatedPrayerWallByIdApi } from "@/app/lib/actions/prayer-wall/prayer.req";
import {
  updateSousProgrammeApi,
  deleteSousProgrammeApi,
} from "@/app/lib/actions/programme/prog.res";

export default function CardVideoFileUI({ video }: { video: ItemVideos }) {
  // setDuration
  const [duration] = useState<number>(0);
  const [imgSrc, setImageSrc] = useState<string>(`${file_url}${video.photo}`);
  const [loadImgError, setLoadImgError] = useState<boolean>(false);

  // const handlerDuration = (duration: number) => {
  //   setDuration(duration);
  // };

  const handleImageError = () => {
    setImageSrc("./ecclessia.png");
    setLoadImgError(true);
  };

  return (
    <Link href={`https://ecclesiabook.org/videos/${video.id}`}>
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
          <Image alt={`${video.titre}`} height={166} src={imgSrc} width={139} />
        </div>
        {/* <div className="card-videos-group1"> */}
        {loadImgError ? (
          <div className="card-videos-img-miniature flex justify-center items-center">
            <Image
              alt={`${video.titre}`}
              src={imgSrc}
              style={{
                width: 150,
                height: 150,
              }}
              className="w-full"
            />
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            <Image
              alt={`${video.titre}`}
              className="card-videos-img-miniature w-full"
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
        {/* {video.interne && (
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
        )} */}
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
      as={Link}
      className="card-videos-layout p-4"
      href={`/first-step/${video.id}`}
      isHoverable
      shadow="sm"
    >
      <div
        className="card-videos-img-blur-base1"
        style={{
          background: `url(${imgSrc}), lightgray 50% / cover no-repeat`,
        }}
      >
        <Image
          src={imgSrc}
          alt={video.title}
          height={220} // augmenté depuis 166
          width={180} // augmenté depuis 139
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="card-videos-img-miniature flex justify-center items-center">
        <Image
          src={imgSrc}
          alt={video.title}
          width={200} // augmenté depuis 150
          height={200} // augmenté depuis 150
          style={{ objectFit: "cover" }}
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
  // const [duration, setDuration] = useState<number>(0);
  // const handlerDuration = (duration: number) => {
  //   setDuration(duration);
  // };

  return (
    <Link href={`https://ecclesiabook.org/audios/${audio.id}`}>
      <Card
        isPressable
        className="card-audio-layout bg-default-100 cursor-pointer"
        isBlurred={false}
        isFooterBlurred={false}
        isHoverable={true}
        shadow="sm"
        onPress={() => {
          if (isLink) {
            redirect(`https://ecclesiabook.org/audios/${audio.id}`);
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
                {capitalize(audio.eglise.nom_eglise.toUpperCase())}{" "}
              </p>
            </div>
            <p className="flex-1 card-videos-description-text">
              {audio.likes.length} like • {moment(audio.createdAt).fromNow()}
            </p>
          </div>
        </div>

        {/* <ForwardRefPlayer
          className="hidden"
          height={0}
          muted={true}
          playing={false}
          url={`${file_url}${audio.lien}`}
          volume={0}
          width={0}
          onDuration={handlerDuration}
        /> */}

        <div className="card-audio-timer-layout">
          <p className="card-audio-timer">
            {isPlay && isCurrentPlay === audio.id ? (
              <Image
                alt="ecclesia-annonce-ebcc1399-f216-4c48-ad25-564ba8705f03.jpeg"
                height={50}
                src="/giphy.gif"
                width={50}
              />
            ) : (
              // duration
              <Duration seconds={0} />
            )}
          </p>
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
      href={`https://ecclesiabook.org/book/${book.id}`}
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

export interface TestimonialItem {
  id: number;
  createdAt: string;
  titre: string;
  description: string;
  image: string; // lien image ou vignette vidéo
  views?: string;
}

type Props = {
  testimonial: TestimonialItem;
  session?: Session | null;
};

export function CardTestimonialFileUI({ testimonial, session }: Props) {
  console.log(testimonial);
  
  return (
    <Link href={`https://ecclesiabook.org/testimonials`}> 
    <Card
      isBlurred
      isFooterBlurred
      className="card-testimonials-layout"
      isHoverable
      shadow="sm"
    >
      <Image
        alt={testimonial.titre}
        className="object-cover card-testimonials-img"
        height={243}
        width={310}
        src={testimonial.image || "https://nextui.org/images/hero-card.jpeg"}
      />

      <CardFooter className="card-testimonials-frame">
        <div
          className="card-testimonials-img-blur"
          style={{
            background: `url(${testimonial.image || "https://nextui.org/images/hero-card.jpeg"}), lightgray 50% / cover no-repeat`,
          }}
        />
        <div className="card-testimonials-text-layout">
          <p className="card-testimonials-titre">{testimonial.titre}</p>
          <p className="card-testimonials-decription">
            {testimonial.views || "0 vues"} • {new Date(testimonial.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardFooter>
    </Card>
    </Link>
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

export function CardCommunique({
  communiques,
  stCommuniques,
  setStCommuniques,
}: {
  communiques: Communiques;
  stCommuniques: CommuniquesPaginated | undefined;
  setStCommuniques: Dispatch<SetStateAction<CommuniquesPaginated | undefined>>;
}) {
  const [onUpdate, setOnUpdate] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [communiqueText, setCommuniqueText] = useState<string>(
    communiques.communique.trim(),
  );
  const [newCom, setNewcCom] = useState<string>(communiques.communique.trim());
  const [submit, setSubmit] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [ondelete, setOnDelete] = useState<boolean>(false);
  const [acceptechange, setAcceptechange] = useState<boolean>(false);
  const [pendingToResend, setPendingToResend] = useState<boolean>(false);
  const [notificationDialog, setNotificationDialog] = useState<boolean>(false);

  const handleOnUpdate = () => {
    if (onUpdate) {
      if (submit) {
        setSubmit(false);
        setNewcCom(communiqueText);
      } else {
        if (communiqueText !== newCom) {
          setAcceptechange(true);
        } else {
          setOnUpdate(!onUpdate);
        }
      }
    } else {
      setOnUpdate(!onUpdate);
    }
  };

  const handleAcceptechange = async () => {
    setCommuniqueText(newCom);
    setOnUpdate(!onUpdate);
  };

  const handleUpdate = async () => {
    if (communiqueText) {
      setPending(true);
      const create = await updateCommuniqueApi(
        { communique: communiqueText.trim() },
        communiques.id,
      );

      setPending(false);
      if (
        create.hasOwnProperty("statusCode") &&
        create.hasOwnProperty("error")
      ) {
        setAlertMsg(create.message);
        setOpenAlert(true);
      } else if (create.hasOwnProperty("id")) {
        if (create.id === communiques.id) {
          setSubmit(true);
          setNewcCom(communiqueText);
          setOnUpdate(!onUpdate);
        } else {
          setAlertTitle("Erreur");
          setAlertMsg(
            "Une erreur se produite lors de la création de commuiqués.",
          );
          setOpenAlert(true);
        }
      } else {
        setAlertMsg(
          "Une erreur se produite lors de la création de commuiqués.",
        );
        setOpenAlert(true);
      }
    } else {
      setAlertMsg("Le champt est obligatoire");
      setOpenAlert(true);
    }
  };

  const handleDelete = async () => {
    setPending(true);
    const dl = await deleteCommuniqueApi(communiques.id);

    setPending(false);
    if (dl) {
      if (stCommuniques) {
        const e = stCommuniques.items.filter(
          (item) => item.id !== communiques.id,
        );

        setStCommuniques({ ...stCommuniques, items: e });
      }
    } else {
      setAlertTitle("Erreur");
      setAlertMsg("Une erreur se produite lors de la création de commuiqués.");
      setOpenAlert(true);
    }
  };

  const handleResend = async () => {
    setPendingToResend(true);
    const resend = await resendNotificationApi(communiques.id);

    setPendingToResend(false);

    if (resend) {
      setAlertTitle("Notification envoyer");
      setAlertMsg(
        "Les fidele ont reçu une notification concernat ce communiqués.",
      );
      setOpenAlert(true);
    } else {
      setAlertTitle("Erreur Notification");
      setAlertMsg("Une erreur se produite lors de l'envoie de notification.");
      setOpenAlert(true);
    }
  };

  return (
    <Card className="max-w-lg min-w-lg">
      {onUpdate && <CardHeader>Modifier le communiqués</CardHeader>}
      <CardBody style={{ height: "18rem" }}>
        {onUpdate ? (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              <textarea
                className="bg-default-100 rounded-lg p-2 mt-4 w-full h-full"
                placeholder="Déscription"
                rows={4}
                value={communiqueText}
                onChange={(e) => {
                  setCommuniqueText(e.target.value);
                }}
              />
              {communiqueText !== newCom && (
                <Button
                  className="bg-primary text-white mt-4"
                  isLoading={pending}
                  type="submit"
                >
                  Modifier
                </Button>
              )}
            </form>
          </>
        ) : (
          <>{newCom}</>
        )}
      </CardBody>
      <CardFooter className="gap-4">
        <Button
          isIconOnly
          color="success"
          size="sm"
          variant="bordered"
          onClick={handleOnUpdate}
        >
          <CiEdit size={24} />
        </Button>
        <Button
          isIconOnly
          color="warning"
          isLoading={pendingToResend}
          size="sm"
          variant="bordered"
          onClick={() => {
            setNotificationDialog(true);
          }}
        >
          <BellIcon className="w-6" />
        </Button>
        <Button
          isIconOnly
          color="danger"
          size="sm"
          variant="bordered"
          onClick={() => {
            setOnDelete(true);
          }}
        >
          <CiTrash size={24} />
        </Button>
      </CardFooter>
      <Alert
        alertBody={<p>{alertMsg}</p>}
        alertTitle={alertTitle}
        isOpen={openAlert}
        onClose={() => {
          setOpenAlert(false);
        }}
        onOpen={() => {
          setOpenAlert(true);
        }}
      />
      <DialogAction
        action={handleDelete}
        dialogBody={<p>Etes-vous sure de vouloire suppimer le communiqués?</p>}
        dialogTitle={"Suppression de communiqués"}
        isOpen={ondelete}
        onClose={() => {
          setOnDelete(false);
        }}
        onOpen={() => {
          setOnDelete(true);
        }}
      />
      <DialogAction
        action={handleAcceptechange}
        dialogBody={<p>Toutes les modification seront supprimer</p>}
        dialogTitle={"Ingorer le modification"}
        isOpen={acceptechange}
        onClose={() => {
          setAcceptechange(false), setOnUpdate(!onUpdate);
        }}
        onOpen={() => {
          setAcceptechange(true);
        }}
      />
      <DialogAction
        action={handleResend}
        dialogBody={
          <p>
            Fonctionnalite temporairement inclut dans le frais d&apos;abonnement
            basic.
          </p>
        }
        dialogTitle={"Notification"}
        isOpen={notificationDialog}
        onClose={() => {
          setNotificationDialog(false);
        }}
        onOpen={() => {
          setNotificationDialog(true);
        }}
      />
    </Card>
  );
}

export function CardProgramme({
  sousProgramme,
  initProgramme,
  setInitPrograame,
}: {
  sousProgramme: SousProgramme;
  initProgramme: Programme[] | undefined;
  setInitPrograame: Dispatch<SetStateAction<Programme[] | undefined>>;
  selected: string | number;
}) {
  const [libelle, setLibelle] = useState<string>(sousProgramme.libelle);
  const [debut, setDebut] = useState<string>(sousProgramme.debut.toString());
  const [fin, setFin] = useState<string>(sousProgramme.fin.toString());

  const [onUpdate, setOnUpdate] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [ondelete, setOnDelete] = useState<boolean>(false);
  const [pendingToResend] = useState<boolean>(false);
  // notificationDialog
  const [, setNotificationDialog] = useState<boolean>(false);

  const handleOnUpdate = async () => {
    setPending(true);
    const update = await updateSousProgrammeApi(
      { libelle, debut, fin },
      sousProgramme.id,
    );

    setPending(false);

    if (update.hasOwnProperty("statusCode") && update.hasOwnProperty("error")) {
      setAlertTitle("Erreur");
      setAlertMsg(
        "Une erreur se produite lors de la modification du programme.",
      );
      setOpenAlert(true);
    } else {
      if (initProgramme) {
        const findprogramme = initProgramme.find((item) =>
          item.sousProgramme.find((e) => e.id === sousProgramme.id),
        );
        const newProgramme = initProgramme.filter(
          (item) => item.id !== findprogramme?.id,
        );

        if (newProgramme && findprogramme) {
          const newSousProgramme = findprogramme.sousProgramme.filter(
            (i) => i.id !== sousProgramme.id,
          );

          newSousProgramme.push(update);
          findprogramme.sousProgramme = newSousProgramme;
          newProgramme.push(findprogramme);
          setInitPrograame(newProgramme);
        }
      }
      setAlertTitle("Modification réussi");
      setAlertMsg("La modification se bien passer.");
      setOpenAlert(true);
      setOnUpdate(false);
    }
  };

  const handleDelete = async () => {
    const deleted = await deleteSousProgrammeApi(sousProgramme.id);

    if (
      deleted.hasOwnProperty("statusCode") &&
      deleted.hasOwnProperty("error")
    ) {
      setAlertTitle("Erreur");
      setAlertMsg(
        "Une erreur se produite lors de la modification du programme.",
      );
      setOpenAlert(true);
    } else {
      if (initProgramme) {
        const findprogramme = initProgramme.find((item) =>
          item.sousProgramme.find((e) => e.id === sousProgramme.id),
        );
        const newProgramme = initProgramme.filter(
          (item) => item.id !== findprogramme?.id,
        );

        if (newProgramme && findprogramme) {
          const newSousProgramme = findprogramme.sousProgramme.filter(
            (i) => i.id !== sousProgramme.id,
          );

          findprogramme.sousProgramme = newSousProgramme;
          newProgramme.push(findprogramme);
          setInitPrograame(newProgramme);
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader>{sousProgramme.libelle}</CardHeader>
      <CardBody>
        <p> Dé: {moment(sousProgramme?.debut).format("LT")}</p>
        <p> À: {moment(sousProgramme?.fin).format("LT")}</p>
      </CardBody>
      <CardFooter className="gap-4">
        <Button
          isIconOnly
          color="success"
          size="sm"
          variant="bordered"
          onPaste={() => {
            setOnUpdate(true);
          }}
        >
          <CiEdit size={24} />
        </Button>
        <Button
          isIconOnly
          color="warning"
          isLoading={pendingToResend}
          size="sm"
          variant="bordered"
          onPaste={() => {
            setNotificationDialog(true);
          }}
        >
          <BellIcon className="w-6" />
        </Button>
        <Button
          isIconOnly
          color="danger"
          size="sm"
          variant="bordered"
          onPaste={() => {
            setOnDelete(true);
          }}
        >
          <CiTrash size={24} />
        </Button>
      </CardFooter>
      <Alert
        alertBody={<p>{alertMsg}</p>}
        alertTitle={alertTitle}
        isOpen={openAlert}
        onClose={() => {
          setOpenAlert(false);
        }}
        onOpen={() => {
          setOpenAlert(true);
        }}
      />
      <UpdateProgrammeFormModal
        debut={debut}
        fin={fin}
        libelle={libelle}
        openModal={onUpdate}
        pending={pending}
        setDebut={setDebut}
        setFin={setFin}
        setLibelle={setLibelle}
        setOpenModal={setOnUpdate}
        submit={handleOnUpdate}
      />
      <DialogAction
        action={handleDelete}
        dialogBody={<p>Etes-vous sure de vouloire suppimer le programme?</p>}
        dialogTitle={"Suppression du programme"}
        isOpen={ondelete}
        onClose={() => {
          setOnDelete(false);
        }}
        onOpen={() => {
          setOnDelete(true);
        }}
      />
    </Card>
  );
}

export function CardPlanLectureStartedUI({
  startedPlan,
}: {
  startedPlan: BiblePlanByUserStarted;
}) {
  return (
    <Card className="flex justify-between rounded-lg shadow-md mb-1">
      <CardBody className="flex flex-row justify-between items-center gap-4">
        <div className="flex">
          <Image
            alt={`${startedPlan.plans.title}`}
            className="w-16 h-16 object-cover rounded-md mr-4"
            height={120}
            src={`${startedPlan.plans.picture ? file_url + startedPlan.plans.picture : `./ecclessia.png`}`}
            style={{
              marginRight: 20,
            }}
            width={120}
          />
          <div>
            <h2 className="text-lg font-bold">{startedPlan.plans.title}</h2>
            {/* <Progress
              color="success"
              value={100 / startedPlan.plans.number_days}
              className="mt-2"
              style={{ width: 200 }}
            /> */}
            <p className="text-sm text-gray-600 mt-1">
              {startedPlan.plans.number_days} Jour
            </p>
          </div>
        </div>
        <Button
          as={Link}
          endContent={<FiChevronRight />}
          href={`/church/plan-lecture/${startedPlan.plans.id}`}
        >
          Continuer votre lecture
        </Button>
      </CardBody>
    </Card>
  );
}

export function CardPlanLectureUI({ plan }: { plan: ItemBiblePlanLecture }) {
  // const [totalLike, setTotalLike] = useState<number>(0);
  const [imgSrc, setImageSrc] = useState<string>(`${file_url}${plan.picture}`);
  const [loadImgError, setLoadImgError] = useState<boolean>(false);

  const handleImageError = () => {
    setImageSrc("./ecclessia.png");
    setLoadImgError(true);
  };

  return (
    <Link href={`/church/plan-lecture/description/${plan.id}`}>
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
            background: `url(${
              plan.picture ? file_url + plan.picture : `./ecclessia.png`
            }), lightgray 50% / cover no-repeat`,
          }}
        >
          <Image
            alt={`${plan.title}`}
            height={166}
            src={`${
              plan.picture ? file_url + plan.picture : `./ecclessia.png`
            }`}
            width={139}
          />
        </div>

        {loadImgError ? (
          <div className="card-videos-img-miniature flex justify-center items-center">
            <Image
              alt={`${plan.picture}`}
              src={imgSrc}
              style={{
                width: 150,
                height: 150,
              }}
            />
          </div>
        ) : (
          <Image
            alt={`${plan.picture}`}
            className="card-videos-img-miniature"
            src={imgSrc}
            onError={handleImageError}
          />
        )}

        <div className="card-videos-timer-layout">
          <p className="card-videos-timer">{plan.number_days} jours</p>
        </div>
        <CardFooter className="h-full card-videos-footer">
          <Avatar size="sm" src={`${file_url}${plan.eglise.photo_eglise}`} />
          <div className="card-videos-footer-layout-text">
            <p className="card-videos-titre-text">{plan.title} </p>
            <p className="card-videos-description-text">
              {plan.eglise.nom_eglise.toUpperCase()}{" "}
            </p>
            <p className="flex-1 card-videos-description-text text-foreground ">
              {moment(plan.createdAt).fromNow()}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
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
    <Link href={`/church/bible-study/${bibleStudy.id}`}>
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
            src={`${image}`}
            width={139}
          />
        </div>

        <Image
          alt={`${bibleStudy.titre}`}
          className="object-cover card-videos-img-miniature"
          height={243}
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

export function CardContenteBibleStudyUI({
  contentebibleStudy,
}: {
  setSelectedContent: React.Dispatch<
    React.SetStateAction<ItemContentBibleStudy>
  >;
  contentebibleStudy: ItemContentBibleStudy;
}) {
  // setDuration
  const [duration] = useState<number>(0);

  // const handlerDuration = (duration: number) => {
  //   setDuration(duration);
  // };

  return (
    <Link href={`/church/bible-study/${contentebibleStudy.id}`}>
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
            background: `url(${file_url}${contentebibleStudy.image}), lightgray 50% / cover no-repeat`,
          }}
        >
          <Image
            alt={`${contentebibleStudy.titre}`}
            height={166}
            src={`${file_url}${contentebibleStudy.image}`}
            width={139}
          />
        </div>

        <Image
          alt={`${contentebibleStudy.titre}`}
          className="object-cover card-videos-img-miniature"
          height={243}
          src={`${file_url}${contentebibleStudy.image}`}
          width={310}
        />

        {
          <div className="card-videos-timer-layout">
            <p className="card-videos-timer">
              <Duration seconds={duration} />
            </p>
          </div>
        }
        <CardFooter className="h-full card-videos-footer">
          <Avatar size="sm" src={`${file_url}${contentebibleStudy.image}`} />
          <div className="card-videos-footer-layout-text">
            <p className="card-videos-titre-text">
              {contentebibleStudy.titre}{" "}
            </p>
            <p className="flex-1 card-videos-description-text text-foreground ">
              {contentebibleStudy.likes.length} likes •{" "}
              {moment(contentebibleStudy.createdAt).fromNow()}
            </p>
          </div>
        </CardFooter>
        {/* <ForwardRefPlayer
          className="hidden"
          height={0}
          muted={true}
          playing={false}
          url={`${file_url}${contentebibleStudy.content}`}
          volume={0}
          width={0}
          onDuration={handlerDuration}
        /> */}
      </Card>
    </Link>
  );
}

// export function CardEgliseUI({ eglise }: { eglise: Eglise }) {
//   return <a href={`@${eglise.username_eglise}`}>
//     <Card isPressable>
//       <CardHeader className="flex gap-2">
//         <Avatar src={`${file_url}${eglise.photo_eglise}`} />
//         <p className="text-foreground">{eglise.nom_eglise.toUpperCase()}</p>
//       </CardHeader>
//     </Card>
//   </a>
// }

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
  handelFindInMaps: (
    id_eglise: number,
    localisation_eglise: string[] | null,
  ) => Promise<void>;
}) {
  return (
    <Card
      isPressable
      className="w-full mt-4"
      onClick={() => {
        handelFindInMaps(eglise.id_eglise, eglise.localisation_eglise);
      }}
    >
      <CardBody>
        <div className="grid grid-cols-4">
          <Image
            alt={`${file_url}${eglise?.photo_eglise}`}
            className="object-cover rounded"
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

export function CardForumUI({ forum }: { forum: any }) {
  return (
    <Link href={`/church/forum/${forum.id}`}>
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

export function CardQuizBiblique({
  handleRefreshQuizBiblique,
  quiz,
  isCreator,
}: {
  handleRefreshQuizBiblique: () => Promise<void>;
  quiz: ItemQuizBiblique;
  session: Session | null;
  isCreator: boolean;
}) {
  const router = useRouter();

  return (
    <Card className="cursor-pointer">
      <CardHeader
        className="flex flex-col gap-2"
        onClick={() => {
          router.push(
            isCreator
              ? `/church/bible-quiz/detail/${quiz.id}`
              : `/bible-quiz/${quiz.id}`,
          );
        }}
      >
        <p className="text-xl font-bold text-center">{quiz.title}</p>
        <p className="text-default-500">
          Difficulté:{" "}
          {quizDifficulty.find((e) => e.key === quiz.difficulty)?.value || ""}
        </p>
        <p className="text-default-500">{quiz.questionnairesCount} question</p>
      </CardHeader>
      <CardBody
        onClick={() => {
          router.push(
            isCreator
              ? `/church/bible-quiz/detail/${quiz.id}`
              : `/bible-quiz/${quiz.id}`,
          );
        }}
      >
        <p className="text-default-500 text-left line-clamp-3">
          {quiz.description}
        </p>
      </CardBody>
      <CardFooter className="flex flex-col justify-start gap-4">
        <div className="flex justify-between w-full">
          <p className="text-default-500">Temps:{quiz.timer}</p>
          <p className="text-default-500">{moment(quiz.createdAt).fromNow()}</p>
        </div>
        {isCreator && (
          <div className="flex justify-between w-full gap-4">
            <CreatAddQuestionFormModal
              handleRefreshQuizBiblique={handleRefreshQuizBiblique}
              quizId={quiz.id}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export function CardSondageQstUI({
  sondage,
}: {
  sondage: ItemSondageQst;
  session: Session | null;
}) {
  const pathName = usePathname();

  return (
    <Card
      isPressable
      as={Link}
      href={
        pathName === "/sondage"
          ? `/sondage/${sondage.id}`
          : `/church/sondage/${sondage.id}`
      }
    >
      <CardBody>
        <p>{sondage.title}</p>
        <p className="text-default-500">
          Visibilité: {sondage.public ? "public" : "privé"}
        </p>
        <div className="flex gap-2 items-center">
          {" "}
          <BsPatchQuestionFill />: {sondage.totalQuestion} question
        </div>
        <div className="flex gap-2 items-center">
          {" "}
          <FaUsers />: {sondage.totalAnswered} participant
        </div>
      </CardBody>
    </Card>
  );
}

export function CardPrayerWallUI({
  gbColor,
  prayer,
  session,
  handleFindPrayerWall,
}: {
  gbColor: string;
  prayer: ItemPrayerWall;
  session: Session | null;
  handleFindPrayerWall: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<boolean>(false);
  const [prayerEditing, setPrayerEditing] = useState<string>(prayer.prayer);

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");

  const handelEdited = (id: number) => {
    if (id === session?.user.sub) {
      setEditing(!editing);
    }
  };

  const handelUpdatePrayerWall = async () => {
    if (prayerEditing) {
      setLoading(true);
      const create = await updatedPrayerWallByIdApi(prayer.id, {
        prayer: prayerEditing,
      });

      setLoading(false);
      if (
        !create.hasOwnProperty("statusCode") &&
        !create.hasOwnProperty("message")
      ) {
        handleFindPrayerWall();
        setPrayerEditing(prayerEditing);
        setEditing(false);
      } else {
        setAlertMsg("Une erreur se produite lors de la création du prière.");
        setOpenAlert(true);
      }
    } else {
      setAlertMsg("Le champt est obligatoire");
      setOpenAlert(true);
    }
  };

  return (
    <Card
      className="rounded-none text-black"
      isPressable={prayer.user.id === session?.user.sub && !editing}
      shadow="lg"
      style={{
        backgroundColor: gbColor !== "" ? gbColor : "#FADFA1",
        height: 300,
      }}
      onClick={() => {
        handelEdited(prayer.user.id);
      }}
    >
      {/* <CardHeader className="justify-between"> */}
      {/* <div className="flex gap-4">
        <Avatar
          radius="full"
          size="sm"
          src={`${file_url}${prayer.user.profil}`}
        />
        <div className="flex flex-col gap-1 prayers-start justify-center">
          <p className="text-xs text-white">
            {prayer.user.nom} {prayer.user.prenom}
          </p>
          <Link
            href={session?.user.sub == prayer.user.id ? `/account` : `/f/${prayer?.user?.username}`}
            className="text-white text-xs"
          >
            @{prayer?.user?.username}
          </Link>
        </div>
      </div>
      <FavoriSignaleUI
        contentId={prayer.id}
        typeContent={TypeContentEnum.prayer}
        initFavoris={prayer.favoris}
        session={session}
      /> */}
      {/* </CardHeader> */}
      <CardBody
        className={
          (!editing && "flex justify-center items-center") || undefined
        }
      >
        {editing ? (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handelUpdatePrayerWall();
            }}
          >
            <p>Modifier la prière</p>
            <Textarea
              fullWidth
              label={"Modifier la prière"}
              value={prayerEditing}
              variant="bordered"
              onChange={(e) => {
                setPrayerEditing(e.target.value);
              }}
            />
            <Button
              className="text-white"
              color="primary"
              isLoading={loading}
              type="submit"
            >
              Modifier
            </Button>
            <Button
              isDisabled={loading}
              onClick={() => {
                setEditing(false);
              }}
            >
              Annuler
            </Button>
          </form>
        ) : (
          <Tooltip
            color="default"
            content={
              <div className="w-[300px]" style={{ width: 300 }}>
                <p>{prayer.prayer}</p>
              </div>
            }
            delay={3000}
          >
            <p className="line-clamp-3 handlee-regular">{prayer.prayer}</p>
          </Tooltip>
        )}
      </CardBody>
      <CardFooter className="flex justify-between">
        <div className="flex gap-4">
          <LikeFileUI
            fileType={TypeContentEnum.images}
            idFile={prayer.id}
            likes={prayer.likes || []}
            session={session}
          />
          <CommentModalUI
            comments={prayer.commentaire}
            idEglise={0}
            idFile={prayer.id}
            loadingComment={false}
            session={session}
            typeFile={TypeContentEnum.images}
          />
          <ShareFormModal
            file={prayer}
            session={session}
            typeContent={TypeContentEnum.images}
          />
        </div>
        <h5 className="text-small tracking-tight text-black text-right">
          {moment(prayer.createdAt).fromNow()}
        </h5>
      </CardFooter>
      <Alert
        alertBody={<p>{alertMsg}</p>}
        alertTitle={"Message"}
        isOpen={openAlert}
        onClose={() => {
          setOpenAlert(false);
        }}
        onOpen={() => {
          setOpenAlert(true);
        }}
      />
    </Card>
  );
}

export function CardEventUI({ event }: { event: any }) {
  const router = useRouter();

  return (
    <div key={event.id} className="gap-4 border border-default p-4 rounded-lg">
      <div className="flex h-full justify-between flex-col">
        <p className="text-ellipsis line-clamp-1">{event.name}</p>
        <>
          {event.adressMap ? (
            <Link
              href={event.adressMap}
              target="_blank"
              title={event.adressMap}
            >
              Lien adresse Map{" "}
              <CiLink
                className="text-default-500 text-ellipsis text-sm"
                size={30}
              />
            </Link>
          ) : (
            <p
              className="text-default-500 text-ellipsis text-sm"
              style={{ fontSize: 11 }}
            >
              Veuillez consulter la description pour l&apos;adresse détaillée.
            </p>
          )}
        </>

        {event.description && (
          <p
            className="text-default-500 text-ellipsis text-sm line-clamp-2"
            style={{ fontSize: 12 }}
            title={event.description}
          >
            {event.description}
          </p>
        )}

        <div className="mt-2 flex items-center gap-2">
          <Image
            className="rounded-full"
            height={20}
            src={`${file_url}${event.eglise.photo_eglise}`}
            width={20}
          />
          <Link
            className="text-sm text-default-500"
            href={`@${event.eglise.username_eglise}`}
          >
            {event.eglise.nom_eglise}
          </Link>
        </div>
        <div className="flex w-full justify-between items-center mt-2">
          <p className="text-default-500 text-sm">{event.totalPerson} prs</p>
          <p className="text-default-500 text-sm">
            {event.isFree && "Gratuit"}
          </p>
          {!event.isFree && (
            <p className="text-default-500 text-sm">{event.price + "USD"}</p>
          )}
          {!event.isFree && !event.isSubscribe && (
            <Button
              className="border-small mr-0.5 font-medium shadow-small bg-foreground text-background"
              radius="full"
              size="sm"
              variant="bordered"
              onClick={() => {
                router.push(`/event/${event.id}`);
              }}
            >
              Réserver
            </Button>
          )}
        </div>
        {event.isSubscribe && (
          <p>
            réserver le {moment(`${event.subscribe.createdAt}`).calendar()}{" "}
          </p>
        )}
      </div>
    </div>
  );
}
