"use server";

import React from "react";

import { tuto } from "./tuto";

import { CardVideoTutoUI } from "@/ui/card/card.ui";

export default async function FirstStepPage() {
  return (
    <div className="grid grid-cols-1  md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {tuto.map((item, i) => (
        <CardVideoTutoUI key={i} video={item} />
      ))}
    </div>
  );
}
