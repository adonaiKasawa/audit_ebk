"use client";

import { Image } from "@heroui/image";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {}, [error]);

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <Image alt="ecclessia logo" src="/ecclessia.png" width={200} />
      <h2 className="text-3xl">Vérifiez votre connexion Internet</h2>
      <button onClick={() => reset()}>Réessayez</button>
      <div className="flex space-x-2 justify-center items-center bg-white dark:invert mt-4">
        <div className="h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="h-4 w-4 bg-black rounded-full animate-bounce" />
      </div>
    </div>
  );
}
