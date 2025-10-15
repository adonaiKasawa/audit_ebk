"use client";

import React from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollShadow } from "@heroui/scroll-shadow";

import NavLinks, { NavAvartLinks, NavFooterLinks } from "./nav-links";

export default function Sidebar({}: { pathname: string }) {
  const pathnameHook = usePathname();
  // const [isBiblePage, setIsBiblePage] = useState(false);

  useEffect(() => {
    // setIsBiblePage(pathnameHook === "/bible");
    // console.log(pathname);
  }, [pathnameHook]);

  return (
    <div
      className={"hidden xl:flex lg:flex w-[25%]"}
      // className={clsx(
      //   "hidden md:block w-full flex-none md:w-72 lg:w-72 xl:w-72 lg:block xl:block",
      //   {
      //     "md:block": pathname === "/library/videos/66",
      //   },
      // )}
      // className="w-16 max-w-24"
      // style={isBiblePage ? { display: "none" } : {}}
      // style={{ width: 320 }}
    >
      <ScrollShadow
        hideScrollBar
        className="sticky top-0 bottom-0 pb-36 h-screen w-36"
      >
        <div className="pb-8 border-r-ui">
          <div className="flex flex-col gap-2 bg-background shadow-md rounded-md px-2 py-2">
            <NavLinks />
          </div>
          <div className="flex flex-col gap-2 bg-background shadow-md rounded-md mt-2.5 px-2 py-2">
            <NavAvartLinks />
          </div>
          <div className="text-justify bg-background shadow-md  rounded-md mt-2.5 px-2 py-2">
            <NavFooterLinks />
          </div>
        </div>
      </ScrollShadow>
    </div>
  );
}
