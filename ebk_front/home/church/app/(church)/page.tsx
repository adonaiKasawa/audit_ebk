import React from "react";
import { redirect } from "next/navigation";

import { findAnnonceByEgliseIdPaginated } from "../lib/actions/annonce/annonce.req";
import {
  findChurchByUsername,
  findFileByChurchId,
} from "../lib/actions/church/church";
import { FindStatistique } from "../lib/services/api/churcheApi";

import ChurchProfil from "./c/[id]/client.page";

import { PrivilegesEnum, TypeContentEnum } from "@/app/lib/config/enum";
import { auth } from "@/auth";

export default async function ChurchSpace() {
  const session = await auth();

  if (!session || session.user.privilege_user !== PrivilegesEnum.ADMIN_EGLISE) {
    redirect("/api/auth/signin");
  }
  let username = session.user.eglise.username_eglise.toString();
  const church = await findChurchByUsername(username);

  if (church.hasOwnProperty("StatusCode") && church.hasOwnProperty("message")) {
    redirect("/api/auth/signin");
  }
  const videos = await findFileByChurchId(
    church.id_eglise,
    TypeContentEnum.videos,
  );
  const audios = await findFileByChurchId(
    church.id_eglise,
    TypeContentEnum.audios,
  );
  const books = await findFileByChurchId(
    church.id_eglise,
    TypeContentEnum.livres,
  );
  const pictures = await findFileByChurchId(
    church.id_eglise,
    TypeContentEnum.images,
  );
  const annonces = await findAnnonceByEgliseIdPaginated(church.id_eglise);
  // const testimonials = await findFileByChurchId(church.id_eglise, TypeContentEnum.testimonials);
  const statistiques = await FindStatistique(church.id_eglise);

  return (
    <div className="container">
      <ChurchProfil
        initData={{
          church,
          videos,
          audios,
          books,
          pictures,
          annonces,
          statistiques,
        }}
        params={{ id: `@${username}` }}
        session={session}
      />
    </div>
  );
}
