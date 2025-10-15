"use client";

import { Session } from "next-auth";
import React, { useState } from "react";

import { findSondageQstByEglsieIdApi } from "@/app/lib/actions/sondageQst/sondageQst.req";
import {
  ItemSondageQst,
  SondageQstPaginated,
} from "@/app/lib/config/interface";
import { CardSondageQstUI } from "@/ui/card/card.ui";
import { CreateSondageQstFormModal } from "@/ui/modal/form/sondageQst";

export default function SondageQstPageClient({
  session,
  initData,
}: {
  session: Session;
  initData: { sondage: SondageQstPaginated };
}) {
  const { user } = session;
  const [sondageQsts, setSondageQsts] = useState<ItemSondageQst[]>(
    initData.sondage.items,
  );

  const handleFindSondageQst = async () => {
    const sondage = await findSondageQstByEglsieIdApi(user.eglise.id_eglise);

    if (
      !sondage.hasOwnProperty("statusCode") &&
      !sondage.hasOwnProperty("message")
    ) {
      setSondageQsts(sondage.items);
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <p className="text-2xl">Sondage et Question</p>
        <CreateSondageQstFormModal
          handleFindSondageQst={handleFindSondageQst}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {sondageQsts &&
          sondageQsts.length > 0 &&
          sondageQsts.map((item) => (
            <CardSondageQstUI key={item.id} session={session} sondage={item} />
          ))}
      </div>
    </div>
  );
}
