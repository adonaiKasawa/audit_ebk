"use client";

import React, { useState } from "react";
import { Divider } from "@heroui/divider";
import { Tabs, Tab } from "@heroui/tabs";

import { Programme } from "@/app/lib/config/interface";
import { AddProgrammeFormModal } from "@/ui/modal/form/programme";
import { CardProgramme } from "@/ui/card/card.ui";

export default function ListProgramme({
  programmes,
}: {
  programmes: Programme[];
}) {
  const [selected, setSelected] = useState<string | number>("dimanche");
  const [initProgramme, setInitPrograame] = useState<Programme[] | undefined>(
    programmes,
  );

  const handleRenderProgramme = () => {
    const findprogramme = initProgramme?.find(
      (item) => item.titre.toLowerCase() === selected,
    );

    if (findprogramme && findprogramme.sousProgramme.length > 0) {
      return findprogramme.sousProgramme.map((item) => (
        <CardProgramme
          key={item.id}
          initProgramme={initProgramme}
          selected={selected}
          setInitPrograame={setInitPrograame}
          sousProgramme={item}
        />
      ));
    } else {
      return (
        <div className="col-span-4 flex h-full justify-center items-center">
          <p className="text-3xl">
            Il n&#39;y a aucun programme pour {selected}
          </p>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <h1 className="text-3xl">Programme</h1>
        <AddProgrammeFormModal
          initProgramme={initProgramme}
          selected={selected}
          setInitPrograame={setInitPrograame}
        />
      </div>
      <div className="flex justify-between mb-2">
        <Tabs
          aria-label="Tabs variant"
          selectedKey={selected}
          variant={"underlined"}
          onSelectionChange={(k) => {
            setSelected(k);
          }}
        >
          <Tab key="dimanche" title={`Dimanche`} />
          <Tab key="lundi" title={`Lundi`} />
          <Tab key="mardi" title={`Mardi`} />
          <Tab key="mercredi" title={`Mercredi`} />
          <Tab key="jeudi" title={`Jeudi`} />
          <Tab key="vendredi" title="Vendredi" />
          <Tab key="samedi" title="Samedi" />
        </Tabs>
      </div>
      <Divider />
      <div className="grid grid-cols-4 gap-4 mt-4">
        {handleRenderProgramme()}
      </div>
    </div>
  );
}
