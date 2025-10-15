"use client";

import React, { useCallback, useEffect, useState } from "react";
import { EmblaOptionsType } from "embla-carousel";

import EmblaCarouselUI from "../carousel";

import { AnnoncePaginated } from "@/app/lib/config/interface";

const OPTIONS: EmblaOptionsType = {};
// const SLIDE_COUNT = 5;
// const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

export default function AnnonceSlideUI({
  annonces,
}: {
  annonces: AnnoncePaginated;
}) {
  const [annonceImages, setAnnoncesImage] = useState<string[]>([]);

  const prepareAnnonces = useCallback(() => {
    const img: string[] = [];
    const items = annonces.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      img.push(item.contente);
    }
    setAnnoncesImage(img);
  }, [annonceImages, annonces]);

  useEffect(() => {
    prepareAnnonces();
  }, []);

  return (
    <div>
      <EmblaCarouselUI options={OPTIONS} slides={annonceImages} />
    </div>
  );
}
