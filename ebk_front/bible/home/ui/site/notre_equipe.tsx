import React from "react";
import { useTheme } from "next-themes";
import { EmblaOptionsType } from "embla-carousel";

import EmblaCarouselSite from "../carousel/site/EmblaCarousel";

import { Eglise } from "@/app/lib/config/interface";

const OPTIONS: EmblaOptionsType = { loop: true };

export default function NotreEquipeSite({ eglise }: { eglise: Eglise }) {
  const { theme } = useTheme();

  const slides = [
    {
      photo:
        "https://cdn.pixabay.com/photo/2017/08/08/22/11/century-link-field-2612912_1280.jpg",
      name: "",
    },
  ];

  return (
    <div
      className="flex"
      id="notre_equipe"
      style={{
        position: "relative",
        width: "100%",
        paddingTop: 30,
        paddingBottom: 30,
        justifyContent: "center",
        background: theme == "dark" ? "white" : "#EDEDED",
        flexDirection: "column",
      }}
    >
      <h1
        className="title_site"
        style={{
          fontSize: 35,
          color: theme == "dark" ? "white" : "black",
          textAlign: "center",
        }}
      >
        Notre equipe
      </h1>
      <EmblaCarouselSite eglise={eglise} options={OPTIONS} slides={slides} />
    </div>
  );
}
