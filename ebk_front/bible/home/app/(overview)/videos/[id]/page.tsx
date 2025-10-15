"use server";

import React from "react";

import VideosPlayer from "./videos.player";

import { auth } from "@/auth";
import { getFileById } from "@/app/lib/actions/library/library";
import { file_url, front_url } from "@/app/lib/request/request";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  

  if (!/^\d+$/.test(id)) {
    return {
      title: "Contenu invalide",
    };
  }

  const fileType = "videos";
  const file = await getFileById(id, fileType);
  

  if (!file || file.statusCode) {
    return {
      title: "Contenu non trouvé",
    };
  }

  return {
    title: file.titre || "Vidéo - Ecclesiabook",
    description:
      file.description ||
      `Regardez "${file.titre}" publié par ${file.eglise?.nom_eglise || "une église"}`,
    openGraph: {
      title: file.titre || "",
      description:
        file.description || `Regardez cette vidéo sur Ecclesiabook`,
      url: `${front_url}${fileType}/${file.id}`,
      images: [
        {
          url: `${file_url}${file.photo}`,
          width: 1200,
          height: 630,
          alt: file.titre,
        },
      ],
      type: "video.other",
    },
  };
}




export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const getparams = await params;

  return (
    <div>
      <VideosPlayer params={getparams} session={session} />
    </div>
  );
}
