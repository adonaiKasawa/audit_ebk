"use client";

import React, { useEffect, useState } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import "./css/embla.css";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { Progress } from "@heroui/progress";
import { Image } from "@heroui/image";

import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";

import { file_url } from "@/app/lib/request/request";

type PropType = {
  slides: string[];
  options?: EmblaOptionsType;
};

const EmblaCarouselUI: React.FC<PropType> = (props) => {
  const { theme } = useTheme();
  // const isSSR = useIsSSR();

  const { slides, options } = props;

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ delay: 5000 }),
  ]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const [counter, setCounter] = useState<number>(0);

  const handelCounter = () => {
    setCounter(0);
    const intervalId = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(intervalId);

          return 100;
        }

        return prev + 1;
      });
    }, 50);
  };

  useEffect(() => {
    handelCounter();
  }, [selectedIndex]);

  return (
    <section className="embla w-full">
      <div ref={emblaRef} className="embla__viewport">
        <div className="embla__container">
          {slides.map((item, index) => (
            <div key={index} className="embla__slide relative rounded-lg">
              <div
                className="absolute"
                style={{
                  background: `url(${file_url}${item}),lightgray 50% / cover no-repeat`,
                  filter: "blur(20px)",
                  top: -10,
                  bottom: -10,
                  right: -10,
                  left: -10,
                  borderRadius: "20%",
                }}
              />
              <ImageDimensions index={index} src={`${file_url}${item}`} />
              <div
                className="absolute"
                style={{
                  // top: -10,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  borderRadius: "20%",
                }}
              >
                <Progress
                  aria-label="Loading..."
                  color="danger"
                  size="sm"
                  value={index === selectedIndex ? counter : 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 p-2">
          <PrevButton disabled={prevBtnDisabled} onClick={onPrevButtonClick} />
          <NextButton disabled={nextBtnDisabled} onClick={onNextButtonClick} />
        </div>
        <div className="flex justify-end flex-wrap items-center gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              className={clsx("w-2 h-2 border rounded-full appearance-none", {
                "w-3 h-3": index === selectedIndex,
                "bg-white": index === selectedIndex && theme === "dark",
                "bg-black": index === selectedIndex && theme === "light",
                "border-white": index !== selectedIndex && theme === "dark",
                "border-gray-500": index !== selectedIndex && theme === "light",
              })}
              onClick={() => onDotButtonClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ImageDimensions = ({ src, index }: { src: string; index: number }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
    };
    img.src = src;
  }, [src]);

  const isPortrait = dimensions.height > dimensions.width;

  return (
    <div
      className="flex items-center justify-center w-full h-full"
      style={{
        position: "relative",
        zIndex: 10,
      }}
    >
      <Image
        alt={`${index}`}
        height={isPortrait ? "10%" : "50%"}
        src={src}
        style={{
        maxWidth: "9%%",
        maxHeight: "90%",
        objectFit: "contain",
        borderRadius: 20,
        margin: "0 auto",
        display: "block",
      }}
        width={isPortrait ? "30%" : "70%"}
      />
    </div>
  );
};


export default EmblaCarouselUI;
