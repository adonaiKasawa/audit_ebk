"use client";

import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";

import {
  findSondageQstByEglsieIdApi,
  findSondageQstUserAnsweredApi,
} from "@/app/lib/actions/sondageQst/sondageQst.req";
import {
  ItemSondageQst,
  SondageQstPaginated,
} from "@/app/lib/config/interface";
import { CardSondageQstUI } from "@/ui/card/card.ui";

export default function SondageQstPageClient({
  session,
  initData,
}: {
  session: Session | null;
  initData: { sondage: SondageQstPaginated };
}) {
  const user = session?.user;
  const [sondageQsts] = useState<ItemSondageQst[]>(initData.sondage.items);
  const [sondageQstsFromEglise, setSondageQstsFromEglise] = useState<
    ItemSondageQst[]
  >([]);
  const [sondageQstsUserAnswered, setSondageQstsUserAnswered] = useState<
    ItemSondageQst[]
  >([]);
  const [selected, setSelected] = React.useState<string | number>("public");

  const handleFindSondageQstUserAnswered = useCallback(async () => {
    if (user) {
      const sondage = await findSondageQstUserAnsweredApi(user.sub);

      if (
        !sondage.hasOwnProperty("statusCode") &&
        !sondage.hasOwnProperty("message")
      ) {
        setSondageQstsUserAnswered(sondage);
      }
    }
  }, [user]);

  const handleFindSondageByEglseId = useCallback(async () => {
    if (user) {
      const sondage = await findSondageQstByEglsieIdApi(user.eglise.id_eglise);

      if (
        !sondage.hasOwnProperty("statusCode") &&
        !sondage.hasOwnProperty("message")
      ) {
        setSondageQstsFromEglise(sondage.items);
      }
    }
  }, [user]);

  useEffect(() => {
    handleFindSondageByEglseId();
    handleFindSondageQstUserAnswered();
  }, [handleFindSondageQstUserAnswered, handleFindSondageByEglseId]);

  return (
    <div>
      <div className="flex justify-between">
        <p className="text-2xl">Sondage et Question</p>
        <div>
          <Tabs
            aria-label="Options"
            selectedKey={selected}
            onSelectionChange={setSelected}
          >
            <Tab key="public" title="Public" />
            <Tab key="private" title="Mon église" />
            <Tab key="answered" title="Participer" />
          </Tabs>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {sondageQsts &&
          sondageQsts.length > 0 &&
          selected === "public" &&
          sondageQsts.map((item) => (
            <CardSondageQstUI key={item.id} session={session} sondage={item} />
          ))}
        {sondageQstsFromEglise &&
          sondageQstsFromEglise.length > 0 &&
          selected === "private" &&
          sondageQstsFromEglise.map((item) => (
            <CardSondageQstUI key={item.id} session={session} sondage={item} />
          ))}
        {sondageQstsUserAnswered &&
          sondageQstsUserAnswered.length > 0 &&
          selected === "answered" &&
          sondageQstsUserAnswered.map((item) => (
            <CardSondageQstUI key={item.id} session={session} sondage={item} />
          ))}
      </div>
    </div>
  );
}
