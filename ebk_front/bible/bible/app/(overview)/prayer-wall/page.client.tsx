"use client";
import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";

import { findPrayerWallApi } from "@/app/lib/actions/prayer-wall/prayer.req";
import { getRandomNumberBetween } from "@/app/lib/config/func";
import { ItemPrayerWall } from "@/app/lib/config/interface";
import { CardPrayerWallUI } from "@/ui/card/card.ui";
import { CreatePrayerWallFormModal } from "@/ui/prayerWall";
// import { CreatePrayerWallFormModal } from "@/ui/modal/form/prayerWall";

export default function PrayerWallPageClient({
  initData,
  session,
}: {
  initData: ItemPrayerWall[];
  session: Session | null;
}) {
  const [prayerWall, setPrayerWall] = useState<ItemPrayerWall[]>(initData);

  const [selected, setSelected] = useState<string | number>("public");

  const handleFindPrayerWall = useCallback(async () => {
    const find = await findPrayerWallApi();

    if (!find.hasOwnProperty("statusCode") && !find.hasOwnProperty("message")) {
      setPrayerWall(find);
    }
  }, []);

  useEffect(() => {
    handleFindPrayerWall();
  }, [, handleFindPrayerWall]);

  return (
    <div>
      <div className="flex justify-between">
        <p className="text-2xl text-white">Intentions de prière: Prions les uns pour les autres.</p>
        <CreatePrayerWallFormModal
          handleFindPrayerWall={handleFindPrayerWall}
        />
      </div>

      <div className="flex justify-center my-4">
        <Tabs
          aria-label="Options"
          selectedKey={selected}
          onSelectionChange={setSelected}
        >
          <Tab key="public" title="Public" />
          <Tab key="private" title="Mes prières" />
        </Tabs>
      </div>
      <DynamicGrid
        key={"data-1"}
        data={
          selected === "public"
            ? prayerWall
            : prayerWall.filter((item) => item.user.id === session?.user.sub)
        }
        handleFindPrayerWall={handleFindPrayerWall}
        session={session}
      />
    </div>
  );
}

const DynamicGrid = ({
  data,
  session,
  handleFindPrayerWall,
}: {
  data: ItemPrayerWall[];
  session: Session | null;
  handleFindPrayerWall: () => Promise<void>;
}) => {
  const color = [
    "#5cd482",
    "#58c1de",
    "#ff8042",
    "#b65cd8",
    "#f0699a",
    "#f6dd4d",
  ];

  // const maxColumns = 4;

  // const chunkData = (array: any, size: number) => {
  //   const chunked = [];
  //   let index = 0;

  //   while (index < array.length) {
  //     chunked.push(array.slice(index, index + size));
  //     index += size;
  //   }

  //   return chunked;
  // };

  const getColumnsBasedOnIndex = (index: number) => {
    // Si l'index est pair, retourner 4 colonnes, sinon 3 colonnes
    return index % 2 === 0 ? 4 : 3;
  };

  const grids = [];
  let remainingData = data.slice();
  let index = 0;

  while (remainingData.length > 0) {
    const cols = getColumnsBasedOnIndex(index);
    const chunkSize = Math.min(cols, remainingData.length);

    grids.push(remainingData.slice(0, chunkSize));

    remainingData = remainingData.slice(chunkSize);

    index++;
  }

  if (remainingData.length > 0) {
    grids.push(remainingData);
  }

  return (
    <>
      {grids.map((gridItems, index) => (
        <div
          key={index}
          className={`grid grid-cols-${index % 2 ? "3" : "4"} gap-2 mt-2`}
        >
          {gridItems.map((item, i) => (
            <CardPrayerWallUI
              key={i}
              gbColor={color[getRandomNumberBetween(0, 5)]}
              handleFindPrayerWall={handleFindPrayerWall}
              prayer={item}
              session={session}
            />
          ))}
        </div>
      ))}
    </>
  );
};
