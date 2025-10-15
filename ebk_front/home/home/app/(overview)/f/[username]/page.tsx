import React from "react";

import { AccountClientPage } from "../../account/client.page";

import { auth } from "@/auth";
import { findFavorisByContetTypeAndUserApiByUser } from "@/app/lib/actions/favoris/favoris.req";
import { authWithUsername } from "@/app/lib/actions/auth";
import { TypeContentEnum } from "@/app/lib/config/enum";

export default async function page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await auth();
  let { username } = await params;

  if (username[0] === "@" || username.slice(0, 3) === "%40") {
    username = username.slice(3);
  }

  const user = await authWithUsername({ username });

  if (user.hasOwnProperty("StatusCode") && user.hasOwnProperty("message")) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-4xl">Impossible de voir cet profil</p>
      </div>
    );
  }
  const favorisEglise = await findFavorisByContetTypeAndUserApiByUser(
    TypeContentEnum.eglises,
    user.id,
  );
  const favorisVideos = await findFavorisByContetTypeAndUserApiByUser(
    TypeContentEnum.videos,
    user.id,
  );
  const favorisAudios = await findFavorisByContetTypeAndUserApiByUser(
    TypeContentEnum.audios,
    user.id,
  );
  const favorisImages = await findFavorisByContetTypeAndUserApiByUser(
    TypeContentEnum.images,
    user.id,
  );
  const favorisLivres = await findFavorisByContetTypeAndUserApiByUser(
    TypeContentEnum.livres,
    user.id,
  );
  const favorisTemoignages = await findFavorisByContetTypeAndUserApiByUser(
    TypeContentEnum.temoignages,
    user.id,
  );

  return (
    <div>
      <AccountClientPage
        initData={{
          favoris: {
            eglise: favorisEglise,
            picture: favorisImages,
            videos: favorisVideos,
            audios: favorisAudios,
            books: favorisLivres,
            testimonials: favorisTemoignages,
          },
          testimonialls: { items: [] },
          forum: [],
          bibleStudy: [],
          historique: { items: [] },
        }}
        session={session}
        userProfil={user}
      />
    </div>
  );
}
