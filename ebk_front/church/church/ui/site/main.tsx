import React from "react";
import { Session } from "next-auth";

import PresentationSite from "./presentation";
import AproposSite from "./a_propos";
import NotreEquipeSite from "./notre_equipe";
import NousContacterSite from "./nous_contacter";
import FooterSite from "./footer";

import { Eglise } from "@/app/lib/config/interface";
export default function MainSite({
  eglise,
  session,
}: {
  eglise: Eglise;
  session: Session | null;
}) {
  return (
    <div className="flex flex-col w-full gap-4">
      <PresentationSite eglise={eglise} session={session} />
      <AproposSite eglise={eglise} />
      <NotreEquipeSite eglise={eglise} />
      <NousContacterSite eglise={eglise} session={session} />
      <FooterSite eglise={eglise} />
    </div>
  );
}
