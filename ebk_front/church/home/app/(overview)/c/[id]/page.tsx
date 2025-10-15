"use server";

import { redirect } from "next/navigation";

import ChurchProfil from "./client.page";

import {
  findChurchByUsername,
  findFileByChurchId,
} from "@/app/lib/actions/church/church";
import { TypeContentEnum } from "@/app/lib/config/enum";
import { auth } from "@/auth";
import { findAnnonceByEgliseIdPaginated } from "@/app/lib/actions/annonce/annonce.req";
import { FindStatistique } from "@/app/lib/services/api/churcheApi";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  let username = id;

  if (id[0] === "@" || id.slice(0, 3) === "%40") {
    username = id.slice(3);
    const church = await findChurchByUsername(username);

    if (
      church.hasOwnProperty("StatusCode") &&
      church.hasOwnProperty("message")
    ) {
      redirect("/");
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
    // const testimonials = await findFileByChurchId(
    //   church.id_eglise,
    //   TypeContentEnum.testimonials,
    // );
    const statistiques = await FindStatistique(church.id_eglise);

    return (
      <div>
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
          params={await params}
          session={session}
        />
      </div>
    );
  } else {
    redirect(id);
  }
}
