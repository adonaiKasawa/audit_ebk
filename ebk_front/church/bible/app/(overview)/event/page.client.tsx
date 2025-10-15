"use client";

import React, { useState } from "react";
import { Session } from "next-auth";
import { Button } from "@heroui/button";

import { ManagementEvent } from "@/app/lib/config/interface";
import { CardEventUI } from "@/ui/card/card.ui";

export default function EventPageClient({
  initData,
}: {
  initData: ManagementEvent[];
  session: Session | null;
}) {
  const [view, setView] = useState<boolean>(true);

  return (
    <div>
      <p className="text-2xl">Événements</p>
      <div className="flex justify-center items-center gap-4">
        <Button
          color={view ? "primary" : "default"}
          size="sm"
          variant={view ? "solid" : "flat"}
          onPress={() => {
            setView(true);
          }}
        >
          Tout
        </Button>
        <Button
          color={!view ? "primary" : "default"}
          size="sm"
          variant={!view ? "solid" : "flat"}
          onPress={() => {
            setView(false);
          }}
        >
          Réserveration
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {initData.map((item) => {
          if (view) {
            return <CardEventUI key={item.id} event={item} />;
          } else {
            if (item.isSubscribe) {
              return <CardEventUI key={item.id} event={item} />;
            }
          }
        })}
      </div>
    </div>
  );
}
