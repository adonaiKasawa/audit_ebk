"use client";
import { Image } from "@heroui/image";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col space-x-2 space-y-6 justify-center items-center h-screen">
        <Image
          alt="ecclessia logo"
          height={100}
          src="/ecclessia.png"
          width={100}
        />
        <div className="flex space-x-2 justify-center items-center">
          <div className="h-4 w-4 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-4 w-4 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="h-4 w-4 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </>
  );
}
