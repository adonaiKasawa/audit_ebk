"use server";

import React from "react";
import { Image } from "@heroui/image";
import Link from "next/link";

import PopUpLogin from "@/ui/PopUpLogin/popUpLogin";

export default async function SignIn() {
  // const session = await auth();
  // if (session && session.user) {
  //   redirect("/api/auth/signin");
  // }

  return (
    <div className="grid grid-cols-3">
      <div className="col-span-3 lg:col-span-1 md:col-span-3 sm:col-span-3">
        <div className="flex w-full h-screen overflow-x-scroll items-center px-12">
          <PopUpLogin />
        </div>
      </div>
      <div
        className="hidden lg:flex lg:col-span-2 md:col-span-2 w-full flex  justify-end"
        style={{
          background: `url(/logout2.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <Link className="p-2" href="/">
          <Image alt="ecclesia" height={100} src="/ecclessia.png" width={100} />
        </Link>
        {/* <p className="text-4xl text-white">EcclesiaBooK</p> */}
      </div>
    </div>
  );
}
