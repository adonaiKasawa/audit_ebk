"use client";

import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { usePathname, useRouter } from "next/navigation";
import { CiLink } from "react-icons/ci";
import { Session } from "next-auth";
import { IoDocuments, IoStar } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { BsPatchQuestionFill } from "react-icons/bs";
import Link from "next/link";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardFooter, CardBody, CardHeader } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { Tooltip } from "@heroui/tooltip";
import { Image } from "@heroui/image";
import { FiChevronRight } from "react-icons/fi";

import {
  CreatAddQuestionFormModal,
  quizDifficulty,
} from "../modal/form/quizBiblique";
import { LikeFileUI } from "../like/like.ui";
import Alert from "../modal/alert";
import { CommentModalUI } from "../modal/form/comment";
import { ShareFormModal } from "../modal/form/share";

import { updatedPrayerWallByIdApi } from "@/app/lib/actions/prayer-wall/prayer.req";
import { file_url } from "@/app/lib/request/request";
import {
  BiblePlanByUserStarted,
  Eglise,
  ItemBiblePlanLecture,
  ItemBibleStudy,
  ItemContentBibleStudy,
  ItemPrayerWall,
  ItemQuizBiblique,
  ItemSondageQst,
  StatistiqueEglise,
} from "@/app/lib/config/interface";
import { findChurchStatistique } from "@/app/lib/actions/church/church";
import { Duration, capitalize } from "@/app/lib/config/func";
import { TypeContentEnum } from "@/app/lib/config/enum";

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
  const [duration] = useState<number>(0);

  // const handlerDuration = (duration: number) => {
  //   setDuration(duration);
  // };

  return (
    <Link href={`/bible-study/${contentebibleStudy.id}`}>
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
    <Link className="mt-4 w-full" href={`/@${eglise?.username_eglise}`}>
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
    <Card
      as={Link}
      className="w-ful max-w-26 responsive-card mt-4"
      href={`/forum/${forum.id}`}
      isPressable={true}
      // style={{
      //   width: 500,
      // }}
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
            <div>
              <h5 className="text-small tracking-tight text-default-400">
                ${forum.eglise.username_eglise}
              </h5>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <p className="text-3xl">{capitalize(forum.title)}</p>
        <p className="text-gray-400">{capitalize(forum.description)}</p>
      </CardBody>
      <CardFooter className="gap-4 text-gray-500">
        <p> {forum.favoris.length} favoris</p>
        <p> {forum.shared.length} partage</p>
      </CardFooter>
    </Card>
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
  // const user = session?.user;
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

  const MAX_LENGTH = 300;

  const handelEdited = (id: number) => {
    if (id === session?.user.sub) {
      setEditing(!editing);
    }
  };

  const handelUpdatePrayerWall = async () => {
    if (!prayerEditing) {
      setAlertMsg("Le champ est obligatoire.");
      setOpenAlert(true);
      return;
    }

    if (prayerEditing.length > MAX_LENGTH) {
      setAlertMsg(`La prière ne doit pas dépasser ${MAX_LENGTH} caractères.`);
      setOpenAlert(true);
      return;
    }

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
      setAlertMsg("Une erreur s'est produite lors de la modification de la prière.");
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
              maxLength={MAX_LENGTH}
              onChange={(e) => {
                setPrayerEditing(e.target.value);
              }}
            />
            <p className="text-sm text-gray-500 text-right">
              {prayerEditing.length}/{MAX_LENGTH}
            </p>
            <Button
              className="text-white"
              color="primary"
              isLoading={loading}
              type="submit"
              isDisabled={!prayerEditing || prayerEditing.length > MAX_LENGTH}
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

export function CardPlanLectureStartedUI({
  startedPlan,
}: {
  startedPlan: BiblePlanByUserStarted;
}) {
  return (
    <Card className="flex justify-between rounded-lg shadow-md mb-1">
      <CardBody className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="md:flex">
          <Image
            alt={`${startedPlan.plans.title}`}
            className="w-full h-auto md:w-16 md:h-16 object-cover rounded-md mr-4 img-responsive"
            //height={120}
            src={`${startedPlan.plans.picture ? file_url + startedPlan.plans.picture : `./ecclessia.png`}`}
            style={{
              marginRight: 20,
            }}
            //width={120}
          />
          <div>
            <h2 className="text-[12px] md:text-lg font-bold">{startedPlan.plans.title}</h2>
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
          href={`plan-lecture/${startedPlan.plans.id}`}
        >
          Continuer votre lecture
        </Button>
      </CardBody>
    </Card>
  );
}

export function CardPlanLectureUI({ plan }: { plan: ItemBiblePlanLecture }) {
  const [imgSrc, setImageSrc] = useState<string>(`${file_url}${plan.picture}`);
  const [loadImgError, setLoadImgError] = useState<boolean>(false);

  const handleImageError = () => {
    setImageSrc("/ecclessia.png");
    setLoadImgError(true);
  };

  return (
    <Link href={`/plan-lecture/description/${plan.id}`}>
      <Card
        isBlurred
        isFooterBlurred
        isHoverable
        shadow="sm"
        className="w-full flex flex-col sm:flex-row gap-4 p-4 hover:shadow-md transition-shadow"
      >
        
          <Image
            alt={plan.title}
            src={imgSrc}
            width={150}
            height={150}
            className="w-full h-auto object-cover rounded-md"
            onError={handleImageError}
          />
     

        <div className="flex flex-col justify-between flex-grow">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              {plan.number_days} jours
            </p>
            <h2 className="text-lg font-semibold line-clamp-2">{plan.title}</h2>
            <p className="text-sm text-gray-600 uppercase">
              {plan.eglise.nom_eglise}
            </p>
          </div>
          <CardFooter className="mt-4 flex items-center gap-2 p-0">
            <Avatar size="sm" src={`${file_url}${plan.eglise.photo_eglise}`} />
            <p className="text-xs text-gray-400">
              {moment(plan.createdAt).fromNow()}
            </p>
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
}