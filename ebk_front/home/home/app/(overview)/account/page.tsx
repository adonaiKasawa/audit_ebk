"use server";

import { redirect } from "next/navigation";
import React from "react";

import { AccountClientPage } from "./client.page";

import { auth } from "@/auth";
import { findFavorisByContetTypeAndUserApiByUser } from "@/app/lib/actions/favoris/favoris.req";
import { TypeContentEnum } from "@/app/lib/config/enum";

export default async function Account() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const favorisEglise = await findFavorisByContetTypeAndUserApiByUser(
    TypeContentEnum.eglises,
    session.user.sub,
  );
  const favorisVideos = await findFavorisByContetTypeAndUserApiByUser(
    TypeContentEnum.videos,
    session.user.sub,
  );
  const favorisAudios = await findFavorisByContetTypeAndUserApiByUser(
    TypeContentEnum.audios,
    session.user.sub,
  );
  const favorisImages = await findFavorisByContetTypeAndUserApiByUser(
    TypeContentEnum.images,
    session.user.sub,
  );
  const favorisLivres = await findFavorisByContetTypeAndUserApiByUser(
    TypeContentEnum.livres,
    session.user.sub,
  );
  const favorisTemoignages = await findFavorisByContetTypeAndUserApiByUser(
    TypeContentEnum.temoignages,
    session.user.sub,
  );
  const testimonialls = { items: [] };

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
          testimonialls,
          forum: [],
          bibleStudy: [],
          historique: { items: [] },
        }}
        session={session}
        userProfil={session.user}
      />
    </div>
  );
}
