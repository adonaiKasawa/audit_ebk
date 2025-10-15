"use client";

import React from "react";

import { CardEgliseUI } from "../card/card.ui";

import { Eglise } from "@/app/lib/config/interface";

export default function Eglises({ eglises }: { eglises: Eglise[] }) {
  return (
    <div>
      <div className="grid grid-cols-12 gap-x-4 gap-y-4 gap-2">
        <div className="col-span-3" />
        <div className="col-span-12 md:col-span-6 sm:col-span-12">
          {eglises &&
            eglises?.map((item: any) => (
              <CardEgliseUI key={item.eglise.id_eglise} eglise={item.eglise} />
            ))}
        </div>
      </div>
    </div>
  );
}
