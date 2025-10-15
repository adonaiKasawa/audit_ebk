"use client";

import React from "react";
import parse from "html-react-parser";

interface Props {
  iframe: string;
}

export const IFramePlayer = ({ iframe }: Props) => {
  const handleIframe = () => {
    if (iframe) {
      return parse(iframe);
    } else {
      return <></>;
    }
  };

  return <div className="w-full">{handleIframe()}</div>;
};
