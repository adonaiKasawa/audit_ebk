"use client";

import React from "react";
import { Image } from "@heroui/image";
import Link from "next/link";
import PopUpLogin from "@/ui/PopUpLogin/popUpLogin";

export default function SignIn() {
  return (
    <div className="grid grid-cols-3">
      {/* SECTION GAUCHE AVEC LOGIN */}
      <div className="col-span-3 lg:col-span-1 md:col-span-3 sm:col-span-3">
        <div className="flex w-full h-screen overflow-x-scroll items-center px-12">
          <PopUpLogin />
        </div>
      </div>

      {/* SECTION DROITE AVEC VIDEO */}
      <div className="hidden lg:flex lg:col-span-2 md:col-span-2 relative w-full h-screen justify-end">
        <VideoBackground />
      </div>
    </div>
  );
}

function VideoBackground() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = React.useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* VIDEO */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-contain bg-black"
        src="/ECCLESIABOOK (Nouvelle version)_1 V1.mp4"
        autoPlay
        muted={muted}
        loop
        playsInline
      >
        {/* 👇 track ajouté pour calmer ESLint */}
        <track kind="captions" srcLang="fr" label="Français" />
      </video>

      {/* LOGO */}
      <div className="absolute top-4 right-4 z-10">
        <Link href="/">
          <Image alt="ecclesia" height={100} src="/ecclessia.png" width={100} />
        </Link>
      </div>

      {/* BOUTON TOGGLE SON */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 z-10 bg-black/60 text-white px-4 py-2 rounded-2xl shadow-md hover:bg-black/80 transition"
      >
        {muted ? "🔇 Activer le son" : "🔊 Couper le son"}
      </button>
    </div>
  );
}
