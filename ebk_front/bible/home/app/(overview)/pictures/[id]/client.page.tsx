"use client";

import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";

import { getFileById } from "@/app/lib/actions/library/library";
import { TypeContentEnum } from "@/app/lib/config/enum";
import { ItemPicture } from "@/app/lib/config/interface";
import { CardPictureFileUI } from "@/ui/card/card.ui";

export function PictureClietPage({
  params,
  session,
}: {
  params: { id: string };
  session: Session | null;
}) {
  const { id } = params;
  const [picture, setPicture] = useState<ItemPicture>();

  const handelFindPictureById = useCallback(async () => {
    const find = await getFileById(id, TypeContentEnum.images);

    if (!find.hasOwnProperty("statusCode") && !find.hasOwnProperty("message")) {
      setPicture(find);
    }
  }, [setPicture, id]);

  useEffect(() => {
    handelFindPictureById();
  }, [handelFindPictureById]);

  return (
    <div className="flex justify-center">
      <div className="gap-4">
        {picture && <CardPictureFileUI picture={picture} session={session} />}
      </div>
    </div>
  );
}
