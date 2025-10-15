"use server";

import { ReactNode, Suspense } from "react";
import { Divider } from "@heroui/divider";

import { AudiosSuggestion } from "./audios/list.audios";
import { VideosSuggestion } from "./videos/client.page";
import { BookSuggestion } from "./book/list.page";

import CardVideoFileSkleton from "@/ui/skeleton/card.video.file.skleton";
import { auth } from "@/auth";
import { findFilesPaginatedApi } from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";
import "moment/locale/fr";
import AnnonceSlideUI from "@/ui/annonce/annonce.slide.ui";
import { findAnnoncePaginated } from "@/app/lib/actions/annonce/annonce.req";

function randomizeComponents(components: ReactNode[]) {
  return components.sort(() => Math.random() - 0.5);
}

export default async function Home() {
  const session = await auth();

  const annonces = await findAnnoncePaginated();
  const books = await findFilesPaginatedApi(TypeContentEnum.livres, 1, 8);
  const audios = await findFilesPaginatedApi(TypeContentEnum.audios, 1, 6);
  const videos = await findFilesPaginatedApi(TypeContentEnum.videos, 1, 6);
  // const testimonials = await findFilesPaginatedApi(TypeContentEnum.testimonials);

  const randomizedComponents = randomizeComponents([
    <div key="videos">
      <Suspense fallback={<CardVideoFileSkleton />}>
        <VideosSuggestion videos={videos} />
      </Suspense>
      <Divider key="divider1videos" className="my-4" />
    </div>,
    <div key="audios">
      <AudiosSuggestion key="audios" audios={audios} />
      <Divider key="divider2audios" className="my-4" />
    </div>,
    <div key="books">
      <BookSuggestion key="books" books={books} session={session} />
      <Divider key="dividerbook" className="my-4" />
    </div>,
  ]);

  return (
    <div>
      <AnnonceSlideUI annonces={annonces} />
      {randomizedComponents}
    </div>
  );
}
