import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import Maps from "../maps/maps";
import { ArrowRight } from "../icons";

import { Eglise } from "@/app/lib/config/interface";

export default function AproposSite({ eglise }: { eglise: Eglise }) {
  const [selected, setSelected] = useState(0);

  const [screenDimensions, setScreenDimensions] = useState({
    width: 0,
    height: 0,
  });

  const { theme } = useTheme();

  const elements: any = [
    {
      title: "Historique",
      content: (
        <p>
          {eglise?.about_eglise?.length > 10
            ? eglise?.about_eglise?.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))
            : "Veuillez intégrer l'historique au sein du profil de l'église."}
        </p>
      ),
    },
    {
      title: "Adresse",
      content: (
        <Maps
          adress="Rue Masi-Manimba, Salongo, République démocratique du Congo"
          coordinate={{
            x: eglise?.localisation_eglise
              ? parseFloat(eglise?.localisation_eglise[0])
              : 0,
            y: eglise?.localisation_eglise
              ? parseFloat(eglise?.localisation_eglise[1])
              : 0,
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setScreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="flex"
      id="a_propos"
      style={{
        position: "relative",
        width: "100%",
        paddingLeft: 100,
        paddingRight: 100,
        paddingBottom: 30,
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
        A propos
      </h1>
      <div
        className="flex about-sec"
        style={
          screenDimensions.width != null && screenDimensions.width < 1285
            ? { flexDirection: "column", flexWrap: "wrap" }
            : { flexWrap: "wrap" }
        }
      >
        <div
          className="flex about-sec-left"
          style={
            screenDimensions.width != null && screenDimensions.width < 1285
              ? { flexDirection: "row", marginBottom: 10 }
              : {}
          }
        >
          {elements.map((e: any, i: number) => (
            <button
              key={i}
              className={`flex about-site-button-tabs ${
                i == selected ? "dark-tab" : ""
              }`}
              style={{ borderColor: theme == "dark" ? "white" : "" }}
              onClick={() => setSelected(() => i)}
            >
              <div>{e?.title || "error"}</div>
              <ArrowRight />
            </button>
          ))}
        </div>
        <div className="about-sec-right">
          <div>{elements[selected]?.content}</div>
        </div>
      </div>
    </div>
  );
}
