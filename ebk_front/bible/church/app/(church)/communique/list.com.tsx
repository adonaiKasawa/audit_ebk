"use client";

import { useState } from "react";

import { Communiques, CommuniquesPaginated } from "@/app/lib/config/interface";
import { CardCommunique } from "@/ui/card/card.ui";
import { AddCommuniqueFormModal } from "@/ui/modal/form/communique";

export function ListCommuniques({
  initCommuniques,
}: {
  initCommuniques: CommuniquesPaginated | undefined;
}) {
  const [stCommuniques, setStCommuniques] = useState<
    CommuniquesPaginated | undefined
  >(initCommuniques);

  return (
    <div>
      <div className="flex justify-between">
        <p className="text-4xl">Communiqués</p>
        <AddCommuniqueFormModal
          setStCommuniques={setStCommuniques}
          stCommuniques={stCommuniques}
        />
      </div>

      <div className="mt-4">
        {stCommuniques ? (
          <div className="grid grid-cols-2 gap-4">
            {stCommuniques &&
              stCommuniques?.items?.map((item: Communiques) => (
                <CardCommunique
                  key={`${item.id}`}
                  communiques={item}
                  setStCommuniques={setStCommuniques}
                  stCommuniques={stCommuniques}
                />
              ))}
          </div>
        ) : (
          <div className="flex h-full justify-center items-center">
            <p className="text-4xl">
              Vous n&#39;avez pas encore de communiqués.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
