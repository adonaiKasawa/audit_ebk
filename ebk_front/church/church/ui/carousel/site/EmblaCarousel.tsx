import React, { useCallback } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import NextImage from "next/image";

import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";

import "./css/embla.css";
import { file_url } from "@/app/lib/request/request";
import { Eglise } from "@/app/lib/config/interface";

type PropType = {
  slides: Object[];
  options?: EmblaOptionsType;
  eglise: Eglise;
};

const EmblaCarouselSite: React.FC<PropType> = (props) => {
  const { slides, options, eglise } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: true, delay: 3000 }),
  ]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const onButtonAutoplayClick = useCallback(
    (callback: () => void) => {
      const autoplay = emblaApi?.plugins()?.autoplay;

      if (!autoplay) return;

      const resetOrStop =
        autoplay.options.stopOnInteraction === false
          ? autoplay.reset
          : autoplay.stop;

      resetOrStop();
      callback();
    },
    [emblaApi],
  );

  // const toggleAutoplay = useCallback(() => {
  //   const autoplay = emblaApi?.plugins()?.autoplay;

  //   if (!autoplay) return;

  //   const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play;

  //   playOrStop();
  // }, [emblaApi]);

  return (
    <div className="embla">
      <div ref={emblaRef} className="embla__viewport">
        <div className="embla__container">
          {slides.map((content, index) => (
            <div
              key={index}
              className="embla__slide"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <NextImage
                alt={`Photo de l'eglise `}
                className="object-cover w-full"
                height={150}
                src={`${file_url + eglise.photo_eglise}`}
                style={{
                  height: 300,
                  width: 200,
                }}
                width={200}
              />
              <div>{"content.name"}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="embla__controls"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="embla__buttons">
          <PrevButton
            disabled={prevBtnDisabled}
            onClick={() => onButtonAutoplayClick(onPrevButtonClick)}
          />
          <NextButton
            disabled={nextBtnDisabled}
            onClick={() => onButtonAutoplayClick(onNextButtonClick)}
          />
        </div>

        {/* <button className="embla__play" onClick={toggleAutoplay} type="button">
          {isPlaying ? 'Stop' : 'Start'}
        </button> */}
      </div>
    </div>
  );
};

export default EmblaCarouselSite;
