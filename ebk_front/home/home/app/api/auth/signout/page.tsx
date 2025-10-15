"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";

import { handleSignOut } from "@/app/lib/actions/auth";

export default function SignOut() {
  return (
    <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-3">
      {/* Section gauche avec vidéo en fond */}
      <div className="hidden lg:block relative h-full w-full lg:col-span-2 overflow-hidden">
        {/* Vidéo de fond */}
       <VideoBackground />

        {/* Overlay sombre pour lisibilité */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/40" />
      </div>
      {/* Section droite avec formulaire */}
      <div className="h-full w-full flex flex-col justify-center items-center p-6">
        <Card className="w-full max-w-md">
          <CardBody className="items-center gap-4">
            <Link className="block" href="/">
              <Image
                alt="ecclesia"
                height={78}
                src="/ecclessia.png"
                width={78}
              />
            </Link>
            <p className="text-center font-bold text-xl">
              Voulez-vous vraiment vous déconnecter ?
            </p>
            <form action={handleSignOut}>
              <Button className="font-bold" type="submit">
                Oui, je veux me déconnecter !
              </Button>
            </form>
          </CardBody>
        </Card>
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
      autoPlay
      loop
      playsInline
      className="absolute top-0 left-0 w-full h-full object-contain bg-black"
      muted={muted}
      src="/ECCLESIABOOK (Nouvelle version)_1 V1.mp4"
    >
      <track kind="captions" src="/captions.vtt" srcLang="fr" label="Français" /> 
    </video>

      {/* LOGO */}
      <div className="absolute top-4 right-4 z-10">
        <Link href="/">
          <Image alt="ecclesia" height={100} src="/ecclessia.png" width={100} />
        </Link>
      </div>

      {/* BOUTON TOGGLE SON */}
      <button
        className="absolute bottom-4 right-4 z-10 bg-black/60 text-white px-4 py-2 rounded-2xl shadow-md hover:bg-black/80 transition"
        onClick={toggleMute}
      >
        {muted ? "🔇 Activer le son" : "🔊 Couper le son"}
      </button>
    </div>
  );
}
