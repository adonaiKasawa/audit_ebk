"use client";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import Img from "next/image";
import { Session } from "next-auth";
import { CiStar } from "react-icons/ci";
import { MdCameraswitch } from "react-icons/md";
import { Image } from "@heroui/image";
import { Tab, Tabs } from "@heroui/tabs";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { MicrophoneIcon } from "@heroicons/react/24/outline";

import {
  AnnoncePaginated,
  Eglise,
  Favoris,
  PicturePaginated,
  StatistiqueEglise,
  VideoPaginated,
} from "@/app/lib/config/interface";
import { PrivilegesEnum, TypeContentEnum } from "@/app/lib/config/enum";
import CardVideoFileUI, { CardAudioFileUI, CardBookFileUI, CardTestimonialFileUI } from "@/ui/card/card.ui";
import GaleryModale from "@/ui/modal/galery";
import { file_url } from "@/app/lib/request/request";
import {
  createFavorisApi,
  deleteFavorisApi,
  findFavorisByContetTypeAndUserApi,
} from "@/app/lib/actions/favoris/favoris.req";
import Alert from "@/ui/modal/alert";
import { CropperCouverturImageUI } from "@/ui/cropperFile/image/couverture";
import DialogAction from "@/ui/modal/dialog";
import { updateChurcheApi } from "@/app/lib/actions/church/church";
import NavbarSite from "@/ui/site/navbar";
import MainSite from "@/ui/site/main";
import { SearchIcon } from "@/ui/icons";
import test from "node:test";
import TesmonialPlayerUI from "@/ui/testmonials/player.testmonials.ui";

export default function ChurchProfil({
  session,
  initData,
}: {
  params: { id: string };
  session: Session | null;
  initData: {
    church: Eglise;
    videos: VideoPaginated;
    audios: VideoPaginated;
    books: VideoPaginated;
    pictures: PicturePaginated;
    annonces: AnnoncePaginated;
    statistiques: StatistiqueEglise;
    testimonials: VideoPaginated
  };
}) {
  const [selected, setSelected] = useState<string | number>("videos");
  const [church] = useState<Eglise>(initData.church);
  const [churchVideos] = useState<VideoPaginated>(initData.videos);
  const [churchAudios] = useState<VideoPaginated>(initData.audios);
  const [churchPicture] = useState<PicturePaginated>(initData.pictures);
  const [churchBook] = useState<VideoPaginated>(initData.books);
  const [churchAnnonce] = useState<AnnoncePaginated>(initData.annonces);
  const [churchTestimonials] = useState<VideoPaginated>(initData.testimonials);
  const [userFavorised, setUserFavorised] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [favoris, setFavoris] = useState<Favoris>();
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");

  const [photoCouvertureLink, setPhotoCouvertureLink] = useState<string>("");
  // const [photoCouverture, setPhotoCouverture] = useState<any>();
  const [photoProfileLink, setPhotoProfileLink] = useState<string>("");
  const [photoProfile, setPhotoProfile] = useState<any>();
  const [openDialogAction, setOpenDialogoAction] = useState<boolean>(false);
  

  const handelFindFavorisByContetTypeAndUser = useCallback(async () => {
    const find: any[] = await findFavorisByContetTypeAndUserApi(
      TypeContentEnum.eglises,
    );

    if (!find.hasOwnProperty("StatusCode") && !find.hasOwnProperty("message")) {
      const check = find.find(
        (item: any) => item.eglise.id_eglise === church.id_eglise,
      );

      setFavoris(check);
      if (check) {
        setUserFavorised(true);
      }
    }
  }, [church.id_eglise]);

  const handelFavorisContent = async () => {
    setLoading(true);
    const req = userFavorised
      ? await deleteFavorisApi(favoris ? favoris.id : 0)
      : await createFavorisApi(TypeContentEnum.eglises, church.id_eglise);

    setLoading(false);
    if (!req.hasOwnProperty("statusCode") && !req.hasOwnProperty("message")) {
      setUserFavorised(!userFavorised);
    } else {
      setOpenAlert(true);
      setAlertMsg(req.message);
      setAlertTitle("Erreur");
    }
  };

  const getContente = () => {
    switch (selected) {
      case "videos":
        return churchVideos?.items.map((item) => (
          <CardVideoFileUI key={`${item.id}videos`} video={item} />
        ));
      case "audios":
        return churchAudios?.items.map((item) => (
          <CardAudioFileUI key={`${item.id}audio`} audio={item} isLink={true} />
        ));
      case "books":
        return churchBook?.items.map((item) => (
          <CardBookFileUI key={`${item.id}audio`} book={item} session={session}  />
        ));
      case "images":
        return churchPicture?.items.map((item) => (
          <>
            <GaleryModale key={`${item.id}picture`} pictures={item.photos}>
              <Image
                isZoomed
                alt={`${item.photos[0]}`}
                className="object-cover bg-primary"
                src={`${file_url}${item.photos[0]}`}
                style={{ height: 200 }}
                width={"100%"}
              />
            </GaleryModale>
          </>
        ));

         case "temoignages":
          return churchTestimonials?.items.map((item) => (
              <CardTestimonialFileUI
                  key={item.id}
                  testimonial={{
                    id: item.id, // number
                    titre: item.titre,
                    description: (item as any).description ?? "", // créer si absent
                    image: item.photo ?? "", // mapper 'photo' en 'image'
                    createdAt:
                      item.createdAt instanceof Date
                        ? item.createdAt.toISOString()
                        : String(item.createdAt),
                    views: "views" in item ? String(item.views) : "0",
                  }}
                  session={session}
                />
              ));
      case "annonces": {
        return churchPicture?.items.map((item) => (
          <>
            <GaleryModale key={`${item.id}annonces`} pictures={item.photos}>
              <Image
                isZoomed
                alt={`${item.photos[0]}`}
                className="object-cover bg-primary"
                src={`${file_url}${item.photos[0]}`}
                style={{ height: 200 }}
                width={"100%"}
              />
            </GaleryModale>
          </>
        ));
      }
      default:
        churchVideos?.items.map((item) => (
          <CardVideoFileUI key={`${item.id}default`} video={item} />
        ));
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profil" | "couverture",
  ) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileUrl = reader.result ? reader.result.toString() : "";

        if (type === "profil") {
          setPhotoProfileLink(fileUrl);
          setPhotoProfile(file);
          setOpenDialogoAction(true);
        } else {
          setPhotoCouvertureLink(fileUrl);
          // setPhotoCouverture(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;

    if (target) {
      target.src = "./ecclesia-photo-courverture.png"; // Chargement de l'image de secours en cas d'erreur de chargement
    }
  };

  const handleUpatePhotoProfil = async () => {
    if (
      session &&
      session.user.privilege_user === PrivilegesEnum.ADMIN_EGLISE
    ) {
      if (photoProfile) {
        const formData = new FormData();

        formData.append("photo", photoProfile);
        setLoading(true);
        const update = await updateChurcheApi(
          formData,
          session.user.eglise.id_eglise,
        );

        setLoading(false);
        if (
          !update.hasOwnProperty("StatusCode") &&
          !update.hasOwnProperty("message")
        ) {
          setOpenAlert(true);
          setAlertTitle("Modification réussi!");
          setAlertMsg(
            "La modification de la photo de profil de l'église a été enregistrée avec succès.",
          );
          document.location = "/church";
        } else {
          setOpenAlert(true);
          setAlertTitle("Erreur dans la modification!");
          if (typeof update.message === "object") {
            let message = "";

            update.message.map((item: string) => (message += `${item} \n`));
            setAlertMsg(message);
          } else {
            setAlertMsg(update.message);
          }
        }
      } else {
        setOpenAlert(true);
        setAlertTitle("Erreur dans la modification!");
        setAlertMsg("Veuillez choisir une image.");
      }
    } else {
      setOpenAlert(true);
      setAlertTitle("Erreur dans la modification!");
      setAlertMsg("Vous n'avez pas la permission d'effectuer cette action.");
    }
  };

  useEffect(() => {
    handelFindFavorisByContetTypeAndUser();
  }, [handelFindFavorisByContetTypeAndUser]);

  return (
    <div>
      {church ? (
        <>
          <Tabs aria-label="Options">
            <Tab
              key="nous_connaitre"
              style={{ padding: 5 }}
              title="Nous connaitre d'avantage"
            >
              <div className="flex items-center bg-background ">
                <NavbarSite eglise={initData.church} />
              </div>
              <div className="flex items-center bg-background ">
                <MainSite eglise={initData.church} session={session} />
              </div>
            </Tab>
            <Tab key="biblio" title="Bibliothèque">
              <>
                <Card className="w-full">
                  <div className="w-full">
                    <Img
                      alt="couverture_file"
                      className="object-cover w-full"
                      height={250}
                      src={`${
                        photoCouvertureLink
                          ? photoCouvertureLink
                          : file_url + church.couverture_eglise
                      }`}
                      style={{
                        height: 250,
                        width: "100%",
                      }}
                      width={2000}
                      onError={handleError}
                    />
                    {session &&
                      session.user.privilege_user ===
                        PrivilegesEnum.ADMIN_EGLISE &&
                      church.id_eglise === session.user.eglise.id_eglise && (
                        <label
                          className="absolute right-3 top-4 cursor-pointer "
                          htmlFor="couvertureFile"
                        >
                          <MdCameraswitch className="text-white" size={30} />
                          <input
                            hidden
                            id="couvertureFile"
                            name="couvertureFile"
                            type="file"
                            onChange={(e) => handleFileChange(e, "couverture")}
                          />
                        </label>
                      )}
                    {photoCouvertureLink && (
                      <CropperCouverturImageUI
                        croppedImageUrl={photoCouvertureLink}
                        session={session}
                        setCroppedImageUrl={setPhotoCouvertureLink}
                      />
                    )}
                  </div>
                </Card>
                <div className="mt-4">
                  <div className="flex gap-2">
                    <div className="relative">
                      <Avatar
                        className="rounded-md bg-background w-28 h-28 "
                        src={`${
                          photoProfileLink
                            ? photoProfileLink
                            : file_url + church.photo_eglise
                        }`}
                      />
                      {session &&
                        session.user.privilege_user ===
                          PrivilegesEnum.ADMIN_EGLISE &&
                        church.id_eglise === session.user.eglise.id_eglise && (
                          <label
                            className="absolute right-3 bottom-0 cursor-pointer"
                            htmlFor="photoProfil"
                          >
                            <MdCameraswitch size={30} />
                            <input
                              hidden
                              id="photoProfil"
                              name="photoProfil"
                              type="file"
                              onChange={(e) => handleFileChange(e, "profil")}
                            />
                          </label>
                        )}
                    </div>
                    <div className="max-w-sm md:max-w-md lg:max-w-lg couverture-profil-description w-full">
                      <p className="text-4xl w-full couverture-profil-name-church">
                        {church?.nom_eglise}
                      </p>
                      <p className="text-xs">
                        {initData.statistiques.members} membres
                      </p>
                      <div className="flex justify-between items-center gap-3">
                        <p className="text-xs">
                          {initData.statistiques.likes} likes .{" "}
                          {initData.statistiques.comments} commentaires
                        </p>
                        {/* {session &&
                          session.user.privilege_user ===
                          PrivilegesEnum.ADMIN_EGLISE &&
                          church.id_eglise ===
                          session.user.eglise.id_eglise && (
                            <UpdateChurchFormModal
                              church={church}
                              session={session}
                            />
                          )} */}
                      </div>
                      {session?.user &&
                        session.user.eglise.id_eglise !== church.id_eglise && (
                          <div className="flex gap-4">
                            <Button
                              isIconOnly
                              onClick={() => {
                                handelFavorisContent();
                              }}
                            >
                              {loading ? (
                                <Spinner color="danger" />
                              ) : (
                                <CiStar
                                  className="cursor-pointer"
                                  color={userFavorised ? "red" : "primary"}
                                  size={30}
                                />
                              )}
                            </Button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Tabs
                    aria-label="Tabs variant"
                    selectedKey={selected}
                    variant={"underlined"}
                    onSelectionChange={(k) => {
                      setSelected(k);
                    }}
                  >
                    {/* <Tab key="all" title="Tout"></Tab> */}
                    <Tab
                      key="videos"
                      title={`Videos ${
                        churchVideos ? churchVideos?.items.length : ""
                      }`}
                    />
                    <Tab
                      key="audios"
                      title={`Audios ${
                        churchAudios ? churchAudios?.items.length : ""
                      }`}
                    />
                    <Tab
                      key="images"
                      title={`Images ${
                        churchPicture ? churchPicture?.items.length : ""
                      }`}
                    />
                    <Tab
                      key="books"
                      title={`Livres ${
                        churchBook ? churchBook?.items.length : ""
                      }`}
                    />
                    <Tab
                      key="temoignages"
                      title={`Témoignages ${
                        churchTestimonials ? churchTestimonials.items.length : ""
                      }`}
                    >
                    
                    </Tab> 
                    <Tab
                      key="annonces"
                      title={`Annonces ${
                        churchAnnonce ? churchAnnonce?.items.length : ""
                      }`}
                    />
                  </Tabs>
                  <div className="flex items-center bg-background ">
                    <Input
                      className="bg-background focus:bg-background click:bg-background"
                      classNames={{
                        inputWrapper: "bg-background",
                        input: "text-sm",
                      }}
                      endContent={
                        <MicrophoneIcon style={{ width: 24, height: 24 }} />
                      }
                      placeholder="Type to search..."
                      size="md"
                      startContent={<SearchIcon size={18} />}
                      type="search"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {getContente()}
                </div>
                <Alert
                  alertBody={alertMsg}
                  alertTitle={alertTitle}
                  isOpen={openAlert}
                  onClose={() => {
                    setOpenAlert(false);
                  }}
                  onOpen={() => {
                    setOpenAlert(true);
                  }}
                />
              </>
            </Tab>
          </Tabs>
        </>
      ) : null}
      <DialogAction
        action={async () => {
          handleUpatePhotoProfil();
        }}
        dialogBody={
          <p>
            Etes-vous sure de vouloir modifier la photo de profile de
            l&apos;église?
          </p>
        }
        dialogTitle={"Suppresion du sujet"}
        isOpen={openDialogAction}
        onClose={() => {
          setOpenDialogoAction(false);
        }}
        onOpen={() => setOpenDialogoAction(true)}
      />
    </div>
  );
}
