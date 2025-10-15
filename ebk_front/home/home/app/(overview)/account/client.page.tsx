"use client";

import React, { useState } from "react";
import { Link } from "@heroui/link";
import { Avatar } from "@heroui/avatar";
// import { CiHome } from "react-icons/ci";
import { Session } from "next-auth";
import {
  Card,
  //  CardHeader
} from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";

import { file_url } from "@/app/lib/request/request";
import {
  Eglise,
  ItemPicture,
  PayloadUserInterface,
} from "@/app/lib/config/interface";
// import CardVideoFileUI, { CardAudioFileUI } from "@/ui/card/card.ui";
import Audios from "@/ui/profile/audios";
// import { GalleryIcon, MusicIcon, VideoIcon } from "@/ui/icons";
import Eglises from "@/ui/profile/eglises";
import Photos from "@/ui/profile/photos";
import Videos from "@/ui/profile/videos";
import Temoignages from "@/ui/profile/temoignages";

export const AccountClientPage = ({
  session,
  initData,
  userProfil,
}: {
  session: Session | null;
  initData: {
    favoris: {
      picture: any[];
      videos: any[];
      audios: any[];
      books: any[];
      eglise: Eglise[];
      testimonials: any[];
    };
    testimonialls: any;
    forum: any;
    bibleStudy: any;
    historique: any;
  };
  userProfil: PayloadUserInterface;
}) => {
  const [user] = useState<PayloadUserInterface>(userProfil);
  // const [selected] = useState<string | number>("favoris");
  // const [FavorisTypeselected, setFavorisTypeSelected] = useState<
  //   string | number
  // >("favoris");
  const [favorisDataFilter] = useState<{
    picture: ItemPicture[];
    videos: any[];
    audios: any[];
    books: any[];
    eglise: Eglise[];
    testimonials: any[];
  }>(initData.favoris);

  // const handleUpdateUser = async () => {
  //   if (user) {
  //     const find = await findUserByIdApi(user?.sub);

  //     if (!find.hasOwnProperty("statusCode")) {
  //       setUser(find);
  //     }
  //   }
  // };

  // const RangeFavorisInState = useCallback(() => {
  //   const picture = initData.favoris.filter(
  //     (item: any) => item.images !== null
  //   );
  //   const audios = initData.favoris.filter((item: any) => item.audios !== null);
  //   const videos = initData.favoris.filter((item: any) => item.videos !== null);
  //   const books = initData.favoris.filter((item: any) => item.livres !== null);
  //   const eglise = initData.favoris.filter((item: any) => item.eglise !== null);
  //   setFavorisDataFilter({
  //     picture,
  //     videos,
  //     audios,
  //     books,
  //     eglise,
  //   });
  // }, [initData]);

  // const GetComponent = () => {
  //   switch (selected) {
  //     case "favoris":
  //       return (
  //         <div>
  //           <Tabs
  //             aria-label="Options"
  //             color="primary"
  //             selectedKey={FavorisTypeselected}
  //             variant="bordered"
  //             onSelectionChange={(k: any) => {
  //               setFavorisTypeSelected(k);
  //             }}
  //           >
  //             <Tab
  //               key="photos"
  //               title={
  //                 <div className="flex items-center space-x-2">
  //                   <GalleryIcon />
  //                   <span>Photos</span>
  //                 </div>
  //               }
  //             />
  //             <Tab
  //               key="audios"
  //               title={
  //                 <div className="flex items-center space-x-2">
  //                   <MusicIcon />
  //                   <span>Music</span>
  //                 </div>
  //               }
  //             />
  //             <Tab
  //               key="videos"
  //               title={
  //                 <div className="flex items-center space-x-2">
  //                   <VideoIcon />
  //                   <span>Videos</span>
  //                 </div>
  //               }
  //             />
  //             <Tab
  //               key="eglise"
  //               title={
  //                 <div className="flex items-center space-x-2">
  //                   <CiHome size={24} />
  //                   <span>Église</span>
  //                 </div>
  //               }
  //             />
  //           </Tabs>
  //           <div>{GetComponentByFavoris()}</div>
  //         </div>
  //       );
  //       break;

  //     default:
  //       break;
  //   }
  // };

  // const GetComponentByFavoris = () => {
  //   switch (FavorisTypeselected) {
  //     case "photo":
  //       return <div />;
  //     case "audios":
  //       return (
  //         <div className="grid grid-cols-3 gap-3 mt-4">
  //           {favorisDataFilter?.audios.map((item) => (
  //             <CardAudioFileUI
  //               key={`${item.createdAt}`}
  //               isLink
  //               audio={item.audios}
  //             />
  //           ))}
  //         </div>
  //       );
  //     case "videos":
  //       return (
  //         <div className="grid grid-cols-3 gap-3 mt-4">
  //           {favorisDataFilter?.videos.map((item) => (
  //             <CardVideoFileUI key={`${item.createdAt}`} video={item.videos} />
  //           ))}
  //         </div>
  //       );
  //     case "eglise":
  //       return (
  //         <div className="grid grid-cols-3 gap-3">
  //           {favorisDataFilter?.eglise.map((item) => (
  //             <Card
  //               key={`${item.createdAt}`}
  //               isPressable
  //               as={Link}
  //               href={`@${item.username_eglise}`}
  //             >
  //               <CardHeader className="flex gap-2">
  //                 <Avatar src={`${file_url}${item.photo_eglise}`} />
  //                 <p className="text-foreground">{item.nom_eglise}</p>
  //               </CardHeader>
  //             </Card>
  //           ))}
  //         </div>
  //       );
  //     default:
  //       break;
  //   }
  // };

  return (
    <div className="gap-4">
      <Card className="w-full couverture-profil-layout rounded-0">
        <div className="w-full couverture-profil-frame rounded-0">
          <div
            className="w-full couverture-profil-frame-blur"
            style={{
              background:
                'url("' +
                file_url +
                user?.couverture +
                '"), lightgray 90% / cover no-repeat',
              filter: "blur(10px)",
            }}
          />
          <Avatar
            className="rounded-md bg-background w-28 h-28 "
            src={`${file_url + user?.photo}`}
          />
          <div className="max-w-sm md:max-w-md lg:max-w-lg couverture-profil-description w-full">
            <p className="text-4xl w-full text-foreground">
              {user?.nom} {user?.prenom}
            </p>
            <p className="text-xs text-foreground">{user.telephone}</p>
            {user?.eglise && (
              <div className="flex items-center gap-1">
                <Avatar
                  className="w-6 h-6"
                  src={`${file_url}${user.eglise.photo_eglise}`}
                />
                <Link
                  className="text-xs text-gray-400"
                  href={`@${user.eglise.username_eglise}`}
                >
                  @{user.eglise.username_eglise}
                </Link>
              </div>
            )}
          </div>
        </div>
      </Card>
      <div className="flex mt-4 w-full flex-col">
        <Tabs aria-label="Tabs variant" variant={"underlined"}>
          <Tab key="eglise" title="Eglise">
            <Eglises eglises={favorisDataFilter.eglise} />
          </Tab>
          <Tab key="photos" title="Photos">
            <Photos pictures={favorisDataFilter.picture} session={session} />
          </Tab>
          <Tab key="videos" title="Videos">
            <Videos videos={favorisDataFilter.videos} />
          </Tab>
          <Tab key="audios" title="Audios">
            <Audios audios={favorisDataFilter.audios} />
          </Tab>
          <Tab key="temoignages" title="Temoignages">
            <Temoignages
              session={session}
              testimonials={favorisDataFilter.testimonials}
            />
          </Tab>
          {/* <Tab key="formation" title="Formation">
            <Formations id={user.sub} />
          </Tab>
          <Tab key="forum" title="Forum">
            <Forum id={user.sub} />
          </Tab>
          <Tab key="quiz" title="Quiz">
            <Quiz id={user.sub} />
          </Tab>
          <Tab key="sondage" title="Sondage">
            <Sondage id={user.sub} />
          </Tab> */}
          {/* <Tab
            key="temoignages"
            title={`Témoignages ${
              initData.testimonialls ? initData.testimonialls?.items.length : ""
            }`}
          />
          <Tab
            key="bibleStudy"
            title={`Etude Biblique ${
              initData ? initData.bibleStudy.length : ""
            }`}
          />
          <Tab
            key="forum"
            title={`Forum ${initData ? initData.forum.length : ""}`}
          />
          <Tab
            key="favoris"
            title={`Favoris ${initData ? initData.favoris.length : ""}`}
          /> */}
          {/* <Tab key="historique" title={`Historique ${churchAnnonce ? churchAnnonce?.items.length : ""}`} /> */}
        </Tabs>
      </div>
      {/* <div>{GetComponent()}</div> */}
      {/* <UpdateMembreFormModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        membre={{ ...user, id: user.sub }}
        handleFindMemebres={async () => {
          await handleUpdateUser();
        }}
      /> */}
    </div>
  );
};
